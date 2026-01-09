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
            content: "A truly authentic experience. The cultural tours mixed with the wildlife adventures gave us a complete picture of this wonderful island.",
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
        <section className="py-20 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    What Our Travelers Say
                </h2>
                <p className="text-xl text-gray-600">
                    Stories from those who have experienced the magic of Sri Lanka with us
                </p>
            </div>

            <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>

                <div className="flex overflow-hidden">
                    <div className="flex animate-marquee whitespace-nowrap gap-8 py-4">
                        {[...testimonials, ...testimonials].map((testimonial, index) => (
                            <div
                                key={`${testimonial.id}-${index}`}
                                className="w-[350px] md:w-[400px] flex-shrink-0 bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 mx-4 whitespace-normal"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover shadow-sm"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                                    </div>
                                </div>

                                <div className="flex mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>

                                <p className="text-gray-600 italic">"{testimonial.content}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Testimonials;
