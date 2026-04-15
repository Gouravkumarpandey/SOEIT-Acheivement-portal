import { Accessibility as AccessibilityIcon, Eye, CheckCircle, Smartphone, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Accessibility = () => {
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
                            <AccessibilityIcon size={16} /> Inclusive Design
                        </div>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--gray-900)' }}>Accessibility <span className="text-gradient">Statement</span></h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '1rem' }}>
                            Ensuring the SOEIT Portal is accessible to everyone.
                        </p>
                    </div>

                    <div className="card shadow-sm" style={{ padding: '3rem', borderRadius: '1.5rem', background: 'white', border: '1px solid var(--border-primary)' }}>
                        <div className="space-y-12">
                            <section>
                                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '1.5rem' }}>
                                    <CheckCircle className="text-brand-600" size={24} /> 1. Our Commitment
                                </h2>
                                <p style={{ color: 'var(--gray-600)', lineHeight: '1.8', fontSize: '1.05rem' }}>
                                    SOEIT is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards, including WCAG 2.1 Level AA.
                                </p>
                            </section>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--gray-100)', margin: '2.5rem 0' }} />

                            <section>
                                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '1.5rem' }}>
                                    <Eye className="text-brand-600" size={24} /> 2. Visual Design
                                </h2>
                                <p style={{ color: 'var(--gray-600)', lineHeight: '1.8', fontSize: '1.05rem' }}>
                                    The portal utilizes high-contrast color palettes and scalable typography to ensure content is readable for users with visual impairments. All meaningful UI elements include appropriate ARIA labels and alt-text.
                                </p>
                            </section>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--gray-100)', margin: '2.5rem 0' }} />

                            <section>
                                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '1.5rem' }}>
                                    <Smartphone className="text-brand-600" size={24} /> 3. Navigation & Interaction
                                </h2>
                                <p style={{ color: 'var(--gray-600)', lineHeight: '1.8', fontSize: '1.05rem' }}>
                                    We ensure that the portal is fully navigable via keyboard and screen readers. Our interactive elements are designed with adequate target sizes and logical focus order to support users with motor or cognitive disabilities.
                                </p>
                            </section>

                            <section style={{ marginTop: '4rem', padding: '2rem', background: 'var(--brand-50)', borderRadius: '1rem', border: '1px solid var(--brand-100)' }}>
                                <h4 style={{ color: 'var(--brand-700)', fontWeight: 700, marginBottom: '0.5rem' }}>Feedback on Accessibility</h4>
                                <p style={{ color: 'var(--brand-600)', fontSize: '0.9rem' }}>
                                    We welcome your feedback on the accessibility of the SOEIT Portal. Please let us know if you encounter any barriers by contacting the portal administration team.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Accessibility;
