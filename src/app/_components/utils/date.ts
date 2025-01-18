import {
  format,
  formatDistance as dateFnsFormatDistance,
  Locale,
} from "date-fns";
import { vi } from "date-fns/locale";

export class DateUtils {
  formatNowDistance(
    date: Date | number,
    options?: {
      addSuffix?: boolean;
      unit?: "second" | "minute" | "hour" | "day" | "month" | "year";
      roundingMethod?: "floor" | "ceil" | "round";
      locale?: Locale;
    },
  ): string {
    const now = new Date();
    if (!date || (typeof date === "number" && isNaN(date))) {
      console.error("Invalid date value:", date);
      return "Invalid date";
    }
    return dateFnsFormatDistance(date, now, {
      locale: vi,
      ...options,
    });
  }

  formatDateTime(date: Date | number, options?: { locale?: Locale }) {
    return format(date, "dd/MM/yyyy HH:mm", {
      ...options,
    });
  }
}
