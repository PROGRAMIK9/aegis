"use client";
import { useEffect, useState } from "react";
import { Circle } from "lucide-react";

const mockEvents = [
    { id: 1, time: "15:28:04", type: "phishing", message: "Blocked paypa1-login.tk — credential harvesting detected", score: 82 },
    { id: 2, time: "15:27:51", type: "fraud", message: "Transaction anomaly flagged on update-secure-auth.com", score: 95 },
    { id: 3, time: "15:27:33", type: "clean", message: "Verified legitimate-bank-login.com — no threats found", score: 12 },
    { id: 4, time: "15:26:19", type: "phishing", message: "Suspicious redirect chain detected via free-prize-claim.xyz", score: 78 },
    { id: 5, time: "15:25:42", type: "clean", message: "DNS resolution normal for cdn.trusted-service.com", score: 5 },
];

const typeColors: Record<string, string> = {
    phishing: "text-red-400",
    fraud: "text-amber-400",
    clean: "text-green-400",
};

export default function LiveFeedPage() {
    const [events, setEvents] = useState(mockEvents);
    const [pulse, setPulse] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => setPulse((p) => !p), 1000);
        return () => clearInterval(interval);
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
