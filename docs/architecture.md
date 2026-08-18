# CampusHub Architecture & Product Specification

## 1. System Overview

CampusHub is a full-stack student community web application. The frontend is built using React (Vite) with TypeScript, offering a responsive and interactive user interface. The backend is an Express server running on Node.js with TypeScript, providing a RESTful API. The application uses a PostgreSQL database for persistent storage and Passport.js with JWT for authentication and session management.

### Component Diagram

```text
+---------------------+         +----------------------+         +-----------------------+
|    Web Browser      |         |   Backend Server     |         |    Database (PostgreSQL)|
| (React/Vite + TS)   |<--JWT-->| (Express + Node.js)  |<--SQL-->|                       |
|                     |  HTTPS  |                      |         | - Users               |
| - Student Dashboard |         | - Auth Middleware    |         | - Events              |
| - Admin Dashboard   |         | - Event Services     |         | - Event Registrations |
| - Group Pages       |         | - Group Services     |         | - Groups              |
| - Event Pages       |         | - Admin Services     |         | - Group Memberships   |
+---------------------+         +----------------------+         +-----------------------+
```

## 2. User Flows

### Student Persona
1. **Onboarding:** Student lands on the home page -> Clicks "Register" -> Fills out registration form (Name, Email, Password, Student ID) -> Submits -> Gets redirected to Login -> Logs in using credentials -> Redirected to Student Dashboard.
2. **Event Discovery & Registration:** Student navigates to "Events" page -> Browses upcoming events -> Clicks on an event to view details -> Clicks "Register for Event" -> Success message displayed.
3. **Event Creation:** Student clicks "Create Event" on the Events page -> Fills out title, description, date, location, and capacity -> Submits -> Event is published and student is listed as the organizer.
4. **Group Management:** Student goes to "Study Groups" -> Browses existing groups -> Clicks "Join" on a group OR clicks "Create Group" -> Fills out group details -> Group is created and student becomes the owner.
5. **Dashboard:** Student views the Personal Dashboard -> Sees a list of "Upcoming Events I'm Attending" and "My Study Groups".

### Admin Persona
1. **Login:** Admin user logs in using admin credentials.
2. **Admin Dashboard:** Admin is redirected to the Admin Dashboard upon login.
3. **Platform Statistics:** Admin views high-level stats (Total Users, Total Events, Total Groups, Total Registrations).
4. **User Management:** Admin navigates to the "Users" tab -> Views a list of all registered users.
5. **Event Moderation:** Admin navigates to the "Events" tab -> Browses all events -> Identifies an inappropriate event -> Clicks "Delete Event" -> Event and its registrations are removed from the system.

## 3. Core Domain Entities

- **User**: Represents a registered account. Fields: `id`, `name`, `email`, `password_hash`, `role` (student/admin), `student_id`, `created_at`.
- **Event**: Represents an activity organized by a user. Fields: `id`, `title`, `description`, `date`, `location`, `capacity`, `organizer_id` (User), `created_at`.
- **Registration**: Represents a user's attendance at an event. Fields: `id`, `user_id`, `event_id`, `registered_at`.
- **Group**: Represents a study group. Fields: `id`, `name`, `description`, `owner_id` (User), `created_at`.
- **Membership**: Represents a user's membership in a group. Fields: `id`, `user_id`, `group_id`, `joined_at`.

## 4. Acceptance Criteria

**Feature: Authentication**
- A user must be able to register with valid details.
- A user must be able to log in and receive a JWT.
- Invalid login attempts must return an appropriate error.

**Feature: Events**
- Any student can create an event.
- Students can register for events if there is available capacity.
- A student cannot register for the same event twice.
- Students can cancel their registration.
- Past events are still viewable but registration is disabled.

**Feature: Study Groups**
- Any student can create a study group.
- Students can join open groups.
- Students can leave groups they have joined.

**Feature: Dashboard**
- A logged-in student must see a curated list of their upcoming registered events.
- A logged-in student must see the study groups they are part of.

**Feature: Admin Moderation**
- Admins can view all platform statistics.
- Admins can view all users and events.
- Admins can delete any event.
- Non-admin users attempting to access admin endpoints must receive a 403 Forbidden response.

## 5. Edge Cases & Business Rules

- **Event Capacity Check:** When a user registers for an event, the system must perform a transactional check to ensure the total number of registrations is strictly less than the event's `capacity`. If it's full, return `400 Bad Request`.
- **Past Events:** The system must reject registrations for events whose `date` is in the past.
- **Admin Role Enforcement:** The UI hiding admin links is insufficient. Every `/admin/*` route must check the JWT claims or database for `role === 'admin'`.
- **Orphaned Records:** Deleting an event must cascade and delete all associated registrations. Deleting a user should cascade to their event registrations and group memberships, but handling groups/events they own might require transferring ownership or archiving. For now, cascading deletes are assumed.

## 6. API Endpoints List (REST)

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Events
- `GET /api/events`
- `POST /api/events`
- `GET /api/events/:id`
- `PUT /api/events/:id`
- `DELETE /api/events/:id` (Admin or Organizer)
- `GET /api/events/:id/registrations`
- `POST /api/events/:id/register`
- `DELETE /api/events/:id/register`

### Groups
- `GET /api/groups`
- `POST /api/groups`
- `GET /api/groups/:id`
- `POST /api/groups/:id/join`
- `DELETE /api/groups/:id/leave`

### Dashboard
- `GET /api/dashboard`

### Admin
- `GET /api/admin/users`
- `GET /api/admin/events`
- `DELETE /api/admin/events/:id`
- `GET /api/admin/stats`
