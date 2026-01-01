import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { CalendarEvent } from "~/components/calendar-viewer";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    weekday: "long",
  });
};

export const formatTime = (date: Date) => {
  return date
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
      minute: "2-digit",
    })
    .toLowerCase();
};

// Generate hours from 12 AM to 11 PM
export const hours = Array.from({ length: 24 }, (_, i) => {
  const hour = i;
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return {
    label: `${displayHour} ${period}`,
    value: hour,
  };
});

// Calculate event position and height
export const getEventStyle = (event: CalendarEvent) => {
  const hourHeight = 80;
  const top =
    new Date(event.startTime).getHours() * hourHeight +
    (new Date(event.startTime).getMinutes() / 60) * hourHeight;
  const height = (event.duration / 60) * hourHeight;

  return {
    height: `${height}px`,
    top: `${top}px`,
  };
};
