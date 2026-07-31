import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-2rem)] lg:h-[calc(100vh-4rem)] lg:max-h-[1080px] gap-4 lg:gap-8 max-w-[1920px] mx-auto relative z-10 fade-in p-4 lg:p-8 overflow-y-auto lg:overflow-hidden">
            <Sidebar />
            <main className="flex-1 h-full flex flex-col pt-2 min-w-0">
                {children}
            </main>
        </div>
    );
}
