import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';

const PublicNavbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} style={{ background: scrolled ? undefined : 'rgba(248,250,252,0.85)', backdropFilter: scrolled ? undefined : 'blur(12px)', borderBottom: scrolled ? undefined : '1px solid var(--border-primary)' }}>
            <div className="container">
                <div className="navbar-inner">
                    <Link to="/" className="nav-logo">
                        <div className="nav-logo-icon"><GraduationCap size={22} color="#fff" /></div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>SOEIT Portal</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Achievements</div>
                        </div>
                    </Link>

                    {/* Right side group */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                        <div className="nav-links">
                            {[['/', 'Home'], ['/about', 'About'], ['/features', 'Features'], ['/how-it-works', 'How It Works'], ['/contact', 'Contact']].map(([path, label]) => (
                                <Link key={path} to={path} className="nav-item">{label}</Link>
                            ))}
                        </div>

                        <div className="nav-cta">
                            <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
                            <button className="btn btn-secondary btn-icon" style={{ display: 'none' }} onClick={() => setMenuOpen(!menuOpen)}>
                                {menuOpen ? <X size={18} /> : <Menu size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                {menuOpen && (
                    <div style={{ padding: '1rem 0', borderTop: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
                        {[['/', 'Home'], ['/about', 'About'], ['/features', 'Features'], ['/how-it-works', 'How It Works'], ['/contact', 'Contact']].map(([path, label]) => (
                            <Link key={path} to={path} className="nav-item" onClick={() => setMenuOpen(false)}>{label}</Link>
                        ))}
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <Link to="/login" className="btn btn-secondary btn-sm w-full" style={{ justifyContent: 'center' }}>Sign In</Link>
                            <Link to="/register" className="btn btn-primary btn-sm w-full" style={{ justifyContent: 'center' }}>Get Started</Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default PublicNavbar;
