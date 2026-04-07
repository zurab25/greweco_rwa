use anchor_lang::prelude::*;

// This is your program's public key. We will update this later when we deploy.
declare_id!("ELHGjVXcokM5Y4nKv6Qff4JKM5CisddnUocs459AUUca");

#[program]
pub mod greweco_rwa {
    use super::*;

    pub fn initialize_plantation(
        ctx: Context<InitializePlantation>, 
        plantation_id: String, 
        total_hectares: u64, 
        location_hash: String
    ) -> Result<()> {
        let plantation = &mut ctx.accounts.plantation;
        let authority = &ctx.accounts.authority;

        // Populate the on-chain account with the real-world data
        plantation.authority = authority.key();
        plantation.plantation_id = plantation_id;
        plantation.total_hectares = total_hectares;
        plantation.location_hash = location_hash;
        
        // Save the bump seed for future secure CPIs (Cross-Program Invocations)
        plantation.bump = ctx.bumps.plantation;

        msg!("GreWeCo Plantation Asset Initialized!");
        msg!("ID: {}, Hectares: {}", plantation.plantation_id, plantation.total_hectares);

        Ok(())
    }
}

// --------------------------------------------------------
// Account Validation & PDA Derivation Structure
// --------------------------------------------------------
#[derive(Accounts)]
#[instruction(plantation_id: String)]
pub struct InitializePlantation<'info> {
    #[account(mut)]
    pub authority: Signer<'info>, // The person paying for the transaction and creating the asset

    // This creates the PDA. It uses "plantation" and the unique ID as seeds.
    #[account(
        init, 
        payer = authority, 
        space = 8 + Plantation::INIT_SPACE, // 8 bytes for the Anchor discriminator
        seeds = [b"plantation", plantation_id.as_bytes()], 
        bump
    )]
    pub plantation: Account<'info, Plantation>,

    pub system_program: Program<'info, System>,
}

// --------------------------------------------------------
// The State Structure (What data lives on the blockchain)
// --------------------------------------------------------
#[account]
pub struct Plantation {
    pub authority: Pubkey,        // Who owns this plantation record
    pub plantation_id: String,    // Unique identifier (e.g., "GEO-BAT-001")
    pub total_hectares: u64,      // Size of the land
    pub location_hash: String,    // Hash of exact GPS bounds stored securely off-chain
    pub bump: u8,                 // PDA bump seed
}

// We calculate the maximum size the account needs to store the data
impl Plantation {
    // 32 (Pubkey) + 4 (String prefix) + 32 (ID max length) + 8 (u64) + 4 (String prefix) + 64 (Hash length) + 1 (bump)
    pub const INIT_SPACE: usize = 32 + 36 + 8 + 68 + 1; 
}