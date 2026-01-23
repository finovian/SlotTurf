import { format, parse, differenceInMinutes, addMinutes, isAfter, isBefore, startOfDay, endOfDay, subDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Asia/Kolkata';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateDuration = (startTime: string, endTime: string): number => {
  const start = parse(startTime, 'HH:mm', new Date());
  const end = parse(endTime, 'HH:mm', new Date());
  
  const diffMinutes = differenceInMinutes(end, start);
  return Math.max(0, diffMinutes / 60);
};

export const generateTimeSlots = (opening: string, closing: string): string[] => {
  const slots: string[] = [];
  let current = parse(opening, 'HH:mm', new Date());
  const end = parse(closing, 'HH:mm', new Date());
  
  while (isBefore(current, end)) {
    slots.push(format(current, 'HH:mm'));
    current = addMinutes(current, 60);
  }
  
  return slots;
};

export const getISTDate = (date: Date = new Date()): Date => {
  return toZonedTime(date, TIMEZONE);
};

export const isDateInRange = (dateStr: string, start: Date, end: Date): boolean => {
  const date = startOfDay(new Date(dateStr));
  return (date.getTime() >= start.getTime() && date.getTime() <= end.getTime());
};

export const getRangeDates = (preset: string): { start: Date; end: Date } => {
  const end = startOfDay(new Date());
  let start = end;

  switch (preset) {
    case '7d': start = subDays(end, 6); break;
    case '30d': start = subDays(end, 29); break;
    case '3m': start = subDays(end, 89); break;
    case '6m': start = subDays(end, 179); break;
    case '1y': start = subDays(end, 364); break;
    default: start = end;
  }
  return { start, end };
};