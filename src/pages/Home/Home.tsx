import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import styles from './Home.module.css';

const Home: React.FC = () => {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Welcome to CampusHub</h1>
          <p className={styles.subtitle}>Your one-stop platform for student events and study groups.</p>
          <div className={styles.heroActions}>
            <Link to="/events"><Button variant="primary" size="lg">Browse Events</Button></Link>
            <Link to="/groups"><Button variant="secondary" size="lg">Join a Group</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
