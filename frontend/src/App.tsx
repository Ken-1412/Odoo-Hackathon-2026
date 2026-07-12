import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CapabilityExplorer from './components/CapabilityExplorer';
import HowItWorks from './components/HowItWorks';
import ROICalculator from './components/ROICalculator';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import AdminPortal from './components/AdminPortal';
import { LoginPage } from './components/ui/animated-characters-login-page';
import { isLoggedIn, login, register, logout, getCachedUser } from './lib/auth';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isAdminView, setIsAdminView] = useState(false);
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  // Check auth state on mount
  useEffect(() => {
    if (isLoggedIn()) {
      setIsAuthenticated(true);
      const user = getCachedUser();
      if (user) {
        setUsername(user.username);
        if (user.role === "Administrator") {
          setIsAdminView(true);
        }
      }
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
    setIsAuthenticated(true);
    const user = getCachedUser();
    if (user) {
      setUsername(user.username);
      if (user.role === "Administrator") {
        setIsAdminView(true);
      }
    }
    setShowLogin(false);
  };

  const handleRegister = async (email: string, password: string, usernameInput: string) => {
    await register(email, password, usernameInput);
    setIsAuthenticated(true);
    const user = getCachedUser();
    if (user) {
      setUsername(user.username);
      if (user.role === "Administrator") {
        setIsAdminView(true);
      }
    }
    setShowLogin(false);
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setUsername(null);
    setIsAdminView(false);
  };

  // If authenticated, show either the AdminPortal or the Employee Dashboard
  if (isAuthenticated) {
    if (isAdminView) {
      return (
        <AdminPortal
          username={username}
          onLogout={handleLogout}
          onSwitchToEmployee={() => setIsAdminView(false)}
          themeMode={themeMode}
          setThemeMode={setThemeMode}
        />
      );
    }
    return (
      <Dashboard
        username={username}
        onLogout={handleLogout}
        onSwitchToAdmin={() => setIsAdminView(true)}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
      />
    );
  }

  // Otherwise, render public landing page
  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      {/* Sticky Navigation Header */}
      <Navbar 
        isAuthenticated={isAuthenticated}
        username={username}
        onLoginClick={() => setShowLogin(true)}
        onLogoutClick={handleLogout}
      />

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

      {/* Animated Characters Login overlay */}
      {showLogin && (
        <LoginPage
          onLogin={handleLogin}
          onRegister={handleRegister}
          onClose={() => setShowLogin(false)}
        />
      )}
    </div>
  );
}
