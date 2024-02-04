// src/config/config.ts
const whitelistData = {
  projectName: "Test Project",
  description: "This is a sample project description. ",
  bannerUrl: "/solanaGradient.jpg",
  profilePictureUrl: "/bankk.png",

  websiteUrl: "https://bankkroll.xyz",
  twitterUrl: "https://twitter.com/bankkroll_eth",
  discordUrl: "https://discord.gg/",

  registrationLimit: 6,
  registrationStartDate: "2024-02-01T12:00:00Z",
  registrationEndDate: "2024-03-10T12:00:00Z",
  minimumWalletBalance: 0,

  mintPrice: 0.05,
  totalSupply: 1000,
  numberOfWinners: 500,

  
  verifyDiscordRole: {
    id: "123456789123456789",
    name: "Verified",
  },
  verifyDiscordMembership: {
    id: "970457608395841597",
    name: "BankkRoll Server",
  },

  requireTwitter: true,
  requireDiscord: true,
};

export default whitelistData;
