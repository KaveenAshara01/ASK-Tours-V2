function Hero() {
  return (
    <section className="relative overflow-hidden bg-gray-900 text-white py-24 px-4 min-h-[600px] flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-[url('/images/safari_hero.jpg')] bg-cover bg-center bg-no-repeat"
        aria-hidden="true"
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 bg-gradient-to-b from-black/20 to-black/60"></div>

      <div className="relative max-w-7xl mx-auto text-center z-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in drop-shadow-lg">
          Experience the Wild Heart of Sri Lanka
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Embark on an unforgettable adventure through national parks and ancient landscapes with our expert safari guides
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <a
            href="#packages"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('packages')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }}
            className="bg-white text-primary-600 font-semibold py-4 px-8 rounded-lg hover:bg-blue-50 transition-colors duration-200 shadow-xl"
          >
            Explore Packages
          </a>
          <a
            href="#contact"
            className="bg-primary-600/90 text-white font-semibold py-4 px-8 rounded-lg hover:bg-primary-700/90 transition-colors duration-200 border-2 border-white backdrop-blur-sm"
          >
            Get in Touch
          </a>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(249 250 251)" />
        </svg>
      </div>
    </section>
  );
}

export default Hero;

