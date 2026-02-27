import '../../styles/LoginPage.css';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, RefreshCw, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const UniversityHeader = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
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

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || null;

    const [form, setForm] = useState({ email: '', password: '', captchaInput: '' });
    const [captcha, setCaptcha] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const generateCaptcha = () => {
        const char = '1234567890';
        let res = '';
        for (let i = 0; i < 4; i++) res += char.charAt(Math.floor(Math.random() * char.length));
        setCaptcha(res);
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const validate = () => {
        const e = {};
        if (!form.email) e.email = 'Email/Username is required';
        if (!form.password) e.password = 'Password is required';
        if (form.captchaInput !== captcha) e.captchaInput = 'Invalid Captcha';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const data = await login({ email: form.email, password: form.password });
            toast.success(data.message || 'Welcome back!');
            const redirect = from || (data.user.role === 'student' ? '/dashboard' : '/admin/dashboard');
            navigate(redirect, { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
            generateCaptcha();
            setForm(p => ({ ...p, captchaInput: '' }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fcfcfc', padding: '1.5rem', position: 'relative' }}>
            {/* Top Left Back Button */}
            <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
                <Link to="/" className="btn btn-secondary btn-sm" style={{ fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}>
                    <ArrowLeft size={14} /> Back to Home
                </Link>
            </div>

            <div style={{ width: '100%', maxWidth: '440px' }}>
                <UniversityHeader />

                <div className="card card-body" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: 'none', borderRadius: 'var(--radius-xl)' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? 'error' : ''}`}
                                    style={{ padding: '1rem 1.25rem', height: 'auto', background: '#f8fafc', border: 'none' }}
                                    placeholder="Username"
                                    value={form.email}
                                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                />
                            </div>
                            {errors.email && <div className="input-error">{errors.email}</div>}
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={`form-control ${errors.password ? 'error' : ''}`}
                                    style={{ padding: '1rem 3rem 1rem 1.25rem', height: 'auto', background: '#f8fafc', border: 'none' }}
                                    placeholder="Password"
                                    value={form.password}
                                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '1rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: '#64748b',
                                        cursor: 'pointer',
                                        display: 'flex'
                                    }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <div className="input-error">{errors.password}</div>}
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                                <input
                                    type="text"
                                    className={`form-control ${errors.captchaInput ? 'error' : ''}`}
                                    style={{ padding: '1rem 1.25rem', height: 'auto', background: '#f8fafc', border: 'none' }}
                                    placeholder="Enter Captcha"
                                    value={form.captchaInput}
                                    onChange={e => setForm(p => ({ ...p, captchaInput: e.target.value }))}
                                />
                                {errors.captchaInput && <div className="input-error">{errors.captchaInput}</div>}
                            </div>
                            <div className="captcha-box">
                                {captcha}
                            </div>
                            <button type="button" onClick={generateCaptcha} className="btn-icon btn-secondary" style={{ padding: '0.9rem', borderRadius: 'var(--radius-sm)' }}>
                                <RefreshCw size={18} />
                            </button>
                        </div>

                        <button type="submit" className="btn btn-arka-jain" disabled={loading} style={{ marginTop: '0.5rem' }}>
                            {loading ? 'Logging in...' : 'LOGIN'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#64748b', marginTop: '2.5rem' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: '#303657', fontWeight: 700 }}>Create User</Link>
                    </p>
                </div>

                <div className="alert alert-info" style={{ marginTop: '1.5rem', fontSize: '0.8rem', background: '#f1f5f9', border: 'none', color: '#475569' }}>
                    <strong>Demo Accounts:</strong> AJU/221403 / Test@123 | AJU/ADMIN / Admin@123
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
