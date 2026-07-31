"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShieldAlert, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const searchParams = useSearchParams();
  const isBlocked = searchParams.get('blocked') === 'true';
  const blockedUrl = searchParams.get('url') || 'Unknown URL';
  const score = searchParams.get('score') || '100';
  const tier = searchParams.get('tier') || 'critical';

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  }, []);

  if (isBlocked) {
    return (
      <div className="flex flex-col w-full min-h-screen bg-[#0D0000] text-white font-inter items-center justify-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="z-10 flex flex-col items-center max-w-[600px] text-center p-8 bg-red-950/30 border border-red-500/20 rounded-2xl backdrop-blur-xl">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6 border border-red-500/30">
            <ShieldAlert size={40} className="text-red-500" />
          </div>

          <h1 className="text-[32px] font-bold text-red-500 mb-2 font-cormorant tracking-wide">Threat Blocked</h1>
          <p className="text-red-200/80 mb-8 text-[15px] leading-relaxed">
            Aegis has intercepted your request to access this website because it was flagged as a severe security risk.
          </p>

          <div className="w-full bg-black/40 border border-red-500/20 rounded-xl p-4 mb-8 text-left">
            <div className="text-xs text-red-400/60 uppercase tracking-widest font-semibold mb-1">Target URL</div>
            <div className="text-white font-mono text-sm break-all mb-4">{blockedUrl}</div>

            <div className="flex gap-4">
              <div className="flex-1 bg-red-950/40 rounded-lg p-3 border border-red-500/10">
                <div className="text-xs text-red-400/60 uppercase tracking-widest font-semibold mb-1">Threat Score</div>
                <div className="text-xl font-bold text-red-500">{score} <span className="text-sm text-red-400/60 font-normal">/ 100</span></div>
              </div>
              <div className="flex-1 bg-red-950/40 rounded-lg p-3 border border-red-500/10">
                <div className="text-xs text-red-400/60 uppercase tracking-widest font-semibold mb-1">Risk Tier</div>
                <div className="text-xl font-bold text-red-500 uppercase">{tier}</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 w-full">
            <button 
              onClick={() => {
                if (window.history.length > 2) {
                  window.history.go(-2);
                } else {
                  window.location.href = "about:blank";
                }
              }} 
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-[0_0_20px_rgba(220,38,38,0.3)]"
            >
              Go Back Safely
            </button>
            <Link href="/dashboard" className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
              <ArrowLeft size={16} /> Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen max-w-[1920px] mx-auto relative z-10 px-8 py-10 fade-in">

      {/* Header */}
      <header className="flex justify-between items-center w-full px-4 bg-gradient-to-r from-transparent via-[#003882]/0 to-[#0048A6]/20 py-4 absolute top-0 left-0 right-0 z-50">
        <h1 className="font-cormorant text-[42px] font-bold text-white tracking-widest pl-16 pt-2">Aegis</h1>
        <nav className="flex gap-4 font-inter text-[15px] pr-20 pt-2 items-center">
          {!isLoggedIn && (
            <Link href="/login" className="px-6 py-2 rounded-[6px] bg-gradient-to-r from-[#003882] to-[#0048A6] text-white font-medium hover:brightness-110 transition-all shadow-[0_0_12px_rgba(0,30,100,0.4)] border border-white/10">Sign in</Link>
          )}
          <Link href="/docs" className="px-6 py-2 rounded-[6px] bg-gradient-to-b from-[#1C1F2B]/80 to-[#12141A]/80 text-white font-medium hover:brightness-110 transition-all border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">Docs</Link>
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
          <a href="/aegis-extension.zip" download className="px-10 py-[18px] bg-[#0048A6] hover:bg-[#003882] transition-colors rounded-[8px] font-inter text-[16px] font-medium text-white shadow-[0_0_20px_rgba(0,113,255,0.2)]">
            Get Extension!
          </a>

          <Link href={isLoggedIn ? "/dashboard" : "/login"} className="px-10 py-[18px] bg-gradient-to-b from-[#1C1F2B]/90 to-[#12141A]/90 hover:brightness-110 transition-colors rounded-[8px] font-inter text-[16px] font-medium text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_16px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden text-center">
            <span className="relative z-10">Get Checked!</span>
            <div className="absolute inset-0 bg-white/5 shadow-inner opacity-0 hover:opacity-100 transition-opacity"></div>
          </Link>
        </div>
      </main>

    </div>
  );
}
