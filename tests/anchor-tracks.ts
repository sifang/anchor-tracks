import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { AnchorTracks } from "../target/types/anchor_tracks";

describe("anchor-tracks", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.AnchorTracks as Program<AnchorTracks>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
