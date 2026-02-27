import '../../styles/MyAchievementsPage.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { achievementAPI } from '../../services/api';
import { Trophy, Search, Filter, Pencil, Trash2, Clock, CheckCircle, XCircle, Eye, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const CATEGORIES = ['', 'Academic', 'Sports', 'Cultural', 'Technical', 'Research', 'Internship', 'Certification', 'Competition', 'Other'];
const STATUSES = ['', 'pending', 'approved', 'rejected'];

const StatusBadge = ({ status }) => {
    const icons = { pending: Clock, approved: CheckCircle, rejected: XCircle };
    const Icon = icons[status];
    return <span className={`badge badge-${status}`}>{Icon && <Icon size={10} />}{status}</span>;
};

const MyAchievementsPage = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [filters, setFilters] = useState({ status: '', category: '', search: '', page: 1 });
    const [deleteId, setDeleteId] = useState(null);

    const load = async () => {
        setLoading(true);
        try {
            const params = { ...filters, limit: 10 };
            Object.keys(params).forEach(k => !params[k] && delete params[k]);
            const { data } = await achievementAPI.getMy(params);
            setAchievements(data.data);
            setTotal(data.total);
            setPages(data.pages);
        } catch {
            toast.error('Failed to load achievements');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [filters.status, filters.category, filters.page]);

    const handleSearch = (e) => {
        e.preventDefault();
        load();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this achievement?')) return;
        try {
            await achievementAPI.delete(id);
            toast.success('Achievement deleted');
            load();
        } catch {
            toast.error('Failed to delete');
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ marginBottom: '0.25rem' }}>My Achievements</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{total} achievement{total !== 1 ? 's' : ''} submitted</p>
                </div>
                <Link to="/achievements/upload" className="btn btn-primary">
                    <Upload size={16} /> New Achievement
                </Link>
            </div>

            {/* Filters */}
            <div className="card card-body" style={{ marginBottom: '1.5rem' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <div className="search-box">
                            <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }} />
                            <input className="form-control" style={{ paddingLeft: '2.5rem' }} placeholder="Search achievements..." value={filters.search} onChange={e => setFilters(p => ({ ...p, search: e.target.value }))} />
                        </div>
                    </div>
                    <select className="filter-select" value={filters.status} onChange={e => setFilters(p => ({ ...p, status: e.target.value, page: 1 }))}>
                        <option value="">All Status</option>
                        {STATUSES.slice(1).map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
                    </select>
                    <select className="filter-select" value={filters.category} onChange={e => setFilters(p => ({ ...p, category: e.target.value, page: 1 }))}>
                        <option value="">All Categories</option>
                        {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button type="submit" className="btn btn-primary btn-sm"><Filter size={14} /> Filter</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setFilters({ status: '', category: '', search: '', page: 1 })}>Clear</button>
                </form>
            </div>

            {/* Table */}
            {loading ? (
                <div className="card">{[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 60, margin: '0.5rem', borderRadius: 'var(--radius-md)' }} />)}</div>
            ) : achievements.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <Trophy />
                        <h3>No Achievements Found</h3>
                        <p>Start documenting your accomplishments to build your portfolio!</p>
                        <Link to="/achievements/upload" className="btn btn-primary" style={{ marginTop: '1rem' }}>Upload Your First Achievement</Link>
                    </div>
                </div>
            ) : (
                <>
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Achievement</th>
                                    <th>Category</th>
                                    <th>Level</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Points</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {achievements.map((a) => (
                                    <tr key={a._id}>
                                        <td>
                                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</div>
                                            {a.institution && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{a.institution}</div>}
                                        </td>
                                        <td><span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{a.category}</span></td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{a.level}</td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{format(new Date(a.date || a.createdAt), 'dd MMM yy')}</td>
                                        <td><StatusBadge status={a.status} /></td>
                                        <td>
                                            <span style={{ fontWeight: 700, color: a.status === 'approved' ? 'var(--success-500)' : 'var(--text-muted)' }}>
                                                {a.status === 'approved' ? `+${a.points}` : '-'}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {a.status !== 'approved' && (
                                                    <Link to={`/achievements/edit/${a._id}`} className="btn btn-secondary btn-icon" title="Edit">
                                                        <Pencil size={14} />
                                                    </Link>
                                                )}
                                                <button className="btn btn-icon" title="Delete" onClick={() => handleDelete(a._id)} style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--error-500)' }}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pages > 1 && (
                        <div className="pagination">
                            <button className="page-btn" onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))} disabled={filters.page === 1}><ChevronLeft size={16} /></button>
                            {[...Array(pages)].map((_, i) => (
                                <button key={i} className={`page-btn ${filters.page === i + 1 ? 'active' : ''}`} onClick={() => setFilters(p => ({ ...p, page: i + 1 }))}>{i + 1}</button>
                            ))}
                            <button className="page-btn" onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))} disabled={filters.page === pages}><ChevronRight size={16} /></button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MyAchievementsPage;
