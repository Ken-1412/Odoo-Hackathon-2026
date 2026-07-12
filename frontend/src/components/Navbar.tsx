import { useState } from 'react';
import { Menu, X, Layers } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Benefits', href: '#roi-calculator' },
    { name: 'Documentation', href: '#docs' },
  ];

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-surface-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-md bg-brand-900 flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-surface-900 font-sans">
              Asset<span className="text-brand-900">Flow</span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-surface-650 hover:text-brand-900 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop CTA Login Button */}
          <div className="hidden md:flex items-center">
            <a
              href="#login"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-bold bg-brand-900 hover:bg-brand-800 text-white shadow-sm transition-all font-sans"
            >
              Login
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-surface-600 hover:text-surface-900 hover:bg-surface-100 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`md:hidden transition-all duration-200 ease-in-out ${
        isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
      } overflow-hidden bg-white border-t border-surface-200`}>
        <div className="px-4 pt-2 pb-6 space-y-3 shadow-inner">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-semibold text-surface-700 hover:text-brand-900 hover:bg-surface-100"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 border-t border-surface-250 flex flex-col px-3">
            <a
              href="#login"
              onClick={() => setIsOpen(false)}
              className="text-center py-2.5 rounded-md text-base font-bold bg-brand-900 hover:bg-brand-800 text-white shadow-sm"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
