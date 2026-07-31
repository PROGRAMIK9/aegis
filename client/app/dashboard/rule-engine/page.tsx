"use client";
import { useState } from "react";
import { Plus, ToggleLeft, ToggleRight } from "lucide-react";

const initialRules = [
    { id: 1, name: "Block .tk TLDs", description: "Automatically block all URLs with .tk top-level domain", enabled: true },
    { id: 2, name: "Flag urgency keywords", description: "Flag pages containing urgent language patterns (e.g. 'verify now', 'account suspended')", enabled: true },
    { id: 3, name: "Reject self-signed certs", description: "Block pages with invalid or self-signed SSL certificates", enabled: false },
    { id: 4, name: "Homoglyph detection", description: "Detect and flag domains using lookalike characters (e.g. paypa1 vs paypal)", enabled: true },
    { id: 5, name: "Rate limit new domains", description: "Throttle requests to domains registered within the last 30 days", enabled: true },
];

export default function RuleEnginePage() {
    const [rules, setRules] = useState(initialRules);

    const toggleRule = (id: number) => {
        setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    };

    return (
        <>
            <header className="flex justify-between items-end mb-10 pl-6 xl:pl-10">
                <h2 className="font-cormorant text-[64px] leading-[78px] font-bold tracking-tight">Rule Engine</h2>
                <button className="flex items-center gap-2 px-4 py-2 rounded-[6px] bg-gradient-to-r from-[#003882] to-[#0048A6] text-white font-inter text-sm font-medium hover:brightness-110 transition-all border border-white/10 shadow-[0_0_12px_rgba(0,30,100,0.4)] cursor-pointer mb-4">
                    <Plus className="w-4 h-4" />
                    Add Rule
                </button>
            </header>

            <div className="flex-1 overflow-y-auto pl-6 xl:pl-10 pr-4 custom-scrollbar">
                <div className="flex flex-col gap-4">
                    {rules.map((rule) => (
                        <div key={rule.id} className={`p-6 rounded-[9px] border transition-all shadow-xl ${rule.enabled ? 'border-[#0048A6]/30 bg-[#001C40]/40' : 'border-white/5 bg-[#1E2022]/30 opacity-60'}`}>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-inter font-medium text-lg text-white">{rule.name}</h3>
                                <button onClick={() => toggleRule(rule.id)} className="cursor-pointer transition-transform hover:scale-110">
                                    {rule.enabled ?
                                        <ToggleRight className="w-8 h-8 text-[#0048A6]" /> :
                                        <ToggleLeft className="w-8 h-8 text-white/30" />
                                    }
                                </button>
                            </div>
                            <p className="font-inter text-white/60 text-sm">{rule.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
