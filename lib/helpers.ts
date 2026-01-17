import { format, parse, differenceInMinutes, addMinutes, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';
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