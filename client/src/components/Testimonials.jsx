function Testimonials() {
    const testimonials = [
        {
            id: 1,
            name: "Sarah Johnson",
            role: "Adventure Enthusiast",
            location: "United Kingdom",
            image: "/images/testimonials/sarah.png",
            content: "The safari experience was absolutely magical! Seeing elephants in the wild at sunset is a memory I'll cherish forever. The guide was incredibly knowledgeable and friendly.",
            rating: 5
        },
        {
            id: 2,
            name: "Michael Chen",
            role: "Photography Lover",
            location: "Singapore",
            image: "/images/testimonials/michael.png",
            content: "Perfectly organized tour. The accommodations were top-notch, and the transportation was comfortable. I got some amazing shots of the leopards in Yala!",
            rating: 5
        },
        {
            id: 3,
            name: "Emma & David",
            role: "Honeymooners",
            location: "Australia",
            image: "/images/testimonials/emma_david.png",
            content: "We couldn't have asked for a better honeymoon. Everything was taken care of, allowing us to just relax and enjoy the beautiful scenery of Sri Lanka.",
            rating: 5
        },
        {
            id: 4,
            name: "Hans Muller",
            role: "Nature Explorer",
            location: "Germany",
            image: "/images/testimonials/hans.png",
            content: "A truly authentic experience. The cultural travels mixed with the wildlife adventures gave us a complete picture of this wonderful island.",
            rating: 4
        },
        {
            id: 5,
            name: "Jessica Williams",
            role: "Solo Traveler",
            location: "USA",
            image: "/images/testimonials/jessica.png",
            content: "As a solo female traveler, safety was my priority. Ameliya Elephant Safari Service made me feel safe and welcome throughout the entire journey. Highly recommended!",
            rating: 5
        }
    ];

    return (
        <section className="py-16 bg-white overflow-hidden border-t border-gray-100">
            <div className="max-w-[1920px] mx-auto px-4 md:px-12 mb-12 md:mb-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-4xl">
                        <span className="block text-primary-500 font-bold tracking-[0.3em] uppercase mb-4 text-xs md:text-sm">
                            Client Stories
                        </span>
                        <h2 className="text-5xl md:text-7xl font-black text-black mb-0 font-sans tracking-tighter leading-[0.9] uppercase">
                            Experiences<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">Unfiltered</span>
                        </h2>
                    </div>
                </div>
            </div>

            <div className="relative">
                {/* Sharp gradient fades */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                <div className="flex overflow-hidden">
                    <div className="flex animate-marquee-scroll whitespace-nowrap gap-0 py-4">
                        {[...testimonials, ...testimonials].map((testimonial, index) => (
                            <div
                                key={`${testimonial.id}-${index}`}
                                className="w-[400px] md:w-[500px] flex-shrink-0 bg-white p-10 border-r border-y border-gray-100 hover:border-primary-500 transition-colors duration-300 group whitespace-normal"
                            >
                                <div className="flex items-start justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-14 h-14 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                                        />
                                        <div>
                                            <h3 className="font-bold text-lg text-black uppercase tracking-wider">{testimonial.name}</h3>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{testimonial.location}</p>
                                        </div>
                                    </div>

                                    {/* Brand Blue Stars */}
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-4 h-4 ${i < testimonial.rating ? 'text-primary-500' : 'text-gray-200'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>

                                <p className="text-xl md:text-2xl font-medium text-gray-900 leading-relaxed italic">
                                    "{testimonial.content}"
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Testimonials;
