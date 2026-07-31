"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Ban, CheckCircle, Activity, LogOut } from "lucide-react";

const navItems = [
    { href: "/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
    { href: "/dashboard/blocklist", icon: <Ban />, label: "Blocklist" },
    { href: "/dashboard/whitelist", icon: <CheckCircle />, label: "Whitelist" },
    { href: "/dashboard/live-feed", icon: <Activity />, label: "Live feed" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        router.push('/');
    };

    return (
        <aside className="w-full lg:w-[250px] shrink-0 h-auto lg:h-full rounded-[15px] p-4 lg:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden"
            style={{ background: "linear-gradient(180.03deg, #000D1F 5.53%, #0048A6 122.03%)" }}>
            <div className="absolute inset-0 bg-white/[0.02] mix-blend-overlay opacity-50 pointer-events-none" />

            <div className="relative z-10 w-full flex flex-col h-full">
                <Link href="/" className="font-cormorant text-[36px] lg:text-[48px] leading-[48px] lg:leading-[58px] font-bold mb-6 lg:mb-14 tracking-wide mt-2 block hover:opacity-80 transition-opacity">Aegis</Link>

                <nav className="flex flex-row lg:flex-col gap-4 lg:gap-6 flex-wrap lg:flex-nowrap flex-1">
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

                <button onClick={handleLogout} className="flex items-center gap-3 text-white/50 hover:text-white transition-colors duration-300 mt-6 lg:mt-auto pb-2 lg:pb-4 cursor-pointer">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-[15px] font-inter">Logout</span>
                </button>
            </div>
        </aside>
    );
}
