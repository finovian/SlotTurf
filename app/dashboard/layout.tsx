"use client";

import { useStore } from "@/lib/store";
import {
  BarChart3,
  Bell,
  Calendar,
  ChevronLeft,
  Clock,
  Home,
  Search as SearchIcon,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({
  children,
}: LayoutProps) {
  const { state } = useStore();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();

  const pathname = usePathname();

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

    window.addEventListener("scroll", controlHeader, { passive: true });
    return () => window.removeEventListener("scroll", controlHeader);
  }, [lastScrollY]);

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/dashboard/availability", icon: Calendar, label: "Slots" },
    { href: "/dashboard/history", icon: Clock, label: "History" },
    { href: "/dashboard/revenue", icon: BarChart3, label: "Revenue" },
    { href: "/dashboard/settings", icon: Settings, label: "Profile" },
  ];

  const titleMap: { [key: string]: string } = {
    "/dashboard": "Overview",
    "/dashboard/availability": "Availability",
    "/dashboard/history": "History",
    "/dashboard/revenue": "Revenue",
    "/dashboard/settings": "Business",
    "/dashboard/availability/add-booking": "New Booking",
    "/dashboard/availability/add-booking/confirmed": "Confirmed",
    "/dashboard/settings/customers": "Clients",
    "/dashboard/settings/turfs": "Turf Settings",
    "/dashboard/settings/profile": "Edit Profile",
  };

  const isPrimaryView = navItems.some((item) => item.href === pathname);
  const title = titleMap[pathname] || "TurfFlow Pro";

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-ubuntu scrollbar-hide">
      {/* SaaS Sidebar (Desktop only) */}
      <aside className="hidden lg:flex w-72 h-screen fixed left-0 top-0 bg-white border-r border-neutral-100 flex-col z-60">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-xl shadow-neutral-900/10">
            T
          </div>
          <div>
            <h1 className="text-lg font-bold text-neutral-900 tracking-tight leading-none">
              TurfFlow
            </h1>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">
              SaaS Edition
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                  isActive
                    ? "bg-neutral-900 text-white shadow-lg shadow-neutral-900/10"
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                }`}
              >
                <Icon
                  size={20}
                  className={
                    isActive
                      ? "text-emerald-400"
                      : "text-neutral-400 group-hover:text-neutral-900"
                  }
                />
                <span className="text-sm font-bold">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6">
          <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
              Workspace
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white border border-neutral-200 rounded-lg flex items-center justify-center text-neutral-900 font-bold text-xs">
                {state.turfs[0]?.name.charAt(0) || "T"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-neutral-900 truncate">
                  {state.turfs[0]?.name || "Loading..."}
                </p>
                <p className="text-[9px] text-neutral-400 font-medium">
                  Free Tier
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col lg:pl-72 min-h-screen">
        {/* Dynamic Header */}
        <header
          className={`fixed top-0 left-0 right-0 lg:left-72 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100 px-6 h-16 flex items-center justify-between transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
        >
          <div className="flex items-center gap-3">
            {!isPrimaryView && (
              <div
                onClick={() => router.back()}
                className="cursor-pointer w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-neutral-400 active:bg-neutral-50 transition-colors"
              >
                <ChevronLeft size={24} />
              </div>
            )}
            <h1 className="text-lg font-bold text-neutral-900 tracking-tight">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-neutral-50 border border-neutral-100 rounded-xl text-neutral-400">
              <SearchIcon size={16} />
              <span className="text-xs font-medium">Search anything...</span>
            </div>
            <button className="relative p-2 text-neutral-400 hover:text-neutral-900 transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
            </button>
            <div className="w-10 h-10 bg-neutral-900 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-neutral-900/10 cursor-pointer">
              {state.owner?.owner_name?.charAt(0) || "U"}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 pt-16 pb-24 lg:pb-8 px-4 lg:px-8 overflow-x-hidden no-scrollbar">
          <div className="max-w-5xl mx-auto h-full w-full">{children}</div>
        </main>
      </div>

      {/* Navigation Bar (Mobile only) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-neutral-800 px-6 pb-8 pt-4 lg:hidden">
        <div className="max-w-md mx-auto flex justify-between items-center">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center transition-all duration-300 relative group focus:outline-none outline-none ring-0 ${isActive ? "text-emerald-500" : "text-neutral-500"}`}
              >
                <div
                  className={`p-2.5 rounded-2xl transition-all duration-300 ${isActive ? "bg-white/5 scale-110" : ""}`}
                >
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
