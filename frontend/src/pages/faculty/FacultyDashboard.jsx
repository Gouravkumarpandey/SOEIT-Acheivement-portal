import { useState, useEffect } from 'react';
import { adminAPI, noticeAPI } from '../../services/api';
import {
    Users, Trophy, Clock, CheckCircle, GraduationCap,
    Search, Filter, ChevronRight, Eye, Download, UsersRound
} from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const FacultyDashboard = () => {
    const [stats, setStats] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [semester, setSemester] = useState('all');
    const [section, setSection] = useState('all');
    const [search, setSearch] = useState('');
    const [showNoticeModal, setShowNoticeModal] = useState(false);
    const [noticeData, setNoticeData] = useState({ title: '', content: '', priority: 'Medium' });

    useEffect(() => {
        const loadStats = async () => {
            try {
                const res = await adminAPI.getDashboard();
                setStats(res.data);
            } catch {
                toast.error('Failed to load portal stats');
            }
        };
        loadStats();
    }, []);

    useEffect(() => {
        const loadStudents = async () => {
            setLoading(true);
            try {
                const params = {
                    semester: semester === 'all' ? undefined : semester,
                    section: section === 'all' ? undefined : section,
                    search: search || undefined,
                    limit: 100
                };
                const res = await adminAPI.getStudents(params);
                setStudents(res.data.data);
            } catch {
                toast.error('Failed to load student list');
            } finally {
                setLoading(false);
            }
        };
        loadStudents();
    }, [semester, section, search]);

    const exportToPDF = () => {
        if (students.length === 0) {
            toast.error('No data available to export');
            return;
        }

        const doc = new jsPDF();
        const timestamp = new Date().toLocaleString();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(48, 54, 87); // #303657
        doc.text('ARKA JAIN UNIVERSITY', 105, 20, { align: 'center' });

        doc.setFontSize(14);
        doc.setTextColor(139, 30, 30); // #8B1E1E
        doc.text('SOEIT Student Achievement Report', 105, 30, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139); // #64748b
        doc.text(`Generated on: ${timestamp}`, 105, 38, { align: 'center' });

        // Filters Info
        doc.setDrawColor(226, 232, 240);
        doc.line(20, 45, 190, 45);
        doc.setFontSize(11);
        doc.setTextColor(48, 54, 87);
        doc.text(`Semester: ${semester === 'all' ? 'All' : semester}`, 20, 52);
        doc.text(`Section: ${section === 'all' ? 'All' : section}`, 70, 52);
        doc.text(`Department: CSE`, 120, 52); // Example Dept

        // Table
        const tableData = students.map((s, i) => [
            i + 1,
            s.name,
            s.enrollmentNo || 'N/A',
            `Sem ${s.semester || 'N/A'} - ${s.section || 'N/A'}`,
            s.achievementCounts?.total || 0,
            s.achievementCounts?.approved || 0,
            s.achievementCounts?.points || 0
        ]);

        doc.autoTable({
            startY: 60,
            head: [['#', 'Student Name', 'Enrollment No.', 'Academic Info', 'Total', 'Valid', 'Points']],
            body: tableData,
            headStyles: { fillColor: [48, 54, 87], textColor: [255, 255, 255], fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            styles: { fontSize: 9, cellPadding: 3 },
            margin: { left: 15, right: 15 }
        });

        const filename = `SOEIT_Report_Sem${semester}_Sec${section}_${new Date().getTime()}.pdf`;
        doc.save(filename);
        toast.success('Report exported successfully');
    };

    const handlePostNotice = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Posting notice and notifying students...');
        try {
            await noticeAPI.create(noticeData);
            toast.success('Notice posted successfully!', { id: toastId });
            setShowNoticeModal(false);
            setNoticeData({ title: '', content: '', priority: 'Medium' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to post notice', { id: toastId });
        }
    };

    const statCards = [
        { label: 'Total Students', value: stats?.stats?.totalStudents ?? 0, icon: Users, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
        { label: 'Pending Review', value: stats?.stats?.pendingCount ?? 0, icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
        { label: 'Verified', value: stats?.stats?.approvedCount ?? 0, icon: CheckCircle, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
        { label: 'Achievements', value: stats?.stats?.totalAchievements ?? 0, icon: Trophy, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    ];

    const semesters = [
        { id: '1', label: '1st Semester' },
        { id: '2', label: '2nd Semester' },
        { id: '3', label: '3rd Semester' },
        { id: '4', label: '4th Semester' },
        { id: '5', label: '5th Semester' },
        { id: '6', label: '6th Semester' },
        { id: '7', label: '7th Semester' },
        { id: '8', label: '8th Semester' },
    ];

    return (
        <div style={{ padding: '2rem', animation: 'fadeIn 0.5s ease' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#303657', marginBottom: '0.5rem' }}>Faculty Control Center</h1>
                    <p style={{ color: '#64748b' }}>Comprehensive student achievement monitoring & academic oversight</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        className="btn btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        onClick={exportToPDF}
                    >
                        <Download size={18} /> Export Results
                    </button>
                    <button
                        className="btn btn-primary"
                        style={{ background: '#8B1E1E', border: 'none' }}
                        onClick={() => setShowNoticeModal(true)}
                    >
                        Post Notice
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {statCards.map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} style={{ background: '#fff', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                            <div style={{ width: 48, height: 48, background: bg, borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon size={24} color={color} />
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>LIVE</span>
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#303657', marginBottom: '0.25rem' }}>{value}</div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>{label}</div>
                    </div>
                ))}
            </div>

            {/* Academic Sections */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#303657', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <GraduationCap size={22} color="#8B1E1E" /> Academic Progress Tracking
                </h3>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    <button
                        onClick={() => { setSemester('all'); setSection('all'); }}
                        style={{
                            padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)',
                            background: semester === 'all' ? '#303657' : '#fff',
                            color: semester === 'all' ? '#fff' : '#64748b',
                            border: '1px solid ' + (semester === 'all' ? '#303657' : '#e2e8f0'),
                            fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        All Semesters
                    </button>
                    {semesters.map(sem => (
                        <button
                            key={sem.id}
                            onClick={() => { setSemester(sem.id); setSection('all'); }}
                            style={{
                                padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)',
                                background: semester === sem.id ? '#303657' : '#fff',
                                color: semester === sem.id ? '#fff' : '#64748b',
                                border: '1px solid ' + (semester === sem.id ? '#303657' : '#e2e8f0'),
                                fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            {sem.label}
                        </button>
                    ))}
                </div>

                {/* Section Selection - Dynamic based on semester */}
                {semester !== 'all' && (
                    <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '2rem', animation: 'fadeIn 0.3s ease' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Filter by Section:</span>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <button
                                    onClick={() => setSection('all')}
                                    style={{
                                        padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem',
                                        background: section === 'all' ? '#8B1E1E' : '#fff',
                                        color: section === 'all' ? '#fff' : '#64748b',
                                        border: '1px solid ' + (section === 'all' ? '#8B1E1E' : '#e2e8f0'),
                                        fontWeight: 600, cursor: 'pointer'
                                    }}
                                >
                                    All
                                </button>
                                {(semester === '1' || semester === '2' ? ['A', 'B', 'C', 'D', 'E', 'F', 'G'] : ['A', 'B', 'C', 'D', 'E', 'F']).map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setSection(s)}
                                        style={{
                                            padding: '0.5rem 1.25rem', borderRadius: '0.5rem', fontSize: '0.85rem',
                                            background: section === s ? '#8B1E1E' : '#fff',
                                            color: section === s ? '#fff' : '#64748b',
                                            border: '1px solid ' + (section === s ? '#8B1E1E' : '#e2e8f0'),
                                            fontWeight: 700, cursor: 'pointer'
                                        }}
                                    >
                                        Section {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Student List Section */}
            <div style={{ background: '#fff', borderRadius: '1.25rem', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontWeight: 800, color: '#303657', fontSize: '1.1rem' }}>
                        Student Directory — {semester === 'all' ? 'All Years' : `Semester ${semester}`} {section !== 'all' ? `(Section ${section})` : '(All Sections)'}
                    </h4>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="Search by Name or Enrollment..."
                            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '0.9rem' }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>Student Details</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>Academic Info</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>Achievements</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>Points</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}><td colSpan="5" style={{ padding: '1.5rem' }}><div className="skeleton" style={{ height: '40px', width: '100%' }} /></td></tr>
                                ))
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                                        <UsersRound size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                                        <p>No students found for this criteria.</p>
                                    </td>
                                </tr>
                            ) : students.map(student => (
                                <tr key={student._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} className="hover:bg-slate-50">
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#303657', fontSize: '0.9rem' }}>
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, color: '#303657', fontSize: '0.95rem' }}>{student.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{student.enrollmentNo || student.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{student.department}</span>
                                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Semester {student.semester || 'N/A'} • {student.batch}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#303657' }}>{student.achievementCounts?.total || 0}</div>
                                                <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase' }}>Total</div>
                                            </div>
                                            <div style={{ width: '1px', background: '#e2e8f0', margin: '0 0.5rem' }} />
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#22c55e' }}>{student.achievementCounts?.approved || 0}</div>
                                                <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase' }}>Valid</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#8b5cf6' }}>
                                            {student.achievementCounts?.points || 0}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                        <button className="btn btn-icon btn-secondary" style={{ padding: '0.5rem' }} title="View Details">
                                            <Eye size={18} />
                                        </button>
                                        <button className="btn btn-icon btn-secondary" style={{ padding: '0.5rem', marginLeft: '0.5rem' }}>
                                            <ChevronRight size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Post Notice Modal */}
            {showNoticeModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px', animation: 'slideUp 0.3s ease' }}>
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#303657', color: 'white' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Post Official Notice</h3>
                            <button onClick={() => setShowNoticeModal(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                        </div>
                        <div className="card-body" style={{ padding: '1.5rem' }}>
                            <form onSubmit={handlePostNotice} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 700 }}>Notice Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        required
                                        placeholder="e.g. Schedule Change for Mid-Sem Exams"
                                        value={noticeData.title}
                                        onChange={e => setNoticeData({ ...noticeData, title: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 700 }}>Priority Level</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {['Low', 'Medium', 'High', 'Urgent'].map(p => (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() => setNoticeData({ ...noticeData, priority: p })}
                                                style={{
                                                    flex: 1, padding: '0.5rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 600,
                                                    background: noticeData.priority === p ? (p === 'Urgent' ? '#ef4444' : '#303657') : '#f1f5f9',
                                                    color: noticeData.priority === p ? 'white' : '#64748b',
                                                    border: 'none', cursor: 'pointer', transition: 'all 0.2s'
                                                }}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 700 }}>Notice Content</label>
                                    <textarea
                                        className="form-control"
                                        rows="6"
                                        required
                                        placeholder="Type the detailed notice here..."
                                        style={{ resize: 'none' }}
                                        value={noticeData.content}
                                        onChange={e => setNoticeData({ ...noticeData, content: e.target.value })}
                                    ></textarea>
                                </div>
                                <div style={{ background: '#fef2f2', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #fee2e2' }}>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#991b1b', fontWeight: 600 }}>
                                        ⚠️ This notice will be sent to ALL active students via email instantly.
                                    </p>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ background: '#8B1E1E', border: 'none', padding: '1rem', fontWeight: 700 }}>
                                    Broadcast Notice & Send Emails
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacultyDashboard;
