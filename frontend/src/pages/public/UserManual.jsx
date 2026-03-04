import PublicNavbar from '../../components/common/PublicNavbar';
import Footer from '../../components/common/Footer';
import {
    BookOpen, UserPlus, Upload, ShieldCheck,
    Share2, ChevronRight, CheckCircle2, AlertCircle, Info
} from 'lucide-react';

const UserManual = () => {
    const steps = [
        {
            role: 'For Students',
            color: 'var(--brand-600)',
            bg: 'var(--brand-50)',
            items: [
                {
                    title: 'Account Creation',
                    desc: 'Register using your official University Email ID. Verify your credentials through the portal activation link.',
                    icon: UserPlus
                },
                {
                    title: 'Upload Achievement',
                    desc: 'Navigate to "Upload" section. Select category (Coding, Project, Certificate), upload proof in PDF/Image format, and add a detailed description.',
                    icon: Upload
                },
                {
                    title: 'Track Verification',
                    desc: 'Check your dashboard for real-time status. "Pending" means faculty review is awaited. "Verified" means it is now part of your official record.',
                    icon: ShieldCheck
                },
                {
                    title: 'Global Portfolio',
                    desc: 'Enable your "Public Portfolio" to generate a unique shareable link for recruiters and LinkedIn.',
                    icon: Share2
                }
            ]
        },
        {
            role: 'For Faculty',
            color: '#16a34a',
            bg: '#f0fdf4',
            items: [
                {
                    title: 'Review Queue',
                    desc: 'Access the "Verification" tab to see pending submissions from your department students.',
                    icon: BookOpen
                },
                {
                    title: 'Validate Documents',
                    desc: 'Examine the uploaded proof. Ensure certifications and project links are authentic and meet institutional standards.',
                    icon: CheckCircle2
                },
                {
                    title: 'Feedback Loop',
                    desc: 'Approval instantly updates the student profile. If rejected, provide clear feedback on what needs to be corrected.',
                    icon: AlertCircle
                }
            ]
        }
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <PublicNavbar />

            {/* Header Section */}
            <section style={{ paddingTop: '140px', paddingBottom: '4rem', background: 'linear-gradient(to bottom, #f8fafc, #ffffff)' }}>
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.6rem 1.25rem',
                            background: 'white',
                            border: '1px solid var(--border-primary)',
                            borderRadius: '99px',
                            marginBottom: '2rem',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                        }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-600)' }}></div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--gray-900)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Documentation & Guidelines
                            </span>
                        </div>
                        <h1 style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--gray-900)', marginBottom: '1.5rem', lineHeight: 1.1 }}>
                            Portal <span className="text-gradient">User Manual</span>
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: 'var(--gray-500)', lineHeight: 1.8 }}>
                            Everything you need to know about navigating the SOEIT Achievement Portal, from your first login to generating your verified professional dossier.
                        </p>
                    </div>
                </div>
            </section>

            {/* Quick Navigation Cards */}
            <section style={{ paddingBottom: '6rem' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                        {steps.map((section) => (
                            <div key={section.role}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--gray-900)' }}>{section.role}</h2>
                                    <div style={{ flex: 1, height: '2px', background: section.color, opacity: 0.1 }}></div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {section.items.map((item, idx) => {
                                        const Icon = item.icon;
                                        return (
                                            <div key={item.title} className="card" style={{
                                                padding: '2rem',
                                                borderRadius: '1.25rem',
                                                background: 'white',
                                                border: '1px solid var(--border-primary)',
                                                transition: 'all 0.3s ease',
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '4px',
                                                    height: '100%',
                                                    background: section.color
                                                }}></div>
                                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                                    <div style={{
                                                        width: 50,
                                                        height: 50,
                                                        borderRadius: '12px',
                                                        background: section.bg,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        shrink: 0,
                                                        color: section.color
                                                    }}>
                                                        <Icon size={24} />
                                                    </div>
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: section.color, opacity: 0.6 }}>STEP 0{idx + 1}</span>
                                                            <ChevronRight size={12} style={{ opacity: 0.3 }} />
                                                            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gray-900)' }}>{item.title}</h4>
                                                        </div>
                                                        <p style={{ fontSize: '0.9rem', color: 'var(--gray-500)', lineHeight: 1.6 }}>{item.desc}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pro Tips Section */}
            <section style={{ padding: '6rem 0', background: 'var(--gray-900)', color: 'white' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 800 }}>Pro <span className="text-brand-400">Tips</span> for Success</h2>
                        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '1rem' }}>Maximize the impact of your digital dossier with these best practices.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {[
                            { title: 'High-Quality Proof', desc: 'Always upload clear, high-resolution scans of certificates. Blurred images may lead to rejection by faculty.' },
                            { title: 'Keywords Matter', desc: 'Use industry-relevant keywords in your project descriptions to improve searchability within the recruiter dashboard.' },
                            { title: 'Keep it Updated', desc: 'Add new milestones as they happen. A frequently updated profile shows active participation and growth.' }
                        ].map((tip) => (
                            <div key={tip.title} style={{ padding: '2.5rem', borderRadius: '1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ color: 'var(--brand-400)', marginBottom: '1rem' }}>
                                    <Info size={32} />
                                </div>
                                <h4 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>{tip.title}</h4>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.7 }}>{tip.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default UserManual;
