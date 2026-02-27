import '../../styles/UploadAchievementPage.css';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { achievementAPI } from '../../services/api';
import { Upload, X, File, Image, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Academic', 'Sports', 'Cultural', 'Technical', 'Research', 'Internship', 'Certification', 'Competition', 'Community Service', 'Other'];
const LEVELS = ['International', 'National', 'State', 'University', 'College', 'Department'];
const POINTS_MAP = { International: 100, National: 75, State: 50, University: 30, College: 20, Department: 10 };

const UploadAchievementPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ title: '', category: '', description: '', level: '', date: '', institution: '', tags: '', isPublic: true });
    const [files, setFiles] = useState([]);
    const [dragging, setDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!form.title.trim()) e.title = 'Title is required';
        if (!form.category) e.category = 'Category is required';
        if (!form.description.trim()) e.description = 'Description is required';
        if (!form.level) e.level = 'Level is required';
        if (!form.date) e.date = 'Date is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleFileDrop = useCallback((e) => {
        e.preventDefault();
        setDragging(false);
        const dropped = Array.from(e.dataTransfer?.files || e.target.files || []);
        const valid = dropped.filter(f => f.size <= 5 * 1024 * 1024);
        const invalid = dropped.filter(f => f.size > 5 * 1024 * 1024);
        if (invalid.length) toast.error(`${invalid.length} file(s) exceed 5MB limit`);
        setFiles(prev => [...prev, ...valid].slice(0, 5));
    }, []);

    const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setProgress(0);

        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        files.forEach(f => fd.append('proofFiles', f));

        // Simulate progress
        const interval = setInterval(() => setProgress(prev => Math.min(prev + 15, 90)), 300);

        try {
            await achievementAPI.create(fd);
            clearInterval(interval);
            setProgress(100);
            toast.success('Achievement submitted successfully! Awaiting verification 🎉');
            setTimeout(() => navigate('/achievements'), 500);
        } catch (err) {
            clearInterval(interval);
            setProgress(0);
            toast.error(err.response?.data?.message || 'Submission failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '0.25rem' }}>Upload Achievement</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Submit your achievement for faculty verification. Approved achievements earn points and appear in your portfolio.</p>
            </div>

            {/* Points Preview */}
            {form.level && (
                <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
                    <CheckCircle size={18} />
                    <div>
                        <strong>{form.level} level achievement</strong> — You'll earn <strong>{POINTS_MAP[form.level]} points</strong> upon approval!
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="card card-body" style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1.25rem', color: 'var(--primary-400)' }}>Achievement Details</h4>

                    <div className="form-group">
                        <label className="form-label required">Achievement Title</label>
                        <input className={`form-control ${errors.title ? 'error' : ''}`} placeholder="e.g. First Prize at National Hackathon 2024" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
                        {errors.title && <div className="input-error"><AlertCircle size={12} />{errors.title}</div>}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label required">Category</label>
                            <select className={`form-control ${errors.category ? 'error' : ''}`} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                                <option value="">Select Category</option>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            {errors.category && <div className="input-error"><AlertCircle size={12} />{errors.category}</div>}
                        </div>

                        <div className="form-group">
                            <label className="form-label required">Achievement Level</label>
                            <select className={`form-control ${errors.level ? 'error' : ''}`} value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))}>
                                <option value="">Select Level</option>
                                {LEVELS.map(l => <option key={l} value={l}>{l} ({POINTS_MAP[l]} pts)</option>)}
                            </select>
                            {errors.level && <div className="input-error"><AlertCircle size={12} />{errors.level}</div>}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label required">Date of Achievement</label>
                            <input type="date" className={`form-control ${errors.date ? 'error' : ''}`} value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} max={new Date().toISOString().split('T')[0]} />
                            {errors.date && <div className="input-error"><AlertCircle size={12} />{errors.date}</div>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Organizing Institution</label>
                            <input className="form-control" placeholder="e.g. IIT Bombay, NASSCOM" value={form.institution} onChange={e => setForm(p => ({ ...p, institution: e.target.value }))} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label required">Description</label>
                        <textarea className={`form-control ${errors.description ? 'error' : ''}`} rows={4} placeholder="Describe your achievement, what you accomplished, your role, and the impact..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                        {errors.description && <div className="input-error"><AlertCircle size={12} />{errors.description}</div>}
                        <div className="input-hint">{form.description.length}/2000 characters</div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Tags</label>
                        <input className="form-control" placeholder="e.g. hackathon, coding, teamwork (comma separated)" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} />
                        <div className="input-hint">Tags help categorize your achievement</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
                        <input type="checkbox" id="isPublic" checked={form.isPublic} onChange={e => setForm(p => ({ ...p, isPublic: e.target.checked }))} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--primary-500)' }} />
                        <label htmlFor="isPublic" style={{ cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            Show in public portfolio (visible to recruiters and visitors)
                        </label>
                    </div>
                </div>

                {/* File Upload */}
                <div className="card card-body" style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1.25rem', color: 'var(--primary-400)' }}>Proof Documents</h4>
                    <div
                        className={`file-upload-zone ${dragging ? 'drag-over' : ''}`}
                        onDragOver={e => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleFileDrop}
                        onClick={() => document.getElementById('fileInput').click()}
                    >
                        <Upload size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem', display: 'block' }} />
                        <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Drop files here or click to browse</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>JPG, PNG, PDF, DOC up to 5MB each • Max 5 files</p>
                        <input id="fileInput" type="file" multiple accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" style={{ display: 'none' }} onChange={handleFileDrop} />
                    </div>

                    {files.length > 0 && (
                        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {files.map((f, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
                                    {f.type.startsWith('image') ? <Image size={18} style={{ color: 'var(--primary-400)', flexShrink: 0 }} /> : <File size={18} style={{ color: 'var(--accent-400)', flexShrink: 0 }} />}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{(f.size / 1024).toFixed(1)} KB</div>
                                    </div>
                                    <button type="button" className="btn btn-icon" onClick={() => removeFile(i)} style={{ color: 'var(--error-500)', background: 'rgba(239,68,68,0.1)', flexShrink: 0 }}>
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                {loading && (
                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Uploading...</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--primary-400)' }}>{progress}%</span>
                        </div>
                        <div className="progress-bar-wrapper">
                            <div className="progress-bar" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/achievements')} disabled={loading}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
                        {loading ? <><div className="spinner spinner-sm" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Submitting...</> : <><Upload size={16} /> Submit Achievement</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UploadAchievementPage;
