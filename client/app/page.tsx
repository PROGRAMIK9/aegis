"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  }, []);
  return (
    <div className="flex flex-col w-full min-h-screen max-w-[1920px] mx-auto relative z-10 px-8 py-10 fade-in">

      {/* Header */}
      <header className="flex justify-between items-center w-full px-4 bg-gradient-to-r from-transparent via-[#003882]/0 to-[#0048A6]/20 py-4 absolute top-0 left-0 right-0 z-50">
        <h1 className="font-cormorant text-[42px] font-bold text-white tracking-widest pl-16 pt-2">Aegis</h1>
        <nav className="flex gap-4 font-inter text-[15px] pr-20 pt-2 items-center">
          {!isLoggedIn && (
            <Link href="/login" className="px-6 py-2 rounded-[6px] bg-gradient-to-r from-[#003882] to-[#0048A6] text-white font-medium hover:brightness-110 transition-all shadow-[0_0_12px_rgba(0,30,100,0.4)] border border-white/10">Sign in</Link>
          )}
          <Link href="#" className="px-6 py-2 rounded-[6px] bg-gradient-to-b from-[#1C1F2B]/80 to-[#12141A]/80 text-white font-medium hover:brightness-110 transition-all border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">Docs</Link>
          {isLoggedIn && (
            <Link href="/dashboard" className="px-6 py-2 rounded-[6px] bg-gradient-to-r from-[#003882] to-[#0048A6] text-white font-medium hover:brightness-110 transition-all shadow-[0_0_12px_rgba(0,30,100,0.4)] border border-white/10">View dashboard</Link>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center -mt-20 text-center relative z-20">
        <h2 className="font-cormorant text-[100px] leading-[100px] font-bold text-white mb-8 tracking-tighter">
          Investigate <em className="font-medium italic pr-2">before</em><br />it's a problem
        </h2>

        <p className="font-inter text-[16px] leading-[26px] text-white max-w-[700px] mb-14 drop-shadow-md">
          Aegis fuses deterministic rule engines, isolation forest anomaly detection, and large language models to intercept phishing and fraud before it reaches your users
        </p>

        <div className="flex items-center gap-6">
          <button className="px-10 py-[18px] bg-[#0048A6] hover:bg-[#003882] transition-colors rounded-[8px] font-inter text-[16px] font-medium text-white shadow-[0_0_20px_rgba(0,113,255,0.2)]">
            Get Extension!
          </button>

          <button className="px-10 py-[18px] bg-gradient-to-b from-[#1C1F2B]/90 to-[#12141A]/90 hover:brightness-110 transition-colors rounded-[8px] font-inter text-[16px] font-medium text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_16px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden">
            <span className="relative z-10">Get Checked!</span>
            <div className="absolute inset-0 bg-white/5 shadow-inner opacity-0 hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </main>

    </div>
  );
}
