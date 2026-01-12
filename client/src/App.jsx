import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './pages/Home';
import About from './pages/About';
import Packages from './pages/Packages';
import AdminDashboard from './pages/AdminDashboard';
import PackageDetails from './pages/PackageDetails';
import CategoryPackages from './pages/CategoryPackages';
import AdminLogin from './pages/AdminLogin';

import FloatingWhatsApp from './components/FloatingWhatsApp';
import ScrollToTop from './components/ScrollToTop';
import LanguageSuggester from './components/LanguageSuggester';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <LanguageSuggester />
        <ScrollToTop />
        <FloatingWhatsApp />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/package/:id" element={<PackageDetails />} />
          <Route path="/category/:id" element={<CategoryPackages />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;

