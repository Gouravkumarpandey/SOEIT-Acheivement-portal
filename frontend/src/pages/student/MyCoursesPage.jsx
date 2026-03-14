import { useState, useEffect } from 'react';
import { courseAPI } from '../../services/api';
import { Plus, Trash2, BookOpen, Clock, CheckCircle2, Book, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

const MyCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [assignedCourses, setAssignedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCourse, setNewCourse] = useState({ courseName: '', platform: '', customPlatform: '', progress: 0 });

    const loadData = async () => {
        setLoading(true);
        try {
            const [myRes, assignedRes] = await Promise.all([
                courseAPI.getMy(),
                courseAPI.getMyAssignments()
            ]);
            setCourses(myRes.data.data);
            setAssignedCourses(assignedRes.data.data);
        } catch {
            toast.error('Failed to load course registry');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAddCourse = async (e) => {
        e.preventDefault();
        try {
            const { customPlatform, ...rest } = newCourse;
            const finalPlatform = newCourse.platform === 'Other' ? customPlatform : newCourse.platform;

            if (!finalPlatform) {
                toast.error('Please specify the platform');
                return;
            }

            await courseAPI.add({ ...rest, platform: finalPlatform });
            toast.success('Course initialized in institutional registry');
            setShowAddModal(false);
            setNewCourse({ courseName: '', platform: '', customPlatform: '', progress: 0 });
            loadData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Initialization failed');
        }
    };

    const handleUpdateProgress = async (id, currentProgress) => {
        const nextProgress = Math.min(100, currentProgress + 10);
        const status = nextProgress === 100 ? 'Completed' : 'Ongoing';
        try {
            await courseAPI.updateProgress(id, { progress: nextProgress, status });
            toast.success(`Progress synchronized: ${nextProgress}%`);
            loadData();
        } catch {
            toast.error('Progress synchronization failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to purge this course record?')) return;
        try {
            await courseAPI.delete(id);
            toast.success('Record purged from registry');
            loadData();
        } catch {
            toast.error('Purge operation failed');
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="page-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 className="heading-display">My Courses</h2>
                    <p className="page-subtitle">Check assigned courses and track your added course progress.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)} style={{ borderRadius: '12px', padding: '0.75rem 1.5rem' }}>
                    <Plus size={18} />
                    <span>Add New Course</span>
                </button>
            </div>

            {/* Assigned by Faculty Section */}
            {assignedCourses.length > 0 && (
                <div style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <GraduationCap size={24} style={{ color: 'var(--brand-600)' }} />
                        <h3 style={{ fontWeight: 900, letterSpacing: '-0.02em' }}>Courses Assigned to You</h3>
                        <span className="badge badge-brand" style={{ borderRadius: '6px' }}>{assignedCourses.length} Assigned</span>
                    </div>
                    <div className="grid-res grid-res-2" style={{ gap: '1.5rem' }}>
                        {assignedCourses.map(ass => (
                            <div key={ass.id} className="card" style={{ borderRadius: '24px', border: '2px solid var(--brand-100)', background: 'linear-gradient(to bottom right, #ffffff, var(--brand-50))' }}>
                                <div className="card-body" style={{ padding: '2rem' }}>
                                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                                        <div style={{ width: 56, height: 56, background: 'var(--brand-600)', color: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Book size={28} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <h4 style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--brand-700)', marginBottom: '0.25rem' }}>{ass.course_name}</h4>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{ass.subject}</div>
                                                </div>
                                                <span className="badge badge-success" style={{ borderRadius: '6px', fontSize: '0.7rem' }}>REQUIRED</span>
                                            </div>
                                            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{ass.description || 'No additional details provided.'}</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--brand-200)', color: 'var(--brand-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.75rem' }}>
                                                    {ass.faculty_name.charAt(0)}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>Assigned by: <span style={{ color: 'var(--brand-600)' }}>{ass.faculty_name}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <BookOpen size={24} style={{ color: 'var(--text-primary)' }} />
                <h3 style={{ fontWeight: 900, letterSpacing: '-0.02em' }}>My Added Courses</h3>
            </div>

            {loading ? (
                <div className="grid-res grid-res-3">
                    {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 200, borderRadius: '20px' }} />)}
                </div>
            ) : courses.length === 0 ? (
                <div className="card" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                    <BookOpen size={64} style={{ opacity: 0.1, margin: '0 auto 1.5rem auto' }} />
                    <h3 style={{ fontWeight: 800 }}>No courses added yet</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Start adding your learning journey here.</p>
                </div>
            ) : (
                <div className="grid-res grid-res-3" style={{ gap: '1.5rem' }}>
                    {courses.map(course => (
                        <div key={course.id} className="card course-card animate-scale-in" style={{ padding: '1.5rem', border: '1px solid var(--border-primary)', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                <div style={{ width: 44, height: 44, background: 'var(--primary-50)', color: 'var(--brand-700)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <BookOpen size={22} />
                                </div>
                                <button className="btn btn-ghost btn-sm text-danger" onClick={() => handleDelete(course.id)} style={{ padding: '0.5rem' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{course.course_name}</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '1.5rem' }}>{course.platform}</p>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>PROGRESS</span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--brand-700)' }}>{course.progress}%</span>
                                </div>
                                <div style={{ height: '8px', background: 'var(--slate-100)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: `${course.progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--brand-500), var(--brand-700))', transition: 'width 0.5s ease' }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button
                                    className="btn btn-ghost w-full"
                                    style={{ fontSize: '0.8rem', fontWeight: 800, padding: '0.75rem', background: 'var(--slate-50)' }}
                                    onClick={() => handleUpdateProgress(course.id, course.progress)}
                                    disabled={course.progress >= 100}
                                >
                                    <Clock size={16} />
                                    <span>Inc. Progress</span>
                                </button>
                                {course.progress === 100 && (
                                    <div style={{ padding: '0.75rem', background: 'var(--success-50)', color: 'var(--success-700)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }}>
                                        <CheckCircle2 size={16} />
                                        <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>COMPLETED</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showAddModal && (
                <div className="modal-overlay animate-fade-in" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                    <div className="card animate-scale-in" style={{ width: '100%', maxWidth: '450px', padding: '2rem' }}>
                        <h3 style={{ margin: '0 0 1.5rem 0', fontWeight: 900 }}>Add New Course</h3>
                        <form onSubmit={handleAddCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem' }}>COURSE NAME</label>
                                <input
                                    className="form-control"
                                    placeholder="Enter Course name"
                                    required
                                    value={newCourse.courseName}
                                    onChange={e => setNewCourse({ ...newCourse, courseName: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem' }}>PLATFORM</label>
                                <select
                                    className="form-control"
                                    required
                                    value={newCourse.platform}
                                    onChange={e => setNewCourse({ ...newCourse, platform: e.target.value })}
                                >
                                    <option value="">Select Platform</option>
                                    <option value="Coursera">Coursera</option>
                                    <option value="NPTEL">NPTEL</option>
                                    <option value="Udemy">Udemy</option>
                                    <option value="LinkedIn Learning">LinkedIn Learning</option>
                                    <option value="Internshala">Internshala</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {newCourse.platform === 'Other' && (
                                <div className="form-group animate-fade-in">
                                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.75rem' }}>SPECIFY PLATFORM</label>
                                    <input
                                        className="form-control"
                                        placeholder="e.g. edX, Pluralsight, etc."
                                        required
                                        value={newCourse.customPlatform}
                                        onChange={e => setNewCourse({ ...newCourse, customPlatform: e.target.value })}
                                    />
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" className="btn btn-ghost w-full" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary w-full">Add Course</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyCoursesPage;
