import '../../styles/pages/student/StudentDashboard.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { achievementAPI, badgeAPI } from '../../services/api';
import { Trophy, CheckCircle, Clock, XCircle, Star, Upload, TrendingUp, Award, GraduationCap, ArrowUpRight, Globe } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip as ChartTooltip,
    Legend as ChartLegend,
    Filler
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    ChartTooltip,
    ChartLegend,
    Filler
);

const COLORS = ['rgba(0, 33, 71, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(139, 92, 246, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(239, 68, 68, 0.8)', 'rgba(6, 182, 212, 0.8)', 'rgba(236, 72, 153, 0.8)', 'rgba(132, 204, 22, 0.8)'];

const StatusBadge = ({ status }) => {
    const map = {
        pending: ['badge-warning', Clock],
        approved: ['badge-success', CheckCircle],
        rejected: ['badge-error', XCircle]
    };
    const [cls, Icon] = map[status] || ['badge-primary', null];
    return (
        <span className={`badge ${cls}`} style={{ fontWeight: 800, padding: '0.4rem 0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {Icon && <Icon size={12} style={{ marginRight: '4px' }} />}
            {status}
        </span>
    );
};

const StudentDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ stats: { all: 0, approved: 0, pending: 0, totalPoints: 0, byCategory: [], byLevel: [] }, recentActivity: [] });
    const [loading, setLoading] = useState(true);
    const [leaderboard, setLeaderboard] = useState([]);
    const [showProfileModal, setShowProfileModal] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await achievementAPI.getStats();
                if (data) setStats(data);
                
                // Check if profile is incomplete (missing 10th or 12th school info)
                const isComplete = user?.edu10thSchool && user?.edu12thSchool && user?.universityCgpa;
                if (!isComplete) {
                    setShowProfileModal(true);
                }

                try {
                    const lbData = await badgeAPI.getLeaderboard();
                    setLeaderboard(lbData.data.data);
                } catch (err) {
                    console.error('Failed to load leaderboard', err);
                }
            } catch {
                toast.error('Could not load dashboard data. Please check your connection.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [user]);

    const statCards = [
        { label: 'Total Achievements', value: stats?.stats?.all ?? 0, icon: Trophy, color: 'var(--brand-600)', bg: 'var(--primary-50)', delta: 'Total Records' },
        { label: 'Approved Achievements', value: stats?.stats?.approved ?? 0, icon: CheckCircle, color: 'var(--success-500)', bg: 'var(--success-50)', delta: 'Verified by Faculty' },
        { label: 'Pending Verification', value: stats?.stats?.pending ?? 0, icon: Clock, color: 'var(--warning-500)', bg: 'var(--warning-50)', delta: 'Awaiting Review' },
        { label: 'Total Points', value: stats?.stats?.totalPoints ?? 0, icon: Award, color: '#8b5cf6', bg: '#f5f3ff', delta: 'Accumulated Score' },
    ];

    const categoryChartData = {
        labels: (stats?.stats?.byCategory || []).map(d => d._id),
        datasets: [{
            label: 'Achievements',
            data: (stats?.stats?.byCategory || []).map(d => d.count),
            backgroundColor: 'rgba(0, 33, 71, 0.8)',
            borderRadius: 8,
            barThickness: 30
        }]
    };

    const levelChartData = {
        labels: (stats?.stats?.byLevel || []).map(d => d._id),
        datasets: [{
            data: (stats?.stats?.byLevel || []).map(d => d.count),
            backgroundColor: COLORS,
            borderWidth: 0,
            hoverOffset: 12
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#fff',
                titleColor: '#0f172a',
                bodyColor: '#64748b',
                padding: 12,
                borderRadius: 12,
                borderColor: '#e2e8f0',
                borderWidth: 1,
                bodyFont: { weight: '800' },
                usePointStyle: true
            }
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#64748b', font: { weight: '800', size: 10 } } },
            y: { grid: { borderDash: [5, 5], color: '#e2e8f0' }, ticks: { color: '#64748b', font: { weight: '800', size: 10 } } }
        }
    };

    if (loading) {
        return (
            <div className="animate-fade-in dashboard-skeleton-suite">
                <div className="dashboard-skeleton-grid" style={{ marginBottom: '2.5rem' }}>
                    {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 160, borderRadius: '16px' }} />)}
                </div>
                <div className="dashboard-skeleton-charts">
                    <div className="skeleton" style={{ height: 380, borderRadius: '16px' }} />
                    <div className="skeleton" style={{ height: 380, borderRadius: '16px' }} />
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Profile Completion Alert Banner */}
            {showProfileModal && (
                <div className="card animate-slide-up" style={{ 
                    marginBottom: '2rem', 
                    padding: '1rem 1.5rem', 
                    background: 'var(--primary-50)', 
                    border: '1px solid var(--brand-200)', 
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.5rem',
                    flexWrap: 'wrap',
                    boxShadow: '0 4px 12px rgba(0, 33, 71, 0.05)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', background: 'white', color: 'var(--brand-600)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                            <GraduationCap size={20} />
                        </div>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--brand-700)' }}>Academic Profile Incomplete</h4>
                            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Please update your 10th, 12th, and CGPA details for accurate resume generation.</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <Link to="/profile" className="btn btn-primary btn-sm" style={{ padding: '0.5rem 1.25rem', borderRadius: '10px', fontWeight: 800 }}>
                            Complete Now
                        </Link>
                        <button onClick={() => setShowProfileModal(false)} title="Close" style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center' }}>
                            <XCircle size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* Scholar Identity Header */}
            <div className="page-header dashboard-header-suite" style={{ marginBottom: '2.5rem' }}>
                <div className="dashboard-header-content">
                    <h2 className="heading-display">Student Performance Dashboard</h2>
                    <p className="page-subtitle">Track your achievements, certifications, and academic progress here.</p>
                </div>
                <div className="header-actions" style={{ display: 'flex', gap: '0.75rem' }}>
                    <Link to={`/portfolio/${user?.id || user?._id}`} className="btn btn-secondary dashboard-header-btn" style={{ border: '1px solid var(--border-primary)' }}>
                        <Globe size={18} />
                        <span className="hide-mobile">View Public Portfolio</span>
                        <span className="show-mobile">Portfolio</span>
                    </Link>
                    <Link to="/achievements/upload" className="btn btn-primary dashboard-header-btn">
                        <Upload size={18} />
                        <span className="hide-mobile">Upload New Achievement</span>
                        <span className="show-mobile">Upload</span>
                    </Link>
                </div>
            </div>

            {/* Welcome Institutional Banner */}
            <div className="card welcome-institutional-banner" style={{ marginBottom: '2.5rem', background: 'linear-gradient(135deg, #f0f7ff 0%, #e8f4fd 50%, #f0f3ff 100%)', border: '1px solid var(--brand-200)', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                <div className="banner-motif-1" style={{ position: 'absolute', top: '-30%', right: '-3%', width: '280px', height: '280px', background: 'rgba(0, 33, 71, 0.04)', borderRadius: '50%' }}></div>
                <div className="banner-motif-2" style={{ position: 'absolute', bottom: '-40%', right: '15%', width: '200px', height: '200px', background: 'rgba(0, 33, 71, 0.03)', borderRadius: '50%' }}></div>
                <div className="banner-inner-content">
                    <div className="banner-icon-container" style={{ borderRadius: '20px', background: 'linear-gradient(135deg, var(--brand-600), var(--brand-800))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0, 33, 71, 0.25)', flexShrink: 0 }}>
                        <GraduationCap size={40} />
                    </div>
                    <div className="banner-text-content">
                        <h3 className="welcome-headline" style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.03em', color: 'var(--brand-700)' }}>Welcome back, {user?.name}</h3>
                        <div className="banner-meta-row" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                            <div className="banner-meta-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success-500)' }}></div>
                                <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user?.department} Department</span>
                            </div>
                            <div className="meta-divider" style={{ width: '1px', height: '14px', background: 'var(--border-primary)' }}></div>
                            <span className="banner-meta-text" style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>BATCH: {user?.batch || '2024'}</span>
                            <div className="meta-divider" style={{ width: '1px', height: '14px', background: 'var(--border-primary)' }}></div>
                            <span className="banner-meta-text" style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SEMESTER: {user?.semester || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Metrics Grid */}
            <div className="dashboard-perf-metrics-grid" style={{ marginBottom: '2.5rem' }}>
                {statCards.map(({ label, value, icon: Icon, color, bg, delta }) => (
                    <div key={label} className="card stat-card-responsive" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                        <div className="stat-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div className="stat-icon-wrap" style={{ width: 44, height: 44, background: bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
                                <Icon size={22} />
                            </div>
                            <TrendingUp size={16} className="trending-icon" style={{ color: color, opacity: 0.5 }} />
                        </div>
                        <div className="stat-card-value" style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1, marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>{value}</div>
                        <div className="stat-card-label" style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                        <div className="stat-card-delta" style={{ fontSize: '0.7rem', fontWeight: 700, color: color, marginTop: '1rem', background: bg, padding: '0.25rem 0.5rem', borderRadius: '4px', width: 'fit-content' }}>
                            {delta}
                        </div>
                    </div>
                ))}
            </div>

            {/* Weekly Scholars Leaderboard */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem', border: '1px solid var(--border-primary)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', transform: 'translate(30%, -30%)' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--warning-50)', color: 'var(--warning-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Trophy size={18} />
                            </div>
                            <h4 style={{ margin: 0, fontWeight: 900, fontSize: '1.2rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Top Scholars of the Week</h4>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Weekly leaderboard recognizing students with the highest verified points.</p>
                    </div>
                </div>

                {leaderboard.length === 0 ? (
                    <div style={{ padding: '3rem 2rem', textAlign: 'center', background: 'var(--slate-50)', borderRadius: '16px', border: '1px dashed var(--border-primary)' }}>
                        <Award size={40} style={{ color: 'var(--slate-300)', marginBottom: '1rem', opacity: 0.5 }} />
                        <h5 style={{ fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>No Badges Yet</h5>
                        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>The weekly badge drop hasn't occurred yet or no points were earned. Keep uploading your achievements!</p>
                    </div>
                ) : (
                    <div className="grid-res grid-res-3">
                        {leaderboard.map((student, idx) => (
                            <div key={student.id} style={{ 
                                padding: '1.25rem', 
                                border: idx === 0 ? '2px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--border-primary)', 
                                borderRadius: '16px', 
                                background: idx === 0 ? 'linear-gradient(to bottom right, #fffbeb, #ffffff)' : '#ffffff',
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '1rem',
                                transition: 'transform 0.2s',
                                boxShadow: idx === 0 ? '0 10px 25px -5px rgba(245, 158, 11, 0.1)' : 'none'
                            }}>
                                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: idx === 0 ? '#f59e0b' : idx === 1 ? '#94a3b8' : idx === 2 ? '#d97706' : 'var(--text-muted)', width: '30px', textAlign: 'center', letterSpacing: '-0.05em' }}>
                                    #{idx + 1}
                                </div>
                                <div className="avatar avatar-md" style={{ background: idx === 0 ? '#fef3c7' : 'var(--primary-100)', color: idx === 0 ? '#d97706' : 'var(--brand-700)', fontWeight: 800, border: idx === 0 ? '2px solid #fde68a' : 'none' }}>
                                    {student.name?.charAt(0) || 'U'}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h5 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>{student.name}</h5>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{student.department}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div className="badge" style={{ background: student.badge_type === 'Platinum' ? 'linear-gradient(135deg, #e2e8f0, #94a3b8)' : student.badge_type === 'Gold' ? 'linear-gradient(135deg, #fef08a, #f59e0b)' : student.badge_type === 'Silver' ? 'linear-gradient(135deg, #f1f5f9, #cbd5e1)' : 'linear-gradient(135deg, #fed7aa, #f97316)', color: '#1e293b', border: 'none', padding: '0.25rem 0.6rem', fontWeight: 800 }}>
                                        {student.badge_type}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, marginTop: '0.35rem', color: 'var(--brand-700)' }}>{student.points_earned} pts</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Analytical Distribution Suite */}
            <div className="dashboard-analytical-distribution" style={{ marginBottom: '2.5rem' }}>
                <div className="card analytical-card-res" style={{ padding: '2rem' }}>
                    <div className="card-header analytical-header" style={{ marginBottom: '2rem', padding: 0 }}>
                        <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem' }}>Achievement Distribution</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Overview of achievements by category.</p>
                    </div>
                    <div className="analytical-chart-wrap" style={{ minHeight: '300px' }}>
                        {(stats?.stats?.byCategory || []).length > 0 ? (
                            <Bar data={categoryChartData} options={chartOptions} />
                        ) : (
                            <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                                <Trophy size={48} style={{ color: 'var(--slate-200)', marginBottom: '1rem' }} />
                                <p style={{ color: 'var(--text-muted)', fontWeight: 700 }}>No data to show yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="card analytical-card-res" style={{ padding: '2rem' }}>
                    <div className="card-header analytical-header" style={{ marginBottom: '2rem', padding: 0 }}>
                        <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem' }}>Recognition Level</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Distribution of achievements by level.</p>
                    </div>
                    <div className="analytical-chart-wrap" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {(stats?.stats?.byLevel || []).length > 0 ? (
                            <div style={{ width: '100%', height: '280px' }}>
                                <Pie 
                                    data={levelChartData} 
                                    options={{ 
                                        ...chartOptions, 
                                        plugins: { 
                                            ...chartOptions.plugins, 
                                            legend: { display: true, position: 'bottom', labels: { usePointStyle: true, font: { weight: '800', size: 10 } } } 
                                        } 
                                    }} 
                                />
                            </div>
                        ) : (
                            <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                                <Award size={48} style={{ color: 'var(--slate-200)', marginBottom: '1rem' }} />
                                <p style={{ color: 'var(--text-muted)', fontWeight: 700 }}>No level data found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Submission Chronology Suite */}
            <div className="card recent-chronology-card" style={{ overflow: 'hidden' }}>
                <div className="card-header chronology-header" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--slate-50)' }}>
                    <div className="chronology-header-content">
                        <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem' }}>Recent Activity</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>View your most recently uploaded achievements.</p>
                    </div>
                    <Link to="/achievements" className="btn btn-ghost btn-sm chronology-action-btn" style={{ fontWeight: 800 }}>
                        <span>View All</span>
                        <ArrowUpRight size={14} />
                    </Link>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    {stats?.recentActivity?.length > 0 ? (
                        <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--border-primary)' }}>
                                    <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Achievement</th>
                                    <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Category</th>
                                    <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Level</th>
                                    <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Status</th>
                                    <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentActivity.map((a) => (
                                    <tr key={a._id} style={{ borderBottom: '1px solid var(--border-primary)', transition: 'background 0.2s ease' }} className="hover-slate">
                                        <td style={{ padding: '1.25rem 2rem', fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{a.title}</td>
                                        <td style={{ padding: '1.25rem 2rem' }}><span className="badge badge-primary" style={{ fontWeight: 800 }}>{a.category}</span></td>
                                        <td style={{ padding: '1.25rem 2rem', fontWeight: 600, fontSize: '0.85rem' }}>{a.level}</td>
                                        <td style={{ padding: '1.25rem 2rem' }}><StatusBadge status={a.status} /></td>
                                        <td style={{ padding: '1.25rem 2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>{format(new Date(a.createdAt), 'MMM dd, yyyy')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                            <div style={{ width: 80, height: 80, background: 'var(--primary-50)', color: 'var(--brand-700)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                                <TrendingUp size={40} />
                            </div>
                            <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>No achievements found</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 2rem auto' }}>You haven't uploaded any achievements yet.</p>
                            <Link to="/achievements/upload" className="btn btn-primary" style={{ padding: '0.8rem 2.5rem', fontWeight: 900 }}>Upload Now</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
