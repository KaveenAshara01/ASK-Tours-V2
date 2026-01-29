import { useState, useEffect } from 'react';

const heroImages = [
  '/images/hero_safari.png',
  '/images/hero_beach.jpg',
  '/images/hero_beach_drone.png',
  '/images/hero_waterfall.jpg',
  '/images/hero_surfing.jpg',
  '/images/hero_lounge.png'
];

function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const [prevImage, setPrevImage] = useState(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => {
        setPrevImage(prev);
        return (prev + 1) % heroImages.length;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getAnimationClass = (index) => {
    // Deterministic animation based on index
    const animMap = ['animate-ken-burns-1', 'animate-ken-burns-2', 'animate-ken-burns-3', 'animate-ken-burns-4'];
    return animMap[index % animMap.length];
  };

  return (
    <section className="relative overflow-hidden bg-gray-900 text-white h-screen flex items-center pb-20">
      {/* Background Images - Carousel */}
      {heroImages.map((img, index) => {
        const isActive = index === currentImage;
        const isPrev = index === prevImage;
        const shouldAnimate = isActive || isPrev;

        return (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-[2500ms] ease-cinematic ${isActive ? 'opacity-100 scale-100 z-20' : isPrev ? 'opacity-0 scale-125 z-10' : 'opacity-0 scale-125 z-0'}`}
            aria-hidden="true"
          >
            <div
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat ${shouldAnimate ? getAnimationClass(index) : ''}`}
              style={{ backgroundImage: `url('${img}')` }}
            ></div>
          </div>
        );
      })}

      {/* Overlay - Cleaner, less "gradient-heavy" for editorial look */}
      <div className="absolute inset-0 bg-black/20 z-20"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-20"></div>

      <div className="relative max-w-[1920px] mx-auto text-center z-30 px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center justify-center h-full pt-24 md:pt-40">
        <span className="block text-white font-bold tracking-[0.3em] uppercase mb-4 text-xs md:text-sm animate-fade-in border-b-2 border-secondary-500 pb-2">
          Your Journey Begins Here
        </span>
        <h1 className="text-6xl sm:text-7xl md:text-[8rem] font-black mb-4 animate-fade-in drop-shadow-2xl leading-[0.8] flex flex-col items-center uppercase tracking-tighter">
          <span className="text-white block mb-0 drop-shadow-lg">Discover</span>
          <span className="bg-[url('https://upload.wikimedia.org/wikipedia/commons/1/11/Flag_of_Sri_Lanka.svg')] bg-cover bg-center bg-clip-text text-transparent bg-[length:200%_auto] animate-bg-pan filter brightness-125 saturate-150 [-webkit-text-stroke:1px_rgba(255,255,255,0.5)] md:[-webkit-text-stroke:2px_rgba(255,255,255,0.5)] drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
            Sri Lanka
          </span>
        </h1>

        {/* <p className="text-lg md:text-2xl mb-8 text-white/95 max-w-4xl mx-auto animate-fade-in-up leading-relaxed font-bold tracking-wide drop-shadow-xl" style={{ animationDelay: '0.2s' }}>
          Experience the ultimate island getaway with ASK Travels. Curated journeys for the modern explorer.
        </p> */}

        <div className="flex flex-col sm:flex-row gap-0 justify-center animate-fade-in-up w-full max-w-md mx-auto sm:max-w-none items-center mt-12" style={{ animationDelay: '0.4s' }}>
          <a
            href="#packages"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('packages')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }}
            className="w-full sm:w-auto bg-secondary-500 text-primary-950 font-black py-4 px-8 hover:bg-secondary-400 transition-all duration-300 transform hover:-translate-y-1 uppercase tracking-widest text-xs md:text-sm"
          >
            Explore Packages
          </a>
          <a
            href="#contact"
            className="w-full sm:w-auto bg-transparent text-white border-2 border-white font-black py-[14px] px-8 hover:bg-white hover:text-black transition-all duration-300 transform hover:-translate-y-1 uppercase tracking-widest text-xs md:text-sm backdrop-blur-sm"
          >
            Start Your Journey
          </a>
        </div>
      </div>

      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 animate-bounce md:hidden text-white/90 z-30 drop-shadow-lg">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
        </svg>
      </div>
    </section>
  );
}

export default Hero;

