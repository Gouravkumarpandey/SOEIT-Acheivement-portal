import '../../styles/ForgotPasswordPage.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { GraduationCap, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) { setError('Email is required'); return; }
        setLoading(true);
        try {
            await authAPI.forgotPassword(email);
            setSent(true);
            toast.success('Password reset instructions sent!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: '1rem', position: 'relative' }}>
            <div style={{ width: '100%', maxWidth: '440px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2>Forgot Password?</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Enter your email and we'll send reset instructions</p>
                </div>

                <div className="card card-body">
                    {sent ? (
                        <div style={{ textAlign: 'center', padding: '1rem' }}>
                            <div style={{ width: 64, height: 64, background: 'rgba(34,197,94,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                <CheckCircle size={32} color="var(--success-500)" />
                            </div>
                            <h3 style={{ color: 'var(--success-500)', marginBottom: '0.75rem' }}>Check Your Email</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                                We've sent password reset instructions to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
                            </p>
                            <Link to="/login" className="btn btn-primary w-full" style={{ justifyContent: 'center' }}>Back to Login</Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label required">Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input type="email" className={`form-control ${error ? 'error' : ''}`} style={{ paddingLeft: '2.5rem' }} placeholder="your@email.com" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} />
                                </div>
                                {error && <div className="input-error">{error}</div>}
                            </div>
                            <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ padding: '0.75rem' }}>
                                {loading ? <><div className="spinner spinner-sm" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Sending...</> : 'Send Reset Link'}
                            </button>
                            <Link to="/login" className="btn btn-secondary w-full" style={{ marginTop: '0.75rem', justifyContent: 'center' }}>
                                <ArrowLeft size={16} /> Back to Login
                            </Link>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
