# SOEIT Achievements Portal

A complete, production-ready, role-based web application for the **School of Engineering & IT** at Arka Jain University. Students can submit, manage, and showcase achievements; faculty and administrators can verify submissions, monitor performance, and generate analytics.

---

## 🏗️ Project Structure

```
SOEIT Acheivement portal/
├── frontend/                   # React.js frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   └── common/         # Sidebar, Topbar, DashboardLayout, Navbar, Footer
│   │   ├── context/            # AuthContext (JWT state management)
│   │   ├── pages/
│   │   │   ├── public/         # Landing, About, Features, HowItWorks, Contact, Portfolio
│   │   │   ├── auth/           # Login, Register, ForgotPassword
│   │   │   ├── student/        # Dashboard, Upload, MyAchievements, Profile
│   │   │   └── admin/          # AdminDashboard, Verify, All, Students, Reports, Settings
│   │   ├── routes/             # ProtectedRoute, PublicRoute guards
│   │   ├── services/           # Axios API service (auth, achievement, admin)
│   │   ├── App.jsx             # Main router with all routes
│   │   ├── main.jsx            # React entry point
│   │   └── index.css           # Complete design system (dark theme, glassmorphism)
│   ├── .env                    # Frontend environment variables
│   └── vite.config.js          # Vite config with API proxy
│
└── soeit-achievements-backend/ # Node.js + Express backend
    ├── config/                 # MongoDB connection
    ├── controllers/            # authController, achievementController, adminController
    ├── middleware/             # auth (JWT), upload (Multer), errorHandler
    ├── models/                 # User, Achievement, Verification schemas
    ├── routes/                 # authRoutes, achievementRoutes, adminRoutes
    ├── uploads/                # File storage (profiles/, certificates/)
    ├── server.js               # Express app entry
    └── .env                    # Backend environment variables
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ and **npm**
- **MongoDB** (local or Atlas)

### 1. Backend Setup

```bash
cd "soeit-achievements-backend"
npm install
# Edit .env — set your MONGODB_URI
npm run dev
```

Backend runs at: `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔑 Environment Variables

### Backend (`soeit-achievements-backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/soeit_achievements
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MAX_FILE_SIZE=5242880
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_UPLOADS_URL=http://localhost:5000
```

---

## 📋 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Student registration |
| POST | `/api/auth/login` | User login (all roles) |
| GET | `/api/auth/profile` | Get current user |
| PUT | `/api/auth/profile` | Update profile + image |
| PUT | `/api/auth/change-password` | Change password |
| POST | `/api/auth/forgot-password` | Generate reset token |
| PUT | `/api/auth/reset-password/:token` | Reset password |

### Achievements
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/achievements` | Create achievement | Student |
| GET | `/api/achievements/my` | Get my achievements | Student |
| GET | `/api/achievements/stats` | Get student stats | Student |
| GET | `/api/achievements/portfolio/:id` | Public portfolio | Public |
| PUT | `/api/achievements/:id` | Update achievement | Student |
| DELETE | `/api/achievements/:id` | Delete achievement | Student |

### Admin
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/admin/dashboard` | Dashboard metrics | Admin/Faculty |
| GET | `/api/admin/achievements/pending` | Pending queue | Admin/Faculty |
| PUT | `/api/admin/achievements/:id/verify` | Approve/Reject | Admin/Faculty |
| GET | `/api/admin/achievements` | All achievements | Admin/Faculty |
| GET | `/api/admin/students` | Student list | Admin/Faculty |
| GET | `/api/admin/reports` | Analytics data | Admin/Faculty |
| PUT | `/api/admin/users/:id` | Manage user | Admin only |

---

## 🎭 Roles & Access

| Role | Access |
|------|--------|
| **Student** | Submit achievements, view own data, manage profile, public portfolio |
| **Faculty** | Verify achievements, view all students, view analytics |
| **Admin** | All faculty permissions + user management, system settings |

---

## 🌟 Key Features

- ✅ **JWT Authentication** with role-based guards
- ✅ **20 fully functional pages** (public, auth, student, admin)
- ✅ **Drag & Drop file upload** (images, PDFs, docs, max 5MB)
- ✅ **Real-time charts** (Recharts: bar, area, pie, horizontal bar)
- ✅ **Points system** based on achievement level (10–100 pts)
- ✅ **Public digital portfolio** with shareable link
- ✅ **Achievement verification workflow** with remarks
- ✅ **Department-wise analytics** and top performers leaderboard
- ✅ **Responsive design** (desktop, tablet, mobile)
- ✅ **Dark glassmorphism UI** with micro-animations
- ✅ **Helmet security** headers, input sanitization, CORS
- ✅ **MongoDB with Mongoose** (indexed schemas for performance)

---

## 🏆 Achievement Point System

| Level | Points |
|-------|--------|
| International | 100 pts |
| National | 75 pts |
| State | 50 pts |
| University | 30 pts |
| College | 20 pts |
| Department | 10 pts |

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Vanilla CSS (custom design system) |
| Charts | Recharts |
| HTTP | Axios |
| Toast | React Hot Toast |
| Icons | Lucide React |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Upload | Multer |
| Security | Helmet, CORS, dotenv |

---

## 🔮 Future Enhancements

- 🤖 AI-based achievement insights
- 📄 Auto-generated resume / CV builder
- 🔔 Email notifications (Nodemailer)
- 🏅 Leaderboard with gamification
- 📊 Predictive analytics for placement
- 🔗 LinkedIn integration for auto-posting
- 📱 PWA / mobile app

---

*Built for SOEIT, Arka Jain University — Jamshedpur, Jharkhand*
