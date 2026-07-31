"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ShieldAlert, Activity, GitCommitHorizontal, LogOut } from "lucide-react";

const navItems = [
    { href: "/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
    { href: "/dashboard/threats", icon: <ShieldAlert />, label: "Threats" },
    { href: "/dashboard/live-feed", icon: <Activity />, label: "Live feed" },
    { href: "/dashboard/rule-engine", icon: <GitCommitHorizontal />, label: "Rule Engine" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        router.push('/');
    };

    return (
        <aside className="w-[250px] shrink-0 h-full rounded-[15px] p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden"
            style={{ background: "linear-gradient(180.03deg, #000D1F 5.53%, #0048A6 122.03%)" }}>
            <div className="absolute inset-0 bg-white/[0.02] mix-blend-overlay opacity-50 pointer-events-none" />

            <div className="relative z-10 w-full flex flex-col h-full">
                <Link href="/" className="font-cormorant text-[48px] leading-[58px] font-bold mb-14 tracking-wide mt-2 block hover:opacity-80 transition-opacity">Aegis</Link>

                <nav className="flex flex-col gap-6 flex-1">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href}
                            className={`w-full flex items-center gap-5 p-2 rounded-lg transition-all duration-300 cursor-pointer overflow-hidden relative group
                ${pathname === item.href ? 'text-white' : 'text-white/50 hover:text-white'}`}>
                            <div className={`p-2 border-2 rounded ${pathname === item.href ? 'border-white bg-white/10' : 'border-transparent group-hover:border-white/50'} transition-all`}>
                                <div className="w-5 h-5">
                                    {item.icon}
                                </div>
                            </div>
                            <span className="font-inter text-[15px] leading-[20px]">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <button onClick={handleLogout} className="flex items-center gap-3 text-white/50 hover:text-white transition-colors duration-300 mt-auto pb-4 cursor-pointer">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-[15px] font-inter">Logout</span>
                </button>
            </div>
        </aside>
    );
}
