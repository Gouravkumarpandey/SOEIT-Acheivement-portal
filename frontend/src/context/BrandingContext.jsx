import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const BrandingContext = createContext(null);

export const BrandingProvider = ({ children }) => {
    const { user } = useAuth();
    const [university, setUniversity] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBranding = async () => {
            if (user?.universityId) {
                setLoading(true);
                try {
                    // In a real app, this would be an API call to get branding info
                    const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/universities/${user.universityId}`);
                    setUniversity(data.data);

                    // 🔹 Dynamic Theme Injection (Premium Aesthetic)
                    if (data.data.primaryColor) {
                        document.documentElement.style.setProperty('--primary', data.data.primaryColor);
                        document.documentElement.style.setProperty('--primary-hover', `${data.data.primaryColor}dd`);
                    }
                    if (data.data.secondaryColor) {
                        document.documentElement.style.setProperty('--secondary', data.data.secondaryColor);
                    }
                } catch (error) {
                    console.error('Failed to fetch university branding:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                // Default theme if no university context
                document.documentElement.style.setProperty('--primary', '#3b82f6');
                setUniversity(null);
            }
        };

        fetchBranding();
    }, [user?.universityId]);

    return (
        <BrandingContext.Provider value={{ university, loading }}>
            {children}
        </BrandingContext.Provider>
    );
};

export const useBranding = () => useContext(BrandingContext);
