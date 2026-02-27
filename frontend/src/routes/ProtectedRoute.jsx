import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Show spinner while loading auth
const LoadingScreen = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
        <div className="spinner"></div>
    </div>
);

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    const getDashboardPath = (role) => {
        if (role === 'student') return '/dashboard';
        if (role === 'faculty') return '/faculty/dashboard';
        return '/admin/dashboard';
    };

    if (loading) return <LoadingScreen />;
    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={getDashboardPath(user.role)} replace />;
    }
    return children;
};

export const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const getDashboardPath = (role) => {
        if (role === 'student') return '/dashboard';
        if (role === 'faculty') return '/faculty/dashboard';
        return '/admin/dashboard';
    };
    if (loading) return <LoadingScreen />;
    if (user) return <Navigate to={getDashboardPath(user.role)} replace />;
    return children;
};

export default ProtectedRoute;
