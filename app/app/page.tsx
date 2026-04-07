"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-semibold tracking-wide text-slate-100">
            GreWeCo | RWA MRV Engine
          </h1>
          <WalletMultiButton className="!bg-emerald-600 hover:!bg-emerald-500" />
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-8 md:grid-cols-2">
        <section className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl shadow-slate-950/40">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Asset</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-100">
            Plantation GEO-BAT-001
          </h2>
          <div className="mt-6 space-y-3 text-sm text-slate-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Total Hectares</span>
              <span className="font-medium text-slate-100">1,250 ha</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Owner Pubkey</span>
              <span className="truncate font-mono text-xs text-slate-100">
                9xQeWvG816bUx9EPjHmaT23yvVMQz7LwJfLxY2PpEw9G
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl shadow-slate-950/40">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">MRV Oracle</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-100">
            Latest AI Verification
          </h2>
          <div className="mt-6 space-y-3 text-sm text-slate-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Biomass Estimate</span>
              <span className="font-medium text-slate-100">4,820 tons</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Carbon Credits Verified</span>
              <span className="font-medium text-emerald-400">2,140 tCO2e</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
