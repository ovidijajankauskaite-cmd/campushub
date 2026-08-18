import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import styles from './Layout.module.css';

const Layout: React.FC = () => {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} CampusHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
