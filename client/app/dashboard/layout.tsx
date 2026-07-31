import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex w-full h-[calc(100vh-4rem)] max-h-[1080px] gap-8 max-w-[1920px] mx-auto relative z-10 fade-in p-6 md:p-8">
            <Sidebar />
            <main className="flex-1 h-full flex flex-col pt-2 min-w-0">
                {children}
            </main>
        </div>
    );
}
