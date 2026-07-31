import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, ScanLine, Link2, CreditCard } from "lucide-react";

// ---- Mock data (swap for real API response later) ----
const MOCK_PHISHING = {
  input: "paypa1-secure-verify.xyz/login",
  verdict: "phishing",
  score: 87,
  reasons: [
    { signal: "TLD blocklist", detail: "'.xyz' is a low-cost TLD heavily abused for phishing", source: "rule" },
    { signal: "Brand distance", detail: "'paypa1' is 1 edit from 'paypal' — likely impersonation", source: "rule" },
    { signal: "URL entropy", detail: "Subdomain structure resembles randomly generated strings", source: "rule" },
    { signal: "Urgency language", detail: "Page text pressures immediate account verification", source: "llm" },
    { signal: "Credential request", detail: "Form requests password and one-time code together", source: "llm" },
  ],
};

const MOCK_FRAUD = {
  input: "Txn #48213 — $1,240.00",
  verdict: "suspicious",
  score: 54,
  reasons: [
    { signal: "Amount deviation", detail: "3.4x above this account's rolling average spend", source: "rule" },
    { signal: "Velocity", detail: "4th transaction in the last hour", source: "rule" },
    { signal: "Geo mismatch", detail: "Device location differs from last known pattern", source: "rule" },
  ],
};

const VERDICT_STYLE = {
  safe: { label: "SAFE", color: "#2F6F4E" },
  suspicious: { label: "SUSPICIOUS", color: "#B8791A" },
  phishing: { label: "PHISHING", color: "#A63232" },
};

function Stamp({ verdict }) {
  const v = VERDICT_STYLE[verdict];
  return (
    <div
      style={{
        border: `2.5px solid ${v.color}`,
        color: v.color,
        transform: "rotate(-7deg)",
        fontFamily: "'IBM Plex Mono', monospace",
        letterSpacing: "0.12em",
      }}
      className="px-4 py-1.5 text-sm font-bold rounded-sm select-none"
    >
      {v.label}
    </div>
  );
}

function SignalRow({ signal }) {
  const Icon = signal.source === "llm" ? AlertTriangle : CheckCircle2;
  return (
    <div className="flex items-start gap-3 py-3" style={{ borderTop: "1px solid #DAD6CC" }}>
      <Icon size={18} style={{ color: signal.source === "llm" ? "#B8791A" : "#6B6558", marginTop: 2, flexShrink: 0 }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 flex-wrap">
          <span
            style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#1C1B19" }}
            className="text-sm font-semibold"
          >
            {signal.signal}
          </span>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: signal.source === "llm" ? "#B8791A" : "#6B6558",
              letterSpacing: "0.08em",
            }}
            className="text-[10px] font-bold uppercase"
          >
            {signal.source === "llm" ? "Reasoned" : "Instant"}
          </span>
        </div>
        <p style={{ color: "#4A463D", fontFamily: "'Source Serif 4', serif" }} className="text-sm mt-0.5">
          {signal.detail}
        </p>
      </div>
    </div>
  );
}

export default function ScanLedger() {
  const [mode, setMode] = useState("phishing");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(MOCK_PHISHING);

  const runScan = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, input: inputValue }),
      });
      if (!res.ok) throw new Error(`Scan failed: ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      // show an error state instead of silently failing
    } finally {
      setLoading(false);
    }
  };

  const v = VERDICT_STYLE[result.verdict];

  return (
    <div
      style={{ background: "#F7F5F1", minHeight: "100%", fontFamily: "'Inter', sans-serif" }}
      className="w-full p-6 md:p-10"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@500;600&family=IBM+Plex+Mono:wght@500;600;700&family=Inter:wght@400;500&display=swap');
      `}</style>

      <div className="max-w-2xl mx-auto">
        {/* Eyebrow + title */}
        <div className="flex items-center gap-2 mb-1">
          <ScanLine size={14} style={{ color: "#8A8474" }} />
          <span
            style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#8A8474", letterSpacing: "0.16em" }}
            className="text-xs font-semibold uppercase"
          >
            Risk Analysis
          </span>
        </div>
        <h1
          style={{ fontFamily: "'Source Serif 4', serif", color: "#1C1B19" }}
          className="text-3xl md:text-4xl font-semibold mb-6"
        >
          Signal Ledger
        </h1>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-4">
          {[
            { key: "phishing", label: "URL / Email", icon: Link2 },
            { key: "fraud", label: "Transaction", icon: CreditCard },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                background: mode === key ? "#1C1B19" : "transparent",
                color: mode === key ? "#F7F5F1" : "#4A463D",
                border: "1.5px solid #1C1B19",
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase rounded-sm tracking-wide"
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* Scan form */}
        <div className="flex gap-2 mb-8">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={mode === "phishing" ? "Paste a URL or email text…" : "Paste a transaction reference…"}
            style={{
              fontFamily: "'Inter', sans-serif",
              border: "1.5px solid #DAD6CC",
              background: "#FFFFFF",
              color: "#1C1B19",
            }}
            className="flex-1 px-3 py-2.5 text-sm rounded-sm outline-none focus:border-black"
          />
          <button
            onClick={runScan}
            style={{ fontFamily: "'IBM Plex Mono', monospace", background: "#1C1B19", color: "#F7F5F1" }}
            className="px-5 py-2.5 text-xs font-bold uppercase rounded-sm tracking-wide"
          >
            {loading ? "Scanning…" : "Run check"}
          </button>
        </div>

        {/* Verdict card */}
        <div
          style={{ background: "#FFFFFF", border: "1px solid #DAD6CC" }}
          className="rounded-sm p-6 mb-4 relative overflow-hidden"
        >
          <div className="flex items-start justify-between gap-4 mb-1">
            <div className="min-w-0">
              <div
                style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#8A8474" }}
                className="text-[11px] uppercase tracking-wide mb-1 truncate"
              >
                {result.input}
              </div>
              <div className="flex items-baseline gap-1">
                <span
                  style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#1C1B19" }}
                  className="text-5xl font-bold"
                >
                  {result.score}
                </span>
                <span style={{ color: "#8A8474" }} className="text-lg font-medium">
                  /100
                </span>
              </div>
            </div>
            <Stamp verdict={result.verdict} />
          </div>

          {/* Signal ledger */}
          <div className="mt-4">
            {result.reasons.map((r, i) => (
              <SignalRow key={i} signal={r} />
            ))}
          </div>
        </div>

        <p style={{ color: "#8A8474", fontFamily: "'Inter', sans-serif" }} className="text-xs text-center">
          Instant = rule engine · Reasoned = LLM called on ambiguous scores (30–70)
        </p>
      </div>
    </div>
  );
}
