const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require('path');

async function generateSeed() {
  const adminPass = await bcrypt.hash('Admin123!', 12);
  const studentPass = await bcrypt.hash('Student123!', 12);

  let sql = `
-- Admin users
INSERT INTO users (email, password_hash, full_name, role) VALUES 
('admin@campus.edu', '${adminPass}', 'Super Admin 1', 'admin'),
('admin2@campus.edu', '${adminPass}', 'Super Admin 2', 'admin');

-- Student users
INSERT INTO users (email, password_hash, full_name, role) VALUES \n`;

  for (let i = 1; i <= 10; i++) {
    sql += `('student${i}@campus.edu', '${studentPass}', 'Student User ${i}', 'student')${i < 10 ? ',' : ';'}\n`;
  }

  sql += `
-- Events
INSERT INTO events (title, description, location, event_date, capacity, creator_id) VALUES \n`;

  for (let i = 1; i <= 15; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    sql += `('Event ${i}', 'Description for event ${i}', 'Location ${i}', '${date.toISOString()}', ${20 + i * 5}, 1)${i < 15 ? ',' : ';'}\n`;
  }

  sql += `
-- Groups
INSERT INTO groups (name, description, subject, creator_id, max_members) VALUES \n`;

  for (let i = 1; i <= 5; i++) {
    sql += `('Group ${i}', 'Study group for subject ${i}', 'Subject ${i}', 2, ${10 + i * 2})${i < 5 ? ',' : ';'}\n`;
  }

  sql += `
-- Registrations
INSERT INTO event_registrations (event_id, user_id) VALUES 
(1, 3), (1, 4), (2, 5), (3, 6), (4, 7);

-- Memberships
INSERT INTO group_memberships (group_id, user_id) VALUES 
(1, 3), (2, 4), (3, 5), (4, 6), (5, 7);
`;

  fs.writeFileSync(path.join(__dirname, 'seed.sql'), sql);
  console.log('seed.sql generated!');
}

generateSeed();
