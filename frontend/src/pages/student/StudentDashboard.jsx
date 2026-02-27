import '../../styles/StudentDashboard.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { achievementAPI } from '../../services/api';
import { Trophy, CheckCircle, Clock, XCircle, Star, Upload, TrendingUp, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16'];

const StatusBadge = ({ status }) => (
    <span className={`badge badge-${status}`}>
        {status === 'pending' && <Clock size={10} />}
        {status === 'approved' && <CheckCircle size={10} />}
        {status === 'rejected' && <XCircle size={10} />}
        {status}
    </span>
);

const StudentDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await achievementAPI.getStats();
                setStats(data);
            } catch {
                toast.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const statCards = [
        { label: 'Total Submitted', value: stats?.stats?.all ?? 0, icon: Trophy, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
        { label: 'Approved', value: stats?.stats?.approved ?? 0, icon: CheckCircle, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
        { label: 'Pending Review', value: stats?.stats?.pending ?? 0, icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
        { label: 'Total Points', value: stats?.stats?.totalPoints ?? 0, icon: Star, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    ];

    const categoryData = stats?.stats?.byCategory?.map(d => ({ name: d._id, count: d.count })) || [];
    const levelData = stats?.stats?.byLevel?.map(d => ({ name: d._id, value: d.count })) || [];

    if (loading) {
        return (
            <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                    {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-lg)' }} />)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    {[...Array(2)].map((_, i) => <div key={i} className="skeleton" style={{ height: 280, borderRadius: 'var(--radius-lg)' }} />)}
                </div>
            </div>
        );
    }

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            {/* Welcome Banner */}
            <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.15))', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 'var(--radius-xl)', padding: '1.5rem 2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ marginBottom: '0.25rem' }}>Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user?.department} • {user?.batch || 'SOEIT'} • Semester {user?.semester || ''}</p>
                </div>
                <Link to="/achievements/upload" className="btn btn-primary">
                    <Upload size={16} /> Upload Achievement
                </Link>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                {statCards.map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="stat-card">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ width: 44, height: 44, background: bg, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon size={22} color={color} />
                            </div>
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Space Grotesk', color: 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>{label}</div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
                {/* Bar Chart: Achievements by Category */}
                <div className="card">
                    <div className="card-header">
                        <h4 style={{ fontSize: '1rem' }}>Achievements by Category</h4>
                    </div>
                    <div className="card-body" style={{ paddingTop: '0.5rem' }}>
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={categoryData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f8fafc', fontSize: 12 }} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                                    <Bar dataKey="count" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3b82f6" />
                                            <stop offset="100%" stopColor="#8b5cf6" />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <div className="empty-state" style={{ padding: '2rem' }}><Trophy size={40} /><p>No achievements yet</p></div>}
                    </div>
                </div>

                {/* Pie Chart: By Level */}
                <div className="card">
                    <div className="card-header">
                        <h4 style={{ fontSize: '1rem' }}>Achievements by Level</h4>
                    </div>
                    <div className="card-body" style={{ paddingTop: '0.5rem' }}>
                        {levelData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie data={levelData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} paddingAngle={3}>
                                        {levelData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f8fafc', fontSize: 12 }} />
                                    <Legend formatter={(val) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{val}</span>} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : <div className="empty-state" style={{ padding: '2rem' }}><Award size={40} /><p>No approved achievements</p></div>}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
                <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4 style={{ fontSize: '1rem' }}>Recent Activity</h4>
                    <Link to="/achievements" style={{ fontSize: '0.85rem', color: 'var(--primary-400)' }}>View all →</Link>
                </div>
                {stats?.recentActivity?.length > 0 ? (
                    <div className="table-wrapper" style={{ borderRadius: '0 0 var(--radius-lg) var(--radius-lg)', border: 'none' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Achievement</th>
                                    <th>Category</th>
                                    <th>Level</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentActivity.map((a) => (
                                    <tr key={a._id}>
                                        <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{a.title}</td>
                                        <td><span className="badge badge-primary">{a.category}</span></td>
                                        <td style={{ color: 'var(--text-muted)' }}>{a.level}</td>
                                        <td><StatusBadge status={a.status} /></td>
                                        <td style={{ color: 'var(--text-muted)' }}>{format(new Date(a.createdAt), 'dd MMM yyyy')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state">
                        <TrendingUp />
                        <h3>No Activity Yet</h3>
                        <p>Start by uploading your first achievement!</p>
                        <Link to="/achievements/upload" className="btn btn-primary" style={{ marginTop: '1rem' }}>Upload Achievement</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
