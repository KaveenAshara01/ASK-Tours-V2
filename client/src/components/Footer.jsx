import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-white pt-12 md:pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & Description */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
              ASK Tours
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Your trusted travel partner in Sri Lanka. We craft personalized journeys, from thrilling safaris to serene beach escapes.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/packages" className="hover:text-white transition-colors">Packages</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: contact@asktours.com</li>
              <li>WhatsApp: +1 234 567 890</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} ASK Tours. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;


