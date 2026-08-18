import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

const groupSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  subject: z.string().min(1),
  max_members: z.number().int().positive()
});

router.get('/', async (req, res) => {
  try {
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret123') as any;
        userId = decoded.id;
      } catch (e) {}
    }

    let query = `
      SELECT g.*, 
        (SELECT COUNT(*) FROM group_memberships gm WHERE gm.group_id = g.id) as member_count
    `;
    let params: any[] = [];
    
    if (userId) {
      query += `, EXISTS(SELECT 1 FROM group_memberships gm WHERE gm.group_id = g.id AND gm.user_id = $1) as "isMember"`;
      params.push(userId);
    } else {
      query += `, false as "isMember"`;
    }
    
    query += ` FROM groups g ORDER BY g.created_at DESC`;

    const result = await pool.query(query, params);
    
    const groups = result.rows.map(row => ({
      ...row,
      member_count: parseInt(row.member_count),
      isMember: row.isMember
    }));
    
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticate, validate(groupSchema), async (req, res) => {
  try {
    const { name, description, subject, max_members } = req.body;
    const user = req.user as any;
    
    const result = await pool.query(
      'INSERT INTO groups (name, description, subject, max_members, creator_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, subject, max_members, user.id]
    );
    
    await pool.query('INSERT INTO group_memberships (group_id, user_id) VALUES ($1, $2)', [result.rows[0].id, user.id]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const groupResult = await pool.query('SELECT * FROM groups WHERE id = $1', [id]);
    
    if (groupResult.rows.length === 0) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    const membersResult = await pool.query(`
      SELECT u.id, u.full_name, u.avatar_url, gm.joined_at 
      FROM users u
      JOIN group_memberships gm ON u.id = gm.user_id
      WHERE gm.group_id = $1
    `, [id]);
    
    res.json({
      ...groupResult.rows[0],
      members: membersResult.rows
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/join', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user as any;
    
    const groupResult = await pool.query('SELECT max_members, (SELECT COUNT(*) FROM group_memberships WHERE group_id = $1) as current_count FROM groups WHERE id = $1', [id]);
    
    if (groupResult.rows.length === 0) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    if (parseInt(groupResult.rows[0].current_count) >= groupResult.rows[0].max_members) {
      return res.status(400).json({ error: 'Group is full' });
    }
    
    await pool.query('INSERT INTO group_memberships (group_id, user_id) VALUES ($1, $2)', [id, user.id]);
    
    res.status(201).json({ message: 'Joined successfully' });
  } catch (error) {
    if ((error as any).code === '23505') {
      return res.status(400).json({ error: 'Already a member' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id/leave', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user as any;
    
    await pool.query('DELETE FROM group_memberships WHERE group_id = $1 AND user_id = $2', [id, user.id]);
    
    res.json({ message: 'Left group successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
