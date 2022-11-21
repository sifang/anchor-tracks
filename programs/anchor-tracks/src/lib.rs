use anchor_lang::prelude::*;

declare_id!("Hwvq856XGDLfHpTAWdPEYjhu9YwVEGN7jfYE6QC5FqQh");



#[program]
pub mod anchor_tracks {
    use super::*;

    pub fn upload_track(ctx: Context<UploadTrack>, cid: String) -> Result<()> {
        ctx.accounts.track_account.cid = cid;
        Ok(())
    }
}

#[account]
pub struct Track {
    pub cid: String,
}

#[derive(Accounts)]
#[instruction(cid: String)]
pub struct UploadTrack<'info> {
    #[account(
        init,
        payer = authority,
        seeds = [
            b"track".as_ref(),
            // use sha256(cid) as seed, because there is a limit of seed length 32 bytes.  
            &anchor_lang::solana_program::hash::hash(cid.as_bytes()).to_bytes()      
        ],
        bump,
        space = 8 + 200,
    )]
    pub track_account: Account<'info, Track>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}