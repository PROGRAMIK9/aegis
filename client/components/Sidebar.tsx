"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Ban, CheckCircle, Activity, LogOut } from "lucide-react";

const navItems = [
    { href: "/dashboard", icon: <LayoutDashboard size={18} strokeWidth={2} />, label: "Dashboard" },
    { href: "/dashboard/blocklist", icon: <Ban size={18} strokeWidth={2} />, label: "Blocklist" },
    { href: "/dashboard/whitelist", icon: <CheckCircle size={18} strokeWidth={2} />, label: "Whitelist" },
    { href: "/dashboard/live-feed", icon: <Activity size={18} strokeWidth={2} />, label: "Live feed" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        router.push('/');
    };

    return (
        <aside className="w-full lg:w-[240px] shrink-0 h-auto lg:h-full rounded-[15px] p-4 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all"
            style={{ background: "linear-gradient(180.03deg, #000D1F 5.53%, #0048A6 122.03%)" }}>
            <div className="absolute inset-0 bg-white/[0.02] mix-blend-overlay opacity-50 pointer-events-none" />

            <div className="relative z-10 w-full flex flex-col h-full">
                <Link href="/" className="font-cormorant text-[32px] lg:text-[40px] leading-[40px] lg:leading-[48px] font-bold mb-6 lg:mb-10 tracking-wide block hover:opacity-80 transition-opacity">Aegis</Link>

                <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible flex-1 scrollbar-hide pb-2 lg:pb-0">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href}
                            className={`flex-shrink-0 lg:w-full flex items-center gap-3 px-4 py-2.5 rounded-[8px] transition-all duration-300 cursor-pointer
                ${pathname === item.href ? 'text-white bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] font-medium' : 'text-white/60 hover:text-white hover:bg-white/5 font-normal'}`}>
                            <div className="flex items-center justify-center opacity-90">
                                {item.icon}
                            </div>
                            <span className="font-inter text-[14px] tracking-wide whitespace-nowrap">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <button onClick={handleLogout} className="flex-shrink-0 lg:w-full flex items-center gap-3 px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/5 rounded-[8px] transition-colors duration-300 mt-4 lg:mt-auto cursor-pointer">
                    <LogOut size={18} strokeWidth={2} />
                    <span className="font-inter text-[14px] tracking-wide whitespace-nowrap">Logout</span>
                </button>
            </div>
        </aside>
    );
}
