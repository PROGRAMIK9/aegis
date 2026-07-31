"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { LayoutDashboard, ShieldHalf, Activity, BookOpen, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";

const navItems = [
    { href: "/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
    { href: "/dashboard/overrides", icon: <ShieldHalf />, label: "Overrides" },
    { href: "/dashboard/live-feed", icon: <Activity />, label: "Live feed" },
    { href: "/dashboard/docs", icon: <BookOpen />, label: "Docs" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        router.push('/');
    };

    return (
        <aside className={`shrink-0 h-auto lg:h-full rounded-r-[15px] lg:rounded-l-none rounded-l-[15px] flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-full lg:w-[80px] p-4 lg:p-4' : 'w-full lg:w-[240px] p-4 lg:p-6'}`}
            style={{ background: "linear-gradient(180.03deg, #000D1F 5.53%, #0048A6 122.03%)" }}>
            <div className="absolute inset-0 bg-white/[0.02] mix-blend-overlay opacity-50 pointer-events-none" />

            <div className="relative z-10 w-full flex flex-col h-full">
                <div className={`flex ${isCollapsed ? 'flex-col gap-4 items-center justify-start' : 'flex-row items-center justify-between'} mb-6 lg:mb-10`}>
                    {!isCollapsed && (
                        <Link href="/" className="font-cormorant text-[32px] lg:text-[40px] leading-[40px] lg:leading-[48px] font-bold tracking-wide block hover:opacity-80 transition-opacity">Aegis</Link>
                    )}
                    <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-white/60 hover:text-white transition-colors hidden lg:block">
                        {isCollapsed ? <PanelLeftOpen size={24} /> : <PanelLeftClose size={24} />}
                    </button>
                    {isCollapsed && (
                        <Link href="/" className="block hover:opacity-80 transition-opacity">
                            <Image src="/aegis-logo.png" alt="Aegis Logo" width={32} height={32} style={{ width: "auto", height: "auto" }} className="rounded-md" />
                        </Link>
                    )}
                </div>

                <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible flex-1 scrollbar-hide pb-2 lg:pb-0">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href}
                            title={isCollapsed ? item.label : undefined}
                            className={`flex-shrink-0 lg:w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-2.5 rounded-[8px] transition-all duration-300 cursor-pointer
                ${pathname === item.href ? 'text-white bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] font-medium' : 'text-white/60 hover:text-white hover:bg-white/5 font-normal'}`}>
                            <div className="flex items-center justify-center opacity-90">
                                {item.icon}
                            </div>
                            {!isCollapsed && <span className="font-inter text-[14px] tracking-wide whitespace-nowrap">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                <button onClick={handleLogout} title={isCollapsed ? "Logout" : undefined} className={`flex-shrink-0 lg:w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-2.5 text-white/60 hover:text-white hover:bg-white/5 rounded-[8px] transition-colors duration-300 mt-4 lg:mt-auto cursor-pointer`}>
                    <LogOut size={isCollapsed ? 22 : 18} strokeWidth={2} />
                    {!isCollapsed && <span className="font-inter text-[14px] tracking-wide whitespace-nowrap">Logout</span>}
                </button>
            </div>
        </aside>
    );
}
