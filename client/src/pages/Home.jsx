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
  const [activities, setActivities] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [catRes, actRes, evtRes] = await Promise.all([
        axios.get('/api/categories'),
        axios.get('/api/activities'),
        axios.get('/api/events')
      ]);
      setCategories(catRes.data);
      setActivities(actRes.data);
      setEvents(evtRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
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
                <span key={i} className="mx-4 text-white font-black uppercase tracking-widest text-sm notranslate">
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
                <span key={i} className="mx-4 text-white font-black uppercase tracking-widest text-lg notranslate">
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
          className="relative pt-16 pb-12 px-0 bg-white"
        >
          {/* Stark Minimalist Background - No textures, just structure */}
          <div className="absolute inset-0 border-b border-gray-100"></div>

          <div className="relative max-w-[1920px] mx-auto z-10 px-4 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 px-4">
              <div className="max-w-4xl">
                <span className="block text-gray-400 font-bold tracking-[0.4em] uppercase mb-6 text-xs md:text-sm">
                  The Collections
                </span>
                <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-0 font-sans tracking-tighter leading-[0.9] uppercase">
                  Travel<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600 pr-4">Collections</span>
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
                {/* Editorial Swiper - Collections */}
                <div className="mb-12">
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

                {/* --- EXPERIENCES SECTION --- */}
                {activities.length > 0 && (
                  <div className="mb-16 px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
                      <div>
                        <span className="block text-gray-400 font-bold tracking-[0.4em] uppercase mb-4 text-xs">
                          Most Loved
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                          Popular<br /><span className="text-primary-600">Experiences</span>
                        </h2>
                      </div>
                      <Link to="/experiences" className="hidden md:inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-primary-600 transition-colors">
                        View All Experiences <span className="text-xl">→</span>
                      </Link>
                    </div>

                    <Swiper
                      spaceBetween={20}
                      slidesPerView={1.2}
                      breakpoints={{
                        640: { slidesPerView: 2.2 },
                        1024: { slidesPerView: 3.5 },
                      }}
                      modules={[Navigation]}
                      navigation={{
                        nextEl: '.activity-next-custom',
                        prevEl: '.activity-prev-custom',
                      }}
                      className="!pb-10"
                    >
                      {activities.map((activity) => (
                        <SwiperSlide key={activity._id} className="group cursor-pointer">
                          <Link to={`/experiences/${activity._id}`} className="block relative aspect-[4/5] overflow-hidden bg-gray-100">
                            {activity.images?.[0] ? (
                              <img
                                src={activity.images[0]}
                                alt={activity.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                                No Image
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                            <div className="absolute bottom-0 left-0 p-6 w-full text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                              <h3 className="text-2xl font-bold uppercase tracking-tight mb-2">{activity.title}</h3>
                              {activity.location && (
                                <p className="text-sm font-medium opacity-80 flex items-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                  {activity.location}
                                </p>
                              )}
                            </div>
                          </Link>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    {/* Activity Navigation */}
                    <div className="flex justify-between items-center px-4 md:px-0 mt-4 max-w-[1920px] mx-auto absolute top-1/2 left-0 w-full z-20 pointer-events-none transform -translate-y-1/2">
                      <button className="activity-prev-custom pointer-events-auto w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-white hover:bg-black text-black hover:text-white transition-all duration-300 shadow-xl">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <button className="activity-next-custom pointer-events-auto w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-white hover:bg-black text-black hover:text-white transition-all duration-300 shadow-xl">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </div>
                    <div className="md:hidden mt-6 text-center">
                      <Link to="/experiences" className="text-sm font-bold uppercase tracking-widest border-b border-gray-900 pb-1">View All Experiences</Link>
                    </div>
                  </div>
                )}

                {/* --- EVENTS SECTION (BANNER STYLE) --- */}
                {events.length > 0 && (
                  <div className="mb-16 px-4 md:px-12 max-w-[1920px] mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
                      <div>
                        <span className="block text-gray-400 font-bold tracking-[0.4em] uppercase mb-4 text-xs">
                          Mark Your Calendar
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                          Upcoming<br /><span className="text-primary-600">Happenings</span>
                        </h2>
                      </div>
                      <Link to="/events" className="hidden md:inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-primary-600 transition-colors">
                        View All Events <span className="text-xl">→</span>
                      </Link>
                    </div>

                    <Swiper
                      spaceBetween={20}
                      slidesPerView={1.2}
                      breakpoints={{
                        640: { slidesPerView: 2.2 },
                        1024: { slidesPerView: 3.2 },
                      }}
                      className="!pb-10"
                    >
                      {events.map((event) => {
                        const dateObj = new Date(event.startDate);
                        const month = dateObj.toLocaleString('default', { month: 'short' });
                        const day = dateObj.getDate();
                        const formattedDay = day < 10 ? `0${day}` : day;
                        const getSuffix = (d) => {
                          if (d > 3 && d < 21) return 'th';
                          switch (d % 10) {
                            case 1: return "st";
                            case 2: return "nd";
                            case 3: return "rd";
                            default: return "th";
                          }
                        };
                        const suffix = getSuffix(day);

                        return (
                          <SwiperSlide key={event._id} className="group h-auto">
                            <Link to={`/events/${event._id}`} className="block relative h-[450px] w-full overflow-hidden bg-gray-900">
                              {/* Background Image */}
                              {event.images?.[0] ? (
                                <img
                                  src={event.images[0]}
                                  alt={event.title}
                                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90"
                                />
                              ) : (
                                <div className="absolute inset-0 bg-gray-800"></div>
                              )}

                              {/* Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                              {/* Date Badge - Custom Design */}
                              <div className="absolute top-4 left-4 bg-white px-4 py-3 rounded-lg text-center shadow-lg min-w-[80px]">
                                <div className="flex items-start justify-center leading-none">
                                  <span className="text-4xl font-black text-black tracking-tighter">
                                    {formattedDay}
                                  </span>
                                  <span className="text-sm font-bold text-black mt-1">
                                    {suffix}
                                  </span>
                                </div>
                                <span className="block text-sm font-black text-black uppercase tracking-widest mt-1">
                                  {month.toUpperCase()}
                                </span>
                              </div>

                              {/* Content Container - Editorial Style */}
                              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
                                <div className="border-l-2 border-primary-500 pl-4 transition-all duration-300 group-hover:border-white">
                                  <span className="block text-gray-300 text-xs font-bold tracking-[0.2em] uppercase mb-2">
                                    Upcoming Event
                                  </span>
                                  <h3 className="text-2xl md:text-3xl font-black text-white mb-2 font-sans tracking-tight uppercase leading-none">
                                    {event.title}
                                  </h3>
                                  <div className="flex items-center text-primary-400 text-xs font-bold uppercase tracking-widest mt-3 group-hover:text-white transition-colors">
                                    View Details <span className="ml-2">→</span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </SwiperSlide>
                        )
                      })}
                    </Swiper>

                    <div className="md:hidden mt-8 text-center">
                      <Link to="/events" className="text-sm font-bold uppercase tracking-widest border-b border-gray-900 pb-1">View All Events</Link>
                    </div>
                  </div>
                )}

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
