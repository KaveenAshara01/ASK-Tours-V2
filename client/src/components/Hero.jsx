function Hero() {
  return (
    <section className="relative overflow-hidden bg-gray-900 text-white min-h-[90vh] md:min-h-[600px] flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-[url('/images/safari_hero.jpg')] bg-cover bg-center bg-no-repeat transition-transform duration-10000 hover:scale-105"
        aria-hidden="true"
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 bg-gradient-to-b from-black/50 via-transparent to-black/70"></div>

      <div className="relative max-w-7xl mx-auto text-center z-10 px-4 sm:px-6 lg:px-8 w-full mt-16 md:mt-0">
        <span className="block text-primary-300 font-bold tracking-widest uppercase mb-4 text-sm md:text-base animate-fade-in">
          Your Journey Begins Here
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 animate-fade-in drop-shadow-xl leading-tight">
          Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">Sri Lanka</span>
        </h1>
        <p className="text-lg md:text-2xl mb-10 text-white/90 max-w-3xl mx-auto animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
          Experience the ultimate island getaway with ASK Tours. From pristine beaches and ancient cities to thrilling wildlife safaris, we craft the perfect holiday for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up w-full max-w-md mx-auto sm:max-w-none" style={{ animationDelay: '0.4s' }}>
          <a
            href="#packages"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('packages')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }}
            className="w-full sm:w-auto bg-white text-gray-900 font-bold py-4 px-8 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg transform hover:-translate-y-1"
          >
            Explore Packages
          </a>
          <a
            href="#contact"
            className="w-full sm:w-auto bg-primary-600/90 text-white font-bold py-4 px-8 rounded-full hover:bg-primary-700/90 transition-all duration-300 border border-primary-500/50 backdrop-blur-sm shadow-lg transform hover:-translate-y-1"
          >
            Start Your Journey
          </a>
        </div>
      </div>

      {/* Scroll indicator for mobile */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce md:hidden text-white/70">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block align-middle">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(249 250 251)" />
        </svg>
      </div>
    </section>
  );
}

export default Hero;

