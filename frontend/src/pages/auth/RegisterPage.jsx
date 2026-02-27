import '../../styles/RegisterPage.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, BookOpen, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const UniversityHeader = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#303657', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', fontWeight: 800, flexShrink: 0, boxShadow: '0 4px 12px rgba(48,54,87,0.2)' }}>JGi</div>
        <div style={{ height: '60px', width: '2px', background: '#8B1E1E' }} className="hidden md:block" />
        <div style={{ textAlign: 'left', minWidth: '180px' }}>
            <div style={{ fontWeight: 800, fontSize: '1.4rem', lineHeight: 1.1 }}>
                <span style={{ color: '#8B1E1E' }}>ARKA JAIN</span><br />
                <span style={{ color: '#303657' }}>UNIVERSITY</span>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '4px' }}>Jharkhand</div>
        </div>
        <div style={{ background: '#8B1E1E', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '0.35rem 0.75rem', borderRadius: '4px', alignSelf: 'center', whiteSpace: 'nowrap' }}>NAAC GRADE A</div>
    </div>
);

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

    const Field = ({ name, type = 'text', placeholder, required, icon: Icon, children }) => (
        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            {children || (
                <div style={{ position: 'relative' }}>
                    <input
                        type={type}
                        className={`form-control ${errors[name] ? 'error' : ''}`}
                        style={{ padding: '0.875rem 1rem', background: '#f8fafc', border: 'none', height: 'auto' }}
                        placeholder={placeholder + (required ? ' *' : '')}
                        value={form[name]}
                        onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
                    />
                </div>
            )}
            {errors[name] && <div className="input-error">{errors[name]}</div>}
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fcfcfc', padding: '2rem 1.5rem', position: 'relative' }}>
            {/* Top Left Back Button */}
            <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
                <Link to="/" className="btn btn-secondary btn-sm" style={{ fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}>
                    <ArrowLeft size={14} /> Back to Home
                </Link>
            </div>

            <div style={{ width: '100%', maxWidth: '650px' }}>
                <UniversityHeader />

                <h1 style={{ textAlign: 'center', color: '#303657', fontSize: '2.25rem', fontWeight: 800, marginBottom: '2.5rem', fontFamily: 'Space Grotesk' }}>
                    Student Registration
                </h1>

                <div className="card card-body" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: 'none', borderRadius: 'var(--radius-xl)' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.25rem' }}>
                            <Field name="name" placeholder="Full Name" required />
                            <Field name="enrollmentNo" placeholder="Enrollment No. (e.g. AJU/221403)" />
                        </div>

                        <Field name="email" type="email" placeholder="Email Address" required />

                        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                            <select
                                className={`form-control ${errors.department ? 'error' : ''}`}
                                style={{ padding: '0.875rem 1rem', background: '#f8fafc', border: 'none', height: 'auto' }}
                                value={form.department}
                                onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
                            >
                                <option value="">Select Department *</option>
                                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            {errors.department && <div className="input-error">{errors.department}</div>}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.25rem' }}>
                            <Field name="batch" placeholder="Batch Year" />
                            <Field name="semester" placeholder="Current Semester" />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.25rem' }}>
                            <div className="form-group">
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className={`form-control ${errors.password ? 'error' : ''}`}
                                        style={{ padding: '0.875rem 2.5rem 0.875rem 1rem', background: '#f8fafc', border: 'none', height: 'auto' }}
                                        placeholder="Password *"
                                        value={form.password}
                                        onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.password && <div className="input-error">{errors.password}</div>}
                            </div>

                            <div className="form-group">
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                                        style={{ padding: '0.875rem 2.5rem 0.875rem 1rem', background: '#f8fafc', border: 'none', height: 'auto' }}
                                        placeholder="Confirm Password *"
                                        value={form.confirmPassword}
                                        onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                                    />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <div className="input-error">{errors.confirmPassword}</div>}
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ padding: '1rem', fontWeight: 700, marginTop: '1rem' }}>
                            {loading ? 'Creating account...' : 'CREATE ACCOUNT'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#64748b', marginTop: '1.5rem' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#303657', fontWeight: 700 }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
