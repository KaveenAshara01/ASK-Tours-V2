import SEO from '../components/SEO';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Testimonials from '../components/Testimonials';
import ContactSection from '../components/ContactSection';

function About() {
    return (
        <div className="min-h-screen bg-white">
            <SEO
                title="About Us"
                description="Learn more about ASK Travels. We are a premier travel agency in Sri Lanka, offering tailor-made travels, wildlife safaris, and cultural experiences."
                keywords="about ask travels, travel agency sri lanka, travel operator, sri lanka holidays, wildlife safaris"
            />
            <Header />

            {/* Editorial Hero */}
            <div className="relative min-h-[70vh] md:h-[80vh] bg-gray-900 flex flex-col justify-center items-center overflow-hidden pt-32 md:pt-20">
                <div
                    className="absolute inset-0 bg-[url('/images/safari_hero.jpg')] bg-cover bg-center bg-no-repeat opacity-50"
                    aria-hidden="true"
                ></div>
                <div className="absolute inset-0 bg-black/40"></div>
                {/* Bottom Fade */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-10"></div>

                <div className="relative z-10 text-center px-4 pt-20">
                    <span className="block text-white font-bold tracking-[0.3em] uppercase mb-4 text-xs md:text-sm animate-fade-in border-b-2 border-white/50 w-fit mx-auto pb-2">
                        Who We Are
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white mb-4 uppercase tracking-tighter leading-[0.9] flex flex-col items-center">
                        <span className="block drop-shadow-lg text-white">Ask</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 md:ml-32 pr-8 filter drop-shadow-lg leading-tight pb-4">
                            Travels
                        </span>
                    </h1>
                </div>
            </div>

            {/* Authentic Story Section - Editorial Layout */}
            <section className="py-12 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            {/* Abstract Decor */}
                            <div className="absolute -top-10 -left-10 w-40 h-40 border-t-8 border-l-8 border-primary-100 hidden md:block"></div>
                            <div className="relative z-10">
                                <h2 className="text-5xl font-black text-black mb-8 uppercase tracking-tighter leading-none">
                                    Crafting<br /> <span className="text-primary-600">Memories</span>
                                </h2>
                                <div className="space-y-6 text-lg text-gray-600 font-medium leading-relaxed border-l-4 border-primary-500 pl-8">
                                    <p>
                                        Founded with a passion for sharing the beauty of our island,
                                        ASK Travels has grown into a full-service travel agency dedicated to creating unforgettable Sri Lankan experiences.
                                    </p>
                                    <p>
                                        Whether you're looking to explore the ancient cities, relax on pristine beaches, or witness the majestic elephants of Minneriya,
                                        our expert team is here to craft the perfect itinerary for you. We are committed to sustainable tourism and exceptional service.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="relative h-[600px] bg-gray-100 hidden md:block overflow-hidden group">
                            <img
                                src="/images/hero_waterfall.jpg"
                                alt="Sri Lanka Landscape"
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section - Sharp & Technical */}
            <section className="py-24 bg-gray-50 border-y border-gray-200">
                <div className="max-w-[1920px] mx-auto px-4 md:px-12">
                    <div className="max-w-4xl mb-16">
                        <span className="block text-gray-400 font-bold tracking-[0.3em] uppercase mb-4 text-xs">
                            The Difference
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter">
                            Why Choose <span className="text-primary-600">Us</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-200 bg-white shadow-sm">
                        {/* Feature 1 */}
                        <div className="p-12 border-b md:border-b-0 md:border-r border-gray-200 hover:bg-gray-50 transition-colors group">
                            <div className="w-16 h-16 bg-primary-50 flex items-center justify-center mb-8 group-hover:bg-primary-600 transition-colors duration-300">
                                <svg className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-black mb-4 uppercase tracking-wider">Premium & Luxury</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">
                                We select only the best accommodations and transport options to ensure your comfort and luxury throughout the journey.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-12 border-b md:border-b-0 md:border-r border-gray-200 hover:bg-gray-50 transition-colors group">
                            <div className="w-16 h-16 bg-primary-50 flex items-center justify-center mb-8 group-hover:bg-primary-600 transition-colors duration-300">
                                <svg className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-black mb-4 uppercase tracking-wider">Expert Guides</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">
                                Our certified guides speak fluent English and Russian, ensuring you understand every story and fact about our beautiful island.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-12 hover:bg-gray-50 transition-colors group">
                            <div className="w-16 h-16 bg-primary-50 flex items-center justify-center mb-8 group-hover:bg-primary-600 transition-colors duration-300">
                                <svg className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-black mb-4 uppercase tracking-wider">24/7 Support</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">
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
