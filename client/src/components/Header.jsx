import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';

function Header() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scrolling when menu is open
  if (typeof document !== 'undefined') {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  const navLinks = [
    { name: t('packages'), path: '/packages', type: 'link' },
    { name: 'Experiences', path: '/experiences', type: 'link' },
    { name: 'Events', path: '/events', type: 'link' },
    { name: 'Gallery', path: '/gallery', type: 'link' },
    { name: t('about'), path: '/about', type: 'link' },
    { name: t('contact'), path: '#contact', type: 'anchor' },
  ];

  // Determine header and text colors based on state
  // If Scrolled OR Menu Open (on mobile) -> White bg, Dark Text/Logo
  // If Top AND Menu Closed -> Transparent bg, White Text/Logo
  const isDarkState = isScrolled || isMenuOpen;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isDarkState ? 'bg-white shadow-sm py-3' : 'bg-transparent py-5'
          }`}
      >
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center transition-all duration-300">
            <Link to="/" className="flex items-center z-50" onClick={() => setIsMenuOpen(false)}>
              <Logo
                className="h-16 md:h-20 w-auto transition-all duration-300"
                color={isDarkState ? '#003580' : 'white'}
              />
            </Link>

            {/* Mobile Menu Button - Sharp & Clean */}
            <button
              className="md:hidden p-2 focus:outline-none z-50 rounded-none transition-colors border-2 border-transparent"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className={`w-8 h-8 ${isDarkState ? 'text-black' : 'text-white'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Desktop Navigation - Editorial Style */}
            <nav className="hidden md:flex space-x-12 items-center">
              {navLinks.map((link, index) => (
                link.type === 'link' ? (
                  <Link
                    key={index}
                    to={link.path}
                    className={`font-black text-sm uppercase tracking-widest transition-all duration-300 border-b-2 border-transparent hover:border-current ${isDarkState ? 'text-primary-950 hover:text-primary-700' : 'text-white hover:text-secondary-500'}`}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={index}
                    href={link.path}
                    className={`font-black text-sm uppercase tracking-widest transition-all duration-300 border-b-2 border-transparent hover:border-current ${isDarkState ? 'text-primary-950 hover:text-primary-700' : 'text-white hover:text-secondary-500'}`}
                  >
                    {link.name}
                  </a>
                )
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay - Stark White */}
      <div
        className={`fixed inset-0 z-40 bg-white transition-transform duration-500 ease-in-out md:hidden flex flex-col justify-start items-center pt-32 ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
      >
        <div className="flex flex-col space-y-8 text-center p-4 overflow-y-auto max-h-full pb-20">
          {navLinks.map((link, index) => (
            link.type === 'link' ? (
              <Link
                key={index}
                to={link.path}
                className="text-4xl font-black uppercase tracking-tighter text-black hover:text-gray-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ) : (
              <a
                key={index}
                href={link.path}
                className="text-4xl font-black uppercase tracking-tighter text-black hover:text-gray-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            )
          ))}

          <div className="mt-16 pt-16 border-t font-bold border-gray-200 w-48 mx-auto">
            <p className="text-gray-900 text-xs tracking-[0.4em] uppercase">ASK Travels</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;

