import { useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

import { Button } from "./ui/button";
import { formatDate, formatTime, getEventStyle, hours } from "~/lib/utils";

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  duration: number;
}

interface CalendarDayViewerProps {
  loaderData: {
    events?: CalendarEvent[];
  };
}

export default function CalendarDayViewer({
  loaderData,
}: CalendarDayViewerProps) {
  const { events = [] } = loaderData;
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 9, 26));

  const eventsForSelectedDate = events.filter((event) => {
    const eventDate = new Date(event.startTime);
    return (
      eventDate.getFullYear() === selectedDate.getFullYear() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getDate() === selectedDate.getDate()
    );
  });

  const goToPreviousDay = () => {
    setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000));
  };

  const goToNextDay = () => {
    setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-black bg-muted/50">
        {/* Date row */}
        <div className="flex items-center gap-2">
          <Button
            className="hover:bg-gray-100 p-0!"
            onClick={goToPreviousDay}
            variant="ghost"
          >
            <LuChevronLeft className="h-7! min-w-7 text-black/60" />
          </Button>
          <h2 className="text-xl font-semibold text-gray-900">
            {formatDate(selectedDate)}
          </h2>
          <Button
            className="hover:bg-gray-100 p-0!"
            onClick={goToNextDay}
            variant="ghost"
          >
            <LuChevronRight className="h-7! min-w-7 text-black/60" />
          </Button>
        </div>
        <Button className="py-5 px-4 rounded-none" onClick={goToToday}>
          Today
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="relative">
          {/* Hours column */}
          {hours.map((hour) => (
            <div className="flex" key={hour.value} style={{ height: "80px" }}>
              <div className="w-24 shrink-0 px-4 py-2 text-sm text-black font-medium border-r border-black">
                {hour.label}
              </div>
              <div className="flex-1 relative border-b border-dashed border-black z-5" />
            </div>
          ))}
          <div className="absolute top-0 left-24 right-0 pointer-events-none">
            {/* Events column */}
            {eventsForSelectedDate.map((event) => (
              <div
                className="absolute left-0 right-4 pointer-events-auto z-6"
                key={event.id}
                style={getEventStyle(event)}
              >
                <div className=" bg-muted p-3 cursor-pointer">
                  <div className="font-semibold text-gray-900 text-sm mb-1">
                    {event.title}
                  </div>
                  <div className="text-xs text-gray-600">
                    {formatTime(new Date(event.startTime))} -{" "}
                    {formatTime(new Date(event.endTime))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
