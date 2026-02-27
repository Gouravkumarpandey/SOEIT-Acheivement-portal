import '../../styles/StudentManagementPage.css';
import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Users, Search, Trophy, Star, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

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

    const exportStudentData = (type) => {
        const date = new Date().toLocaleDateString().replace(/\//g, '-');

        if (type === 'excel') {
            const excelData = students.map(s => ({
                'Name': s.name,
                'Enrollment No': s.enrollmentNo || s.studentId,
                'Department': s.department,
                'Semester': s.semester || 'N/A',
                'Section': s.section || 'X',
                'Email': s.email,
                'Batch': s.batch || 'N/A',
                'Total Achievements': s.achievementCounts?.total || 0,
                'Approved': s.achievementCounts?.approved || 0,
                'Total Points': s.achievementCounts?.points || 0
            }));

            const ws = XLSX.utils.json_to_sheet(excelData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Students");
            XLSX.writeFile(wb, `SOEIT_Students_List_${date}.xlsx`);
            toast.success('Excel file downloaded');
        } else {
            const doc = new jsPDF('l', 'mm', 'a4');
            doc.setFillColor(30, 41, 59);
            doc.rect(0, 0, 297, 30, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(20);
            doc.text('SOEIT STUDENT MANAGEMENT - ACADEMIC REPORT', 148, 15, { align: 'center' });
            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 148, 22, { align: 'center' });

            doc.autoTable({
                startY: 40,
                head: [['Name', 'ID/Enrollment', 'Dept', 'Sem', 'Email', 'Achievements', 'Points']],
                body: students.map(s => [
                    s.name,
                    s.enrollmentNo || s.studentId,
                    s.department,
                    `${s.semester || 'N/A'}-${s.section || 'X'}`,
                    s.email,
                    s.achievementCounts?.total || 0,
                    s.achievementCounts?.points || 0
                ]),
                theme: 'grid',
                headStyles: { fillColor: [59, 130, 246] },
                alternateRowStyles: { fillColor: [245, 248, 255] }
            });

            doc.save(`SOEIT_Students_Data_${date}.pdf`);
            toast.success('PDF report downloaded');
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ marginBottom: '0.25rem' }}>Student Management</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{total} registered students</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => exportStudentData('excel')} style={{ background: '#16a34a', color: '#fff', border: 'none' }}>
                        Excel Export
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => exportStudentData('pdf')}>
                        PDF Export
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="card card-body" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }} />
                        <input className="form-control" style={{ paddingLeft: '2.5rem' }} placeholder="Search by name, enrollment no, or ID..." value={filters.search} onChange={e => setFilters(p => ({ ...p, search: e.target.value }))} onKeyDown={e => e.key === 'Enter' && load()} />
                    </div>
                    <select className="filter-select" value={filters.department} onChange={e => setFilters(p => ({ ...p, department: e.target.value, page: 1 }))}>
                        <option value="">All Departments</option>
                        {['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE'].map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select className="filter-select" value={filters.semester} onChange={e => setFilters(p => ({ ...p, semester: e.target.value, page: 1 }))}>
                        <option value="">All Semesters</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                    </select>
                    <button className="btn btn-primary" onClick={load}><Search size={14} /> Search</button>
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
                    <div className="card" style={{ overflowX: 'auto', border: '1px solid var(--border-primary)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-primary)' }}>
                                <tr>
                                    <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Student</th>
                                    <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Academic Info</th>
                                    <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Login Detail</th>
                                    <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'center' }}>Total</th>
                                    <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'center' }}>Valid</th>
                                    <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'center' }}>Points</th>
                                    <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((s) => (
                                    <tr key={s._id} style={{ borderBottom: '1px solid var(--border-primary)', transition: 'background 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                {s.profileImage ? (
                                                    <img src={`${import.meta.env.VITE_UPLOADS_URL || ''}${s.profileImage}`} alt={s.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div className="avatar avatar-sm" style={{ width: 32, height: 32, fontSize: '0.7rem' }}>{getInitials(s.name)}</div>
                                                )}
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{s.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.enrollmentNo || s.studentId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontSize: '0.85rem' }}>
                                                <span className="badge badge-primary" style={{ marginRight: '0.4rem', padding: '0.1rem 0.4rem', fontSize: '0.65rem' }}>{s.department}</span>
                                                <span style={{ color: 'var(--text-secondary)' }}>Sem {s.semester}-{s.section || 'X'}</span>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>Batch {s.batch || 'N/A'}</div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <Star size={12} color="var(--primary-400)" />
                                                {s.email}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <span style={{ fontWeight: 700, color: 'var(--primary-400)' }}>{s.achievementCounts?.total ?? 0}</span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <span style={{ fontWeight: 700, color: 'var(--success-500)' }}>{s.achievementCounts?.approved ?? 0}</span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <div style={{ fontWeight: 800, color: 'var(--warning-500)', fontFamily: 'Space Grotesk' }}>{s.achievementCounts?.points ?? 0}</div>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <Link to={`/portfolio/${s._id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.4rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <Eye size={14} /> View
                                            </Link>
                                        </td>
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

export default StudentManagementPage;
