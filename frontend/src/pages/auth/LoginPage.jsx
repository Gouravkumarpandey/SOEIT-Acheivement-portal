import '../../styles/LoginPage.css';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || null;

    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!form.email) e.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
        if (!form.password) e.password = 'Password is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const data = await login(form);
            toast.success(data.message || 'Welcome back!');
            const redirect = from || (data.user.role === 'student' ? '/dashboard' : '/admin/dashboard');
            navigate(redirect, { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at 30% 40%, rgba(59,130,246,0.12) 0%, transparent 60%), var(--bg-primary)', padding: '1rem', position: 'relative' }}>
            {/* Top Left Back Button */}
            <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
                <Link to="/" className="btn btn-secondary btn-sm" style={{ fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}>
                    <ArrowLeft size={14} /> Back to Home
                </Link>
            </div>

            <div style={{ width: '100%', maxWidth: '440px' }}>
                {/* Logo removed from here to top-left */}


                <div className="card card-body" style={{ boxShadow: 'var(--shadow-xl)' }}>
                    <h2 style={{ marginBottom: '0.375rem', textAlign: 'center' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem', marginBottom: '2rem' }}>Sign in to your account to continue</p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label required">Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? 'error' : ''}`}
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="your@email.com"
                                    value={form.email}
                                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                    autoComplete="email"
                                />
                            </div>
                            {errors.email && <div className="input-error">{errors.email}</div>}
                        </div>

                        <div className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label className="form-label" style={{ margin: 0 }}>Password</label>
                                <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--primary-400)' }}>Forgot password?</Link>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={`form-control ${errors.password ? 'error' : ''}`}
                                    style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                    autoComplete="current-password"
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

                        <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ marginTop: '0.5rem', padding: '0.75rem' }}>
                            {loading ? <><div className="spinner spinner-sm" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Signing in...</> : <><LogIn size={16} /> Sign In</>}
                        </button>
                    </form>

                    <div className="divider" style={{ margin: '1.5rem 0' }}>
                        <div style={{ position: 'relative', textAlign: 'center' }}>
                            <span style={{ background: 'var(--bg-secondary)', padding: '0 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', position: 'relative', zIndex: 1 }}>or</span>
                        </div>
                    </div>

                    <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: 'var(--primary-400)', fontWeight: 600 }}>Create one</Link>
                    </p>
                </div>

                <div className="alert alert-info" style={{ marginTop: '1rem', fontSize: '0.8rem' }}>
                    <strong>Demo Accounts:</strong> Student: student@soeit.ac.in / Test@123 | Admin: admin@soeit.ac.in / Admin@123
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
