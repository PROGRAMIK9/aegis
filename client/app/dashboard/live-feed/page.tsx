"use client";
import { useEffect, useState } from "react";
import { Circle } from "lucide-react";

const typeColors: Record<string, string> = {
    phishing: "text-red-400",
    fraud: "text-amber-400",
    clean: "text-green-400",
};

export default function LiveFeedPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [pulse, setPulse] = useState(true);

    useEffect(() => {
        const pulseInterval = setInterval(() => setPulse((p) => !p), 1000);
        
        const fetchEvents = () => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            fetch(`${apiUrl}/api/v1/events?limit=50`)
                .then(res => res.json())
                .then(data => {
                    if (data.events) {
                        const formattedEvents = data.events.map((e: any) => {
                            const date = new Date(e.created_at);
                            const time = date.toLocaleTimeString('en-US', { hour12: false });
                            let msgType = "clean";
                            if (e.tier === "high" || e.tier === "critical") msgType = "phishing";
                            else if (e.tier === "moderate") msgType = "fraud";
                            
                            return {
                                id: e.id,
                                time: time,
                                type: msgType,
                                message: `[${e.verdict}] ${e.target}`,
                                score: e.score
                            };
                        });
                        setEvents(formattedEvents);
                    }
                })
                .catch(console.error);
        };

        fetchEvents();
        const pollInterval = setInterval(fetchEvents, 3000);

        return () => {
            clearInterval(pulseInterval);
            clearInterval(pollInterval);
        };
    }, []);

    return (
        <>
            <header className="flex justify-between items-end mb-10 pl-6 xl:pl-10">
                <h2 className="font-cormorant text-[64px] leading-[78px] font-bold tracking-tight">Live Feed</h2>
                <div className="flex items-center gap-2 mb-4">
                    <Circle className={`w-3 h-3 fill-green-400 text-green-400 ${pulse ? 'opacity-100' : 'opacity-40'} transition-opacity`} />
                    <span className="font-inter text-green-400 text-sm">Stream active</span>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto pl-6 xl:pl-10 pr-4 custom-scrollbar">
                <div className="flex flex-col gap-1">
                    {events.map((event) => (
                        <div key={event.id} className="flex items-start gap-4 py-3 px-4 rounded-[6px] hover:bg-white/[0.03] transition-colors font-mono text-sm border-b border-white/5">
                            <span className="text-white/30 shrink-0 w-[72px]">{event.time}</span>
                            <span className={`shrink-0 uppercase text-[11px] tracking-wider font-bold w-[72px] ${typeColors[event.type]}`}>{event.type}</span>
                            <span className="text-white/80 flex-1">{event.message}</span>
                            <span className="text-white/40 shrink-0">score: {event.score}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
