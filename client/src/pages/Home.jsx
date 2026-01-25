import SEO from '../components/SEO';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectCreative } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-creative';
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
      <div className="relative z-30">

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
          className="relative pt-28 pb-24 px-0 bg-white"
        >
          {/* Stark Minimalist Background - No textures, just structure */}
          <div className="absolute inset-0 border-b border-gray-100"></div>

          <div className="relative max-w-[1920px] mx-auto z-10 px-4 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 px-4">
              <div className="max-w-4xl">
                <span className="block text-gray-400 font-bold tracking-[0.4em] uppercase mb-6 text-xs md:text-sm">
                  The Collections
                </span>
                <h2 className="text-5xl md:text-8xl font-black text-gray-900 mb-0 font-sans tracking-tighter leading-[0.9] uppercase">
                  Discover<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">Sri Lanka</span>
                </h2>
              </div>
              <div className="mt-8 md:mt-0 md:mb-4 hidden md:block">
                <Link
                  to="/packages"
                  className="inline-flex items-center gap-3 text-gray-900 text-sm font-bold uppercase tracking-widest hover:text-primary-600 transition-colors group"
                >
                  View All
                  <div className="w-12 h-px bg-current group-hover:w-16 transition-all duration-300"></div>
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-40">
                <div className="inline-block h-1 w-24 bg-gray-200 overflow-hidden">
                  <div className="h-full bg-gray-900 animate-progress"></div>
                </div>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-xl font-light">No categories found.</p>
              </div>
            ) : (
              <>
                {/* Editorial Swiper - Full Width Feel */}
                <div className="mb-20">
                  <Swiper
                    spaceBetween={2}
                    slidesPerView={1.1}
                    loop={true}
                    autoplay={{
                      delay: 5000,
                      disableOnInteraction: false,
                    }}
                    speed={1000}
                    pagination={{
                      clickable: true,
                      modifierClass: 'swiper-pagination-custom-',
                      renderBullet: function (index, className) {
                        return '<span class="' + className + ' !bg-gray-900 !w-2 !h-2 !rounded-none !opacity-20 swiper-pagination-bullet-active:!opacity-100 swiper-pagination-bullet-active:!scale-150 transition-all duration-500"></span>';
                      },
                    }}
                    navigation={{
                      nextEl: '.swiper-button-next-custom',
                      prevEl: '.swiper-button-prev-custom',
                    }}
                    modules={[Autoplay, Pagination, Navigation]}
                    breakpoints={{
                      640: {
                        slidesPerView: 2.2,
                        spaceBetween: 4,
                      },
                      1024: {
                        slidesPerView: 3.2,
                        spaceBetween: 8, // Very tight editorial gap
                      },
                      1600: {
                        slidesPerView: 3.5,
                        spaceBetween: 10,
                      }
                    }}
                    className="products-swiper !pb-20 !px-0"
                  >
                    {categories.map((cat) => (
                      <SwiperSlide key={cat._id} className="h-auto">
                        <CategoryCard category={cat} />
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Custom Navigation */}
                  <div className="flex justify-between items-center px-4 md:px-0 mt-4 max-w-[1920px] mx-auto absolute top-1/2 left-0 w-full z-20 pointer-events-none transform -translate-y-1/2">
                    <button className="swiper-button-prev-custom pointer-events-auto w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-white hover:bg-black text-black hover:text-white transition-all duration-300 shadow-xl">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button className="swiper-button-next-custom pointer-events-auto w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-white hover:bg-black text-black hover:text-white transition-all duration-300 shadow-xl">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </div>

                <div className="text-center md:hidden pb-12">
                  <Link
                    to="/packages"
                    className="inline-block px-8 py-4 bg-gray-900 text-white font-bold uppercase tracking-widest text-xs"
                  >
                    View All Collections
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
