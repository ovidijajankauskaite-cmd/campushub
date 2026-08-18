import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { getEvents } from '../../api/events';
import { getGroups } from '../../api/groups';
import { getAdminStats } from '../../api/admin';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { useAuthStore } from '../../store/authStore';
import styles from './Home.module.css';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1523580494112-071d16940d14?auto=format&fit=crop&w=800&q=80';

const Home: React.FC = () => {
  const { user } = useAuthStore();

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  });

  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: getGroups,
  });

  const { data: stats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: getAdminStats,
  });

  const featuredEvents = events?.slice(0, 6) ?? [];
  const featuredGroups = groups?.slice(0, 4) ?? [];

  return (
    <div className={styles.page}>
      {/* ── Hero Section ── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          {user && (
            <p className={styles.welcomeTag}>👋 Welcome back, {user.full_name.split(' ')[0]}!</p>
          )}
          <h1 className={styles.heroTitle}>
            Your campus,{' '}
            <span className={styles.highlight}>connected.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Discover events, join study groups, and build meaningful connections
            with fellow students — all in one place.
          </p>
          <div className={styles.heroActions}>
            <Link to="/events">
              <Button variant="primary" size="lg">Browse Events</Button>
            </Link>
            <Link to="/groups">
              <Button variant="secondary" size="lg">Join a Group</Button>
            </Link>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroImageGrid}>
            <img src="https://images.unsplash.com/photo-1523580494112-071d16940d14?auto=format&fit=crop&w=400&q=80" alt="campus event" className={styles.heroImg1} />
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80" alt="study group" className={styles.heroImg2} />
            <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80" alt="students" className={styles.heroImg3} />
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      {stats && (
        <section className={styles.statsBar}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{stats.totalUsers}+</span>
            <span className={styles.statLabel}>Students</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{stats.totalEvents}+</span>
            <span className={styles.statLabel}>Events</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{stats.totalGroups}+</span>
            <span className={styles.statLabel}>Study Groups</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{stats.totalRegistrations}+</span>
            <span className={styles.statLabel}>Registrations</span>
          </div>
        </section>
      )}

      {/* ── Featured Events ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Upcoming Events</h2>
            <p className={styles.sectionSubtitle}>Don't miss what's happening this semester</p>
          </div>
          <Link to="/events">
            <Button variant="ghost">View all →</Button>
          </Link>
        </div>

        {eventsLoading ? (
          <div className={styles.eventGrid}>
            {[1, 2, 3].map(i => <Skeleton key={i} className={styles.eventSkeleton} />)}
          </div>
        ) : (
          <div className={styles.eventGrid}>
            {featuredEvents.map(event => (
              <Link key={event.id} to={`/events/${event.id}`} className={styles.eventCardLink}>
                <Card hoverable className={styles.eventCard}>
                  <div className={styles.eventImageWrapper}>
                    <img
                      src={event.image_url || FALLBACK_IMG}
                      alt={event.title}
                      className={styles.eventImage}
                      onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                    />
                  </div>
                  <div className={styles.eventCardBody}>
                    <p className={styles.eventDate}>
                      {format(new Date(event.event_date), 'EEE, MMM d · h:mm a')}
                    </p>
                    <h3 className={styles.eventCardTitle}>{event.title}</h3>
                    <p className={styles.eventLocation}>📍 {event.location}</p>
                    <div className={styles.eventMeta}>
                      <Badge variant="secondary">
                        {event.capacity - (event.registration_count ?? 0)} spots left
                      </Badge>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Featured Groups ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Study Groups</h2>
            <p className={styles.sectionSubtitle}>Find your academic community</p>
          </div>
          <Link to="/groups">
            <Button variant="ghost">View all →</Button>
          </Link>
        </div>

        {groupsLoading ? (
          <div className={styles.groupGrid}>
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className={styles.groupSkeleton} />)}
          </div>
        ) : (
          <div className={styles.groupGrid}>
            {featuredGroups.map(group => (
              <Link key={group.id} to={`/groups/${group.id}`} className={styles.groupCardLink}>
                <Card hoverable className={styles.groupCard}>
                  <div className={styles.groupIcon}>
                    {group.subject.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.groupCardBody}>
                    <Badge variant="secondary" className={styles.subjectBadge}>
                      {group.subject}
                    </Badge>
                    <h3 className={styles.groupCardTitle}>{group.name}</h3>
                    <p className={styles.groupDescription}>{group.description}</p>
                    <p className={styles.groupMeta}>
                      👥 {group.member_count ?? 0} / {group.max_members} members
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── CTA Section ── */}
      {!user && (
        <section className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Ready to get involved?</h2>
          <p className={styles.ctaSubtitle}>
            Join thousands of students already using CampusHub to make the most of their university experience.
          </p>
          <div className={styles.ctaActions}>
            <Link to="/register">
              <Button variant="primary" size="lg">Create Free Account</Button>
            </Link>
            <Link to="/events">
              <Button variant="ghost" size="lg">Explore Events</Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
