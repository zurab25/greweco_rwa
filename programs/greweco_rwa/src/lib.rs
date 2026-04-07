use anchor_lang::prelude::*;

declare_id!("ELHGjVXcokM5Y4nKv6Qff4JKM5CisddnUocs459AUUca");

#[program]
pub mod greweco_rwa {
    use super::*;

    pub fn initialize_plantation(
        ctx: Context<InitializePlantation>,
        plantation_id: String,
        total_hectares: u64,
        location_hash: String,
    ) -> Result<()> {
        let plantation = &mut ctx.accounts.plantation;

        plantation.authority = ctx.accounts.authority.key();
        plantation.plantation_id = plantation_id;
        plantation.total_hectares = total_hectares;
        plantation.location_hash = location_hash;
        plantation.bump = ctx.bumps.plantation;

        msg!("GreWeCo Plantation PDA initialized successfully.");

        Ok(())
    }

    pub fn record_mrv(
        ctx: Context<RecordMrv>,
        timestamp: i64,
        biomass_estimate: u64,
        carbon_credits_verified: u64,
        mrv_hash: String,
    ) -> Result<()> {
        let mrv_record = &mut ctx.accounts.mrv_record;

        mrv_record.plantation = ctx.accounts.plantation.key();
        mrv_record.timestamp = timestamp;
        mrv_record.biomass_estimate = biomass_estimate;
        mrv_record.carbon_credits_verified = carbon_credits_verified;
        mrv_record.mrv_hash = mrv_hash;
        mrv_record.bump = ctx.bumps.mrv_record;

        msg!("GreWeCo MRV Data anchored successfully.");

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(plantation_id: String)]
pub struct InitializePlantation<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = 8 + Plantation::INIT_SPACE,
        seeds = [b"plantation", authority.key().as_ref(), plantation_id.as_bytes()],
        bump
    )]
    pub plantation: Account<'info, Plantation>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Plantation {
    pub authority: Pubkey,
    #[max_len(32)]
    pub plantation_id: String,
    pub total_hectares: u64,
    #[max_len(64)]
    pub location_hash: String,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct MrvRecord {
    pub plantation: Pubkey,
    pub timestamp: i64,
    pub biomass_estimate: u64,
    pub carbon_credits_verified: u64,
    #[max_len(64)]
    pub mrv_hash: String,
    pub bump: u8,
}

#[derive(Accounts)]
#[instruction(timestamp: i64)]
pub struct RecordMrv<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(has_one = authority)]
    pub plantation: Account<'info, Plantation>,

    #[account(
        init,
        payer = authority,
        space = 8 + MrvRecord::INIT_SPACE,
        seeds = [b"mrv", plantation.key().as_ref(), timestamp.to_le_bytes().as_ref()],
        bump
    )]
    pub mrv_record: Account<'info, MrvRecord>,

    pub system_program: Program<'info, System>,
}
