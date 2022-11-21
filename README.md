# anchor-tracks 
This repo is a fun excercise to solve an interesteing problem on Solana blockchain.

## Problem
There are number of music tracks uploaded to IPFS. Each track is unique with checksum such as `QmPdcY6rdUNt9UyFb2WDvDe46gdUPtSKRNMjCNQfQXtKRT`. <br/>
These tracks are being uploaded to IPFS-like storage, with checksum referenced above. 
How can we store these references in [Solana blockchain](https://solana.com/). So that we can 
1. upload a track checksum get a reference back.
2. use the reference to retrive the checksum, and eventually the IPFS content.

## Approach
If we were on a centralized client-server enviroment, this would be very easy. 
We could simply use a SQL database table, to store the relations between IPFS checksum with generated indexes, and even reverse indexes for quick lookups.
On blockchain however, everything is costly. We want to avoid cost as much as possible.

Solana offers an interesting model of PDA (Program Dirived Addresses): 
https://solanacookbook.com/core-concepts/pdas.html#facts

It can be used to build data structure like a hashtable, and bypass some limitations of blockchain. For example, up to 10MB of data can be stored per "account". 
(account in Solana is like a file, NOT to be confused with real account or wallet) 

## Implementation
- After research, Anchor framework is the way to go in Solana world. Because it requires much less code than vanilla Solana. Also, it seems to be the king now, among Solana developers. Active Community = More support & knowledge.
- Implement Anchor PDA: 
  - logical goal is to use cid as the seed.
  - IPFS address is greater than 32 bytes.
  - but there is 32 byte limit for each seed.  
  - so wrap cid with sha256(cid)
    
## Future expansion
- Permission this system so that only a given wallet can control a given track
    - We could store the controlling wallet pubKey in each track
- Add in additional track metadata like "title" or "album art"
    - Easily done to add addtional fields in Track struct.

## Try Out
### Install dependencies
https://book.anchor-lang.com/getting_started/installation.html

### Update dotenv
Default value for dotenv file is 
```
ANCHOR_WALLET = /Users/sifang/.config/solana/id.json
```
Change it to your own name/value!

### Setup 
- restart solana
- npm install
- anchor rebuild 
- anchor deploy

### try it
[Upload 1234588]
- npx ts-node client/client.ts upload 1234588

Uploading CID:  1234588
Expected trackPDA:  PublicKey {
  _bn: <BN: 6f4b8c19ae20d78b112f94448ff25d7b9c84b43c1e11e0e372a9aaecc479ffa1>
}
Expected trackPDAString:  8VT4zZymoa2fLrjCX3Rn7iwcCRnUgUGehzfWcVd3eorg
Track uploaded, checking ....
Upload successful!  1234588
To retreive track, run: npx ts-node client/client.ts get 8VT4zZymoa2fLrjCX3Rn7iwcCRnUgUGehzfWcVd3eorg

[Verify]
- npx ts-node client/client.ts get 8VT4zZymoa2fLrjCX3Rn7iwcCRnUgUGehzfWcVd3eorg

`npx ts-node client/client.ts get 8VT4zZymoa2fLrjCX3Rn7iwcCRnUgUGehzfWcVd3eorg
Get CID with Hash:  8VT4zZymoa2fLrjCX3Rn7iwcCRnUgUGehzfWcVd3eorg
Track IPFS: 1234588`