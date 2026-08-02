# HomeVista - Frontend

This is the frontend application for the HomeVista Real Estate Portal, built with React, TypeScript, and Vite.

## Live Demo
[https://home-vistas-ten.vercel.app/](https://home-vistas-ten.vercel.app/)

## Technologies Used
- **React 18**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Zustand** (State Management)
- **React Router DOM** (Routing)
- **Socket.io-client** (Real-time chat)
- **Lucide React** (Icons)

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in this directory with the following:
```env
VITE_API_URL=http://localhost:5000/api
```
*(If testing against production backend, use `VITE_API_URL=https://homevistas-backend.onrender.com/api`)*

### 3. Start Development Server
```bash
npm run dev
```

## Build for Production
```bash
npm run build
```
This will compile the TypeScript code and bundle the application into the `dist` folder.
