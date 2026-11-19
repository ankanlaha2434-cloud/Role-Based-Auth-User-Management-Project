# Role-Based Authentication & User Management System

## Requirements
- Node.js 18+
- MongoDB local or Atlas

## Setup
1. Copy `.env.example` to `.env` and set `MONGO_URI` and a strong `SESSION_SECRET`.
2. Run `npm install`
3. Create first admin: `npm run seed:admin -- admin@example.com Admin@123`
4. Start: `npm run dev` (or `npm start`)
5. Open http://localhost:3000

## Roles
- Admin: dashboards, user CRUD, role/status control, all login history
- Manager: read-only user directory
- User: own dashboard/profile/login history

Public registration always creates a normal User. Admin is created only by seed utility.
