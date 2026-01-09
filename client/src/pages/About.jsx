import Header from '../components/Header';
import Footer from '../components/Footer';
import Testimonials from '../components/Testimonials';
import ContactSection from '../components/ContactSection';

function About() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <div className="relative h-[400px] bg-gray-900 flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-[url('/images/safari_hero.jpg')] bg-cover bg-center bg-no-repeat opacity-60"
                    aria-hidden="true"
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60"></div>
                <div className="relative z-10 text-center px-4 animate-fade-in-up">
                    <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">About Us</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Crafting unforgettable journeys through the heart of Sri Lanka
                    </p>
                </div>
            </div>

            {/* Our Story Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                        <div className="w-20 h-1 bg-primary-600 mx-auto rounded-full"></div>
                    </div>
                    <div className="prose prose-lg mx-auto text-gray-600">
                        <p className="mb-6 text-lg leading-relaxed text-center">
                            Founded with a deep respect for Sri Lanka's majestic wildlife,
                            Ameliya Elephant Safari Service was born from a desire to connect travelers with the untamed beauty of our island.
                            We specialize in ethical wildlife encounters that honor nature while creating breathtaking memories.
                        </p>
                        <p className="text-lg leading-relaxed text-center">
                            From the legendary elephant gatherings of Minneriya to the leopard-rich zones of Yala,
                            our expert naturalists guide you through the island's most spectacular ecosystems.
                            We are committed to conservation and providing you with an immersive, respectful, and thrilling safari experience.
                        </p>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
                        <p className="text-xl text-gray-600">Experience the difference with our premium services</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
                            <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Premium Experience</h3>
                            <p className="text-gray-600 text-center">
                                We select only the best accommodations and transport options to ensure your comfort and luxury throughout the journey.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
                            <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Expert Guides</h3>
                            <p className="text-gray-600 text-center">
                                Our certified guides are passionate locals who know every hidden gem and story of this beautiful island.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
                            <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">24/7 Support</h3>
                            <p className="text-gray-600 text-center">
                                We are always here for you. From planning to execution, our support team is just a call away.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Testimonials />
            <ContactSection />
            <Footer />
        </div >
    );
}

export default About;
