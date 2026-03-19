import '../../styles/pages/admin/AdminDashboard.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { Users, Trophy, Clock, CheckCircle, XCircle, TrendingUp, BarChart3, Award, Shield } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip as ChartTooltip,
    Legend as ChartLegend,
    Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    ChartTooltip,
    ChartLegend,
    Filler
);

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
                toast.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const statCards = [
        { label: 'Total Students', value: data?.stats?.totalStudents ?? 0, icon: Users, color: 'var(--brand-600)', bg: 'var(--primary-50)', delta: 'Active students', iconColor: 'var(--brand-700)' },
        { label: 'Total Faculty', value: data?.stats?.totalFaculties ?? 0, icon: Shield, color: 'var(--indigo-600)', bg: 'var(--indigo-50)', delta: 'Total teaching staff', iconColor: 'var(--indigo-700)' },
        { label: 'Total Achievements', value: data?.stats?.totalAchievements ?? 0, icon: Trophy, color: 'var(--success-600)', bg: 'var(--success-50)', delta: `Approved: ${data?.stats?.approvedCount ?? 0}`, iconColor: 'var(--success-700)' },
        { label: 'Pending Review', value: data?.stats?.pendingCount ?? 0, icon: Clock, color: 'var(--warning-500)', bg: 'var(--warning-50)', delta: 'Waiting for approval', iconColor: 'var(--warning-700)' },
    ];

    const trendLabels = (data?.monthlyTrend || []).map(d => 
        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d._id.month - 1]
    );
    const trendValues = (data?.monthlyTrend || []).map(d => d.count);

    const trendChart = {
        labels: trendLabels,
        datasets: [{
            label: 'Submissions',
            data: trendValues,
            fill: true,
            borderColor: '#002147',
            backgroundColor: 'rgba(0, 33, 71, 0.1)',
            tension: 0.4,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#002147',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
        }]
    };

    const pieChart = {
        labels: (data?.byCategory || []).map(d => d._id),
        datasets: [{
            data: (data?.byCategory || []).map(d => d.count),
            backgroundColor: COLORS,
            borderWidth: 0,
            hoverOffset: 15
        }]
    };

    const barLabels = (data?.byDepartment || []).map(d => d._id);
    const barChart = {
        labels: barLabels,
        datasets: [
            {
                label: 'Total Submissions',
                data: (data?.byDepartment || []).map(d => d.count),
                backgroundColor: 'rgba(100, 116, 139, 0.2)',
                borderRadius: 8,
                barThickness: 25
            },
            {
                label: 'Approved Submissions',
                data: (data?.byDepartment || []).map(d => d.approved),
                backgroundColor: '#002147',
                borderRadius: 8,
                barThickness: 25
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: '#fff',
                titleColor: '#0f172a',
                bodyColor: '#64748b',
                padding: 12,
                borderRadius: 12,
                borderColor: '#e2e8f0',
                borderWidth: 1,
                displayColors: true,
                usePointStyle: true,
                bodyFont: { weight: '800' }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#64748b', font: { weight: '800', size: 11 } }
            },
            y: {
                grid: { borderDash: [5, 5], color: '#e2e8f0' },
                ticks: { color: '#64748b', font: { weight: '800', size: 11 } }
            }
        }
    };

    if (loading) {
        return (
            <div className="animate-fade-in">
                <div className="admin-skeleton-grid">
                    {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 160, borderRadius: '20px' }} />)}
                </div>
                <div className="admin-skeleton-charts">
                    <div className="skeleton" style={{ height: 400, borderRadius: '20px' }} />
                    <div className="skeleton" style={{ height: 400, borderRadius: '20px' }} />
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Header Context Suite */}
            <div className="page-header admin-header-suite">
                <div className="admin-header-content">
                    <h2 className="heading-display">Admin Dashboard</h2>
                    <p className="page-subtitle">Overview of student achievements, department growth, and performance metrics.</p>
                </div>
                <div className="admin-header-sync">
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success-500)', boxShadow: '0 0 0 4px var(--success-50)' }}></div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>LIVE DATA</span>
                </div>
            </div>

            {/* Premium Stat Architecture */}
            <div className="grid-stats admin-stats-grid">
                {statCards.map(({ label, value, icon: Icon, color, bg, delta, iconColor }) => (
                    <div key={label} className="card" style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden', border: '1px solid var(--border-primary)', borderRadius: '20px', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                            <div style={{ width: 52, height: 52, background: bg, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${bg}` }}>
                                <Icon size={24} style={{ color: iconColor }} strokeWidth={2.5} />
                            </div>
                            <div style={{ padding: '0.4rem 0.6rem', background: 'var(--slate-50)', borderRadius: '8px', border: '1px solid var(--border-primary)', fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)' }}>
                                DATA
                            </div>
                        </div>
                        <div style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1, marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>{value.toLocaleString()}</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: color, marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: bg, borderRadius: '10px', width: 'fit-content' }}>
                            <TrendingUp size={14} strokeWidth={3} />
                            {delta}
                        </div>
                    </div>
                ))}
            </div>

            {/* Dynamic Visualization Ecosystem */}
            <div className="admin-charts-ecosystem">
                {/* Submission Longitudinal Trend */}
                <div className="card admin-chart-card-res">
                    <div className="card-header admin-chart-header">
                        <h4 style={{ margin: 0, fontWeight: 900, fontSize: '1.15rem', color: 'var(--text-primary)' }}>Yearly Submission Trend</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 900, color: 'var(--brand-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <BarChart3 size={16} /> Last 12 Months
                        </div>
                    </div>
                    <div className="card-body admin-chart-body" style={{ minHeight: '320px' }}>
                        <Line data={trendChart} options={chartOptions} />
                    </div>
                </div>

                {/* Domain Distribution Intelligence */}
                <div className="card admin-chart-card-res">
                    <div className="card-header admin-chart-header">
                        <h4 style={{ margin: 0, fontWeight: 900, fontSize: '1.15rem', color: 'var(--text-primary)' }}>Category Breakdown</h4>
                    </div>
                    <div className="card-body admin-domain-body" style={{ minHeight: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '100%', height: '280px' }}>
                            <Pie data={pieChart} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: true, position: 'bottom', labels: { usePointStyle: true, padding: 20, font: { weight: '800', size: 10 } } } } }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Departmental Intelligence & Critical Action Queue */}
            <div className="admin-charts-ecosystem-alt">
                <div className="card admin-chart-card-res">
                    <div className="card-header admin-chart-header">
                        <h4 style={{ margin: 0, fontWeight: 900, fontSize: '1.15rem', color: 'var(--text-primary)' }}>Department Progress</h4>
                    </div>
                    <div className="card-body admin-chart-body" style={{ minHeight: '320px' }}>
                        <Bar 
                            data={barChart} 
                            options={{
                                ...chartOptions, 
                                plugins: { ...chartOptions.plugins, legend: { display: true, position: 'top', align: 'end', labels: { usePointStyle: true, font: { weight: '800', size: 11 } } } } 
                            }} 
                        />
                    </div>
                </div>

                <div className="card admin-chart-card-res">
                    <div className="card-header admin-chart-header">
                        <h4 style={{ margin: 0, fontWeight: 900, fontSize: '1.15rem', color: 'var(--text-primary)' }}>Recent Pending Requests</h4>
                        <Link to="/admin/verify" className="btn btn-ghost admin-sync-btn">
                            <span>VIEW ALL</span> <Award size={16} strokeWidth={2.5} />
                        </Link>
                    </div>
                    <div className="card-body admin-queue-body">
                        {(data?.recentAchievements || []).length === 0 ? (
                            <div style={{ padding: '5rem 2rem', textAlign: 'center' }}>
                                <div style={{ width: 80, height: 80, background: 'var(--success-50)', color: 'var(--success-600)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                                    <CheckCircle size={40} strokeWidth={1.5} />
                                </div>
                                <h5 style={{ fontWeight: 900, margin: '0 0 0.75rem 0', color: 'var(--text-primary)', fontSize: '1.25rem' }}>All Caught Up!</h5>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0, fontWeight: 600 }}>All pending requests have been reviewed.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {data.recentAchievements.map(a => (
                                    <div key={a._id} className="admin-recent-achievements-row hover-row">
                                        <div style={{ width: 48, height: 48, background: 'var(--primary-50)', color: 'var(--brand-700)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem', border: '1px solid var(--primary-100)', flexShrink: 0 }}>
                                            {a.studentId?.name?.charAt(0) || 'S'}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.2rem' }}>{a.title}</div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>{a.studentId?.name} • <span style={{ color: 'var(--brand-600)' }}>{a.studentId?.department}</span></div>
                                        </div>
                                        <div style={{ padding: '0.4rem 0.75rem', background: 'var(--warning-50)', color: 'var(--warning-700)', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid var(--warning-100)' }}>PENDING</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
