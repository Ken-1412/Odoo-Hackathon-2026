import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CapabilityExplorer from './components/CapabilityExplorer';
import HowItWorks from './components/HowItWorks';
import ROICalculator from './components/ROICalculator';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      {/* Sticky Navigation Header */}
      <Navbar />

      {/* Main Page Layout */}
      <main className="flex-grow">
        {/* B2B Hero Section containing the Interactive Demo Screen */}
        <Hero />

        {/* Capability Explorer — 3D Carousel with Unified Controls */}
        <CapabilityExplorer />

        {/* How It Works — 4-step Process Flow */}
        <HowItWorks />

        {/* Dynamic ROI Calculator widget */}
        <ROICalculator />

        {/* Scalability and Trust Testimonials */}
        <Testimonials />
      </main>

      {/* Footer corporate notes & security logos */}
      <Footer />
    </div>
  );
}
