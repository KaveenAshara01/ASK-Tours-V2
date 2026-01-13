import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Prevent browser from restoring scroll position
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        // Immediate scroll with 'auto' to force instant jump (overriding CSS smooth scroll)
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'auto'
        });

        // Delayed scroll to handle mobile browser address bar resize/layout shifts
        const timeoutId = setTimeout(() => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'auto'
            });
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [pathname]);

    return null;
}
