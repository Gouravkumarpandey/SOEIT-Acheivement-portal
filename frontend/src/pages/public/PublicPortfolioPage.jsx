import '../../styles/PublicPortfolioPage.css';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { achievementAPI } from '../../services/api';
import { Trophy, Star, Globe, Github, Linkedin, Award, CheckCircle, Calendar, Building, Share2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const LEVEL_COLORS = { International: '#f59e0b', National: '#3b82f6', State: '#8b5cf6', University: '#10b981', College: '#06b6d4', Department: '#6b7280' };
const CATEGORY_ICONS = { Academic: '🎓', Sports: '🏆', Cultural: '🎭', Technical: '💻', Research: '🔬', Internship: '💼', Certification: '📜', Competition: '🥇', 'Community Service': '🤝', Other: '⭐' };

const PublicPortfolioPage = () => {
    const { userId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCat, setSelectedCat] = useState('');

    useEffect(() => {
        achievementAPI.getPortfolio(userId)
            .then(res => setData(res.data))
            .catch(() => toast.error('Portfolio not found'))
            .finally(() => setLoading(false));
    }, [userId]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Portfolio link copied! 🔗');
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
            <div className="spinner" style={{ width: 48, height: 48 }} />
        </div>
    );

    if (!data) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', flexDirection: 'column', gap: '1rem' }}>
            <Trophy size={64} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
            <h2 style={{ color: 'var(--text-secondary)' }}>Portfolio Not Found</h2>
            <Link to="/" className="btn btn-primary">Back Home</Link>
        </div>
    );

    const { student, achievements, stats } = data;
    const categories = [...new Set(achievements.map(a => a.category))];
    const filtered = selectedCat ? achievements.filter(a => a.category === selectedCat) : achievements;
    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'S';

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* Back link */}
            <div style={{ position: 'fixed', top: '1rem', left: '1rem', zIndex: 100 }}>
                <Link to="/" className="btn btn-secondary btn-sm" style={{ backdropFilter: 'blur(10px)' }}>
                    <ArrowLeft size={14} /> Back
                </Link>
            </div>
            {/* Share button */}
            <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 100 }}>
                <button className="btn btn-primary btn-sm" onClick={handleShare} style={{ backdropFilter: 'blur(10px)' }}>
                    <Share2 size={14} /> Share Portfolio
                </button>
            </div>

            {/* Hero Banner */}
            <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(99,102,241,0.12) 50%, rgba(16,185,129,0.08) 100%)', borderBottom: '1px solid var(--border-primary)', padding: '6rem 0 3rem' }}>
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                        {student.profileImage ? (
                            <img src={student.profileImage} alt={student.name} style={{ width: 110, height: 110, borderRadius: '50%', objectFit: 'cover', border: '4px solid rgba(59,130,246,0.4)', boxShadow: '0 0 30px rgba(59,130,246,0.3)' }} />
                        ) : (
                            <div className="avatar" style={{ width: 110, height: 110, fontSize: '2.5rem', border: '4px solid rgba(59,130,246,0.4)', boxShadow: '0 0 30px rgba(59,130,246,0.3)' }}>{getInitials(student.name)}</div>
                        )}
                        <div style={{ flex: 1 }}>
                            <h1 style={{ marginBottom: '0.375rem' }}>{student.name}</h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '0.75rem' }}>
                                {student.department} Engineering • {student.batch ? `Batch ${student.batch}` : ''} {student.semester ? `• Sem ${student.semester}` : ''}
                            </p>
                            {student.bio && <p style={{ color: 'var(--text-muted)', maxWidth: 500, lineHeight: 1.7, marginBottom: '1rem', fontSize: '0.9rem' }}>{student.bio}</p>}
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {student.linkedIn && <a href={student.linkedIn.startsWith('http') ? student.linkedIn : `https://${student.linkedIn}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm"><Linkedin size={14} /> LinkedIn</a>}
                                {student.github && <a href={student.github.startsWith('http') ? student.github : `https://${student.github}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm"><Github size={14} /> GitHub</a>}
                                {student.portfolio && <a href={student.portfolio.startsWith('http') ? student.portfolio : `https://${student.portfolio}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm"><Globe size={14} /> Portfolio</a>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Strip */}
            <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)', padding: '1.5rem 0' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
                        {[
                            { label: 'Achievements', value: stats.total, icon: Trophy, color: '#3b82f6' },
                            { label: 'Total Points', value: stats.totalPoints, icon: Star, color: '#f59e0b' },
                            { label: 'Categories', value: Object.keys(stats.byCategory).length, icon: Award, color: '#8b5cf6' },
                            { label: 'Highest Level', value: Object.keys(stats.byLevel)[0] || 'N/A', icon: CheckCircle, color: '#10b981' },
                        ].map(({ label, value, icon: Icon, color }) => (
                            <div key={label}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                                    <Icon size={16} style={{ color }} />
                                    <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>{value}</span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Achievements */}
            <div className="container" style={{ padding: '3rem 1.5rem' }}>
                {/* Category Filter */}
                {categories.length > 1 && (
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                        <button onClick={() => setSelectedCat('')} style={{ padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', border: `1px solid ${!selectedCat ? 'var(--primary-500)' : 'var(--border-primary)'}`, background: !selectedCat ? 'rgba(59,130,246,0.15)' : 'transparent', color: !selectedCat ? 'var(--primary-400)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s' }}>
                            All ({achievements.length})
                        </button>
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setSelectedCat(cat)} style={{ padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', border: `1px solid ${selectedCat === cat ? 'var(--primary-500)' : 'var(--border-primary)'}`, background: selectedCat === cat ? 'rgba(59,130,246,0.15)' : 'transparent', color: selectedCat === cat ? 'var(--primary-400)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s' }}>
                                {CATEGORY_ICONS[cat] || '⭐'} {cat}
                            </button>
                        ))}
                    </div>
                )}

                {filtered.length === 0 ? (
                    <div className="empty-state">
                        <Trophy /><h3>No achievements yet</h3><p>Achievements will appear here once verified.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                        {filtered.map(a => (
                            <div key={a._id} className="card card-body" style={{ transition: 'all 0.25s' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = (LEVEL_COLORS[a.level] || 'var(--primary-500)') + '66'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-primary)'; }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                                    <div style={{ fontSize: '2rem', flexShrink: 0 }}>{CATEGORY_ICONS[a.category] || '⭐'}</div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <h4 style={{ fontSize: '1rem', lineHeight: 1.3, color: 'var(--text-primary)' }}>{a.title}</h4>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: LEVEL_COLORS[a.level] || '#64748b', background: (LEVEL_COLORS[a.level] || '#64748b') + '20', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', flexShrink: 0 }}>{a.level}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.625rem' }}>
                                            <span className="badge badge-approved" style={{ fontSize: '0.65rem' }}><CheckCircle size={9} /> Verified</span>
                                            <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{a.category}</span>
                                        </div>
                                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.description}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.875rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {a.date && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={12} />{format(new Date(a.date), 'MMM yyyy')}</span>}
                                            {a.institution && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><Building size={12} />{a.institution}</span>}
                                            <span style={{ marginLeft: 'auto', fontWeight: 700, color: '#f59e0b' }}>+{a.points} pts</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicPortfolioPage;
