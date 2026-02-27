import '../../styles/VerifyAchievementsPage.css';
import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { CheckCircle, XCircle, Eye, Search, Filter, Clock, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const DEPARTMENTS = ['', 'CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE'];
const CATEGORIES = ['', 'Academic', 'Sports', 'Cultural', 'Technical', 'Research', 'Internship', 'Certification', 'Competition', 'Other'];

const VerifyAchievementsPage = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [filters, setFilters] = useState({ department: '', category: '', search: '', page: 1 });
    const [selected, setSelected] = useState(null);
    const [action, setAction] = useState('');
    const [remarks, setRemarks] = useState('');
    const [verifying, setVerifying] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const params = { ...filters, limit: 8 };
            Object.keys(params).forEach(k => !params[k] && delete params[k]);
            const { data } = await adminAPI.getPending(params);
            setAchievements(data.data);
            setTotal(data.total);
            setPages(data.pages);
        } catch {
            toast.error('Failed to load achievements');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [filters.department, filters.category, filters.page]);

    const handleVerify = async () => {
        if (!action) { toast.error('Select approve or reject'); return; }
        if (action === 'rejected' && !remarks.trim()) { toast.error('Please provide remarks for rejection'); return; }
        setVerifying(true);
        try {
            await adminAPI.verify(selected._id, { action, remarks });
            toast.success(`Achievement ${action} successfully!`);
            setSelected(null);
            setAction('');
            setRemarks('');
            load();
        } catch {
            toast.error('Verification failed');
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ marginBottom: '0.25rem' }}>Verify Achievements</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{total} pending for review</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} style={{ color: 'var(--warning-500)' }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--warning-500)', fontWeight: 600 }}>{total} pending</span>
                </div>
            </div>

            {/* Filters */}
            <div className="card card-body" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }} />
                        <input className="form-control" style={{ paddingLeft: '2.5rem' }} placeholder="Search by title or student..." value={filters.search} onChange={e => setFilters(p => ({ ...p, search: e.target.value }))} onKeyDown={e => e.key === 'Enter' && load()} />
                    </div>
                    <select className="filter-select" value={filters.department} onChange={e => setFilters(p => ({ ...p, department: e.target.value, page: 1 }))}>
                        <option value="">All Departments</option>
                        {DEPARTMENTS.slice(1).map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select className="filter-select" value={filters.category} onChange={e => setFilters(p => ({ ...p, category: e.target.value, page: 1 }))}>
                        <option value="">All Categories</option>
                        {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button className="btn btn-primary btn-sm" onClick={load}><Filter size={14} /> Apply</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '1.5rem' }}>
                {/* List */}
                <div>
                    {loading ? (
                        <div className="card">{[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 80, margin: '0.75rem', borderRadius: 'var(--radius-md)' }} />)}</div>
                    ) : achievements.length === 0 ? (
                        <div className="card">
                            <div className="empty-state"><CheckCircle /><h3>All Caught Up!</h3><p>No pending achievements for review.</p></div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {achievements.map((a) => (
                                <div key={a._id} className="card card-body" style={{ cursor: 'pointer', border: selected?._id === a._id ? '1px solid var(--primary-500)' : '1px solid var(--border-primary)', background: selected?._id === a._id ? 'rgba(59,130,246,0.05)' : 'var(--bg-card)', transition: 'all 0.2s' }}
                                    onClick={() => { setSelected(a); setAction(''); setRemarks(''); }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                        <div className="avatar avatar-md" style={{ flexShrink: 0 }}>{a.student?.name?.charAt(0) || 'S'}</div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</div>
                                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{a.student?.name}</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>•</span>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{a.student?.department}</span>
                                                <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{a.category}</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.level}</span>
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                                Submitted {format(new Date(a.createdAt), 'dd MMM yyyy')} • {a.proofFiles?.length || 0} file(s)
                                            </div>
                                        </div>
                                        <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); setSelected(a); }}>
                                            <Eye size={14} /> Review
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {pages > 1 && (
                        <div className="pagination">
                            <button className="page-btn" onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))} disabled={filters.page === 1}><ChevronLeft size={16} /></button>
                            {[...Array(Math.min(pages, 5))].map((_, i) => (
                                <button key={i} className={`page-btn ${filters.page === i + 1 ? 'active' : ''}`} onClick={() => setFilters(p => ({ ...p, page: i + 1 }))}>{i + 1}</button>
                            ))}
                            <button className="page-btn" onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))} disabled={filters.page === pages}><ChevronRight size={16} /></button>
                        </div>
                    )}
                </div>

                {/* Detail Panel */}
                {selected && (
                    <div className="card" style={{ position: 'sticky', top: '80px', alignSelf: 'start' }}>
                        <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h4 style={{ fontSize: '0.95rem' }}>Review Details</h4>
                            <button className="btn btn-icon btn-secondary" onClick={() => setSelected(null)} style={{ width: 28, height: 28 }}><XCircle size={14} /></button>
                        </div>
                        <div className="card-body">
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{selected.title}</div>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                    <span className="badge badge-primary">{selected.category}</span>
                                    <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-primary)', color: 'var(--text-secondary)', fontSize: '0.7rem' }}>{selected.level}</span>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '0.75rem' }}>{selected.description}</p>
                                {[['Student', selected.student?.name], ['Department', selected.student?.department], ['Date', selected.date ? format(new Date(selected.date), 'dd MMM yyyy') : 'N/A'], ['Institution', selected.institution || 'N/A']].map(([label, val]) => (
                                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-primary)', fontSize: '0.85rem' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{val}</span>
                                    </div>
                                ))}
                            </div>

                            {selected.proofFiles?.length > 0 && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Proof Documents</div>
                                    {selected.proofFiles.map((f, i) => (
                                        <a key={i} href={f.url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-primary)', marginBottom: '0.375rem', color: 'var(--primary-400)', fontSize: '0.82rem' }}>
                                            <FileText size={14} />{f.originalname}
                                        </a>
                                    ))}
                                </div>
                            )}

                            <div className="divider" />
                            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Decision</div>

                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                <button className={`btn btn-sm ${action === 'approved' ? 'btn-success' : 'btn-secondary'}`} style={{ flex: 1 }} onClick={() => setAction('approved')}>
                                    <CheckCircle size={14} /> Approve
                                </button>
                                <button className={`btn btn-sm ${action === 'rejected' ? 'btn-danger' : 'btn-secondary'}`} style={{ flex: 1 }} onClick={() => setAction('rejected')}>
                                    <XCircle size={14} /> Reject
                                </button>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Remarks {action === 'rejected' && <span style={{ color: 'var(--error-500)' }}>*</span>}</label>
                                <textarea className="form-control" rows={3} placeholder={action === 'rejected' ? 'Explain why this is rejected...' : 'Optional remarks for the student...'} value={remarks} onChange={e => setRemarks(e.target.value)} />
                            </div>

                            <button className="btn btn-primary w-full" onClick={handleVerify} disabled={!action || verifying}>
                                {verifying ? <><div className="spinner spinner-sm" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />Processing...</> : `Confirm ${action || 'Decision'}`}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyAchievementsPage;
