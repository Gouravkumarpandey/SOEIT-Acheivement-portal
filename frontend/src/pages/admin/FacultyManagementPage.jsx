import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Users, Search, Mail, Shield, UserCheck, UserX } from 'lucide-react';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const FacultyManagementPage = () => {
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const loadFaculty = async () => {
        setLoading(true);
        try {
            const { data } = await adminAPI.getFaculty({ search });
            setFaculty(data.data);
        } catch {
            toast.error('Failed to load faculty members');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFaculty();
    }, []);

    const toggleStatus = async (id, currentStatus) => {
        try {
            await adminAPI.manageUser(id, { isActive: !currentStatus });
            toast.success('Faculty status updated');
            loadFaculty();
        } catch {
            toast.error('Failed to update status');
        }
    };

    const exportFacultyData = (type) => {
        try {
            const date = new Date().toLocaleDateString().replace(/\//g, '-');

            if (type === 'excel') {
                const excelData = faculty.map(f => ({
                    'Name': f.name,
                    'Employee ID': f.studentId || 'N/A',
                    'Email': f.email,
                    'Department': f.department || 'General',
                    'Status': f.isActive ? 'Active' : 'Inactive'
                }));

                const ws = XLSX.utils.json_to_sheet(excelData);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Faculty");
                XLSX.writeFile(wb, `SOEIT_Faculty_List_${date}.xlsx`);
                toast.success('Excel file downloaded');
            } else {
                const doc = new jsPDF();
                doc.setFillColor(139, 92, 246);
                doc.rect(0, 0, 210, 30, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(20);
                doc.text('SOEIT FACULTY ROSTER', 105, 15, { align: 'center' });
                doc.setFontSize(10);
                doc.text(`Official Academic Record - ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });

                autoTable(doc, {
                    startY: 40,
                    head: [['Name', 'Employee ID', 'Official Email', 'Department', 'Status']],
                    body: faculty.map(f => [
                        f.name,
                        f.studentId || 'N/A',
                        f.email,
                        f.department || 'General',
                        f.isActive ? 'Active' : 'Inactive'
                    ]),
                    theme: 'striped',
                    headStyles: { fillColor: [139, 92, 246] }
                });

                doc.save(`SOEIT_Faculty_Data_${date}.pdf`);
                toast.success('PDF roster downloaded');
            }
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Download failed! ' + error.message);
        }
    };

    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'F';

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2>Faculty Management</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage faculty portal access and review login details</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => exportFacultyData('excel')} style={{ background: '#16a34a', color: '#fff', border: 'none' }}>
                        Excel Export
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => exportFacultyData('pdf')}>
                        PDF Export
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="card card-body" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            className="form-control"
                            style={{ paddingLeft: '2.5rem' }}
                            placeholder="Search by name, email or employee ID..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && loadFaculty()}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={loadFaculty}>Search</button>
                </div>
            </div>

            {loading ? (
                <div className="card card-body" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="spinner" style={{ margin: '0 auto' }}></div>
                </div>
            ) : faculty.length === 0 ? (
                <div className="card card-body" style={{ textAlign: 'center', padding: '3rem' }}>
                    <Users size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                    <h3>No Faculty Members Found</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search query.</p>
                </div>
            ) : (
                <div className="card" style={{ overflowX: 'auto', border: '1px solid var(--border-primary)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-primary)' }}>
                            <tr>
                                <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Faculty Member</th>
                                <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Login Account</th>
                                <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Department</th>
                                <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'center' }}>Status</th>
                                <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {faculty.map((f) => (
                                <tr key={f._id} style={{ borderBottom: '1px solid var(--border-primary)', transition: 'background 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            {f.profileImage ? (
                                                <img src={`${import.meta.env.VITE_UPLOADS_URL || ''}${f.profileImage}`} alt={f.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                                            ) : (
                                                <div className="avatar avatar-sm" style={{ width: 36, height: 36, fontSize: '0.8rem' }}>{getInitials(f.name)}</div>
                                            )}
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{f.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {f.studentId || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            <Mail size={14} color="var(--primary-400)" />
                                            {f.email}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span className="badge badge-purple" style={{ textTransform: 'uppercase' }}>{f.department || 'General'}</span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <span className={`badge ${f.isActive ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.7rem' }}>
                                            {f.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <button
                                            className={`btn btn-sm ${f.isActive ? 'btn-secondary' : 'btn-primary'}`}
                                            onClick={() => toggleStatus(f._id, f.isActive)}
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                                        >
                                            {f.isActive ? <><UserX size={14} /> Disable</> : <><UserCheck size={14} /> Enable</>}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default FacultyManagementPage;
