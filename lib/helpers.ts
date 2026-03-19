import {
  format,
  parse,
  differenceInMinutes,
  addMinutes,
  isAfter,
  isBefore,
  startOfDay,
  endOfDay,
  subDays,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";

const TIMEZONE = "Asia/Kolkata";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateDuration = (
  startTime: string,
  endTime: string,
): number => {
  const start = parse(startTime, "HH:mm", new Date());
  const end = parse(endTime, "HH:mm", new Date());

  const diffMinutes = differenceInMinutes(end, start);
  return Math.max(0, diffMinutes / 60);
};

export const generateTimeSlots = (
  opening: string,
  closing: string,
): string[] => {
  const slots: string[] = [];
  let current = parse(opening, "HH:mm", new Date());
  const end = parse(closing, "HH:mm", new Date());

  const isOvernight = isBefore(end, current);

  while (true) {
    slots.push(format(current, "HH:mm"));
    current = addMinutes(current, 60);

    if (isOvernight) {
      // Stop when we've passed midnight and reached/passed close time
      if (
        format(current, "HH:mm") === format(end, "HH:mm") ||
        (slots.length > 1 && !isBefore(end, current))
      ) {
        break;
      }
    } else {
      if (!isBefore(current, end)) break;
    }

    // Safety: never exceed 24 slots
    if (slots.length >= 24) break;
  }

  return slots;
};

export const getISTDate = (date: Date = new Date()): Date => {
  return toZonedTime(date, TIMEZONE);
};

export const isDateInRange = (
  dateInput: string | Date,
  start: Date,
  end: Date,
): boolean => {
  const date = startOfDay(new Date(dateInput));
  return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
};

export const getRangeDates = (preset: string): { start: Date; end: Date } => {
  const end = startOfDay(new Date());
  let start = end;

  switch (preset) {
    case "7d":
      start = subDays(end, 6);
      break;
    case "30d":
      start = subDays(end, 29);
      break;
    case "3m":
      start = subDays(end, 89);
      break;
    case "6m":
      start = subDays(end, 179);
      break;
    case "1y":
      start = subDays(end, 364);
      break;
    case "all":
      return {
        start: new Date("2020-01-01"),
        end: new Date("2099-12-31"),
      };
    default:
      start = end;
  }
  return { start, end };
};

export const HHMMToMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
};

export const minutesToHHMM = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};
