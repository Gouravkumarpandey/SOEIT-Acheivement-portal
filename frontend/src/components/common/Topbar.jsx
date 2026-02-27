import { Bell, Menu, Search, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Topbar = ({ onMenuClick, title }) => {
    const { user } = useAuth();

    const getInitials = (name) =>
        name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

    return (
        <header className="topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    onClick={onMenuClick}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', padding: '0.25rem', borderRadius: 'var(--radius-sm)', display: 'none' }}
                    className="mobile-menu-btn"
                >
                    <Menu size={22} />
                </button>
                <div>
                    <h1 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h1>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', padding: '0.5rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all var(--transition-fast)' }}
                    onMouseEnter={e => { e.target.style.color = 'var(--text-primary)'; e.target.style.borderColor = 'var(--primary-500)'; }}
                    onMouseLeave={e => { e.target.style.color = 'var(--text-secondary)'; e.target.style.borderColor = 'var(--border-primary)'; }}
                >
                    <Bell size={18} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', padding: '0.4rem 0.75rem' }}>
                    {user?.profileImage ? (
                        <img src={user.profileImage} alt={user.name} className="avatar avatar-sm" />
                    ) : (
                        <div className="avatar avatar-sm">{getInitials(user?.name)}</div>
                    )}
                    <div style={{ display: 'none' }} className="topbar-user-info">
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name?.split(' ')[0]}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user?.department}</div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
