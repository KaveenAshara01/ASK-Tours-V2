import SEO from '../components/SEO';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import CategoryCard from '../components/CategoryCard';
import Header from '../components/Header';
import Hero from '../components/Hero';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import InquiryForm from '../components/InquiryForm';

function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <SEO
        title="Home"
        description="Welcome to ASK Travels, your premier travel agency in Sri Lanka. Explore our wide range of travel packages, from wildlife safaris to cultural travels."
        keywords="sri lanka travel agency, travel packages, wildlife safari, cultural travels, ask travels, holidays in sri lanka"
      />
      <Header />
      <Hero />


      {/* Wave Clip Path Definition */}
      <svg className="absolute w-0 h-0">
        <defs>
          <clipPath id="wave-clip" clipPathUnits="objectBoundingBox">
            <path d="M0,0.02 C0.25,0.15 0.25,0 0.5,0 S0.75,0.15 1,0.02 L1,1 L0,1 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Brand Tape Transition Style */}
      <div className="relative z-30 -mt-8 md:-mt-12">

        {/* Tape 1 (Background) */}
        <div className="absolute top-0 left-0 w-full overflow-hidden transform -rotate-1 origin-top-left">
          <div className="bg-cyan-400 py-3 shadow-lg">
            <div className="flex animate-marquee whitespace-nowrap">
              {[...Array(20)].map((_, i) => (
                <span key={i} className="mx-4 text-white font-black uppercase tracking-widest text-sm">
                  ASK TRAVELS • DISCOVER SRI LANKA •
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tape 2 (Foreground) */}
        <div className="absolute -top-4 left-0 w-full overflow-hidden transform rotate-1 origin-top-right">
          <div className="bg-primary-600 py-3 shadow-xl">
            <div className="flex animate-marquee-reverse whitespace-nowrap">
              {[...Array(20)].map((_, i) => (
                <span key={i} className="mx-4 text-white font-black uppercase tracking-widest text-lg">
                  ASK TRAVELS • UNFORGETTABLE JOURNEYS •
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      <div className="relative z-20">

        <section
          id="packages"
          className="relative pt-20 pb-12 md:pb-20 px-4 overflow-hidden bg-white"
        >
          {/* Background Overlay */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: "url('/images/hero_beach_drone.png')" }}
          />
          <div className="absolute inset-0 z-0 bg-white/70 backdrop-blur-[2px]"></div>

          <div className="relative max-w-7xl mx-auto z-10">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Explore Our Collections
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Hand-picked experiences for your perfect holiday
              </p>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-600 text-xl">No categories available at the moment.</p>
              </div>
            ) : (
              <>
                {/* Categories Carousel */}
                <div className="mb-12">
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={30}
                    loop={true}
                    autoplay={{
                      delay: 3500,
                      disableOnInteraction: false,
                    }}
                    pagination={{
                      clickable: true,
                      dynamicBullets: true,
                    }}
                    navigation={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    breakpoints={{
                      640: {
                        slidesPerView: 1,
                        spaceBetween: 20,
                      },
                      768: {
                        slidesPerView: 2,
                        spaceBetween: 30,
                      },
                      1024: {
                        slidesPerView: 3,
                        spaceBetween: 40,
                      },
                    }}
                    className="products-swiper !pb-14"
                  >
                    {categories.map((cat) => (
                      <SwiperSlide key={cat._id} className="h-auto">
                        <div className="h-full py-2 px-1">
                          <CategoryCard category={cat} />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                <div className="text-center">
                  <Link
                    to="/packages"
                    className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors text-lg group"
                  >
                    View All Packages
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </>
            )}

          </div>
          <WhyChooseUs />
        </section>
      </div>

      {/* Brand Tape Divider (Middle) */}
      <div className="relative z-30 py-12 bg-white overflow-hidden">
        {/* Tape 1 */}
        <div className="absolute top-1/2 left-0 w-full transform -translate-y-1/2 rotate-2 scale-110">
          <div className="bg-gray-900 py-4 shadow-xl border-y-2 border-yellow-400">
            <div className="flex animate-marquee whitespace-nowrap">
              {[...Array(15)].map((_, i) => (
                <span key={i} className="mx-6 text-yellow-400 font-bold uppercase tracking-[0.2em] text-xl">
                  ★ 100% TAILOR-MADE HOLIDAYS ★ ASK TRAVELS ★
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Testimonials />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default Home;
