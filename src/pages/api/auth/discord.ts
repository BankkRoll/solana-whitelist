// src/pages/api/auth/discord.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.DISCORD_REDIRECT_URI!);
  const scope = encodeURIComponent("identify guilds");
  const discordUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&response_type=code&scope=${scope}&redirect_uri=${redirectUri}&prompt=consent`;

  res.redirect(discordUrl);
}
