"use client";
import { useState, useEffect } from "react";
import { CheckCircle, ShieldAlert, Trash2 } from "lucide-react";

export default function WhitelistPage() {
    const [whitelist, setWhitelist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("aegis_token");
        if (!token) {
            setLoading(false);
            return;
        }
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        fetch(`${apiUrl}/api/v1/phishing/whitelist`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.whitelist) {
                    setWhitelist(data.whitelist);
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
                <h2 className="font-cormorant text-[48px] md:text-[64px] leading-[58px] md:leading-[78px] font-bold tracking-tight mb-4 md:mb-0">Whitelist</h2>
                <div className="flex items-center gap-4 mb-4">
                    <span className="font-inter text-white/50 text-sm">{whitelist.length} trusted domains</span>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto pl-2 lg:pl-6 xl:pl-10 pr-4 custom-scrollbar pb-8">
                <div className="flex flex-col gap-4 max-w-4xl">
                    {loading ? (
                        <div className="text-white/40 italic">Loading whitelist...</div>
                    ) : whitelist.length > 0 ? (
                        whitelist.map((item, index) => (
                            <div key={index} className="p-6 rounded-[9px] border border-green-500/40 bg-green-500/5 backdrop-blur-sm shadow-xl transition-all hover:scale-[1.005] cursor-pointer"
                                style={{ background: "radial-gradient(100% 150% at 50% 50%, #1A2E20 0%, #122116 60%, #0A130C 100%)" }}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                        <h3 className="font-inter font-medium text-lg text-white max-w-xl truncate">{item.domain}</h3>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[11px] font-inter uppercase tracking-widest font-bold px-3 py-1 rounded-full border border-green-500/40 text-green-400">
                                            TRUSTED
                                        </span>
                                        <button 
                                          className="text-xs font-medium px-3 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30 rounded-full transition-colors flex items-center gap-1"
                                          onClick={(e) => {
                                              e.stopPropagation();
                                              const token = localStorage.getItem("aegis_token");
                                              if (!token) return;
                                              const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                                              fetch(`${apiUrl}/api/v1/phishing/whitelist`, {
                                                  method: "DELETE",
                                                  headers: {
                                                      "Content-Type": "application/json",
                                                      "Authorization": `Bearer ${token}`
                                                  },
                                                  body: JSON.stringify({ domain: item.domain })
                                              })
                                              .then(res => {
                                                  if (res.ok) {
                                                      setWhitelist(prev => prev.filter(w => w.domain !== item.domain));
                                                  }
                                              });
                                          }}
                                        >
                                            <Trash2 size={12} />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="font-inter text-white/70 text-sm"><span className="text-white/40">Status:</span> <span className="font-bold text-green-400">Exempt from Scanning</span> — Allowed by user</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-10 rounded-[9px] border border-white/10 text-center flex flex-col items-center justify-center">
                            <ShieldAlert className="w-12 h-12 text-white/20 mb-4" />
                            <h3 className="text-xl font-medium text-white/60 mb-2">No Whitelisted Sites</h3>
                            <p className="text-white/40 text-sm">You haven't manually trusted any blocked domains yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
