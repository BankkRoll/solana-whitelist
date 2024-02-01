const whitelistData = {
  projectName: "Test Project",
  description: "This is a sample project description. ",
  bannerUrl: "/solanaGradient.jpg",
  profilePictureUrl: "/bankk.png",

  websiteUrl: "https://bankkroll.xyz",
  twitterUrl: "https://twitter.com/bankkroll_eth",
  discordUrl: "https://discord.gg/",

  registrationLimit: 25000,
  registrationStartDate: "2024-02-01T12:00:00Z",
  registrationEndDate: "2024-02-10T12:00:00Z",
  minimumWalletBalance: 0,

  mintPrice: 0.05,
  totalSupply: 1000,
  numberOfWinners: 500,

  verifyDiscordRole: {
    id: "123456789123456789",
    name: "Verified",
  },
  verifyDiscordMembership: {
    id: "123456789123456789",
    name: "BankkRoll Server",
  },

  requireTwitterFollow: true,
  requireDiscordJoin: true,
};

export default whitelistData;
