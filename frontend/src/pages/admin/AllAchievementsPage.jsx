import '../../styles/AllAchievementsPage.css';
import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Search, Filter, Trophy, ChevronLeft, ChevronRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const STATUSES = ['', 'pending', 'approved', 'rejected'];
const DEPARTMENTS = ['', 'CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE'];
const CATEGORIES = ['', 'Academic', 'Sports', 'Cultural', 'Technical', 'Research', 'Internship', 'Certification', 'Competition', 'Other'];

const StatusBadge = ({ status }) => {
    const map = { pending: ['badge-pending', Clock], approved: ['badge-approved', CheckCircle], rejected: ['badge-rejected', XCircle] };
    const [cls, Icon] = map[status] || ['badge-primary', null];
    return <span className={`badge ${cls}`}>{Icon && <Icon size={10} />}{status}</span>;
};

const AllAchievementsPage = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [filters, setFilters] = useState({ status: '', category: '', department: '', search: '', page: 1 });

    const load = async () => {
        setLoading(true);
        try {
            const params = { ...filters, limit: 12 };
            Object.keys(params).forEach(k => !params[k] && delete params[k]);
            const { data } = await adminAPI.getAll(params);
            setAchievements(data.data);
            setTotal(data.total);
            setPages(data.pages);
        } catch {
            toast.error('Failed to load achievements');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [filters.status, filters.category, filters.department, filters.page]);

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ marginBottom: '0.25rem' }}>All Achievements</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{total} achievement{total !== 1 ? 's' : ''} in system</p>
                </div>
            </div>

            {/* Filters */}
            <div className="card card-body" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }} />
                        <input className="form-control" style={{ paddingLeft: '2.5rem' }} placeholder="Search by title or student..." value={filters.search} onChange={e => setFilters(p => ({ ...p, search: e.target.value }))} onKeyDown={e => e.key === 'Enter' && load()} />
                    </div>
                    <select className="filter-select" value={filters.status} onChange={e => setFilters(p => ({ ...p, status: e.target.value, page: 1 }))}>
                        <option value="">All Status</option>
                        {STATUSES.slice(1).map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
                    </select>
                    <select className="filter-select" value={filters.department} onChange={e => setFilters(p => ({ ...p, department: e.target.value, page: 1 }))}>
                        <option value="">All Depts</option>
                        {DEPARTMENTS.slice(1).map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select className="filter-select" value={filters.category} onChange={e => setFilters(p => ({ ...p, category: e.target.value, page: 1 }))}>
                        <option value="">All Categories</option>
                        {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button className="btn btn-primary btn-sm" onClick={load}><Filter size={14} /> Apply</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setFilters({ status: '', category: '', department: '', search: '', page: 1 })}>Clear</button>
                </div>
            </div>

            {loading ? (
                <div className="card">{[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 70, margin: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)' }} />)}</div>
            ) : achievements.length === 0 ? (
                <div className="card"><div className="empty-state"><Trophy /><h3>No Achievements Found</h3><p>Adjust your filters to see results.</p></div></div>
            ) : (
                <>
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Achievement</th>
                                    <th>Student</th>
                                    <th>Dept</th>
                                    <th>Category</th>
                                    <th>Level</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {achievements.map(a => (
                                    <tr key={a._id}>
                                        <td style={{ maxWidth: 200 }}>
                                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div className="avatar" style={{ width: 28, height: 28, fontSize: '0.7rem', flexShrink: 0 }}>{a.student?.name?.charAt(0) || 'S'}</div>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>{a.student?.name}</span>
                                            </div>
                                        </td>
                                        <td><span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{a.student?.department}</span></td>
                                        <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{a.category}</td>
                                        <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{a.level}</td>
                                        <td><StatusBadge status={a.status} /></td>
                                        <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{format(new Date(a.createdAt), 'dd MMM yy')}</td>
                                        <td><span style={{ fontWeight: 700, color: a.status === 'approved' ? 'var(--success-500)' : 'var(--text-muted)', fontSize: '0.9rem' }}>{a.status === 'approved' ? `+${a.points}` : '-'}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {pages > 1 && (
                        <div className="pagination">
                            <button className="page-btn" onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))} disabled={filters.page === 1}><ChevronLeft size={16} /></button>
                            {[...Array(Math.min(pages, 7))].map((_, i) => (
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

export default AllAchievementsPage;
