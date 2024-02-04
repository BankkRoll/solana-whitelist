// src/pages/api/balance.ts

import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { publicKey } = req.query;

    if (!publicKey || typeof publicKey !== "string") {
      res.status(400).json({ error: "Public key is required." });
      return;
    }

    const connection = new Connection("https://api.mainnet-beta.solana.com");
    const balanceInLamports = await connection.getBalance(
      new PublicKey(publicKey)
    );
    const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

    res.status(200).json({ balance: balanceInSOL });
  } catch (error) {
    console.error("Error fetching balance:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;
