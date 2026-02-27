import '../../styles/AdminDashboard.css';
import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Users, Trophy, Clock, CheckCircle, XCircle, TrendingUp, BarChart3, Award, Shield } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend } from 'recharts';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await adminAPI.getDashboard();
                setData(res.data);
            } catch {
                toast.error('Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const statCards = [
        { label: 'Total Students', value: data?.stats?.totalStudents ?? 0, icon: Users, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', delta: '+12 this month' },
        { label: 'Total Faculties', value: data?.stats?.totalFaculties ?? 0, icon: Shield, color: '#10b981', bg: 'rgba(16,185,129,0.1)', delta: 'Verified staff' },
        { label: 'Total Achievements', value: data?.stats?.totalAchievements ?? 0, icon: Trophy, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', delta: `${data?.stats?.approvedCount ?? 0} approved` },
        { label: 'Pending Review', value: data?.stats?.pendingCount ?? 0, icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', delta: 'Needs attention' },
        { label: 'Approved', value: data?.stats?.approvedCount ?? 0, icon: CheckCircle, color: '#22c55e', bg: 'rgba(34,197,94,0.1)', delta: `${data?.stats?.rejectedCount ?? 0} rejected` },
    ];

    const trendData = (data?.monthlyTrend || []).map(d => ({
        name: `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d._id.month - 1]}`,
        count: d.count,
    }));

    if (loading) {
        return (
            <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                    {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-lg)' }} />)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
                    <div className="skeleton" style={{ height: 280, borderRadius: 'var(--radius-lg)' }} />
                    <div className="skeleton" style={{ height: 280, borderRadius: 'var(--radius-lg)' }} />
                </div>
            </div>
        );
    }

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                {statCards.map(({ label, value, icon: Icon, color, bg, delta }) => (
                    <div key={label} className="stat-card">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ width: 44, height: 44, background: bg, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon size={22} color={color} />
                            </div>
                            <TrendingUp size={14} style={{ color: 'var(--text-muted)' }} />
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Space Grotesk', color: 'var(--text-primary)', lineHeight: 1 }}>{value.toLocaleString()}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>{label}</div>
                        <div style={{ fontSize: '0.75rem', color, marginTop: '0.5rem', fontWeight: 500 }}>{delta}</div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
                <div className="card">
                    <div className="card-header"><h4 style={{ fontSize: '1rem' }}>Monthly Submission Trend</h4></div>
                    <div className="card-body" style={{ paddingTop: '0.5rem' }}>
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f8fafc', fontSize: 12 }} />
                                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} fill="url(#areaGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header"><h4 style={{ fontSize: '1rem' }}>By Category</h4></div>
                    <div className="card-body" style={{ paddingTop: '0.5rem' }}>
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie data={data?.byCategory || []} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={70} paddingAngle={3}>
                                    {(data?.byCategory || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f8fafc', fontSize: 12 }} />
                                <Legend formatter={val => <span style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>{val}</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Dept Stats & Recent Pending */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="card">
                    <div className="card-header"><h4 style={{ fontSize: '1rem' }}>Department Performance</h4></div>
                    <div className="card-body" style={{ paddingTop: '0.5rem' }}>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={data?.byDepartment || []} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                <XAxis dataKey="_id" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f8fafc', fontSize: 12 }} />
                                <Bar dataKey="count" name="Total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="approved" name="Approved" fill="#22c55e" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h4 style={{ fontSize: '1rem' }}>Pending Approvals</h4>
                        <a href="/admin/verify" style={{ fontSize: '0.8rem', color: 'var(--primary-400)' }}>View all →</a>
                    </div>
                    {(data?.recentAchievements || []).length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <CheckCircle size={32} style={{ marginBottom: '0.5rem', color: 'var(--success-500)' }} />
                            <p>All caught up!</p>
                        </div>
                    ) : (
                        <div style={{ padding: '0.75rem' }}>
                            {data.recentAchievements.map(a => (
                                <div key={a._id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-primary)' }}>
                                    <div className="avatar avatar-sm" style={{ flexShrink: 0 }}>
                                        {a.studentId?.name?.charAt(0) || 'S'}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{a.studentId?.name} • {a.studentId?.department}</div>
                                    </div>
                                    <span className="badge badge-pending" style={{ flexShrink: 0, fontSize: '0.65rem' }}>pending</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
