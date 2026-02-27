import '../../styles/AdminSettingsPage.css';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import { Settings, User, Key, Shield, Bell, Save, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSettingsPage = () => {
    const { user, updateUser } = useAuth();
    const [tab, setTab] = useState('profile');
    const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', bio: user?.bio || '' });
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pwLoading, setPwLoading] = useState(false);

    const handleProfileSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
            const { data } = await authAPI.updateProfile(fd);
            updateUser(data.user);
            toast.success('Profile updated!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Passwords do not match'); return; }
        if (pwForm.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
        setPwLoading(true);
        try {
            await authAPI.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
            toast.success('Password changed!');
            setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed');
        } finally {
            setPwLoading(false);
        }
    };

    const tabs = [['profile', 'Profile', User], ['password', 'Security', Shield], ['notifications', 'Notifications', Bell]];

    return (
        <div style={{ maxWidth: 760, margin: '0 auto', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Settings size={24} style={{ color: 'var(--primary-400)' }} /> Settings
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage your account profile and security preferences</p>
            </div>

            {/* Current User Info Card */}
            <div className="card card-body" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(99,102,241,0.08))' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="avatar avatar-lg">{user?.name?.charAt(0)?.toUpperCase() || 'A'}</div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{user?.email}</div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <span className="badge badge-purple" style={{ textTransform: 'capitalize' }}>{user?.role}</span>
                            <span className="badge badge-primary">{user?.department}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-primary)', paddingBottom: 0 }}>
                {tabs.map(([key, label, Icon]) => (
                    <button key={key} onClick={() => setTab(key)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.625rem 1.125rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', borderBottom: `2px solid ${tab === key ? 'var(--primary-500)' : 'transparent'}`, color: tab === key ? 'var(--primary-400)' : 'var(--text-muted)', marginBottom: '-1px', transition: 'all var(--transition-fast)' }}>
                        <Icon size={15} /> {label}
                    </button>
                ))}
            </div>

            {tab === 'profile' && (
                <form onSubmit={handleProfileSave} className="card card-body">
                    <h4 style={{ marginBottom: '1.25rem', color: 'var(--primary-400)' }}>Account Information</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input className="form-control" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email (Read-only)</label>
                            <input className="form-control" value={user?.email || ''} disabled />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone</label>
                            <input className="form-control" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Role (Read-only)</label>
                            <input className="form-control" value={user?.role || ''} disabled style={{ textTransform: 'capitalize' }} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Bio</label>
                        <textarea className="form-control" rows={3} value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} placeholder="Brief description..." />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? <><div className="spinner spinner-sm" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Saving...</> : <><Save size={16} /> Save Profile</>}
                    </button>
                </form>
            )}

            {tab === 'password' && (
                <form onSubmit={handlePasswordChange} className="card card-body">
                    <h4 style={{ marginBottom: '1.25rem', color: 'var(--primary-400)' }}>Change Password</h4>
                    <div className="alert alert-warning" style={{ marginBottom: '1.25rem' }}>
                        <Shield size={16} /> Choose a strong password with at least 8 characters, numbers, and special characters.
                    </div>
                    {[['currentPassword', 'Current Password'], ['newPassword', 'New Password'], ['confirmPassword', 'Confirm New Password']].map(([field, label]) => (
                        <div key={field} className="form-group">
                            <label className="form-label">{label}</label>
                            <div style={{ position: 'relative' }}>
                                <input type={showPw ? 'text' : 'password'} className="form-control" style={{ paddingRight: field !== 'confirmPassword' ? '2.75rem' : '1rem' }} placeholder="••••••••" value={pwForm[field]} onChange={e => setPwForm(p => ({ ...p, [field]: e.target.value }))} required />
                                {field === 'newPassword' && (
                                    <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    <button type="submit" className="btn btn-primary" disabled={pwLoading}>
                        {pwLoading ? <><div className="spinner spinner-sm" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />Updating...</> : <><Key size={16} /> Update Password</>}
                    </button>
                </form>
            )}

            {tab === 'notifications' && (
                <div className="card card-body">
                    <h4 style={{ marginBottom: '1.5rem', color: 'var(--primary-400)' }}>Notification Preferences</h4>
                    {[
                        ['New achievement submissions', 'Get notified when students submit achievements'],
                        ['Verification reminders', 'Daily digest of pending verifications'],
                        ['System announcements', 'Important platform updates and maintenance'],
                        ['Monthly reports', 'Receive monthly analytics report via email'],
                    ].map(([title, desc]) => (
                        <div key={title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--border-primary)' }}>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{title}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{desc}</div>
                            </div>
                            <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input type="checkbox" defaultChecked style={{ display: 'none' }} />
                                <div style={{ width: 44, height: 24, background: 'var(--primary-600)', borderRadius: 12, position: 'relative', transition: 'background 0.2s' }}>
                                    <div style={{ position: 'absolute', top: 3, left: 22, width: 18, height: 18, background: '#fff', borderRadius: '50%', transition: 'left 0.2s' }} />
                                </div>
                            </label>
                        </div>
                    ))}
                    <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => toast.success('Preferences saved!')}>
                        <Save size={16} /> Save Preferences
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminSettingsPage;
