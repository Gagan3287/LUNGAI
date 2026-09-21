'use client';

import React, { useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { MotionConfig } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

/**
 * ClientLayout: wraps all layout chrome that requires client-side interactivity.
 *
 * Responsibilities:
 * - ThemeProvider: Provides light/dark theme switching and documentElement class updates
 * - Detects if route is public landing page ("/") vs internal workstation routes
 * - Manages isMobileMenuOpen state shared between Header (hamburger toggle) and Sidebar (drawer)
 * - Wraps the entire tree in <MotionConfig reducedMotion="user"> for prefers-reduced-motion.
 */
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const openMobileMenu = useCallback(() => setIsMobileMenuOpen(true), []);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  // Public routes ("/" and "/login") do not render the internal workstation sidebar & workstation header
  const isPublicRoute = pathname === '/' || pathname === '/login';

  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        {isPublicRoute ? (
          <div className="min-h-screen transition-colors duration-300 bg-[#050A14] text-slate-100">
            {children}
          </div>
        ) : (
          <div className="flex min-h-screen transition-colors duration-300">
            {/* Fixed Left Sidebar — drawer on mobile, always-visible on lg+ */}
            <Sidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />

            {/* Main Workstation Content Area */}
            <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
              <Header onToggleMobileMenu={openMobileMenu} />
              <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        )}
      </MotionConfig>
    </ThemeProvider>
  );
}
