import '../../styles/ReportsPage.css';
import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import { Trophy, Star, TrendingUp, Award, Download, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16'];

const ReportsPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminAPI.getReports()
            .then(res => setData(res.data))
            .catch(() => toast.error('Failed to load reports'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div>
            {[...Array(3)].map((_, i) =>
                <div key={i} className="skeleton" style={{ height: 280, borderRadius: 'var(--radius-lg)', marginBottom: '1.25rem' }} />
            )}
        </div>
    );

    const monthlyData = (data?.monthlyTrend || []).map(d => ({
        name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d._id.month - 1],
        submitted: d.submitted, approved: d.approved,
    }));

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ marginBottom: '0.25rem' }}>Reports & Analytics</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Comprehensive insights across departments and categories</p>
                </div>
                <button className="btn btn-secondary" onClick={() => toast.success('Export feature coming soon!')}>
                    <Download size={16} /> Export Report
                </button>
            </div>

            {/* Charts Row 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div className="card">
                    <div className="card-header"><h4 style={{ fontSize: '1rem' }}>Monthly Trend (Submitted vs Approved)</h4></div>
                    <div className="card-body">
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={monthlyData}>
                                <defs>
                                    <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="100%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
                                    <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} /><stop offset="100%" stopColor="#22c55e" stopOpacity={0} /></linearGradient>
                                </defs>
                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f8fafc', fontSize: 12 }} />
                                <Area type="monotone" dataKey="submitted" stroke="#3b82f6" strokeWidth={2} fill="url(#grad1)" name="Submitted" />
                                <Area type="monotone" dataKey="approved" stroke="#22c55e" strokeWidth={2} fill="url(#grad2)" name="Approved" />
                                <Legend formatter={v => <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{v}</span>} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header"><h4 style={{ fontSize: '1rem' }}>Achievement by Category</h4></div>
                    <div className="card-body">
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie data={data?.categoryStats || []} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={80} paddingAngle={3}>
                                    {(data?.categoryStats || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f8fafc', fontSize: 12 }} />
                                <Legend formatter={v => <span style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>{v}</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div className="card">
                    <div className="card-header"><h4 style={{ fontSize: '1rem' }}>Department-wise Count</h4></div>
                    <div className="card-body">
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={data?.departmentStats || []} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                <XAxis dataKey="_id" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f8fafc', fontSize: 12 }} />
                                <Bar dataKey="count" name="Achievements" fill="url(#deptGrad)" radius={[4, 4, 0, 0]} />
                                <defs><linearGradient id="deptGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#4f46e5" /></linearGradient></defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header"><h4 style={{ fontSize: '1rem' }}>Achievement by Level</h4></div>
                    <div className="card-body">
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={data?.levelStats || []} layout="vertical" margin={{ top: 5, right: 25, left: 20, bottom: 5 }}>
                                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                                <YAxis type="category" dataKey="_id" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} width={80} />
                                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f8fafc', fontSize: 12 }} />
                                <Bar dataKey="count" name="Count" radius={[0, 4, 4, 0]}>
                                    {(data?.levelStats || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Performers */}
            <div className="card">
                <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Trophy size={18} style={{ color: '#f59e0b' }} />
                    <h4 style={{ fontSize: '1rem' }}>Top Performers</h4>
                </div>
                <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                    <table className="table">
                        <thead><tr><th>#</th><th>Student</th><th>Department</th><th>Achievements</th><th>Total Points</th></tr></thead>
                        <tbody>
                            {(data?.topPerformers || []).map((p, i) => (
                                <tr key={p._id}>
                                    <td>
                                        <span style={{ width: 28, height: 28, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', background: i < 3 ? ['rgba(255,215,0,0.15)', 'rgba(192,192,192,0.15)', 'rgba(205,127,50,0.15)'][i] : 'rgba(255,255,255,0.05)', color: i < 3 ? ['#ffd700', '#c0c0c0', '#cd7f32'][i] : 'var(--text-muted)' }}>
                                            {i + 1}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div className="avatar avatar-sm">{p.student?.name?.charAt(0) || 'S'}</div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{p.student?.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.student?.studentId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="badge badge-primary">{p.student?.department}</span></td>
                                    <td style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{p.achievementCount}</td>
                                    <td><span style={{ fontWeight: 800, color: 'var(--warning-500)', fontSize: '1rem' }}>{p.totalPoints}</span><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 4 }}>pts</span></td>
                                </tr>
                            ))}
                            {(!data?.topPerformers?.length) && (
                                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No data available</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
