"use client";

import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Calendar, 
  Clock, 
  BarChart3, 
  Settings, 
  ChevronLeft
} from 'lucide-react';
import { useRouter, usePathname } from '../../lib/navigation.ts';
import { useStore } from '../../lib/store.tsx';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { state, isInitialized } = useStore();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (!isInitialized) return;

    if (!state.isLoggedIn && pathname !== '/login') {
      router.replace('/login');
    } else if (state.isLoggedIn && pathname === '/login') {
      router.replace('/');
    }
  }, [isInitialized, state.isLoggedIn, pathname]);

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlHeader, { passive: true });
    return () => window.removeEventListener('scroll', controlHeader);
  }, [lastScrollY]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/availability', icon: Calendar, label: 'Slots' },
    { href: '/history', icon: Clock, label: 'Log' },
    { href: '/revenue', icon: BarChart3, label: 'Sales' },
    { href: '/settings', icon: Settings, label: 'Biz' },
  ];

  const titleMap: Record<string, string> = {
    '/': 'Overview',
    '/availability': 'Availability',
    '/history': 'History',
    '/revenue': 'Revenue',
    '/settings': 'Business',
    '/add-booking': 'New Booking',
    '/confirmed': 'Confirmed',
  };

  const isPrimaryView = navItems.some(item => item.href === pathname);
  const title = titleMap[pathname] || 'TurfFlow Pro';

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-ubuntu no-scrollbar">
      {/* Dynamic Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-100 px-6 h-16 flex items-center justify-between transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="flex items-center gap-3">
          {!isPrimaryView && (
            <button 
              onClick={() => router.back()}
              className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-neutral-400 active:bg-neutral-50 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          <h1 className="text-lg font-bold text-neutral-900 tracking-tight">{title}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-neutral-900/10">
            {state.turfs[0]?.name.charAt(0) || 'T'}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-16 pb-24 px-4 overflow-x-hidden no-scrollbar">
        <div className="max-w-md mx-auto h-full">
          {children}
        </div>
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-neutral-800 px-6 pb-8 pt-4">
        <div className="max-w-md mx-auto flex justify-between items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`flex flex-col items-center transition-all duration-300 relative group focus:outline-none outline-none ring-0 ${isActive ? 'text-emerald-500' : 'text-neutral-500'}`}
              >
                <div className={`p-2.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-white/5 scale-110' : ''}`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                {isActive && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}