"use client";

import { useState } from "react";

export default function Home() {
  const [phishingForm, setPhishingForm] = useState({ url: "", page_text: "" });
  const [phishingResult, setPhishingResult] = useState<any>(null);
  const [phishingLoading, setPhishingLoading] = useState(false);

  const [fraudForm, setFraudForm] = useState({
    amount: 100,
    velocity: 1,
    hour: 12,
    geo_distance: 10,
  });
  const [fraudResult, setFraudResult] = useState<any>(null);
  const [fraudLoading, setFraudLoading] = useState(false);

  const API_URL = "http://localhost:8000";

  const handlePhishingCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhishingLoading(true);
    setPhishingResult(null);
    try {
      const res = await fetch(`${API_URL}/api/v1/phishing/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: phishingForm.url,
          page_text: phishingForm.page_text || undefined,
        }),
      });
      const data = await res.json();
      setPhishingResult(data);
    } catch (err) {
      setPhishingResult({ error: "Failed to connect to API" });
    } finally {
      setPhishingLoading(false);
    }
  };

  const handleFraudCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setFraudLoading(true);
    setFraudResult(null);
    try {
      const res = await fetch(`${API_URL}/api/v1/fraud/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction: {
            amount: Number(fraudForm.amount),
            velocity: Number(fraudForm.velocity),
            hour: Number(fraudForm.hour),
            geo_distance: Number(fraudForm.geo_distance),
          },
        }),
      });
      const data = await res.json();
      setFraudResult(data);
    } catch (err) {
      setFraudResult({ error: "Failed to connect to API" });
    } finally {
      setFraudLoading(false);
    }
  };

  const ResultCard = ({ result, loading }: { result: any; loading: boolean }) => {
    if (loading) return <div className="p-4 border rounded bg-gray-50 text-gray-500 animate-pulse">Loading...</div>;
    if (!result) return null;
    
    if (result.error) return <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded">{result.error}</div>;

    // Check for validation errors (FastAPI 422)
    if (result.detail) return <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded">
      <p className="font-bold">Validation Error:</p>
      <pre className="text-xs overflow-auto">{JSON.stringify(result.detail, null, 2)}</pre>
    </div>;

    const tierColors: Record<string, string> = {
      safe: "bg-green-100 text-green-800 border-green-300",
      moderate: "bg-yellow-100 text-yellow-800 border-yellow-300",
      high: "bg-orange-100 text-orange-800 border-orange-300",
      critical: "bg-red-100 text-red-800 border-red-300",
    };
    
    const colorClass = tierColors[result.tier] || "bg-gray-100";

    return (
      <div className={`p-4 border rounded ${colorClass} mt-4`}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-lg">Verdict: {result.verdict}</h3>
          <span className="font-mono text-xl font-bold bg-white/50 px-2 py-1 rounded">Score: {result.final_score}/100</span>
        </div>
        <p className="mb-2"><strong>Tier:</strong> <span className="uppercase">{result.tier}</span></p>
        
        {result.reasons && result.reasons.length > 0 && (
          <div className="mb-2">
            <strong>Reasons:</strong>
            <ul className="list-disc pl-5 text-sm mt-1">
              {result.reasons.map((r: string, i: number) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}
        
        {result.breakdown && (
          <div className="text-sm bg-white/40 p-2 rounded mt-3">
            <strong>Breakdown:</strong>
            <pre className="mt-1 font-mono text-xs overflow-x-auto">
              {JSON.stringify(result.breakdown, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Aegis API Tester</h1>
          <p className="text-gray-600">Test the phishing and fraud detection endpoints</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Phishing Check */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">POST /phishing/check</h2>
            
            <form onSubmit={handlePhishingCheck} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">URL <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  placeholder="https://example.com"
                  className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
                  value={phishingForm.url}
                  onChange={e => setPhishingForm({...phishingForm, url: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Page Text (Optional)</label>
                <textarea 
                  rows={3}
                  placeholder="Enter text found on the page for LLM analysis..."
                  className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
                  value={phishingForm.page_text}
                  onChange={e => setPhishingForm({...phishingForm, page_text: e.target.value})}
                />
              </div>
              
              <button 
                type="submit" 
                disabled={phishingLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-colors disabled:opacity-50"
              >
                Analyze URL
              </button>
            </form>
            
            <div className="mt-6">
              <ResultCard result={phishingResult} loading={phishingLoading} />
            </div>
          </div>

          {/* Fraud Check */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">POST /fraud/score</h2>
            
            <form onSubmit={handleFraudCheck} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Amount ($) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    required min="0.01" step="0.01"
                    className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
                    value={fraudForm.amount}
                    onChange={e => setFraudForm({...fraudForm, amount: e.target.value as any})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Velocity (tx/hr) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    required min="0"
                    className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
                    value={fraudForm.velocity}
                    onChange={e => setFraudForm({...fraudForm, velocity: e.target.value as any})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Hour (0-23) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    required min="0" max="23"
                    className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
                    value={fraudForm.hour}
                    onChange={e => setFraudForm({...fraudForm, hour: e.target.value as any})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Geo Distance (km) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    required min="0"
                    className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
                    value={fraudForm.geo_distance}
                    onChange={e => setFraudForm({...fraudForm, geo_distance: e.target.value as any})}
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={fraudLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded transition-colors disabled:opacity-50 mt-4"
              >
                Score Transaction
              </button>
            </form>

            <div className="mt-6">
              <ResultCard result={fraudResult} loading={fraudLoading} />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
