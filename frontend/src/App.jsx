import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './routes/ProtectedRoute';
import DashboardLayout from './components/common/DashboardLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import ContactPage from './pages/public/ContactPage';
import PublicPortfolioPage from './pages/public/PublicPortfolioPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyAchievementsPage from './pages/student/MyAchievementsPage';
import UploadAchievementPage from './pages/student/UploadAchievementPage';
import StudentProfilePage from './pages/student/StudentProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import VerifyAchievementsPage from './pages/admin/VerifyAchievementsPage';
import AllAchievementsPage from './pages/admin/AllAchievementsPage';
import StudentManagementPage from './pages/admin/StudentManagementPage';
import ReportsPage from './pages/admin/ReportsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

// Faculty Pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';

// Features page (inline)
import FeaturesPage from './pages/public/FeaturesPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              fontSize: '0.875rem',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#1e293b' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#1e293b' } },
          }}
        />

        <Routes>
          {/* Public Marketing Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/portfolio/:userId" element={<PublicPortfolioPage />} />

          {/* Auth Routes (redirect if logged in) */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/admin-login" element={<PublicRoute><AdminLoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

          {/* Student Routes */}
          <Route element={<ProtectedRoute allowedRoles={['student']}><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/achievements" element={<MyAchievementsPage />} />
            <Route path="/achievements/upload" element={<UploadAchievementPage />} />
            <Route path="/achievements/edit/:id" element={<UploadAchievementPage />} />
            <Route path="/profile" element={<StudentProfilePage />} />
          </Route>

          {/* Admin / Faculty Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'faculty']}><DashboardLayout /></ProtectedRoute>}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
            <Route path="/admin/verify" element={<VerifyAchievementsPage />} />
            <Route path="/admin/achievements" element={<AllAchievementsPage />} />
            <Route path="/admin/students" element={<StudentManagementPage />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Catch All */}
          <Route path="*" element={
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', gap: '1rem' }}>
              <div style={{ fontSize: '6rem', fontWeight: 900, fontFamily: 'Space Grotesk', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>404</div>
              <h2 style={{ color: 'var(--text-secondary)' }}>Page Not Found</h2>
              <p style={{ color: 'var(--text-muted)' }}>The page you're looking for doesn't exist.</p>
              <a href="/" className="btn btn-primary">Go Home</a>
            </div>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
