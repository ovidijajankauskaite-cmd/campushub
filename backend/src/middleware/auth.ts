import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { pool } from '../db';
import dotenv from 'dotenv';

dotenv.config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'supersecret123',
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [jwt_payload.id]);
      if (rows.length > 0) {
        return done(null, rows[0]);
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

export const authenticate = passport.authenticate('jwt', { session: false });
