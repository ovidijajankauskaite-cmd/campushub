import { Router } from 'express';
import { pool } from '../db';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/requireAdmin';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      'SELECT id, email, full_name, avatar_url, role, created_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    const countResult = await pool.query('SELECT COUNT(*) FROM users');

    res.json({
      users: result.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      limit
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/events', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, u.full_name as creator_name, u.email as creator_email 
      FROM events e 
      LEFT JOIN users u ON e.creator_id = u.id 
      ORDER BY e.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM events WHERE id = $1', [id]);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const [users, events, groups, registrations] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query('SELECT COUNT(*) FROM events'),
      pool.query('SELECT COUNT(*) FROM groups'),
      pool.query('SELECT COUNT(*) FROM event_registrations')
    ]);

    res.json({
      totalUsers: parseInt(users.rows[0].count),
      totalEvents: parseInt(events.rows[0].count),
      totalGroups: parseInt(groups.rows[0].count),
      totalRegistrations: parseInt(registrations.rows[0].count)
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
