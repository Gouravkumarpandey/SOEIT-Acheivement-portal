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

    if (loading) return <LoadingScreen />;
    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={user.role === 'student' ? '/dashboard' : '/admin/dashboard'} replace />;
    }
    return children;
};

export const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <LoadingScreen />;
    if (user) return <Navigate to={user.role === 'student' ? '/dashboard' : '/admin/dashboard'} replace />;
    return children;
};

export default ProtectedRoute;
