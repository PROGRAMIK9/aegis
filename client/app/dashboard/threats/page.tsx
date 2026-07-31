"use client";
import { ShieldAlert, AlertTriangle, XCircle } from "lucide-react";

const threats = [
    { id: 1, severity: "critical", title: "Credential Harvesting Kit", source: "paypa1-login.tk", detected: "2 min ago", description: "Active phishing kit mimicking PayPal login. Uses obfuscated JS to exfiltrate credentials." },
    { id: 2, severity: "high", title: "Zero-Day Exploit Attempt", source: "update-secure-auth.com", detected: "8 min ago", description: "Attempted exploitation of CVE-2026-4821 via malicious iframe injection." },
    { id: 3, severity: "medium", title: "Suspicious DNS Tunneling", source: "data.exfil-cdn.xyz", detected: "15 min ago", description: "Anomalous DNS query pattern detected, consistent with data exfiltration via DNS tunneling." },
    { id: 4, severity: "low", title: "Outdated TLS Certificate", source: "legacy-portal.internal", detected: "1 hr ago", description: "TLS 1.1 certificate detected on internal service. Recommend upgrading to TLS 1.3." },
    { id: 5, severity: "critical", title: "Ransomware C2 Communication", source: "cdn-static-res.ru", detected: "3 min ago", description: "Outbound traffic matching known ransomware command-and-control signatures detected." },
];

const severityColors: Record<string, string> = {
    critical: "border-red-500/40 bg-red-500/5 text-red-400",
    high: "border-orange-500/40 bg-orange-500/5 text-orange-400",
    medium: "border-amber-500/40 bg-amber-500/5 text-amber-400",
    low: "border-blue-400/40 bg-blue-400/5 text-blue-400",
};

const severityIcons: Record<string, React.ReactNode> = {
    critical: <XCircle className="w-5 h-5" />,
    high: <AlertTriangle className="w-5 h-5" />,
    medium: <ShieldAlert className="w-5 h-5" />,
    low: <ShieldAlert className="w-5 h-5" />,
};

export default function ThreatsPage() {
    return (
        <>
            <header className="flex justify-between items-end mb-10 pl-6 xl:pl-10">
                <h2 className="font-cormorant text-[64px] leading-[78px] font-bold tracking-tight">Threats</h2>
                <span className="font-inter text-white/50 text-sm mb-4">{threats.length} active threats</span>
            </header>

            <div className="flex-1 overflow-y-auto pl-6 xl:pl-10 pr-4 custom-scrollbar">
                <div className="flex flex-col gap-4">
                    {threats.map((threat) => (
                        <div key={threat.id} className={`p-6 rounded-[9px] border ${severityColors[threat.severity]} backdrop-blur-sm shadow-xl transition-all hover:scale-[1.005] cursor-pointer`}
                            style={{ background: "radial-gradient(100% 150% at 50% 50%, #3C3C3C 0%, #28292B 60%, #1E2022 100%)" }}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className={severityColors[threat.severity]}>{severityIcons[threat.severity]}</span>
                                    <h3 className="font-inter font-medium text-lg text-white">{threat.title}</h3>
                                </div>
                                <span className={`text-[11px] font-inter uppercase tracking-widest font-bold px-3 py-1 rounded-full border ${severityColors[threat.severity]}`}>
                                    {threat.severity}
                                </span>
                            </div>
                            <p className="font-inter text-white/70 text-sm mb-3">{threat.description}</p>
                            <div className="flex items-center gap-6 text-xs font-mono text-white/40">
                                <span>Source: <span className="text-white/60 underline">{threat.source}</span></span>
                                <span>{threat.detected}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
