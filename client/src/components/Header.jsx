import { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/images/ameliyalogo.jpg"
              alt="Ameliya Elephant Safari Service"
              className="h-14 w-auto object-contain rounded-md"
            />
            <span className="hidden md:block text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary-700 to-cyan-700 bg-clip-text text-transparent">
              Ameliya Elephant Safari Service
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-primary-600 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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
            <Link to="/packages" className="text-gray-700 hover:text-primary-600 transition-colors">
              Packages
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary-600 transition-colors">
              About Us
            </Link>
            <a href="#contact" className="text-gray-700 hover:text-primary-600 transition-colors">
              Contact
            </a>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in-down">
            <div className="flex flex-col space-y-4 px-2">
              <Link
                to="/packages"
                className="text-gray-700 hover:text-primary-600 transition-colors px-4 py-2 hover:bg-gray-50 rounded-lg text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Packages
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-primary-600 transition-colors px-4 py-2 hover:bg-gray-50 rounded-lg text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <a
                href="#contact"
                className="text-gray-700 hover:text-primary-600 transition-colors px-4 py-2 hover:bg-gray-50 rounded-lg text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;

