"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();

    const handleLogin = () => {
        localStorage.setItem('isLoggedIn', 'true');
        router.push('/dashboard');
    };

    return (
        <div className="flex flex-col w-full min-h-screen max-w-[1920px] mx-auto relative z-10 px-8 py-10 fade-in">

            {/* Header */}
            <header className="flex justify-center items-center w-full mb-16 relative bg-gradient-to-r from-transparent via-[#003882]/0 to-[#0048A6]/20 py-4 absolute top-0 left-0 right-0 z-50">
                <Link href="/">
                    <h1 className="font-cormorant text-[36px] font-bold text-white tracking-widest relative">Aegis</h1>
                </Link>
            </header>

            {/* Login Card Container */}
            <main className="flex-1 flex items-center justify-center -mt-20">

                <div className="flex flex-col items-center">
                    <h2 className="font-cormorant text-[48px] leading-[64px] font-bold text-white mb-8 tracking-tight text-center">
                        Analyze more clearly
                    </h2>

                    <div className="w-[450px] bg-gradient-to-b from-[#0B1530] to-[#040C1F] rounded-[16px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 backdrop-blur-xl relative z-20">
                        <form className="flex flex-col gap-6 w-full font-inter">

                            <div className="flex flex-col gap-2.5 w-full">
                                <label className="text-white text-[13px] font-medium tracking-wide">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-lg opacity-10 pointer-events-none shadow-inner" />
                                    <input
                                        type="email"
                                        className="w-full h-[52px] bg-[#222222]/80 backdrop-blur-sm rounded-[6px] px-4 text-white border border-black focus:outline-none focus:border-[#0048A6] transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] relative z-10 placeholder:text-white/20"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2.5 w-full mb-4">
                                <label className="text-white text-[13px] font-medium tracking-wide">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-lg opacity-10 pointer-events-none shadow-inner" />
                                    <input
                                        type="password"
                                        className="w-full h-[52px] bg-[#222222]/80 backdrop-blur-sm rounded-[6px] px-4 text-white border border-black focus:outline-none focus:border-[#0048A6] transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] relative z-10 placeholder:text-white/20"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between w-full mt-2">
                                <Link href="#" className="font-inter text-white/80 hover:text-white transition-colors text-[14px] font-medium">
                                    Create an account
                                </Link>

                                <button type="button" onClick={handleLogin} className="px-10 py-3 bg-gradient-to-r from-[#003882] to-[#0048A6] hover:brightness-110 transition-all rounded-[6px] font-inter text-[15px] font-medium text-white shadow-[0_0_15px_rgba(0,30,100,0.6)] border border-white/10 text-center">
                                    Sign in
                                </button>
                            </div>

                        </form>
                    </div>
                </div>

            </main>

        </div>
    );
}
