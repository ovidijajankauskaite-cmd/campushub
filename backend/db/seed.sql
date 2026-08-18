-- Admin users
INSERT INTO users (email, password_hash, full_name, role) VALUES 
('admin@campus.edu', '$2b$12$wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.w', 'Super Admin 1', 'admin'),
('admin2@campus.edu', '$2b$12$wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.w', 'Super Admin 2', 'admin');

-- Student users
INSERT INTO users (email, password_hash, full_name, role) VALUES 
('student1@campus.edu', '$2b$12$wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.w', 'Student User 1', 'student'),
('student2@campus.edu', '$2b$12$wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.w', 'Student User 2', 'student'),
('student3@campus.edu', '$2b$12$wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.w', 'Student User 3', 'student'),
('student4@campus.edu', '$2b$12$wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.w', 'Student User 4', 'student'),
('student5@campus.edu', '$2b$12$wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.w', 'Student User 5', 'student'),
('student6@campus.edu', '$2b$12$wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.w', 'Student User 6', 'student'),
('student7@campus.edu', '$2b$12$wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.w', 'Student User 7', 'student'),
('student8@campus.edu', '$2b$12$wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.w', 'Student User 8', 'student'),
('student9@campus.edu', '$2b$12$wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.w', 'Student User 9', 'student'),
('student10@campus.edu', '$2b$12$wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.wW.w', 'Student User 10', 'student');

-- Events
INSERT INTO events (title, description, location, event_date, capacity, creator_id) VALUES 
('Event 1', 'Description for event 1', 'Location 1', '2026-09-01T10:00:00Z', 25, 1),
('Event 2', 'Description for event 2', 'Location 2', '2026-09-02T10:00:00Z', 30, 1),
('Event 3', 'Description for event 3', 'Location 3', '2026-09-03T10:00:00Z', 35, 1),
('Event 4', 'Description for event 4', 'Location 4', '2026-09-04T10:00:00Z', 40, 1),
('Event 5', 'Description for event 5', 'Location 5', '2026-09-05T10:00:00Z', 45, 1),
('Event 6', 'Description for event 6', 'Location 6', '2026-09-06T10:00:00Z', 50, 1),
('Event 7', 'Description for event 7', 'Location 7', '2026-09-07T10:00:00Z', 55, 1),
('Event 8', 'Description for event 8', 'Location 8', '2026-09-08T10:00:00Z', 60, 1),
('Event 9', 'Description for event 9', 'Location 9', '2026-09-09T10:00:00Z', 65, 1),
('Event 10', 'Description for event 10', 'Location 10', '2026-09-10T10:00:00Z', 70, 1),
('Event 11', 'Description for event 11', 'Location 11', '2026-09-11T10:00:00Z', 75, 1),
('Event 12', 'Description for event 12', 'Location 12', '2026-09-12T10:00:00Z', 80, 1),
('Event 13', 'Description for event 13', 'Location 13', '2026-09-13T10:00:00Z', 85, 1),
('Event 14', 'Description for event 14', 'Location 14', '2026-09-14T10:00:00Z', 90, 1),
('Event 15', 'Description for event 15', 'Location 15', '2026-09-15T10:00:00Z', 95, 1);

-- Groups
INSERT INTO groups (name, description, subject, creator_id, max_members) VALUES 
('Group 1', 'Study group for subject 1', 'Subject 1', 2, 12),
('Group 2', 'Study group for subject 2', 'Subject 2', 2, 14),
('Group 3', 'Study group for subject 3', 'Subject 3', 2, 16),
('Group 4', 'Study group for subject 4', 'Subject 4', 2, 18),
('Group 5', 'Study group for subject 5', 'Subject 5', 2, 20);

-- Registrations
INSERT INTO event_registrations (event_id, user_id) VALUES 
(1, 3), (1, 4), (2, 5), (3, 6), (4, 7);

-- Memberships
INSERT INTO group_memberships (group_id, user_id) VALUES 
(1, 3), (2, 4), (3, 5), (4, 6), (5, 7);
