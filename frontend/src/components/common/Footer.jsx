import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Linkedin, Github, Twitter } from 'lucide-react';

const Footer = () => (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-primary)', padding: '4rem 0 2rem' }}>
        <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,var(--primary-600),var(--accent-600))', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <GraduationCap size={22} color="#fff" />
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Space Grotesk', fontSize: '0.95rem' }}>SOEIT Portal</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Achievements Platform</div>
                        </div>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 280 }}>
                        A centralized platform for students to showcase achievements and for faculty to verify and monitor performance.
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                        {[Linkedin, Github, Twitter].map((Icon, i) => (
                            <a key={i} href="#" style={{ width: 36, height: 36, background: '#fff', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', transition: 'all var(--transition-fast)', boxShadow: 'var(--shadow-sm)' }}
                                onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary-600)'; e.currentTarget.style.borderColor = 'var(--primary-400)'; e.currentTarget.style.background = 'var(--primary-50)'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-primary)'; e.currentTarget.style.background = '#fff'; }}>
                                <Icon size={16} />
                            </a>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Links</h4>
                    {[['/', 'Home'], ['/about', 'About Us'], ['/features', 'Features'], ['/how-it-works', 'How It Works'], ['/contact', 'Contact']].map(([path, label]) => (
                        <Link key={path} to={path} style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', transition: 'color var(--transition-fast)' }}
                            onMouseEnter={e => e.target.style.color = 'var(--primary-400)'}
                            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>{label}</Link>
                    ))}
                </div>

                <div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform</h4>
                    {[['/register', 'Student Registration'], ['/login', 'Student Login'], ['/login', 'Faculty Login'], ['/features', 'Achievement Categories'], ['/features', 'Analytics']].map(([path, label]) => (
                        <Link key={label} to={path} style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', transition: 'color var(--transition-fast)' }}
                            onMouseEnter={e => e.target.style.color = 'var(--primary-400)'}
                            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>{label}</Link>
                    ))}
                </div>

                <div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact</h4>
                    {[
                        [Mail, 'soeit@arkajainuniversity.ac.in'],
                        [Phone, '+91 98765 43210'],
                        [MapPin, 'Jamshedpur, Jharkhand, India'],
                    ].map(([Icon, text]) => (
                        <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.875rem' }}>
                            <Icon size={16} style={{ color: 'var(--primary-400)', marginTop: 2, flexShrink: 0 }} />
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{text}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>© 2024 SOEIT Achievements Portal — School of Engineering & IT</p>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    {['Privacy Policy', 'Terms of Use', 'Support'].map(t => (
                        <a key={t} href="#" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', transition: 'color var(--transition-fast)' }}
                            onMouseEnter={e => e.target.style.color = 'var(--primary-400)'}
                            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>{t}</a>
                    ))}
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
