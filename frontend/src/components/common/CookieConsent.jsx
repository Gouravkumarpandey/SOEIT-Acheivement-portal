import { useState, useEffect } from 'react';
import { Cookie, X, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie_consent', 'declined');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="cookie-consent-fixed">
            <div className="cookie-content-wrapper shadow-2xl">
                <div className="cookie-info">
                    <div className="cookie-icon-box">
                        <Cookie size={24} className="text-brand-600" />
                    </div>
                    <div className="cookie-text-base">
                        <h4 className="cookie-title">We value your privacy</h4>
                        <p className="cookie-desc">
                            We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. <Link to="/cookies" className="cookie-link">Learn More</Link>
                        </p>
                    </div>
                </div>
                <div className="cookie-actions">
                    <button onClick={handleDecline} className="btn-decline">Customize</button>
                    <button onClick={handleAccept} className="btn-accept">Accept All</button>
                </div>
                <button onClick={() => setIsVisible(false)} className="cookie-close-btn" aria-label="Close">
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};

export default CookieConsent;
