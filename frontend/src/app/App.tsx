import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LandingView } from './views/LandingView';
import { DashboardView } from '../features/impact-dashboard/components/DashboardView';
import { AuctionView } from '../features/matching/components/AuctionView';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface font-dmsans text-on-surface">
      <Navbar />

      <main className="flex-1 pt-20">
        <Routes>
          <Route path="/" element={<LandingView />} />
          <Route path="/dashboard" element={<DashboardView />} />
          <Route path="/auction" element={<AuctionView />} />
        </Routes>
      </main>

      <footer className="w-full bg-surface-container-low border-t border-outline-variant/30 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <span className="font-fraunces text-xl text-forest font-normal">MessMind</span>
            <span className="hidden sm:inline text-outline">·</span>
            <span className="text-xs text-on-surface-variant">
              Operational culinary intelligence and food waste telemetry
            </span>
          </div>

          <div className="text-xs text-on-surface-variant">
            © 2025 MessMind Systems Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
