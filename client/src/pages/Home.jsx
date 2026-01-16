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

      {/* Wrapper for Drop Shadow (since clip-path clips normal box-shadow) */}
      <div className="relative mt-0 md:-mt-36 z-20 filter drop-shadow-2xl">
        <section
          id="packages"
          className="relative pt-24 pb-12 md:pb-20 px-4 overflow-hidden rounded-t-[3rem] md:rounded-none clip-wave-md"
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


      <Testimonials />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default Home;

