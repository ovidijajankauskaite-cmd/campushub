/**
 * CampusHub Database Seed Script
 * Run with: npx ts-node src/seed.ts
 * Requires a running PostgreSQL instance and a configured .env file
 */

import bcrypt from 'bcrypt';
import { pool } from './db';
import dotenv from 'dotenv';

dotenv.config();

const SALT_ROUNDS = 12;

async function hash(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Clear existing data (order matters for FK constraints)
    await client.query('DELETE FROM group_memberships');
    await client.query('DELETE FROM event_registrations');
    await client.query('DELETE FROM groups');
    await client.query('DELETE FROM events');
    await client.query('DELETE FROM users');

    // Reset sequences
    await client.query("SELECT setval('users_id_seq', 1, false)");
    await client.query("SELECT setval('events_id_seq', 1, false)");
    await client.query("SELECT setval('groups_id_seq', 1, false)");
    await client.query("SELECT setval('event_registrations_id_seq', 1, false)");
    await client.query("SELECT setval('group_memberships_id_seq', 1, false)");

    // --- USERS ---
    console.log('Seeding users...');

    const adminHash = await hash('Admin123!');
    const studentHash = await hash('Student123!');

    const usersData = [
      // Admins
      { email: 'admin@campus.edu', password_hash: adminHash, full_name: 'Alexandra Müller', role: 'admin', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexandra' },
      { email: 'admin2@campus.edu', password_hash: adminHash, full_name: 'Marcus Chen', role: 'admin', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus' },
      // Students
      { email: 'emma.johnson@campus.edu', password_hash: studentHash, full_name: 'Emma Johnson', role: 'student', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
      { email: 'liam.patel@campus.edu', password_hash: studentHash, full_name: 'Liam Patel', role: 'student', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam' },
      { email: 'sofia.rossi@campus.edu', password_hash: studentHash, full_name: 'Sofia Rossi', role: 'student', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia' },
      { email: 'noah.kim@campus.edu', password_hash: studentHash, full_name: 'Noah Kim', role: 'student', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noah' },
      { email: 'olivia.brown@campus.edu', password_hash: studentHash, full_name: 'Olivia Brown', role: 'student', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia' },
      { email: 'ethan.garcia@campus.edu', password_hash: studentHash, full_name: 'Ethan Garcia', role: 'student', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan' },
      { email: 'ava.martinez@campus.edu', password_hash: studentHash, full_name: 'Ava Martinez', role: 'student', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ava' },
      { email: 'james.wilson@campus.edu', password_hash: studentHash, full_name: 'James Wilson', role: 'student', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
      { email: 'isabella.lee@campus.edu', password_hash: studentHash, full_name: 'Isabella Lee', role: 'student', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella' },
      { email: 'mason.taylor@campus.edu', password_hash: studentHash, full_name: 'Mason Taylor', role: 'student', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mason' },
    ];

    const userIds: number[] = [];
    for (const u of usersData) {
      const res = await client.query(
        'INSERT INTO users (email, password_hash, full_name, role, avatar_url) VALUES ($1,$2,$3,$4,$5) RETURNING id',
        [u.email, u.password_hash, u.full_name, u.role, u.avatar_url]
      );
      userIds.push(res.rows[0].id);
    }
    // userIds[0] = admin1, userIds[1] = admin2, userIds[2..] = students

    // --- EVENTS ---
    console.log('Seeding events...');

    const eventsData = [
      {
        title: 'Freshman Orientation 2026',
        description: 'Welcome to campus! Join us for an exciting orientation week packed with campus tours, meet-and-greets, and essential info sessions to kick off your university journey.',
        location: 'Main Auditorium, Building A',
        event_date: '2026-09-05T10:00:00Z',
        capacity: 300,
        image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
        creator_id: userIds[0],
      },
      {
        title: 'AI & Machine Learning Workshop',
        description: 'A hands-on workshop exploring the fundamentals of machine learning. We\'ll cover neural networks, model training, and real-world applications. Bring your laptop!',
        location: 'CS Lab, Building C, Room 301',
        event_date: '2026-09-12T14:00:00Z',
        capacity: 40,
        image_url: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800',
        creator_id: userIds[2],
      },
      {
        title: 'Campus Startup Pitch Night',
        description: 'Students pitch their startup ideas to a panel of real investors and entrepreneurs. Prizes include mentorship sessions and seed funding opportunities.',
        location: 'Innovation Hub, Building E',
        event_date: '2026-09-18T18:00:00Z',
        capacity: 120,
        image_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
        creator_id: userIds[3],
      },
      {
        title: 'Psychology & Wellbeing Forum',
        description: 'An open discussion on student mental health, resilience strategies, and campus resources. Guest speakers include licensed therapists and wellness coaches.',
        location: 'Student Union, Room 204',
        event_date: '2026-09-22T13:00:00Z',
        capacity: 60,
        image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800',
        creator_id: userIds[4],
      },
      {
        title: 'Hackathon: Build for Good',
        description: '48-hour hackathon focused on social impact. Teams of 2–5 build tech solutions for local community challenges. Food, prizes, and mentors provided.',
        location: 'Engineering Block, Floors 2–3',
        event_date: '2026-10-03T09:00:00Z',
        capacity: 200,
        image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
        creator_id: userIds[5],
      },
      {
        title: 'Photography Walk: Urban Campus Stories',
        description: 'Explore the campus with your camera or smartphone. A photography instructor will guide you through composition, lighting, and storytelling techniques.',
        location: 'Meet at Library Steps',
        event_date: '2026-10-10T09:30:00Z',
        capacity: 25,
        image_url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800',
        creator_id: userIds[6],
      },
      {
        title: 'Finance & Investing 101',
        description: 'Learn personal finance basics: budgeting, investing, compound interest, and how to start investing as a student. Practical exercises included.',
        location: 'Business Faculty, Lecture Hall B',
        event_date: '2026-10-15T16:00:00Z',
        capacity: 80,
        image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
        creator_id: userIds[7],
      },
      {
        title: 'International Food Festival',
        description: 'Celebrate global cultures through food! Student-run booths serving dishes from over 20 countries. Live music, dance performances, and cultural exhibits.',
        location: 'Campus Courtyard',
        event_date: '2026-10-20T12:00:00Z',
        capacity: 500,
        image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
        creator_id: userIds[8],
      },
      {
        title: 'Debate Club Open Tournament',
        description: 'Annual open debate tournament on current global affairs. Categories: Policy, Parliamentary, and Lincoln-Douglas formats. Open to all skill levels.',
        location: 'Humanities Building, Main Hall',
        event_date: '2026-10-28T10:00:00Z',
        capacity: 90,
        image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
        creator_id: userIds[9],
      },
      {
        title: 'Game Development Bootcamp',
        description: 'Two-day intensive bootcamp using Unity. Learn 2D game mechanics, physics, and UI in a collaborative environment. Beginners welcome.',
        location: 'Digital Arts Studio, Building D',
        event_date: '2026-11-01T10:00:00Z',
        capacity: 30,
        image_url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
        creator_id: userIds[10],
      },
      {
        title: 'Sustainability & Green Campus Day',
        description: 'A full day of workshops, exhibits, and panel discussions on sustainability, climate action, and how students can make an impact on campus and beyond.',
        location: 'Campus Green & Eco Hub',
        event_date: '2026-11-08T09:00:00Z',
        capacity: 250,
        image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
        creator_id: userIds[11],
      },
      {
        title: 'Creative Writing Workshop',
        description: 'Sharpen your storytelling skills. From short fiction to poetry, this workshop offers craft exercises, peer feedback, and guidance from a published author.',
        location: 'Arts Library, Reading Room 3',
        event_date: '2026-11-15T15:00:00Z',
        capacity: 20,
        image_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800',
        creator_id: userIds[2],
      },
      {
        title: 'Campus Career Fair 2026',
        description: 'Meet recruiters from 50+ companies spanning tech, finance, healthcare, and NGOs. Bring your CV and prepare for on-the-spot interviews.',
        location: 'Sports Hall, Building F',
        event_date: '2026-11-20T10:00:00Z',
        capacity: 600,
        image_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800',
        creator_id: userIds[0],
      },
      {
        title: 'Yoga & Mindfulness Morning',
        description: 'Start the day with a guided yoga session followed by a 20-minute mindfulness meditation. All levels welcome — bring your mat!',
        location: 'Campus Lawn (East Side)',
        event_date: '2026-11-27T07:30:00Z',
        capacity: 50,
        image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
        creator_id: userIds[3],
      },
      {
        title: 'End-of-Semester Celebration',
        description: 'Celebrate the end of the semester with live music, awards ceremony, and the annual student project showcase. All students and faculty invited.',
        location: 'Main Auditorium & Campus Grounds',
        event_date: '2026-12-18T17:00:00Z',
        capacity: 800,
        image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
        creator_id: userIds[1],
      },
    ];

    const eventIds: number[] = [];
    for (const e of eventsData) {
      const res = await client.query(
        'INSERT INTO events (title, description, location, event_date, capacity, image_url, creator_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
        [e.title, e.description, e.location, e.event_date, e.capacity, e.image_url, e.creator_id]
      );
      eventIds.push(res.rows[0].id);
    }

    // --- GROUPS ---
    console.log('Seeding groups...');

    const groupsData = [
      {
        name: 'Algorithms & Data Structures',
        description: 'Weekly problem-solving sessions on algorithms and data structures. We work through LeetCode, Codeforces, and classic CS textbook exercises together.',
        subject: 'Computer Science',
        creator_id: userIds[2],
        max_members: 15,
      },
      {
        name: 'Quantum Physics Reading Circle',
        description: 'Bi-weekly reading group covering modern quantum mechanics textbooks and papers. From Griffiths to recent arXiv preprints — all welcome.',
        subject: 'Physics',
        creator_id: userIds[3],
        max_members: 10,
      },
      {
        name: 'Entrepreneurship & Innovation Lab',
        description: 'A collaborative space for aspiring entrepreneurs to share ideas, workshop business models, and connect with mentors in the startup ecosystem.',
        subject: 'Business',
        creator_id: userIds[4],
        max_members: 20,
      },
      {
        name: 'Spanish Language Exchange',
        description: 'Practice conversational Spanish with native and advanced speakers. Sessions alternate between structured grammar review and free conversation.',
        subject: 'Languages',
        creator_id: userIds[5],
        max_members: 12,
      },
      {
        name: 'Bioethics & Society',
        description: 'Multidisciplinary group exploring the ethical dimensions of modern biology, medicine, and biotechnology. Students from all faculties welcome.',
        subject: 'Philosophy & Biology',
        creator_id: userIds[6],
        max_members: 18,
      },
      {
        name: 'Web Dev & UX Collective',
        description: 'Frontend and full-stack developers sharing projects, doing code reviews, and exploring the latest frameworks. Monthly project showcase.',
        subject: 'Technology',
        creator_id: userIds[7],
        max_members: 25,
      },
      {
        name: 'Macroeconomics Study Group',
        description: 'Focused on macroeconomic theory, policy analysis, and current global economic events. We prepare together for exams and write analytical pieces.',
        subject: 'Economics',
        creator_id: userIds[8],
        max_members: 14,
      },
    ];

    const groupIds: number[] = [];
    for (const g of groupsData) {
      const res = await client.query(
        'INSERT INTO groups (name, description, subject, creator_id, max_members) VALUES ($1,$2,$3,$4,$5) RETURNING id',
        [g.name, g.description, g.subject, g.creator_id, g.max_members]
      );
      groupIds.push(res.rows[0].id);
    }

    // --- EVENT REGISTRATIONS ---
    console.log('Seeding event registrations...');

    const registrations = [
      [eventIds[0], userIds[2]], [eventIds[0], userIds[3]], [eventIds[0], userIds[4]],
      [eventIds[0], userIds[5]], [eventIds[0], userIds[6]],
      [eventIds[1], userIds[2]], [eventIds[1], userIds[7]], [eventIds[1], userIds[8]],
      [eventIds[2], userIds[3]], [eventIds[2], userIds[4]], [eventIds[2], userIds[9]],
      [eventIds[3], userIds[5]], [eventIds[3], userIds[6]], [eventIds[3], userIds[10]],
      [eventIds[4], userIds[2]], [eventIds[4], userIds[3]], [eventIds[4], userIds[7]],
      [eventIds[4], userIds[8]], [eventIds[4], userIds[9]],
      [eventIds[5], userIds[6]], [eventIds[5], userIds[10]],
      [eventIds[6], userIds[4]], [eventIds[6], userIds[5]], [eventIds[6], userIds[11]],
      [eventIds[7], userIds[2]], [eventIds[7], userIds[6]], [eventIds[7], userIds[9]],
      [eventIds[8], userIds[3]], [eventIds[8], userIds[7]],
      [eventIds[9], userIds[2]], [eventIds[9], userIds[4]], [eventIds[9], userIds[10]],
      [eventIds[12], userIds[2]], [eventIds[12], userIds[5]], [eventIds[12], userIds[8]], [eventIds[12], userIds[11]],
      [eventIds[14], userIds[3]], [eventIds[14], userIds[4]], [eventIds[14], userIds[6]], [eventIds[14], userIds[7]],
    ];

    for (const [eventId, userId] of registrations) {
      await client.query(
        'INSERT INTO event_registrations (event_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [eventId, userId]
      );
    }

    // --- GROUP MEMBERSHIPS ---
    console.log('Seeding group memberships...');

    const memberships = [
      [groupIds[0], userIds[2]], [groupIds[0], userIds[4]], [groupIds[0], userIds[7]],
      [groupIds[0], userIds[9]], [groupIds[0], userIds[10]],
      [groupIds[1], userIds[3]], [groupIds[1], userIds[5]], [groupIds[1], userIds[8]],
      [groupIds[2], userIds[4]], [groupIds[2], userIds[6]], [groupIds[2], userIds[9]],
      [groupIds[2], userIds[11]], [groupIds[2], userIds[2]],
      [groupIds[3], userIds[5]], [groupIds[3], userIds[7]], [groupIds[3], userIds[10]],
      [groupIds[4], userIds[6]], [groupIds[4], userIds[3]], [groupIds[4], userIds[8]],
      [groupIds[5], userIds[7]], [groupIds[5], userIds[2]], [groupIds[5], userIds[4]],
      [groupIds[5], userIds[9]], [groupIds[5], userIds[11]],
      [groupIds[6], userIds[8]], [groupIds[6], userIds[5]], [groupIds[6], userIds[10]],
    ];

    for (const [groupId, userId] of memberships) {
      await client.query(
        'INSERT INTO group_memberships (group_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [groupId, userId]
      );
    }

    await client.query('COMMIT');
    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest accounts:');
    console.log('  Admin:   admin@campus.edu  / Admin123!');
    console.log('  Admin:   admin2@campus.edu / Admin123!');
    console.log('  Student: emma.johnson@campus.edu / Student123!');
    console.log('  Student: liam.patel@campus.edu   / Student123!');
    console.log('  (all student*.@campus.edu accounts use: Student123!)');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
