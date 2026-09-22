import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatTicketDate = (utcDateString) => {
  if (!utcDateString) return "No disponible";

  const date = new Date(utcDateString);

  if (isNaN(date.getTime())) return "Fecha inválida";

  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const startOfTargetDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const timeFormatted = date
    .toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toUpperCase();

  if (startOfTargetDay.getTime() === startOfToday.getTime()) {
    return `Hoy, ${timeFormatted}`;
  }

  if (startOfTargetDay.getTime() === startOfYesterday.getTime()) {
    return `Ayer, ${timeFormatted}`;
  }

  const dateFormatted = date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return `${dateFormatted}`;
};