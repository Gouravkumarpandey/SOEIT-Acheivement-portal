# 🎓 SOEIT Achievement & Analytics Portal

[![Node.js Version](https://img.shields.io/badge/node-v18%2B-green.svg)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/vite-v5.0+-646CFF.svg)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/express-v5.0-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/mongodb-latest-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A high-performance, enterprise-grade unified platform designed for the **School of Engineering & IT (SOEIT)** at **Arka Jain University**. This portal streamlines student achievement tracking, academic oversight, and campus-wide event management with a premium glassmorphic interface and automated notification systems.

---

## 🌟 Core Pillars

### 👨‍🎓 Student Excellence
*   **Achievement Management**: Effortless submission of certificates and awards with automated point calculations.
*   **Professional Portfolio**: A live, shareable digital portfolio showcasing academic and co-curricular milestones.
*   **Real-time Analytics**: Personal dashboards tracking progress across semesters and categories.

### 👩‍🏫 Faculty Oversight
*   **Academic Control Center**: Comprehensive student directory with granular filtering (Semester/Section).
*   **Smart Verification**: Dedicated workflows for approving or rejecting achievement submissions with feedback.
*   **Notice Broadcasting**: Instant official announcements triggered directly to student emails.

### 🏛️ Institutional Governance
*   **Event Hub**: Centralized management of workshops, seminars, and fests with category tagging.
*   **Data PDF/Excel Exports**: One-click professional reports for NAAC/Institutional auditing.
*   **System Security**: Robust RBAC (Role-Based Access Control) with JWT and sanitized data layers.

---

## 🛠️ Technical Architecture

### Frontend (Modern React)
*   **Framework**: React 18 with Vite for lightning-fast HMR.
*   **Styling**: Custom Design System using Vanilla CSS (Glassmorphism & Micro-animations).
*   **UI Components**: Lucide-React icons & Recharts for data visualization.
*   **State**: Context API with protected route guards.

### Backend (Robust Node.js)
*   **Server**: Express.js (v5) with optimized middleware chains.
*   **Database**: MongoDB with Mongoose (Indexed schemas for high performance).
*   **Notifications**: Nodemailer integrated for automated email broadcasts.
*   **Security**: Helmet headers, CORS, bcryptjs, and JWT-based authentication.

---

## 📂 Project Ecosystem

```text
SOEIT-Portal/
├── frontend/                 # React Application (Client-side)
│   ├── src/
│   │   ├── components/       # Reusable layout & UI atomic components
│   │   ├── services/         # Centralized Axios API abstraction
│   │   ├── styles/           # Global design system & page-specific CSS
│   │   └── pages/            # View logic (Auth, Student, Faculty, Admin)
│   └── .env                  # Client-side endpoints
│
└── backend/                  # Express API (Server-side)
    ├── controllers/          # Business logic (Notices, Events, Verification)
    ├── models/               # MongoDB Schemas (User, Event, Achievement)
    ├── routes/               # Secure API endpoint mapping
    ├── utils/                # Helping utilities (Email, File Uploads)
    └── .env                  # Protected credentials
```

---

## 🚀 Deployment & Installation

### 1. Prerequisites
*   Node.js (LTS recommended)
*   MongoDB Instance (Local or Atlas)
*   SMTP Credentials (for Email features)

### 2. Environment Configuration
Create a `.env` in the `backend` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secure_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_app_password
```

### 3. Execution
```bash
# Root directory installation
cd backend && npm install
cd ../frontend && npm install

# Start development servers
# Terminal 1 (Backend)
cd backend && npm run dev

# Terminal 2 (Frontend)
cd frontend && npm run dev
```

---

## 📊 Performance & Analytics
The system utilizes **Aggregation Pipelines** for real-time statistics generation, ensuring that even with thousands of students, the dashboard remains responsive.

---

## 🛡️ License
Distributed under the **MIT License**. See `LICENSE` for more information.

---

*Engineered for SOEIT, Arka Jain University — Excellence in Engineering & Management*
