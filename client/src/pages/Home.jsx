import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PackageCard from '../components/PackageCard';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Testimonials from '../components/Testimonials';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

function Home() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchPackages();
  }, []);

  const scrollContainerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let animationFrameId;

    const scroll = () => {
      if (!isPaused) {
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        } else {
          scrollContainer.scrollLeft += 1.5;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [packages, isPaused]);

  const fetchPackages = async () => {
    try {
      const response = await axios.get('/api/packages');
      setPackages(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header />
      <Hero />

      <section id="packages" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Popular Packages
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hand-picked experiences for your perfect holiday
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-xl">No packages available at the moment.</p>
            </div>
          ) : (
            <>
              {/* Desktop Grid */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {packages
                  .filter(pkg => pkg.featured) // Prioritize featured
                  .concat(packages.filter(pkg => !pkg.featured)) // Then others
                  .slice(0, 3) // Take top 3
                  .map((pkg) => (
                    <PackageCard key={pkg._id} package={pkg} />
                  ))}
              </div>

              {/* Mobile Marquee */}
              {/* Mobile Marquee / Swipeable Auto-Scroll */}
              <div className="md:hidden relative mb-12 -mx-4 group">
                <div
                  ref={scrollContainerRef}
                  className="flex overflow-x-auto gap-8 px-4 scrollbar-hide"
                  onTouchStart={() => setIsPaused(true)}
                  onTouchEnd={() => setIsPaused(false)}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  {(() => {
                    const sortedPackages = packages
                      .filter(pkg => pkg.featured)
                      .concat(packages.filter(pkg => !pkg.featured))
                      .slice(0, 6);

                    // Duplicate the sorted list for seamless scrolling
                    return [...sortedPackages, ...sortedPackages].map((pkg, i) => (
                      <div key={`${pkg._id}-${i}`} className="min-w-[300px] flex-shrink-0 whitespace-normal">
                        <PackageCard package={pkg} />
                      </div>
                    ));
                  })()}
                </div>
              </div>

              <div className="text-center">
                <Link
                  to="/packages"
                  className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors text-lg group"
                >
                  See All Packages
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <Testimonials />
      <ContactSection />
      <Footer />
    </div >
  );
}

export default Home;

