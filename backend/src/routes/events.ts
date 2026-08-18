import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  location: z.string().min(1),
  event_date: z.string().datetime(),
  capacity: z.number().int().positive(),
  image_url: z.string().url().optional()
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
      SELECT e.*, 
        (SELECT COUNT(*) FROM event_registrations er WHERE er.event_id = e.id) as registration_count
    `;
    let params: any[] = [];
    
    if (userId) {
      query += `, EXISTS(SELECT 1 FROM event_registrations er WHERE er.event_id = e.id AND er.user_id = $1) as "isRegistered"`;
      params.push(userId);
    } else {
      query += `, false as "isRegistered"`;
    }
    
    query += ` FROM events e WHERE e.event_date >= CURRENT_TIMESTAMP ORDER BY e.event_date ASC`;

    const result = await pool.query(query, params);
    
    const events = result.rows.map(row => ({
      ...row,
      registration_count: parseInt(row.registration_count),
      isRegistered: row.isRegistered
    }));
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticate, validate(eventSchema), async (req, res) => {
  try {
    const { title, description, location, event_date, capacity, image_url } = req.body;
    const user = req.user as any;
    
    const result = await pool.query(
      'INSERT INTO events (title, description, location, event_date, capacity, image_url, creator_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, description, location, event_date, capacity, image_url, user.id]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authenticate, validate(eventSchema.partial()), async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user as any;
    
    const eventResult = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    if (eventResult.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const event = eventResult.rows[0];
    if (event.creator_id !== user.id && user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    const { title, description, location, event_date, capacity, image_url } = req.body;
    
    const result = await pool.query(
      `UPDATE events SET 
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        location = COALESCE($3, location),
        event_date = COALESCE($4, event_date),
        capacity = COALESCE($5, capacity),
        image_url = COALESCE($6, image_url)
      WHERE id = $7 RETURNING *`,
      [title, description, location, event_date, capacity, image_url, id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user as any;
    
    const eventResult = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    if (eventResult.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const event = eventResult.rows[0];
    if (event.creator_id !== user.id && user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    await pool.query('DELETE FROM events WHERE id = $1', [id]);
    
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/register', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user as any;
    
    const eventResult = await pool.query('SELECT capacity, (SELECT COUNT(*) FROM event_registrations WHERE event_id = $1) as current_count FROM events WHERE id = $1', [id]);
    
    if (eventResult.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    if (parseInt(eventResult.rows[0].current_count) >= eventResult.rows[0].capacity) {
      return res.status(400).json({ error: 'Event is full' });
    }
    
    await pool.query('INSERT INTO event_registrations (event_id, user_id) VALUES ($1, $2)', [id, user.id]);
    
    res.status(201).json({ message: 'Registered successfully' });
  } catch (error) {
    if ((error as any).code === '23505') {
      return res.status(400).json({ error: 'Already registered' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id/register', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user as any;
    
    await pool.query('DELETE FROM event_registrations WHERE event_id = $1 AND user_id = $2', [id, user.id]);
    
    res.json({ message: 'Unregistered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
