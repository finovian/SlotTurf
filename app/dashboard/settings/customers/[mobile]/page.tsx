


"use client";

import { useParams, useRouter } from "next/navigation";
import { useCustomerDetail } from "@/hooks/use-data";
import { Ban, Phone, ChevronLeft } from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export default function CustomerDetailPage() {
  const { mobile } = useParams<{ mobile: string }>();
  const router = useRouter();
  const { data, isLoading } = useCustomerDetail(mobile);

  if (isLoading) {
    return (
      <div className="p-5 space-y-4 max-w-md mx-auto">
        <div className="h-8 w-24 bg-neutral-100 rounded-xl animate-pulse" />
        <div className="h-40 bg-neutral-100 rounded-3xl animate-pulse" />
        <div className="h-20 bg-neutral-100 rounded-2xl animate-pulse" />
        <div className="h-20 bg-neutral-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-5 space-y-5 max-w-md mx-auto">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-xs font-bold text-neutral-400 uppercase tracking-wider"
      >
        <ChevronLeft size={14} /> Back
      </button>

      {/* Stats card */}
      <div className="bg-neutral-900 rounded-3xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-xl font-bold uppercase">
            {data.client_name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-lg leading-tight">{data.client_name}</p>
            <p className="text-neutral-400 text-sm flex items-center gap-1 mt-0.5">
              <Phone size={12} /> {data.client_mobile}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/10">
          <div>
            <p className="text-neutral-500 text-[10px] uppercase tracking-wider">Bookings</p>
            <p className="text-2xl font-bold mt-1">{data.total_bookings}</p>
          </div>
          <div>
            <p className="text-neutral-500 text-[10px] uppercase tracking-wider">Spent</p>
            <p className="text-2xl font-bold mt-1">
              ₹{data.total_spent.toLocaleString("en-IN")}
            </p>
          </div>
          <div>
            <p className="text-neutral-500 text-[10px] uppercase tracking-wider">Hours</p>
            <p className="text-2xl font-bold mt-1">{data.total_hours.toFixed(1)}h</p>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex gap-2 flex-wrap">
        {data.is_repeat && (
          <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full">
            Repeat Customer
          </span>
        )}
        {data.has_cancelled && (
          <span className="text-xs font-bold bg-red-50 text-red-500 px-3 py-1.5 rounded-full flex items-center gap-1">
            <Ban size={12} /> {data.total_cancelled} Cancelled
          </span>
        )}
        <span className="text-xs font-bold bg-neutral-100 text-neutral-500 px-3 py-1.5 rounded-full">
          Last visit {dayjs(data.last_visit).format("D MMM YYYY")}
        </span>
      </div>

      {/* Booking history */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-1">
          Booking History
        </p>
        {data.bookings.map((b: any) => (
          <div
            key={b.id}
            className={`bg-white border border-neutral-100 rounded-2xl px-4 py-4 flex items-center justify-between ${
              b.status === "cancelled" ? "opacity-50" : ""
            }`}
          >
            <div>
              <p className="text-sm font-semibold text-neutral-900">
                {dayjs(b.booking_date).format("D MMM YYYY")}
              </p>
              <p className="text-xs text-neutral-400 mt-0.5">
                {dayjs.utc(b.start_time).local().format("h:mm A")} –{" "}
                {dayjs.utc(b.end_time).local().format("h:mm A")}
                {b.edges?.ground?.name && (
                  <span className="text-neutral-300 mx-1.5">· {b.edges.ground.name}</span>
                )}
              </p>
            </div>
            <div className="text-right">
              {b.status === "cancelled" ? (
                <span className="text-xs font-bold text-red-400">Cancelled</span>
              ) : (
                <p className="text-sm font-bold text-emerald-600">
                  ₹{b.amount.toLocaleString("en-IN")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}