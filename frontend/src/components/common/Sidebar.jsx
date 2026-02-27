import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, Trophy, Upload, User, BarChart3,
    CheckCircle, Users, Settings, LogOut, GraduationCap,
    FileText, X, Shield, Star
} from 'lucide-react';

const studentLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/achievements', icon: Trophy, label: 'My Achievements' },
    { to: '/achievements/upload', icon: Upload, label: 'Upload Achievement' },
    { to: '/profile', icon: User, label: 'My Profile' },
];

const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/verify', icon: CheckCircle, label: 'Verify Achievements' },
    { to: '/admin/achievements', icon: Trophy, label: 'All Achievements' },
    { to: '/admin/students', icon: Users, label: 'Students' },
    { to: '/admin/reports', icon: BarChart3, label: 'Reports & Analytics' },
    { to: '/profile', icon: User, label: 'My Profile' },
];

const Sidebar = ({ mobileOpen, onClose }) => {
    const { user, logout, isStudent, isStaff } = useAuth();
    const navigate = useNavigate();
    const links = isStudent ? studentLinks : adminLinks;

    // Faculty specific links mapping
    const filteredLinks = links.map(link => {
        if (user?.role === 'faculty' && link.to === '/admin/dashboard') {
            return { ...link, to: '/faculty/dashboard' };
        }
        return link;
    });

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const getInitials = (name) =>
        name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

    return (
        <>
            {mobileOpen && (
                <div
                    className="mobile-overlay"
                    onClick={onClose}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99, display: 'none' }}
                />
            )}
            <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
                {/* Logo */}
                <div style={{ padding: '1.5rem 1rem', borderBottom: '1px solid var(--border-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0' }}>
                        <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, var(--primary-600), var(--accent-600))', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <GraduationCap size={22} color="#fff" />
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>SOEIT Portal</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>Achievements</div>
                        </div>
                        <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-muted)', display: 'none' }} className="mobile-close-btn">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* User Info */}
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {user?.profileImage ? (
                            <img src={`${import.meta.env.VITE_UPLOADS_URL || ''}${user.profileImage}`} alt={user.name} className="avatar avatar-md" />
                        ) : (
                            <div className="avatar avatar-md" style={{ fontSize: '0.85rem' }}>{getInitials(user?.name)}</div>
                        )}
                        <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: 2 }}>
                                <span className={`badge ${user?.role === 'student' ? 'badge-primary' : 'badge-purple'}`} style={{ fontSize: '0.6rem', padding: '0.15rem 0.5rem' }}>
                                    {user?.role}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', margin: '0 0.25rem 0.75rem', paddingLeft: '0.75rem' }}>
                        {isStudent ? 'Student Menu' : (user?.role === 'faculty' ? 'Faculty Menu' : 'Admin Menu')}
                    </div>
                    {filteredLinks.map(({ to, icon: Icon, label }) => (
                        <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ marginBottom: '0.25rem' }}>
                            <Icon size={18} />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border-primary)' }}>
                    {isStudent && (
                        <NavLink to={`/portfolio/${user?._id}`} className="nav-link" style={{ marginBottom: '0.5rem' }}>
                            <Star size={18} />
                            <span>My Portfolio</span>
                        </NavLink>
                    )}
                    <button className="nav-link" onClick={handleLogout} style={{ width: '100%', color: 'var(--error-500)' }}>
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
