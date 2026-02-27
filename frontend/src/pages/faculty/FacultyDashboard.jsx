import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Users, Trophy, Clock, CheckCircle, TrendingUp, BarChart3, GraduationCap, MapPin } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const FacultyDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                // Faculty uses the same stats API but filtered context (implied by role)
                const res = await adminAPI.getDashboard();
                setData(res.data);
            } catch {
                toast.error('Failed to load department overview');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const statCards = [
        { label: 'Assigned Students', value: data?.stats?.totalStudents ?? 0, icon: Users, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
        { label: 'Submissions', value: data?.stats?.totalAchievements ?? 0, icon: Trophy, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
        { label: 'Review Required', value: data?.stats?.pendingCount ?? 0, icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
        { label: 'Validated', value: data?.stats?.approvedCount ?? 0, icon: CheckCircle, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    ];

    if (loading) {
        return (
            <div style={{ padding: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: '1rem' }} />)}
                </div>
                <div className="skeleton" style={{ height: 400, borderRadius: '1rem' }} />
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Department Insights</h1>
                <p style={{ color: 'var(--text-muted)' }}>Monitor student achievements and departmental progress</p>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {statCards.map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                            <div style={{ width: 48, height: 48, background: bg, borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon size={24} color={color} />
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '0.25rem 0.6rem', borderRadius: '2rem' }}>Active</span>
                        </div>
                        <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{value}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                {/* Active Students List */}
                <div style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Student Submissions</h3>
                        <button style={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Download Report</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {(data?.recentAchievements || []).map(a => (
                            <div key={a._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '1rem', background: '#f8fafc', border: '1px solid #edf2f7' }}>
                                <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: '#303657', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>
                                    {a.studentId?.name?.charAt(0)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#303657' }}>{a.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{a.studentId?.name} • {a.studentId?.enrollmentNo || 'No ID'}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ display: 'inline-block', padding: '0.35rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', background: '#fff7ed', color: '#c2410c', border: '1px solid #ffedd5' }}>
                                        {a.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ background: '#303657', padding: '1.5rem', borderRadius: '1.25rem', color: '#fff' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Faculty Quick Links</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <button style={{ width: '100%', padding: '0.85rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                <GraduationCap size={18} /> Student List
                            </button>
                            <button style={{ width: '100%', padding: '0.85rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                <CheckCircle size={18} /> Verify Awards
                            </button>
                            <button style={{ width: '100%', padding: '0.85rem', borderRadius: '0.75rem', background: '#8B1E1E', border: 'none', color: '#fff', fontWeight: 700, marginTop: '0.5rem', cursor: 'pointer' }}>
                                Download All Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultyDashboard;
