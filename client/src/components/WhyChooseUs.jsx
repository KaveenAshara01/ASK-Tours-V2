import { useTranslation } from 'react-i18next';

function WhyChooseUs() {
    const { t } = useTranslation();

    const features = [
        {
            icon: (
                <svg className="w-10 h-10 md:w-12 md:h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
            ),
            title: t('why_choose_us.cards.multilang.title', 'Multi-language Guides'),
            description: t('why_choose_us.cards.multilang.desc', 'Expert guides speaking Russian, English, German, and more.')
        },
        {
            icon: (
                <svg className="w-10 h-10 md:w-12 md:h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            title: t('why_choose_us.cards.expert.title', 'Local Expertise'),
            description: t('why_choose_us.cards.expert.desc', 'Native guides who know every hidden gem.')
        },
        {
            icon: (
                <svg className="w-10 h-10 md:w-12 md:h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            title: t('why_choose_us.cards.support.title', '24/7 Support'),
            description: t('why_choose_us.cards.support.desc', 'Always available to assist you, anytime, anywhere.')
        }
    ];

    return (
        <section className="py-16 px-4 bg-white border-t border-gray-100">
            <div className="max-w-[1920px] mx-auto px-4 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                    <div className="md:col-span-1">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 font-sans uppercase tracking-tighter leading-none">
                            {t('why_choose_us.title', 'Why Choose Us')}
                        </h2>
                        <div className="w-16 h-2 bg-gray-900 mb-6"></div>
                        <p className="text-lg text-gray-500 font-medium leading-relaxed">
                            {t('why_choose_us.subtitle', 'Experience Sri Lanka with the best in the business')}
                        </p>
                    </div>

                    <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group p-8 bg-gray-50 hover:bg-gray-900 transition-colors duration-500"
                            >
                                <div className="mb-6 text-gray-900 group-hover:text-white transition-colors duration-500 scale-100 group-hover:scale-110 transform origin-left">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-white mb-3 uppercase tracking-wider transition-colors duration-500">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-500 group-hover:text-gray-400 leading-relaxed text-sm font-medium transition-colors duration-500">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default WhyChooseUs;
