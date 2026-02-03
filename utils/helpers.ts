

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const toHHMM = (time: string): string => {
  // already in HH:mm
  if (/^\d{2}:\d{2}$/.test(time)) {
    return time;
  }

  // ISO or other date string
  return dayjs.utc(time).format("HH:mm");
};