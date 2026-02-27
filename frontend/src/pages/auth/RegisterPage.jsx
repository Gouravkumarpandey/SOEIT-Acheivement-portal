import '../../styles/RegisterPage.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, User, Mail, Lock, Eye, EyeOff, UserPlus, BookOpen, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const DEPARTMENTS = ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE', 'Other'];

const RegisterPage = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', department: '', studentId: '', batch: '', semester: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!form.email) e.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
        if (!form.password) e.password = 'Password is required';
        else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
        if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
        if (!form.department) e.department = 'Department is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const { confirmPassword, ...data } = form;
            await register(data);
            toast.success('Registration successful! Welcome aboard 🎉');
            navigate('/dashboard', { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const Field = ({ label, name, type = 'text', placeholder, required, icon: Icon, children }) => (
        <div className="form-group">
            <label className={`form-label ${required ? 'required' : ''}`}>{label}</label>
            {children || (
                <div style={{ position: 'relative' }}>
                    {Icon && <Icon size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }} />}
                    <input
                        type={type}
                        className={`form-control ${errors[name] ? 'error' : ''}`}
                        style={Icon ? { paddingLeft: '2.5rem' } : {}}
                        placeholder={placeholder}
                        value={form[name]}
                        onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
                    />
                </div>
            )}
            {errors[name] && <div className="input-error">{errors[name]}</div>}
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at 70% 30%, rgba(99,102,241,0.1) 0%, transparent 60%), var(--bg-primary)', padding: '2rem 1rem', position: 'relative' }}>
            {/* Top Left Back Button */}
            <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
                <Link to="/" className="btn btn-secondary btn-sm" style={{ fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}>
                    <ArrowLeft size={14} /> Back to Home
                </Link>
            </div>

            <div style={{ width: '100%', maxWidth: '520px' }}>
                {/* Logo removed from here to top-left */}


                <div className="card card-body" style={{ boxShadow: 'var(--shadow-xl)' }}>
                    <h2 style={{ marginBottom: '0.375rem', textAlign: 'center' }}>Create Account</h2>
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem', marginBottom: '2rem' }}>Register as a SOEIT student</p>

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                            <Field label="Full Name" name="name" placeholder="Your full name" required icon={User} />
                            <Field label="Student ID" name="studentId" placeholder="e.g. 21CSE001" icon={BookOpen} />
                        </div>

                        <Field label="Email Address" name="email" type="email" placeholder="your@email.com" required icon={Mail} />

                        <Field label="Department" name="department" required>
                            <div>
                                <select className={`form-control ${errors.department ? 'error' : ''}`} value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))}>
                                    <option value="">Select Department</option>
                                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                        </Field>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                            <Field label="Batch Year" name="batch" placeholder="e.g. 2021" />
                            <Field label="Semester" name="semester" placeholder="e.g. 5" />
                        </div>

                        <div className="form-group">
                            <label className="form-label required">Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={`form-control ${errors.password ? 'error' : ''}`}
                                    style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
                                    placeholder="Min. 6 characters"
                                    value={form.password}
                                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '0.875rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        zIndex: 10
                                    }}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && <div className="input-error">{errors.password}</div>}
                        </div>

                        <div className="form-group">
                            <label className="form-label required">Confirm Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                                    style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
                                    placeholder="Re-enter password"
                                    value={form.confirmPassword}
                                    onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '0.875rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        zIndex: 10
                                    }}
                                >
                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.confirmPassword && <div className="input-error">{errors.confirmPassword}</div>}
                        </div>

                        <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ padding: '0.75rem' }}>
                            {loading ? <><div className="spinner spinner-sm" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Creating account...</> : <><UserPlus size={16} /> Create Account</>}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--primary-400)', fontWeight: 600 }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
