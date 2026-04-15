import { Settings, Shield, Bell, Cookie, ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';

const PrivacyPreferences = () => {
    const [preferences, setPreferences] = useState({
        essential: true,
        functional: localStorage.getItem('pref_functional') === 'true',
        analytics: localStorage.getItem('pref_analytics') === 'true',
        marketing: localStorage.getItem('pref_marketing') === 'true'
    });

    const handleSave = () => {
        localStorage.setItem('pref_functional', preferences.functional);
        localStorage.setItem('pref_analytics', preferences.analytics);
        localStorage.setItem('pref_marketing', preferences.marketing);
        toast.success("Preferences saved successfully!");
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <div style={{ position: 'fixed', top: '1.5rem', left: '1.5rem', zIndex: 100 }}>
                <Link to="/" className="btn btn-secondary" style={{ fontWeight: 700, borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-primary)', padding: '0.6rem 1.25rem' }}>
                    <ArrowLeft size={16} /> Back to Home
                </Link>
            </div>
            <section style={{ paddingTop: '100px', paddingBottom: '5rem' }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <div style={{
                            display: 'inline-flex',
                            padding: '0.5rem 1rem',
                            background: 'var(--brand-50)',
                            borderRadius: '99px',
                            color: 'var(--brand-600)',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            marginBottom: '1.5rem',
                            gap: '0.5rem',
                            alignItems: 'center'
                        }}>
                            <Settings size={16} /> User Controls
                        </div>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--gray-900)' }}>Privacy <span className="text-gradient">Preferences</span></h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '1rem' }}>
                            Manage how we use cookies and handle your data.
                        </p>
                    </div>

                    <div className="card shadow-sm" style={{ padding: '3rem', borderRadius: '1.5rem', background: 'white', border: '1px solid var(--border-primary)' }}>
                        <div className="space-y-8">
                            {/* Essential Cookies */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '1rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Shield size={18} className="text-brand-600" /> Essential Cookies
                                    </h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Required for the portal to function. Cannot be disabled.</p>
                                </div>
                                <div style={{ color: 'var(--brand-600)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Always Active</div>
                            </div>

                            {/* Functional Cookies */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid var(--border-primary)', borderRadius: '1rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Settings size={18} className="text-brand-600" /> Functional Cookies
                                    </h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Remember your theme preferences and dashboard layout.</p>
                                </div>
                                <input 
                                    type="checkbox" 
                                    checked={preferences.functional}
                                    onChange={(e) => setPreferences({...preferences, functional: e.target.checked})}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                />
                            </div>

                            {/* Analytics Cookies */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid var(--border-primary)', borderRadius: '1rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Bell size={18} className="text-brand-600" /> Analytics Cookies
                                    </h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Help us understand how students use the portal to improve features.</p>
                                </div>
                                <input 
                                    type="checkbox" 
                                    checked={preferences.analytics}
                                    onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                />
                            </div>

                            <button 
                                onClick={handleSave}
                                className="btn btn-primary btn-lg w-full mt-8 rounded-xl flex items-center justify-center gap-2"
                                style={{ background: 'var(--brand-600)', border: 'none' }}
                            >
                                <Save size={20} /> Save My Preferences
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPreferences;
