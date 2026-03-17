import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Linkedin, Github, Twitter, ExternalLink } from 'lucide-react';
import '../../styles/layout/Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: Linkedin, href: '#' },
        { icon: Github, href: '#' },
        { icon: Twitter, href: '#' },
    ];

    const quickLinks = [
        { path: '/', label: 'Home' },
        { path: '/about', label: 'About Us' },
        { path: '/features', label: 'Features' },
        { path: '/how-it-works', label: 'How It Works' },
        { path: '/contact', label: 'Contact' },
    ];

    const platformLinks = [
        { path: '/register', label: 'Student Registration' },
        { path: '/login', label: 'Portal Login' },
        { path: '/admin-login', label: 'Admin Login' },
        { path: '/features', label: 'Achievement Categories' },
        { path: '/public-portfolio', label: 'Public Portfolios' },

    ];

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand Branding */}
                    <div className="footer-brand-col">
                        <Link to="/" className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-brand-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-200">
                                <GraduationCap size={22} color="#fff" />
                            </div>
                            <div>
                                <div className="font-bold text-gray-900 text-lg leading-tight">SOEIT Portal</div>
                                <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Academic Excellence</div>
                            </div>
                        </Link>
                        <p>
                            A centralized platform for students to showcase achievements and for faculty to verify and monitor academic performance at SOEIT.
                        </p>
                        <div className="footer-social-links">
                            {socialLinks.map(({ icon: Icon, href }, i) => (
                                <a key={i} href={href} className="footer-social-icon" aria-label="Social Link">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Navigation */}
                    <div>
                        <h4 className="footer-heading">Navigations</h4>
                        <nav>
                            {quickLinks.map(({ path, label }) => (
                                <Link key={path} to={path} className="footer-link">
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Platform Links */}
                    <div>
                        <h4 className="footer-heading">Portal</h4>
                        <nav>
                            {platformLinks.map(({ path, label }) => (
                                <Link key={label} to={path} className="footer-link">
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Contact Details */}
                    <div>
                        <h4 className="footer-heading">Reach Us</h4>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-start gap-3">
                                <Mail size={18} className="text-brand-500 mt-1 shrink-0" />
                                <div>
                                    <div className="text-xs font-bold text-gray-400 uppercase mb-1">Email Us</div>
                                    <a href="mailto:soeit@arkajainuniversity.ac.in" className="text-sm text-gray-600 hover:text-brand-600 transition">soeit@arkajainuniversity.ac.in</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-brand-500 mt-1 shrink-0" />
                                <div>
                                    <div className="text-xs font-bold text-gray-400 uppercase mb-1">Location</div>
                                    <span className="text-sm text-gray-600">Jamshedpur, Jharkhand, India</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {currentYear} SOEIT Achievements Portal. All rights reserved.</p>
                    <div className="footer-bottom-links">
                        <Link to="/privacy" className="hover:text-brand-600 transition">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-brand-600 transition">Terms of Service</Link>
                        <Link to="/support" className="hover:text-brand-600 transition">Support</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

