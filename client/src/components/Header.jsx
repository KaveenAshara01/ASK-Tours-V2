import { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prevent scrolling when menu is open
  if (typeof document !== 'undefined') {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  const navLinks = [
    { name: 'Packages', path: '/packages', type: 'link' },
    { name: 'About Us', path: '/about', type: 'link' },
    { name: 'Contact', path: '#contact', type: 'anchor' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isMenuOpen ? 'bg-transparent' : 'bg-white/80 backdrop-blur-md shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center gap-3 z-50" onClick={() => setIsMenuOpen(false)}>
              <img
                src="/images/ameliyalogo.jpg"
                alt="Ameliya Elephant Safari Service"
                className="h-10 md:h-14 w-auto object-contain rounded-md shadow-sm"
              />
              <span className={`text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary-700 to-cyan-700 bg-clip-text text-transparent ${isMenuOpen ? 'opacity-0 md:opacity-100' : 'opacity-100'} transition-opacity`}>
                ASK Tours
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-800 focus:outline-none z-50 bg-white/50 rounded-full backdrop-blur-sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link, index) => (
                link.type === 'link' ? (
                  <Link key={index} to={link.path} className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                    {link.name}
                  </Link>
                ) : (
                  <a key={index} href={link.path} className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                    {link.name}
                  </a>
                )
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-white/95 backdrop-blur-xl transition-transform duration-500 ease-in-out md:hidden flex flex-col justify-center items-center ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
      >
        <div className="flex flex-col space-y-8 text-center p-4">
          {navLinks.map((link, index) => (
            link.type === 'link' ? (
              <Link
                key={index}
                to={link.path}
                className="text-3xl font-bold text-gray-800 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ) : (
              <a
                key={index}
                href={link.path}
                className="text-3xl font-bold text-gray-800 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            )
          ))}

          <div className="mt-12 pt-12 border-t border-gray-200 w-48 mx-auto">
            <p className="text-gray-400 text-sm tracking-widest uppercase">Experience the Wild</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;

