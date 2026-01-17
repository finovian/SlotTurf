"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Calendar, 
  Clock, 
  BarChart3, 
  Settings, 
  ChevronLeft
} from 'lucide-react';
import { useUIStore } from '../../lib/store';
import { useTurfs } from '../../hooks/use-data';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { owner } = useUIStore();
  const { data: turfs = [] } = useTurfs();
  const pathname = usePathname();

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/dashboard/availability', icon: Calendar, label: 'Slots' },
    { href: '/dashboard/history', icon: Clock, label: 'Log' },
    { href: '/dashboard/revenue', icon: BarChart3, label: 'Sales' },
    { href: '/dashboard/settings', icon: Settings, label: 'Biz' },
  ];

  const titleMap: { [key: string]: string } = {
    '/dashboard': 'Overview',
    '/dashboard/availability': 'Availability',
    '/dashboard/history': 'History',
    '/dashboard/revenue': 'Revenue',
    '/settings': 'Business',
    '/add-booking': 'New Booking',
    '/booking-confirmed': 'Confirmed',
    '/customers': 'Clients',
    '/settings/turfs': 'Turf Settings',
    '/settings/profile': 'Edit Profile',
  };

  const isPrimaryView = navItems.some(item => item.href === pathname);
  const title = titleMap[pathname] || 'TurfFlow Pro';

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-ubuntu no-scrollbar">
      <header 
        className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-100 px-6 h-16 flex items-center justify-between transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="flex items-center gap-3">
          {!isPrimaryView && (
            <Link 
              href="/dashboard"
              className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-neutral-400 active:bg-neutral-50 transition-colors"
            >
              <ChevronLeft size={24} />
            </Link>
          )}
          <h1 className="text-lg font-bold text-neutral-900 tracking-tight">{title}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-neutral-900/10">
            {turfs[0]?.name.charAt(0) || 'T'}
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16 pb-24 px-4 overflow-x-hidden no-scrollbar">
        <div className="max-w-md mx-auto h-full">
          {children}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-neutral-800 px-6 pb-8 pt-4">
        <div className="max-w-md mx-auto flex justify-between items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center transition-all duration-300 relative group focus:outline-none outline-none ring-0 ${isActive ? 'text-emerald-500' : 'text-neutral-500'}`}
              >
                <div className={`p-2.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-white/5 scale-110' : ''}`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                {isActive && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
