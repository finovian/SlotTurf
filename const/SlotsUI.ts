export const SLOT_UI = {
  available: {
    card: "bg-emerald-50/10 border-emerald-100/30 hover:bg-emerald-50/30 hover:border-emerald-200",
    iconWrap: "bg-emerald-100/50 text-emerald-600",
    icon: "plus",
    label: "Available",
    sub: "Open Slot",
    clickable: true,
  },

  booked: {
    card: "bg-[#00c2a699] border-[#00c2a699] shadow-sm",
    iconWrap: "bg-white text-yellow-800",
    icon: "check",
    label: "Booked",
    sub: "In Progress",
    clickable: true,
  },

  completed: {
    card: "bg-gray-200 border-neutral-200 opacity-70",
    iconWrap: "bg-neutral-300 text-neutral-700",
    icon: "check",
    label: "Completed",
    sub: "Finished",
    clickable: false,
  },

  cancelled: {
    card: "bg-red-100/50 border-red-200",
    iconWrap: "bg-red-200 text-red-700",
    icon: "x",
    label: "Cancelled",
    sub: "Slot Free",
    clickable: true,
  },
} as const;


export type SlotState = keyof typeof SLOT_UI;