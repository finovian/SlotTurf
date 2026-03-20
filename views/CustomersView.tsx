"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Booking, Turf } from "../types";
import { Search, User, Phone, ArrowRight, Star, MapPin } from "lucide-react";
import { ListSkeleton } from "../components/Skeleton";
import TurfSelector from "../components/TurfSelector";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

interface CustomersViewProps {
  bookings: Booking[];
  turfs: Turf[];
  selectedTurfId: string | null;
  onTurfSelect: (id: string | null) => void;
  onCustomerSelect: (mobile: string) => void;
}

const CustomersView: React.FC<CustomersViewProps> = ({
  bookings,
  turfs,
  selectedTurfId,
  onTurfSelect,
  onCustomerSelect,
}) => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "repeat" | "cancelled">(
    "all",
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const customerMap = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        mobile: string;
        total: number;
        cancelledCount: number;
        lastDate: string; // stored as "YYYY-MM-DD"
        activeCount: number;
      }
    >();

    bookings.forEach((b) => {
      // Filter by turf first if selected
      if (selectedTurfId && selectedTurfId !== "all" && b.turfID !== selectedTurfId) {
        return;
      }

      // date is normalized to "YYYY-MM-DD"
      const dateKey = dayjs.utc(b.date).format("YYYY-MM-DD");

      const existing = map.get(b.client_mobile);
      if (existing) {
        existing.total += 1;
        if (b.status === "cancelled") existing.cancelledCount += 1;
        else existing.activeCount += 1;
        // Compare as plain strings — "YYYY-MM-DD" sorts correctly
        if (dateKey > existing.lastDate) existing.lastDate = dateKey;
      } else {
        map.set(b.client_mobile, {
          name: b.client_name,
          mobile: b.client_mobile,
          total: 1,
          cancelledCount: b.status === "cancelled" ? 1 : 0,
          activeCount: b.status !== "cancelled" ? 1 : 0,
          lastDate: dateKey,
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [bookings, selectedTurfId]);

  const filteredCustomers = useMemo(() => {
    return customerMap.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.mobile.includes(searchTerm);
      if (!matchesSearch) return false;

      if (filterMode === "repeat") return c.activeCount >= 2;
      if (filterMode === "cancelled") return c.cancelledCount > 0;
      return true;
    });
  }, [customerMap, searchTerm, filterMode]);

  const selectedTurfName = selectedTurfId === "all" || !selectedTurfId
    ? "All Grounds"
    : turfs.find(t => t.id === selectedTurfId)?.name || "Ground";

  if (loading) return <ListSkeleton />;

  return (
    <div className="py-4 space-y-6 animate-in fade-in duration-500">
      {/* Header with Selector */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">
          Clients
        </h2>
        {turfs?.length > 1 && (
          <TurfSelector
            turfs={turfs}
            selectedTurfId={selectedTurfId}
            onSelect={onTurfSelect}
            allowAll={true}
          />
        )}
      </div>

      {/* Selected Info */}
      <div className="px-2">
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">
          Results for: <span className="text-emerald-600">{selectedTurfName}</span>
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search customers..."
          className="text-black placeholder:text-[#a1a1a1] w-full h-14 bg-white border border-neutral-100 rounded-2xl pl-12 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 transition-all font-bold text-sm shadow-sm shadow-black/5"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Quick Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-1">
        {[
          { id: "all", label: "All Clients" },
          { id: "repeat", label: "Repeat" },
          { id: "cancelled", label: "Has Cancelled" },
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => setFilterMode(mode.id as any)}
            className={`cursor-pointer shrink-0 px-5 h-10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              filterMode === mode.id
                ? "bg-neutral-900 text-white shadow-lg shadow-black/20"
                : "bg-white text-neutral-400 border border-neutral-100"
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            {filterMode === "repeat" ? "Top Clients" : "Client List"} (
            {filteredCustomers.length})
          </h3>
        </div>

        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <button
              key={customer.mobile}
              onClick={() => onCustomerSelect(customer.mobile)}
              className="cursor-pointer w-full bg-white p-5 rounded-[28px] border border-neutral-100 shadow-sm flex items-center justify-between hover:bg-neutral-50 active:scale-[0.98] transition-all text-left focus:outline-none"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    customer.activeCount >= 2
                      ? "bg-emerald-900 text-emerald-400"
                      : "bg-neutral-100 text-neutral-400"
                  }`}
                >
                  {customer.activeCount >= 2 ? (
                    <Star size={20} fill="currentColor" />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">{customer.name}</h4>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-tight">
                    <Phone size={10} /> {customer.mobile}
                  </div>
                </div>
              </div>

              <div className="text-right flex items-center gap-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-neutral-900">
                    {customer.activeCount} Bookings
                  </p>
                  <p className="text-[10px] font-bold text-neutral-300 uppercase">
                    Last: {dayjs(customer.lastDate).format("D MMM")}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-300">
                  <ArrowRight size={14} />
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="py-20 text-center bg-white rounded-4xl border border-neutral-100">
            <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest">
              No clients found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomersView;