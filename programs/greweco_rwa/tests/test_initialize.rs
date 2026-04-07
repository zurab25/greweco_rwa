use {
    anchor_lang::{
        prelude::Pubkey,
        solana_program::instruction::Instruction,
        system_program,
        InstructionData, ToAccountMetas,
    },
    litesvm::LiteSVM,
    solana_message::{Message, VersionedMessage},
    solana_signer::Signer,
    solana_keypair::Keypair,
    solana_transaction::versioned::VersionedTransaction,
};

#[test]
fn test_initialize() {
    let program_id = greweco_rwa::id();
    let payer = Keypair::new();
    let mut svm = LiteSVM::new();

    let so_path = std::path::Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("../../target/deploy/greweco_rwa.so");
    let bytes = std::fs::read(&so_path).unwrap_or_else(|e| {
        panic!(
            "read {}: {e}. Run `anchor build` so the program is built and copied to target/deploy first.",
            so_path.display()
        )
    });
    svm.add_program(program_id, &bytes).unwrap();
    svm.airdrop(&payer.pubkey(), 1_000_000_000).unwrap();

    let authority = payer.pubkey();
    let plantation_id = "GEO-BAT-001".to_string();
    let (plantation_pda, _bump) = Pubkey::find_program_address(
        &[
            b"plantation",
            authority.as_ref(),
            plantation_id.as_bytes(),
        ],
        &program_id,
    );

    let instruction = Instruction::new_with_bytes(
        program_id,
        &greweco_rwa::instruction::InitializePlantation {
            plantation_id: plantation_id.clone(),
            total_hectares: 100,
            location_hash: "offchain-hash".to_string(),
        }
        .data(),
        greweco_rwa::accounts::InitializePlantation {
            authority,
            plantation: plantation_pda,
            system_program: system_program::ID,
        }
        .to_account_metas(None),
    );

    let blockhash = svm.latest_blockhash();
    let msg = Message::new_with_blockhash(&[instruction], Some(&payer.pubkey()), &blockhash);
    let tx = VersionedTransaction::try_new(VersionedMessage::Legacy(msg), &[payer]).unwrap();

    let res = svm.send_transaction(tx);
    assert!(res.is_ok());
}
