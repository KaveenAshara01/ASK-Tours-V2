import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const COUNTRY_TO_LANG = {
    'FR': 'fr', // France
    'BE': 'fr', // Belgium 
    'ES': 'es', // Spain
    'MX': 'es', // Mexico
    'AR': 'es', // Argentina
    'CO': 'es', // Colombia
    'DE': 'de', // Germany
    'AT': 'de', // Austria
    'CH': 'de', // Switzerland (de-facto, though multilingual)
    'RU': 'ru', // Russia
    'BY': 'ru', // Belarus
    'KZ': 'ru', // Kazakhstan
    'KG': 'ru', // Kyrgyzstan
    'JP': 'ja', // Japan
    'NL': 'nl', // Netherlands
    // Add more mappings as needed
};

const LANGUAGE_NAMES = {
    'fr': 'Français',
    'es': 'Español',
    'de': 'Deutsch',
    'ru': 'Русский',
    'ja': '日本語',
    'nl': 'Nederlands',
    'en': 'English'
};

const LanguageSuggester = () => {
    const { t, i18n } = useTranslation();
    const [suggestion, setSuggestion] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const checkLocation = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/');
                if (!response.ok) {
                    console.warn('LanguageSuggester: Location fetch failed', response.status);
                    return;
                }

                const data = await response.json();
                console.log('LanguageSuggester: Detected country:', data.country_code);

                const suggestedLang = COUNTRY_TO_LANG[data.country_code];
                if (!suggestedLang) {
                    console.log('LanguageSuggester: No language mapping for country', data.country_code);
                    return;
                }

                // Check if user has already dismissed THIS specific language
                const dismissedKey = `language_suggestion_dismissed_${suggestedLang}`;
                const hasDismissed = localStorage.getItem(dismissedKey);

                if (hasDismissed) {
                    console.log(`LanguageSuggester: Users previously dismissed ${suggestedLang}`);
                    return;
                }

                // If there's a suggested language and it's different from current
                if (suggestedLang !== i18n.language) {
                    console.log(`LanguageSuggester: Suggesting ${suggestedLang} for ${data.country_name}`);
                    setSuggestion({
                        lang: suggestedLang,
                        country: data.country_name,
                        langName: LANGUAGE_NAMES[suggestedLang] || suggestedLang
                    });
                    setIsVisible(true);
                } else {
                    console.log('LanguageSuggester: Current language matches suggested language');
                }
            } catch (error) {
                console.error('LanguageSuggester: Error fetching location:', error);
            }
        };

        checkLocation();
    }, [i18n.language]);

    const handleSwitch = () => {
        i18n.changeLanguage(suggestion.lang);
        setIsVisible(false);
        // Be less aggressive with dismissal - only remember we handled it?
        // Or stick to dismissal to avoid annoying user
        localStorage.setItem(`language_suggestion_dismissed_${suggestion.lang}`, 'true');
    };

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem(`language_suggestion_dismissed_${suggestion.lang}`, 'true');
    };

    if (!isVisible || !suggestion) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-4 shadow-lg z-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm md:text-base">
                {t('language_suggestion', {
                    country: suggestion.country,
                    language: suggestion.langName
                })}
            </p>
            <div className="flex gap-2">
                <button
                    onClick={handleSwitch}
                    className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors text-sm whitespace-nowrap"
                >
                    {t('switch_language', { language: suggestion.langName })}
                </button>
                <button
                    onClick={handleDismiss}
                    className="text-white/80 hover:text-white px-3 py-2 text-sm"
                >
                    {t('dismiss')}
                </button>
            </div>
        </div>
    );
};

export default LanguageSuggester;
