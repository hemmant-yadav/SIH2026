import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '../../shared/components/Button';
import { AuthStatus } from '../../features/auth/components/AuthStatus';

export const Navbar: React.FC = () => {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface border-b border-outline-variant/30">
      <div className="h-20 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Wordmark Logo */}
        <NavLink to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-forest flex items-center justify-center text-lime font-fraunces font-bold text-lg">
            M
          </div>
          <span className="font-fraunces text-2xl text-forest tracking-tight font-normal">
            MessMind
          </span>
        </NavLink>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-sm transition-colors duration-150 ${
                isActive
                  ? 'text-forest font-bold border-b-2 border-forest pb-0.5'
                  : 'text-on-surface-variant hover:text-forest font-medium'
              }`
            }
          >
            Platform
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-sm transition-colors duration-150 ${
                isActive
                  ? 'text-forest font-bold border-b-2 border-forest pb-0.5'
                  : 'text-on-surface-variant hover:text-forest font-medium'
              }`
            }
          >
            Line Operations
          </NavLink>
          <NavLink
            to="/auction"
            className={({ isActive }) =>
              `text-sm transition-colors duration-150 ${
                isActive
                  ? 'text-forest font-bold border-b-2 border-forest pb-0.5'
                  : 'text-on-surface-variant hover:text-forest font-medium'
              }`
            }
          >
            Live Flash Auction
          </NavLink>
        </nav>

        {/* CTA & Auth Actions */}
        <div className="flex items-center gap-4">
          <AuthStatus />
          <Button variant="primary" href="#audit">
            Book a Demo
          </Button>
        </div>
      </div>
    </header>
  );
};
