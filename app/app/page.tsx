"use client";

import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider } from "@coral-xyz/anchor";
import { SendTransactionError, Transaction } from "@solana/web3.js";
import { getProgram, initializePlantationTx } from "@/utils/anchorClient";
import dynamic from "next/dynamic";
import { useState } from "react";

const WalletButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false },
);

export default function Home() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [txStatus, setTxStatus] = useState<string | null>(null);

  const isUserRejectedError = (err: unknown) => {
    if (!(err instanceof Error)) return false;
    return (
      err.message.includes("User rejected") ||
      err.message.includes("rejected the request")
    );
  };

  const handleRegisterAsset = async () => {
    try {
      if (!wallet) {
        setTxStatus("Connect your wallet first.");
        return;
      }

      const balanceLamports = await connection.getBalance(wallet.publicKey);
      if (balanceLamports === 0) {
        setTxStatus("Wallet has no SOL for fees. Fund it on the selected cluster and retry.");
        return;
      }

      setTxStatus("Waiting for wallet approval...");

      const provider = new AnchorProvider(
        connection,
        wallet,
        AnchorProvider.defaultOptions(),
      );
      const program = getProgram(provider);

      const ix = await initializePlantationTx(
        program,
        wallet.publicKey,
        "GEO-BAT-001",
        60,
        "QmTestHash123",
      );

      const tx = new Transaction().add(ix);
      const signature = await provider.sendAndConfirm(tx);
      console.log("Initialize plantation success", signature);
      setTxStatus(`Asset registered. Signature: ${signature}`);
    } catch (err) {
      if (isUserRejectedError(err)) {
        setTxStatus("Transaction cancelled in wallet.");
        return;
      }

      if (err instanceof SendTransactionError) {
        const logs = await err.getLogs(connection);
        console.error("Simulation logs:", logs);
      }

      console.error(err);
      setTxStatus("Transaction failed. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-semibold tracking-wide text-slate-100">
            GreWeCo | RWA MRV Engine
          </h1>
          <WalletButton className="!bg-emerald-600 hover:!bg-emerald-500" />
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
                CSJJsGjvg1e6kmutWZbJNM5UZo2FaXoqbWY6u5p3vDC
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRegisterAsset}
            className="mt-6 w-full rounded-lg border border-emerald-500/40 bg-emerald-600/20 px-4 py-2.5 text-sm font-medium text-emerald-100 transition hover:bg-emerald-600/30"
          >
            Register Asset On-Chain
          </button>
          {txStatus ? (
            <p className="mt-3 text-xs text-slate-300">{txStatus}</p>
          ) : null}
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
