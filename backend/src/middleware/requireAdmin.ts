import { Request, Response, NextFunction } from 'express';
import { pool } from '../db';

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as any;
    if (!user || !user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { rows } = await pool.query('SELECT role FROM users WHERE id = $1', [user.id]);
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (rows[0].role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Error in requireAdmin middleware:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
