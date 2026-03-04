import '../../styles/LandingPage.css';
import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/common/PublicNavbar';
import Footer from '../../components/common/Footer';
import {
    Trophy, Shield, BarChart3, CheckCircle,
    Users, Star, ArrowRight, Zap, Globe, Award, BookOpen, Clock, GraduationCap, FileCheck, Briefcase
} from 'lucide-react';

const stats = [
    { value: '4,200+', label: 'Technical Records' },
    { value: '1,250+', label: 'Engineer Dossiers' },
    { value: '100%', label: 'Skill Validation' },
    { value: '24/7', label: 'Faculty Verification' },
];

const features = [
    { icon: Shield, title: 'Project Verification', desc: 'Every technical project and certificate is vetted through a faculty workflow ensuring 100% industry-ready validation.', color: 'var(--brand-600)' },
    { icon: FileCheck, title: 'Engineer Portfolios', desc: 'Students generate tamper-proof project dossiers for top tech recruiters, verified by the SOEIT faculty.', color: 'var(--brand-600)' },
    { icon: BarChart3, title: 'Compliance Analytics', desc: 'Real-time monitoring of departmental achievements for NAAC, NIRF, and other institutional audits.', color: 'var(--brand-600)' },
    { icon: Users, title: 'Faculty Oversight', desc: 'Dedicated administrative tools for department heads to monitor student growth and career milestones.', color: 'var(--brand-600)' },
    { icon: Award, title: 'Excellence Tiering', desc: 'Automated point calculations based on national and international achievement standards and weights.', color: 'var(--brand-600)' },
    { icon: Globe, title: 'Universal Export', desc: 'Export verified records directly to LinkedIn or download as official university-branded PDF certificates.', color: 'var(--brand-600)' },
];

const categoriesData = [
    { name: 'Technical Projects', icon: Briefcase },
    { name: 'Coding Challenges', icon: Zap },
    { name: 'Industrial Training', icon: Shield },
    { name: 'Web/App Innovations', icon: Globe },
    { name: 'Hardware Prototypes', icon: Trophy },
    { name: 'Skill Certifications', icon: BookOpen },
    { name: 'Cultural Events', icon: Star },
    { name: 'Team Leadership', icon: Users }
];

const LandingPage = () => {
    return (
        <div className="landing-page">
            <PublicNavbar />

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-mesh" />

                <div className="container hero-container">
                    <div className="hero-badge">
                        <Shield size={14} />
                        <span className="hero-badge-text">Official Academic Repository of SOEIT</span>
                    </div>

                    <h1 className="hero-title">
                        Centralizing <br />
                        <span className="text-gradient">Student Excellence</span>
                    </h1>

                    <p className="hero-subtitle">
                        The SOEIT Achievement Portal is the primary platform for documenting, verifying, and showcasing the technical projects, coding skills, and engineering milestones of our future innovators.
                    </p>

                    <div className="flex justify-center mt-8">
                        <Link to="/login" className="btn btn-primary btn-lg rounded-md px-12 bg-brand-600 border-none shadow-xl hover:bg-brand-700 transition-all flex items-center gap-3 font-bold text-lg">
                            Get Started <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Strip */}
            <section className="stats-strip">
                <div className="container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                        {stats.map((stat) => (
                            <div key={stat.label} className="stat-item">
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white">
                <div className="container">
                    <div className="text-center mb-20">
                        <div className="section-label mb-4">
                            <Shield size={14} className="text-brand-600" />
                            <span>Academic Governance</span>
                        </div>
                        <h2 className="text-4xl font-extrabold mb-4 text-gray-900">Engineered for <span className="text-brand-600">Institutional Success</span></h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                            An end-to-end framework designed to streamline the lifecycle of student achievements, from initial submission to final verification.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature) => {
                            const FeatureIcon = feature.icon;
                            return (
                                <div key={feature.title} className="feature-card">
                                    <div className="feature-icon-wrapper" style={{ background: 'var(--bg-secondary)' }}>
                                        <FeatureIcon size={32} style={{ color: 'var(--brand-600)' }} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 text-gray-800">{feature.title}</h3>
                                    <p className="text-gray-500 leading-relaxed text-sm">{feature.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-24 bg-gray-50 border-y">
                <div className="container">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-3 text-gray-900">Engineering <span className="text-brand-600">Skill Categories</span></h2>
                        <p className="text-gray-500 max-w-lg mx-auto">We provide a structured categorization for every student milestone, ensuring comprehensive performance reports.</p>
                    </div>
                    <div className="category-grid">
                        {categoriesData.map((cat) => {
                            const CatIcon = cat.icon;
                            return (
                                <div key={cat.name} className="category-card">
                                    <div className="category-icon" style={{ background: 'white' }}>
                                        <CatIcon size={20} />
                                    </div>
                                    <span style={{ fontSize: '0.85rem' }}>{cat.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>


            <Footer />
        </div>
    );
};

export default LandingPage;
