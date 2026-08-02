<div align="center">
  <img src="https://via.placeholder.com/150?text=HomeVista" alt="HomeVista Logo" width="120" />
  <h1>🏡 HomeVista - Premium Real Estate Portal</h1>
  <p>A full-stack, feature-rich MERN real estate platform built for modern buyers, agents, and administrators.</p>
</div>

---

## 🚀 Live Demos
- **Frontend Web Application:** [https://home-vistas-ten.vercel.app/](https://home-vistas-ten.vercel.app/)
- **Backend API Server:** [https://homevistas-backend.onrender.com](https://homevistas-backend.onrender.com)

---

## ✨ Features

### For Users & Buyers
- **Authentication:** Secure JWT-based Login and Registration.
- **Advanced Search:** Filter properties by keywords, location, property type, price range, and bedrooms.
- **Favorites System:** Heart your favorite properties and view them in a dedicated dashboard.
- **Property Reviews (NEW):** Leave 1-to-5 star ratings and textual reviews on properties.
- **Real-Time Chat (NEW):** Chat live with property owners and agents using Socket.io instantly.
- **Dark Mode (NEW):** Fully responsive light and dark themes using a custom Context Provider.

### For Agents & Owners
- **Dashboard:** A personalized view to manage your listings and track engagement.
- **Create Listings:** Upload high-quality property images, descriptions, amenities, and pricing.
- **Neighborhood Intelligence:** Add neighborhood scores for safety, schools, and lifestyle to attract buyers.

### For Administrators
- **Admin Panel:** Powerful table interface to approve, reject, or delete submitted properties across the platform.
- **User Management:** Complete oversight over all registered users and agents.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 & Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS + custom Shadcn-inspired UI components
- **State Management:** Zustand
- **Routing:** React Router DOM
- **Forms & Validation:** React Hook Form + Zod
- **Real-Time:** Socket.io-client
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose
- **Real-Time:** Socket.io
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **File Uploads:** Multer & Cloudinary *(configured)*

---

## 💻 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/manishak4325-cmd/HomeVistas.git
cd HomeVistas
```

### 2. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb+srv://<your_username>:<your_password>@cluster0.mongodb.net/homevista?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Seed the database with mock properties and users:
   ```bash
   npm run seed
   ```
   *This creates mock users: `admin@homevista.com`, `agent@homevista.com`, and `user@homevista.com` (Password: `password123`)*
5. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` folder:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend Vite server:
   ```bash
   npm run dev
   ```
5. Open your browser to `http://localhost:5173`

---

# 👩‍💻 Author

**Manisha Kumari**

GitHub:
https://github.com/manishak4325-cmd

LinkedIn:
https://www.linkedin.com/in/manisha-sharma-8245182b9/

---

# ⭐ Support

If you like this project,

⭐ Star this repository

🍴 Fork the repository

🛠️ Contribute to improve HomeVistas

---

# 📜 License

This project is licensed under the MIT License.