"use client";

import React, { useState } from "react";
import { AgendaItem, Turf } from "../types";
import {
  Calendar,
  Users,
  Clock,
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle2,
  ChevronRight,
  LayoutGrid,
  Phone,
} from "lucide-react";
import { CardSkeleton } from "../components/Skeleton";
import ConfirmationModal from "../components/Modal";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useCancelBooking } from "@/hooks/use-data";
import { useQueryClient } from "@tanstack/react-query";

dayjs.extend(utc);

interface DashboardViewProps {
  turfs: Turf[];
  ownerName: string;
  confirmedSlots: number;
  traffic: number;
  totalGrounds: number;
  todayAgenda: AgendaItem[];
  nextOutlook: AgendaItem[];
  isLoading?: boolean;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  ownerName,
  confirmedSlots,
  traffic,
  totalGrounds,
  todayAgenda,
  nextOutlook,
  isLoading,
}) => {
  const [activeItem, setActiveItem] = useState<AgendaItem | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const cancelBooking = useCancelBooking();
  const queryClient = useQueryClient();

  console.log('todayAgenda', todayAgenda)

  const clayShadow =
    "shadow-[10px_10px_20px_rgba(0,0,0,0.05),inset_-6px_-6px_12px_rgba(0,0,0,0.05),inset_6px_6px_12px_rgba(255,255,255,0.8)]";
  const darkClayShadow =
    "shadow-[10px_10px_20px_rgba(0,0,0,0.2),inset_-6px_-6px_12px_rgba(255,255,255,0.1),inset_6px_6px_12px_rgba(0,0,0,0.2)]";

  const formatTime = (utcTime: string) =>
    dayjs.utc(utcTime).local().format("HH:mm");

  const formatDate = (utcTime: string) =>
    dayjs.utc(utcTime).local().format("YYYY-MM-DD");

  if (isLoading) {
    return (
      <div className="py-6 px-6">
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="py-6 px-6 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-xl mx-auto">
      {/* Header */}
      <div className="pt-2">
        <p className="text-xs text-neutral-400 font-medium">
          {dayjs().format("dddd, D MMM")}
        </p>
        <h1 className="text-xl font-bold text-neutral-900 mt-0.5">
          Hi, {ownerName?.split(" ")[0]} 👋
        </h1>
      </div>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4">
        <div
          className={`col-span-2 bg-neutral-900 rounded-[48px] p-8 text-white flex flex-col justify-between ${darkClayShadow}`}
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              Today's Bookings
            </span>
            <div className="p-3 bg-white/10 rounded-2xl">
              <CheckCircle2 size={20} className="text-emerald-400" />
            </div>
          </div>
          <div className="mt-6">
            <p className="text-5xl font-bold tracking-tighter">
              {confirmedSlots}
            </p>
            <p className="text-[11px] text-emerald-500 font-bold uppercase mt-1 tracking-widest">
              Slots Booked
            </p>
          </div>
        </div>

        <div
          className={`bg-white rounded-[40px] p-6 flex flex-col justify-between ${clayShadow}`}
        >
          <Users size={18} className="text-neutral-400" />
          <div className="mt-4">
            <p className="text-3xl font-bold text-neutral-900">{traffic}</p>
            <p className="text-[9px] text-neutral-400 font-black uppercase tracking-widest">
              Customers
            </p>
          </div>
        </div>

        <div
          className={`bg-white rounded-[40px] p-6 flex flex-col justify-between ${clayShadow}`}
        >
          <LayoutGrid size={18} className="text-neutral-400" />
          <div className="mt-4">
            <p className="text-3xl font-bold text-neutral-900">
              {totalGrounds}
            </p>
            <p className="text-[9px] text-neutral-400 font-black uppercase tracking-widest">
              Grounds
            </p>
          </div>
        </div>
      </section>

      {/* Today's Agenda */}
      <section className="space-y-5">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em]">
            Today
          </h3>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            {dayjs().format("MMM D")}
          </span>
        </div>

        <div className="space-y-4">
          {todayAgenda?.length > 0 ? (
            todayAgenda.map((b) => {
              console.log('b', b)
              return (
                <div
                  key={b.id}
                  className={`bg-white p-5 rounded-4xl flex items-center justify-between transition-all active:scale-[0.97] cursor-pointer ${clayShadow}`}
                  onClick={() => setActiveItem(b)}
                >
                  <div className="flex items-center gap-5 min-w-0">
                    <div className="w-12 h-12 bg-neutral-50 rounded-[20px] flex items-center justify-center text-neutral-400 shadow-inner">
                      <Clock size={20} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-neutral-900 text-sm tracking-tight truncate">
                        {b.client_name}
                      </h4>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-tight">
                        {formatTime(b.start_time)} – {formatTime(b.end_time)}
                      </p>
                      <p className="text-[9px] text-neutral-300 font-bold uppercase tracking-tight">
                        {b.ground_name}
                      </p>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-neutral-300">
                    <MoreVertical size={18} />
                  </div>
                </div>
              );
            })
          ) : (
            <div
              className={`py-12 text-center bg-white rounded-[48px] border-2 border-dashed border-neutral-100 ${clayShadow}`}
            >
              <p className="text-neutral-400 text-[11px] font-black uppercase tracking-widest">
                No bookings today
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Next Outlook */}
      <section className="space-y-5">
        <h3 className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em] px-2">
          Tomorrow
        </h3>
        <div
          className={`bg-white rounded-[48px] overflow-hidden divide-y divide-neutral-50 ${clayShadow}`}
        >
          {nextOutlook.length > 0 ? (
            nextOutlook.map((b) => (
              <div
                key={b.id}
                className="p-6 flex items-center justify-between active:bg-neutral-50 transition-all"
              >
                <div className="flex items-center gap-5 min-w-0">
                  <div className="text-center w-10 shrink-0">
                    <p className="text-[10px] font-black text-neutral-300 uppercase leading-none">
                      {dayjs.utc(b.start_time).local().format("ddd")}
                    </p>
                    <p className="text-xl font-bold text-neutral-900 mt-1">
                      {dayjs.utc(b.start_time).local().format("D")}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-neutral-800 text-xs tracking-tight truncate">
                      {b.client_name}
                    </h4>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase">
                      {formatTime(b.start_time)} - {formatTime(b.end_time)} ·{" "}
                      {b.ground_name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveItem(b)}
                  className="text-neutral-300 p-2"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <p className="text-neutral-300 text-[10px] font-black uppercase tracking-widest">
                No bookings tomorrow
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Action Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-md animate-in fade-in"
            onClick={() => setActiveItem(null)}
          />
          <div
            className={`relative bg-white w-full max-w-sm rounded-[56px] overflow-hidden animate-in slide-in-from-bottom-12 duration-500 ${clayShadow}`}
          >
            <div className="p-10 space-y-8">
              <div className="text-center space-y-3">
                <div
                  className={`w-20 h-20 bg-neutral-50 text-neutral-900 rounded-[32px] flex items-center justify-center mx-auto mb-4 ${clayShadow}`}
                >
                  <Calendar size={32} />
                </div>
                <h4 className="text-2xl font-bold text-neutral-900 tracking-tight">
                  {activeItem.client_name}
                </h4>
                <p className="text-[11px] font-black text-neutral-400 uppercase tracking-widest flex items-center justify-center gap-2">
                  <Phone size={12} className="text-emerald-500" /> +91{" "}
                  {activeItem.client_mobile}
                </p>
                <p className="text-xs font-bold text-neutral-500">
                  {formatTime(activeItem.start_time)} –{" "}
                  {formatTime(activeItem.end_time)} · {activeItem.ground_name}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => setShowConfirm(true)}
                  className={`w-full h-16 bg-white border border-red-50 text-red-600 font-bold rounded-[24px] flex items-center justify-center gap-3 active:scale-95 transition-all ${clayShadow}`}
                >
                  <Trash2 size={18} /> Cancel Slot
                </button>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="w-full text-neutral-400 hover:text-neutral-600 font-bold text-[11px] uppercase tracking-[0.3em] transition-all active:scale-95"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          if (activeItem) {
            cancelBooking.mutate(activeItem.id, {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["dashboard"] });
                setShowConfirm(false);
                setActiveItem(null);
              },
            });
          }
        }}
        title="Cancel Session?"
        description="This slot will be released and available for new bookings."
        confirmLabel="Yes, Cancel"
        isDanger={true}
      />
    </div>
  );
};

export default DashboardView;
