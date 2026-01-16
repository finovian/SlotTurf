
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateDuration = (startTime: string, endTime: string): number => {
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  
  const start = startH + startM / 60;
  const end = endH + endM / 60;
  
  return Math.max(0, end - start);
};

export const generateTimeSlots = (opening: string, closing: string) => {
  const slots = [];
  const start = parseInt(opening.split(':')[0]);
  const end = parseInt(closing.split(':')[0]);
  
  for (let i = start; i < end; i++) {
    slots.push(`${i.toString().padStart(2, '0')}:00`);
  }
  return slots;
};
