import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUpcomingEvents } from "../api";
import { PageHeader, Card, Badge, EmptyState } from "../ui";

export default function Events() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    getUpcomingEvents()
      .then(setEvents)
      .catch(() => toast.error("Failed to load events"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Card className="text-center py-16 text-white/40">Loading...</Card>;

  return (
    <div>
      <PageHeader title="Events Near Me" sub="Upcoming drone industry events, expos, meetups, and webinars across India" />
      {events.length === 0 ? (
        <EmptyState text="No upcoming events published right now." />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-2.5 text-[10.5px] font-bold text-white/40 uppercase tracking-wide">Date</th>
                  <th className="px-4 py-2.5 text-[10.5px] font-bold text-white/40 uppercase tracking-wide">Event</th>
                  <th className="px-4 py-2.5 text-[10.5px] font-bold text-white/40 uppercase tracking-wide">Type</th>
                  <th className="px-4 py-2.5 text-[10.5px] font-bold text-white/40 uppercase tracking-wide">Location</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev, i) => (
                  <tr key={ev.eventId || i} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                    <td className="px-4 py-3 text-[12.5px] font-semibold text-white whitespace-nowrap">{ev.eventDate || "TBC"}</td>
                    <td className="px-4 py-3 text-[12.5px] text-white/70">{ev.eventName}</td>
                    <td className="px-4 py-3"><Badge tone="info">{ev.category || "Event"}</Badge></td>
                    <td className="px-4 py-3 text-[12.5px] text-white/50">{ev.location || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
