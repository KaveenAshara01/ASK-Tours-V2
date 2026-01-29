import { useState, useEffect } from 'react';
import Logo from './Logo'; // Importing Logo for brand consistency

function TranslationLoader() {
    const [isLoading, setIsLoading] = useState(true);
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Check if we are in a translation mode
        const checkTranslation = () => {
            const storedLang = localStorage.getItem('userLang');
            const getCookie = (name) => {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) return parts.pop().split(';').shift();
            };
            const cookieValue = getCookie('googtrans');

            // If local storage says non-en OR cookie says non-en
            const isTranslating = (storedLang && storedLang !== 'en') || (cookieValue && cookieValue.indexOf('/en/en') === -1);

            if (isTranslating) {
                setShow(true);

                // Hide after 1.5s (simulated load time to cover the glitchy transition)
                setTimeout(() => {
                    setIsLoading(false);
                    setTimeout(() => setShow(false), 500); // Allow fade out
                }, 1500);
            } else {
                setIsLoading(false);
            }
        };

        checkTranslation();
    }, []);

    if (!show) return null;

    return (
        <div
            className={`fixed inset-0 z-[2147483647] bg-white/70 backdrop-blur-md flex items-center justify-center transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <div className="flex flex-col items-center">
                <div className="relative mb-8">
                    {/* Brand Logo or Icon */}
                    <Logo className="h-16 w-auto text-primary-600 mb-4 animate-pulse" color="#003580" />

                    {/* Spinner Ring */}
                    <div className="absolute -inset-4 border-4 border-gray-200 border-t-secondary-500 rounded-full w-24 h-24 animate-spin"></div>
                </div>

                <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest animate-pulse">
                    Preparing your journey...
                </h2>
            </div>
        </div>
    );
}

export default TranslationLoader;
