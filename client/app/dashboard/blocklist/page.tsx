"use client";
import { useState, useEffect } from "react";
import { Ban, ShieldAlert, CheckCircle } from "lucide-react";

export default function BlocklistPage() {
    const [blockedEvents, setBlockedEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8000/api/v1/events?limit=50")
            .then(res => res.json())
            .then(data => {
                if (data.events) {
                    const blocked = data.events.filter((e: any) => e.tier === "high" || e.tier === "critical");
                    setBlockedEvents(blocked);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-10 pl-2 lg:pl-6 xl:pl-10">
                <h2 className="font-cormorant text-[48px] md:text-[64px] leading-[58px] md:leading-[78px] font-bold tracking-tight mb-4 md:mb-0">Blocklist</h2>
                <div className="flex items-center gap-4 mb-4">
                    <span className="font-inter text-white/50 text-sm">{blockedEvents.length} active blocks</span>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto pl-2 lg:pl-6 xl:pl-10 pr-4 custom-scrollbar pb-8">
                <div className="flex flex-col gap-4 max-w-4xl">
                    {loading ? (
                        <div className="text-white/40 italic">Loading blocklist...</div>
                    ) : blockedEvents.length > 0 ? (
                        blockedEvents.map((event) => (
                            <div key={event.id} className="p-6 rounded-[9px] border border-red-500/40 bg-red-500/5 backdrop-blur-sm shadow-xl transition-all hover:scale-[1.005] cursor-pointer"
                                style={{ background: "radial-gradient(100% 150% at 50% 50%, #3C3C3C 0%, #28292B 60%, #1E2022 100%)" }}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <Ban className="w-5 h-5 text-red-400" />
                                        <h3 className="font-inter font-medium text-lg text-white max-w-xl truncate">{event.target}</h3>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[11px] font-inter uppercase tracking-widest font-bold px-3 py-1 rounded-full border border-red-500/40 text-red-400">
                                            {event.tier}
                                        </span>
                                        <button 
                                          className="text-xs font-medium px-3 py-1 bg-green-500/20 hover:bg-green-500/40 text-green-400 border border-green-500/30 rounded-full transition-colors flex items-center gap-1"
                                          onClick={(e) => {
                                              e.stopPropagation();
                                              // Whitelist logic
                                              fetch(`http://localhost:8000/api/v1/phishing/whitelist`, {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ domain: event.target })
                                              }).then(() => alert("Added to whitelist!"));
                                          }}
                                        >
                                            <CheckCircle size={12} />
                                            Mark Safe
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="font-inter text-white/70 text-sm"><span className="text-white/40">Score:</span> <span className="font-bold text-red-400">{event.score}/100</span> — {event.verdict}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-10 rounded-[9px] border border-white/10 text-center flex flex-col items-center justify-center">
                            <ShieldAlert className="w-12 h-12 text-white/20 mb-4" />
                            <h3 className="text-xl font-medium text-white/60 mb-2">No Active Blocks</h3>
                            <p className="text-white/40 text-sm">Active Shield has not intercepted any critical threats yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
