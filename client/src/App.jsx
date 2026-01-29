import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Packages from './pages/Packages';
import AdminDashboard from './pages/AdminDashboard';
import PackageDetails from './pages/PackageDetails';
import CategoryPackages from './pages/CategoryPackages';
import AdminLogin from './pages/AdminLogin';
import Experiences from './pages/Experiences';
import ActivityDetails from './pages/ActivityDetails';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';

import ScrollToTop from './components/ScrollToTop';
import LanguageSuggester from './components/LanguageSuggester';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <LanguageSuggester />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/package/:id" element={<PackageDetails />} />
          <Route path="/category/:id" element={<CategoryPackages />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/experiences/:id" element={<ActivityDetails />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
