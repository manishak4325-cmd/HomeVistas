# HomeVista - Real Estate Portal

A full-stack MERN (MongoDB, Express, React, Node.js) real estate portal.

## Features
- **User Authentication**: Register/Login with JWT. Roles: User, Agent, Admin.
- **Property Listings**: Agents and Admins can create and manage properties.
- **Search & Filters**: Advanced search by location, type, price, and bedrooms.
- **Favorites**: Users can save properties to their favorites list.
- **Inquiries**: Built-in messaging system to contact agents directly.
- **Admin Dashboard**: Approvals workflow for new properties and user management.

## Tech Stack
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT.
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Zustand, React Router.

## Getting Started

### 1. Clone the repository

### 2. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in your MongoDB URI, JWT Secret, and Cloudinary keys.
4. Seed the database with mock properties and users (Admin, Agent, User):
   ```bash
   npm run seed
   ```
   **Mock Users:**
   - Admin: `admin@example.com` / `password123`
   - Agent: `agent@example.com` / `password123`
   - User: `john@example.com` / `password123`
5. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env`. It defaults to `http://localhost:5000/api`.
4. Start the Vite dev server:
   ```bash
   npm run dev
   ```

## Design
This project utilizes a premium aesthetic using modern Tailwind CSS patterns, dynamic dark-mode compatibility, and responsive mobile-first UI components.

## License
MIT
