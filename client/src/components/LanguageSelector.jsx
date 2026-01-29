import { useState, useEffect } from 'react';

const languages = [
    { code: 'en', label: 'English', countryCode: 'gb' },
    { code: 'de', label: 'Deutsch', countryCode: 'de' },
    { code: 'ru', label: 'Русский', countryCode: 'ru' },
    { code: 'es', label: 'Español', countryCode: 'es' },
    { code: 'fr', label: 'Français', countryCode: 'fr' },
    { code: 'zh-CN', label: '中文', countryCode: 'cn' },
];

function LanguageSelector() {
    const [currentLang, setCurrentLang] = useState('en');
    const [isOpen, setIsOpen] = useState(false);
    const [suggestion, setSuggestion] = useState(null);

    // Initialize logic: Read cookie OR Detect via IP
    useEffect(() => {
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        };

        const cookieValue = getCookie('googtrans');

        if (cookieValue) {
            // Cookie exists, use it
            const langCode = cookieValue.split('/')[2];
            if (langCode) setCurrentLang(langCode);
        } else {
            // No cookie, try auto-detect
            detectUserLanguage();
        }
    }, []);

    const detectUserLanguage = async () => {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();

            if (data && data.country_code) {
                const country = data.country_code.toUpperCase();
                let targetLang = null;

                const countryMap = {
                    'RU': 'ru', 'UA': 'ru', 'BY': 'ru', 'KZ': 'ru',
                    'DE': 'de', 'AT': 'de', 'CH': 'de',
                    'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es',
                    'FR': 'fr', 'BE': 'fr', 'CN': 'zh-CN', 'TW': 'zh-CN',
                    'HK': 'zh-CN', 'SG': 'zh-CN', 'IT': 'it', 'JP': 'ja'
                };

                if (countryMap[country]) {
                    targetLang = countryMap[country];
                }

                if (targetLang && targetLang !== 'en') {
                    const matchedLang = languages.find(l => l.code === targetLang);
                    if (matchedLang) {
                        setSuggestion(matchedLang);
                    }
                }
            }
        } catch (error) {
            console.error('Language auto-detect failed:', error);
        }
    };

    const changeLanguage = (langCode) => {
        const domain = window.location.hostname;

        // Clear potential duplicate cookies to ensure we set the authoritative one
        document.cookie = `googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        document.cookie = `googtrans=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        document.cookie = `googtrans=; path=/; domain=.${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

        // Set the new cookie
        // We set it on the root path and current domain.
        // Google Translate often looks for "/en/lang"
        document.cookie = `googtrans=/en/${langCode}; path=/; SameSite=Lax`;
        document.cookie = `googtrans=/en/${langCode}; path=/; domain=${domain}; SameSite=Lax`;

        setCurrentLang(langCode);
        setIsOpen(false);
        setSuggestion(null);
        window.location.reload();
    };

    const dismissSuggestion = () => {
        setSuggestion(null);
    };

    const getCurrentCountryCode = () => {
        return languages.find(l => l.code === currentLang)?.countryCode || 'gb';
    };

    return (
        <div className="relative z-50">
            {/* Language Selection Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/10 transition-colors border border-transparent hover:border-white/20"
                title="Select Language"
            >
                <img
                    src={`https://flagcdn.com/w40/${getCurrentCountryCode()}.png`}
                    srcSet={`https://flagcdn.com/w80/${getCurrentCountryCode()}.png 2x`}
                    width="24"
                    height="24"
                    alt="Language"
                    className="rounded-full w-6 h-6 object-cover border border-white/30 shadow-sm"
                />

                <svg
                    className={`w-3 h-3 text-gray-500 md:text-white transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Language Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 animate-fade-in origin-top-right border border-gray-100 overflow-hidden">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-primary-50 transition-colors ${currentLang === lang.code ? 'bg-primary-50 text-primary-600 font-bold' : 'text-gray-700'
                                }`}
                        >
                            <img
                                src={`https://flagcdn.com/w40/${lang.countryCode}.png`}
                                width="20"
                                height="20"
                                alt={lang.label}
                                className="rounded-full w-5 h-5 object-cover shadow-sm"
                            />
                            <span className="text-sm uppercase tracking-wider font-semibold notranslate">{lang.label}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Language Suggestion Popup */}
            {suggestion && (
                <div className="fixed bottom-6 right-6 md:absolute md:top-14 md:right-0 md:bottom-auto w-72 bg-white rounded-xl shadow-2xl p-5 animate-slide-up border border-gray-100 z-[60]">
                    <div className="flex items-start gap-4 mb-4">
                        <img
                            src={`https://flagcdn.com/w80/${suggestion.countryCode}.png`}
                            alt="Flag"
                            className="w-10 h-10 rounded-full object-cover shadow-md"
                        />
                        <div>
                            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">Translate to</p>
                            <h4 className="text-lg font-bold text-gray-900 leading-none notranslate">{suggestion.label}?</h4>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => changeLanguage(suggestion.code)}
                            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold uppercase tracking-widest py-2 rounded-lg transition-colors"
                        >
                            Yes, Translate
                        </button>
                        <button
                            onClick={dismissSuggestion}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold uppercase tracking-widest py-2 rounded-lg transition-colors"
                        >
                            No, Keep English
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LanguageSelector;
