import { Router } from 'express';
import { pool } from '../db';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const user = req.user as any;
    
    const eventsResult = await pool.query(`
      SELECT e.* FROM events e
      JOIN event_registrations er ON e.id = er.event_id
      WHERE er.user_id = $1 AND e.event_date >= CURRENT_TIMESTAMP
      ORDER BY e.event_date ASC
    `, [user.id]);

    const groupsResult = await pool.query(`
      SELECT g.* FROM groups g
      JOIN group_memberships gm ON g.id = gm.group_id
      WHERE gm.user_id = $1
    `, [user.id]);

    res.json({
      events: eventsResult.rows,
      groups: groupsResult.rows
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
