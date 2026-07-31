import Link from "next/link";
import { Download, ExternalLink, ShieldCheck } from "lucide-react";

export default function DocsPage() {
  return (
    <main className="min-h-screen px-6 py-16 sm:px-12 lg:px-24">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-[#071a33]/70 p-8 shadow-2xl backdrop-blur sm:p-12">
        <div className="mb-8 flex items-center gap-3 text-[#75b8ff]">
          <ShieldCheck className="h-8 w-8" />
          <span className="font-inter text-sm font-semibold uppercase tracking-[0.2em]">Aegis Extension</span>
        </div>

        <h1 className="font-cormorant text-5xl font-bold text-white sm:text-6xl">Install the browser extension</h1>
        <p className="mt-5 max-w-2xl font-inter leading-7 text-slate-200">
          Download the complete Aegis extension package, extract it, then load the extracted folder in your Chromium browser.
        </p>

        <a
          href="/aegis-extension.zip"
          download
          className="mt-8 inline-flex items-center gap-3 rounded-lg bg-[#1268d6] px-6 py-4 font-inter font-semibold text-white transition-colors hover:bg-[#0d55ad]"
        >
          <Download className="h-5 w-5" />
          Download Aegis Extension
        </a>

        <ol className="mt-12 space-y-5 font-inter text-slate-200">
          <li><span className="mr-3 font-semibold text-[#75b8ff]">1.</span>Extract the downloaded <code className="rounded bg-white/10 px-1.5 py-0.5 text-white">aegis-extension.zip</code> file.</li>
          <li><span className="mr-3 font-semibold text-[#75b8ff]">2.</span>Open <code className="rounded bg-white/10 px-1.5 py-0.5 text-white">chrome://extensions</code> (or <code className="rounded bg-white/10 px-1.5 py-0.5 text-white">edge://extensions</code>).</li>
          <li><span className="mr-3 font-semibold text-[#75b8ff]">3.</span>Enable <strong className="text-white">Developer mode</strong>.</li>
          <li><span className="mr-3 font-semibold text-[#75b8ff]">4.</span>Select <strong className="text-white">Load unpacked</strong>, then choose the extracted <code className="rounded bg-white/10 px-1.5 py-0.5 text-white">extension</code> folder.</li>
        </ol>

        <Link href="/" className="mt-12 inline-flex items-center gap-2 font-inter text-sm text-[#8dc5ff] hover:text-white">
          <ExternalLink className="h-4 w-4" /> Return to Aegis
        </Link>
      </div>
    </main>
  );
}
