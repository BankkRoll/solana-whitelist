// src/pages/api/discord-callback.ts

import type { NextApiRequest, NextApiResponse } from "next";

import { serialize } from "cookie";
import whitelistData from "@/config/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query;

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Code is required" });
  }

  try {
    const params = new URLSearchParams();
    params.append("client_id", process.env.DISCORD_CLIENT_ID!);
    params.append("client_secret", process.env.DISCORD_CLIENT_SECRET!);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", process.env.DISCORD_REDIRECT_URI!);

    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });
    const tokenData = await tokenResponse.json();

    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });
    const userData = await userResponse.json();

    const guildsResponse = await fetch(
      "https://discord.com/api/users/@me/guilds",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );
    const guildsData = await guildsResponse.json();

    const isMemberOfRequiredGuild = guildsData.some(
      (guild: { id: string }) =>
        guild.id === whitelistData.verifyDiscordMembership.id
    );

    if (!isMemberOfRequiredGuild) {
      return res
        .status(403)
        .json({ error: "Not a member of the required server." });
    }

    res.setHeader(
      "Set-Cookie",
      serialize("discordUsername", userData.username, {
        path: "/",
        httpOnly: true,
      })
    );

    res.redirect("/");
  } catch (error) {
    console.error("Error during Discord authentication:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
