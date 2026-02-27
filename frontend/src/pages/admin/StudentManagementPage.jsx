import '../../styles/StudentManagementPage.css';
import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Users, Search, Trophy, Star, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const DEPARTMENTS = ['', 'CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE'];

const StudentManagementPage = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [filters, setFilters] = useState({ department: '', search: '', page: 1 });

    const load = async () => {
        setLoading(true);
        try {
            const params = { ...filters, limit: 12 };
            Object.keys(params).forEach(k => !params[k] && delete params[k]);
            const { data } = await adminAPI.getStudents(params);
            setStudents(data.data);
            setTotal(data.total);
            setPages(data.pages);
        } catch {
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [filters.department, filters.page]);

    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'S';

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ marginBottom: '0.25rem' }}>Student Management</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{total} registered students</p>
                </div>
            </div>

            {/* Filters */}
            <div className="card card-body" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }} />
                        <input className="form-control" style={{ paddingLeft: '2.5rem' }} placeholder="Search by name, email, or student ID..." value={filters.search} onChange={e => setFilters(p => ({ ...p, search: e.target.value }))} onKeyDown={e => e.key === 'Enter' && load()} />
                    </div>
                    <select className="filter-select" value={filters.department} onChange={e => setFilters(p => ({ ...p, department: e.target.value, page: 1 }))}>
                        <option value="">All Departments</option>
                        {DEPARTMENTS.slice(1).map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <button className="btn btn-primary btn-sm" onClick={load}><Search size={14} /> Search</button>
                </div>
            </div>

            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 180, borderRadius: 'var(--radius-lg)' }} />)}
                </div>
            ) : students.length === 0 ? (
                <div className="card"><div className="empty-state"><Users /><h3>No Students Found</h3><p>Try adjusting your search.</p></div></div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                        {students.map(s => (
                            <div key={s._id} className="card card-body" style={{ transition: 'all 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-primary)'; }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
                                    {s.profileImage ? (
                                        <img src={s.profileImage} alt={s.name} className="avatar avatar-md" />
                                    ) : (
                                        <div className="avatar avatar-md">{getInitials(s.name)}</div>
                                    )}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.2rem' }}>{s.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.email}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
                                    <span className="badge badge-primary">{s.department}</span>
                                    {s.batch && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-full)', padding: '0.15rem 0.5rem' }}>Batch {s.batch}</span>}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                                    {[
                                        { label: 'Total', value: s.achievementCounts?.total ?? 0, color: 'var(--primary-400)' },
                                        { label: 'Approved', value: s.achievementCounts?.approved ?? 0, color: 'var(--success-500)' },
                                        { label: 'Points', value: s.achievementCounts?.points ?? 0, color: 'var(--warning-500)' },
                                    ].map(({ label, value, color }) => (
                                        <div key={label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', padding: '0.5rem' }}>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color, fontFamily: 'Space Grotesk' }}>{value}</div>
                                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{label}</div>
                                        </div>
                                    ))}
                                </div>

                                <Link to={`/portfolio/${s._id}`} className="btn btn-secondary w-full btn-sm" style={{ justifyContent: 'center' }}>
                                    <Eye size={14} /> View Portfolio
                                </Link>
                            </div>
                        ))}
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

export default StudentManagementPage;
