import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { logout } from '../../api/auth';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const { user, logout: clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      // ignore
    }
    clearAuth();
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link to="/" className={styles.logo}>
          CampusHub
        </Link>
        <div className={styles.links}>
          <Link to="/events" className={styles.link}>Events</Link>
          <Link to="/groups" className={styles.link}>Groups</Link>
        </div>
        <div className={styles.actions}>
          {user ? (
            <>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className={styles.link}>
                Dashboard
              </Link>
              <div className={styles.profile}>
                <Avatar name={user.name} size="sm" />
                <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm">Log In</Button></Link>
              <Link to="/register"><Button variant="primary" size="sm">Register</Button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
