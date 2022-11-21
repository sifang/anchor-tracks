import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { AnchorTracks } from '../target/types/anchor_tracks';

const { createHash } = require('crypto');

// @dev Somehow AnchorProvider.env() (v0.25) would not work without following line... 
require('dotenv').config()

const program = anchor.workspace.AnchorTracks as Program<AnchorTracks>;
const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

async function uploadTrack(cid: string) {
    // use sha256(cid) as seed, because there is a limit of seed length 32 bytes.
    let hexString = createHash('sha256').update(cid,'utf-8').digest('hex');
    let cidSha256 = Uint8Array.from(Buffer.from(hexString,'hex'));

    const [trackPDA, _] = await PublicKey
      .findProgramAddress(
        [
            anchor.utils.bytes.utf8.encode("track"),
            // anchor.utils.bytes.utf8.encode(cidSha256),
            cidSha256,
        ],
        program.programId
      );
    console.log('Expected trackPDA: ', trackPDA);    
    const trackPDAString = trackPDA.toBase58();
    console.log('Expected trackPDAString: ', trackPDAString);

    await program.methods.uploadTrack(cid)
        .accounts({
            trackAccount: trackPDA,
            authority: provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId, 
        })
        .rpc(); 
    
    console.log("Track uploaded, checking ....");
    const trackAccount = await program.account.track.fetch(trackPDAString);
    console.log('Upload successful! ', trackAccount.cid);
    console.log('To retreive track, run: npx ts-node client/client.ts get ' + trackPDAString);
}

async function getTrack(trackPDAString) {
    const trackAccount = await program.account.track.fetch(trackPDAString);
    console.log('Track IPFS:', trackAccount.cid);
}

if (process.argv[2] === 'upload' && process.argv[3]) {
    console.log('Uploading CID: ', process.argv[3]);
    uploadTrack(process.argv[3]);
} else if (process.argv[2] === 'get' && process.argv[3]) {
    console.log('Get CID with Hash: ', process.argv[3]);
    getTrack(process.argv[3]);
} else {
    console.log('Example run: npx ts-node client/client.ts upload 1234567');
}