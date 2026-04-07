import * as anchor from "@coral-xyz/anchor";
import { BN } from "@coral-xyz/anchor";
import {
  PublicKey,
  SystemProgram,
  type TransactionInstruction,
} from "@solana/web3.js";

import idl from "./greweco_rwa.json";

export function getProgram(provider: anchor.AnchorProvider): anchor.Program {
  return new anchor.Program(idl as anchor.Idl, provider);
}

export async function initializePlantationTx(
  program: anchor.Program,
  walletPubkey: PublicKey,
  plantationId: string,
  totalHectares: number,
  locationHash: string,
): Promise<TransactionInstruction> {
  const [pdaAddress] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("plantation"),
      walletPubkey.toBuffer(),
      Buffer.from(plantationId),
    ],
    program.programId,
  );

  return program.methods
    .initializePlantation(plantationId, new BN(totalHectares), locationHash)
    .accounts({
      plantation: pdaAddress,
      authority: walletPubkey,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
}
