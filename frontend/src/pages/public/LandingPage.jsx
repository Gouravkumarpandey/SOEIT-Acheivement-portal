import '../../styles/LandingPage.css';
import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/common/PublicNavbar';
import Footer from '../../components/common/Footer';
import {
    Trophy, Shield, BarChart3, Upload, CheckCircle,
    Users, Star, ArrowRight, Zap, Globe, Award, BookOpen, TrendingUp
} from 'lucide-react';

const stats = [
    { value: '2,500+', label: 'Achievements Tracked' },
    { value: '800+', label: 'Active Students' },
    { value: '98%', label: 'Verification Rate' },
    { value: '10+', label: 'Departments' },
];

const features = [
    { icon: Upload, title: 'Easy Submission', desc: 'Upload achievements with proof documents in minutes. Supports images, PDFs, and certificates.', color: '#3b82f6' },
    { icon: Shield, title: 'Secure Verification', desc: 'Faculty review and verify submissions with a transparent approval workflow and audit trail.', color: '#8b5cf6' },
    { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Real-time charts and insights on performance, trends, and department-wise statistics.', color: '#10b981' },
    { icon: Globe, title: 'Digital Portfolio', desc: 'Share your verified achievements via a public portfolio link — perfect for placements.', color: '#f59e0b' },
    { icon: Award, title: 'Point System', desc: 'Earn points based on achievement level. International awards carry higher weightage.', color: '#ef4444' },
    { icon: TrendingUp, title: 'Performance Tracking', desc: 'Track your academic journey and compare performance over semesters.', color: '#06b6d4' },
];

const categories = ['Academic', 'Sports', 'Cultural', 'Technical', 'Research', 'Internship', 'Certification', 'Competition'];

const LandingPage = () => {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <PublicNavbar />

            {/* Hero Section */}
            <section className="hero-section" style={{ paddingTop: '80px' }}>
                <div className="hero-glow" style={{ width: 700, height: 700, top: '-200px', left: '-300px', background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)' }} />
                <div className="hero-glow" style={{ width: 600, height: 600, bottom: '-100px', right: '-200px', background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)' }} />

                <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '5rem 1.5rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 'var(--radius-full)', padding: '0.4rem 1rem', marginBottom: '2rem', animation: 'fadeIn 0.5s ease' }}>
                        <Zap size={14} color="var(--primary-400)" />
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary-400)', fontWeight: 600 }}>Official Achievement Management Platform</span>
                    </div>

                    <h1 style={{ maxWidth: '800px', margin: '0 auto 1.5rem', animation: 'fadeIn 0.7s ease 0.1s both' }}>
                        Showcase Your{' '}
                        <span className="text-gradient">Academic Excellence</span>
                        {' '}Like Never Before
                    </h1>

                    <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.7, animation: 'fadeIn 0.7s ease 0.2s both' }}>
                        The SOEIT Achievements Portal empowers students to submit, verify, and showcase academic and extracurricular achievements — all in one professional platform.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeIn 0.7s ease 0.3s both' }}>
                        <Link to="/register" className="btn btn-primary btn-lg">
                            Get Started Free <ArrowRight size={18} />
                        </Link>
                        <Link to="/how-it-works" className="btn btn-secondary btn-lg">
                            See How It Works
                        </Link>
                    </div>

                    {/* Hero Visual */}
                    <div style={{ marginTop: '4rem', position: 'relative', maxWidth: '900px', margin: '4rem auto 0', animation: 'fadeIn 0.8s ease 0.4s both' }}>
                        <div style={{ background: '#fff', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow-xl)' }}>
                            {/* Mini Dashboard Preview */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                                {[
                                    { label: 'Total', value: '12', color: '#3b82f6', icon: Trophy },
                                    { label: 'Approved', value: '9', color: '#22c55e', icon: CheckCircle },
                                    { label: 'Pending', value: '2', color: '#f59e0b', icon: Star },
                                    { label: 'Points', value: '450', color: '#8b5cf6', icon: Award },
                                ].map(({ label, value, color, icon: Icon }) => (
                                    <div key={label} style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid var(--border-primary)', textAlign: 'left' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <Icon size={16} color={color} />
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                                        </div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Space Grotesk' }}>{value}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                {[
                                    { title: 'National Hackathon Winner', cat: 'Technical', status: 'approved', pts: 75 },
                                    { title: 'Research Publication', cat: 'Research', status: 'approved', pts: 75 },
                                    { title: 'Sports Runner-up', cat: 'Sports', status: 'pending', pts: 50 },
                                ].map(({ title, cat, status, pts }) => (
                                    <div key={title} style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '0.875rem', border: '1px solid var(--border-primary)' }}>
                                        <div className={`badge badge-${status}`} style={{ marginBottom: '0.5rem' }}>{status}</div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{title}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{cat} • {pts} pts</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section style={{ padding: '4rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-primary)', borderBottom: '1px solid var(--border-primary)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', textAlign: 'center' }}>
                        {stats.map(({ value, label }) => (
                            <div key={label}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Space Grotesk', background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{value}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section style={{ padding: '6rem 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 'var(--radius-full)', padding: '0.4rem 1rem', marginBottom: '1rem' }}>
                            <Star size={14} color="var(--accent-400)" />
                            <span style={{ fontSize: '0.8rem', color: 'var(--accent-400)', fontWeight: 600 }}>Platform Features</span>
                        </div>
                        <h2>Everything You Need to <span className="text-gradient">Succeed</span></h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '1rem auto 0', lineHeight: 1.7 }}>
                            Built specifically for SOEIT students and faculty with features designed for real-world institutional use.
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {features.map(({ icon: Icon, title, desc, color }) => (
                            <div key={title} className="card card-body" style={{ transition: 'all 0.3s ease' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = color + '66'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-primary)'; }}>
                                <div style={{ width: 48, height: 48, background: color + '20', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                    <Icon size={24} color={color} />
                                </div>
                                <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{title}</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section style={{ padding: '5rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-primary)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2>Achievement <span className="text-gradient">Categories</span></h2>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem' }}>Track achievements across all areas of student life</p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                        {categories.map((cat, i) => (
                            <div key={cat} style={{ padding: '0.625rem 1.25rem', background: '#fff', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-full)', fontSize: '0.9rem', color: 'var(--text-secondary)', cursor: 'default', transition: 'all 0.2s', fontWeight: 500, boxShadow: 'var(--shadow-sm)' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-50)'; e.currentTarget.style.color = 'var(--primary-600)'; e.currentTarget.style.borderColor = 'var(--primary-300)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-primary)'; }}>
                                {cat}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '6rem 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, var(--primary-50), #ede9fe)', border: '1px solid var(--primary-200)', borderRadius: 'var(--radius-xl)', padding: '4rem 2rem', boxShadow: 'var(--shadow-lg)' }}>
                        <h2 style={{ marginBottom: '1rem' }}>Ready to <span className="text-gradient">Showcase Your Achievements?</span></h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
                            Join hundreds of students already using SOEIT Portal to document and showcase their journey.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Create Your Account <ArrowRight size={18} />
                            </Link>
                            <Link to="/contact" className="btn btn-secondary btn-lg">Contact Us</Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
