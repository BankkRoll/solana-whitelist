# Solana Whitelist

## Description
Set up a whitelist registration for a Solana-based project.

## In Progress
- [ ] Discord Connection Verification
- [ ] Database Connection to store Entries 

## Installation
1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/BankkRoll/solana-whitelist.git
   ```

2. Navigate to the project directory:

   ```bash
   cd solana-whitelist
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

## Configuration
1. Open the `src/config/config.ts` file.

2. Update the following configuration options to match your project:

   - `projectName`: Name of your project.
   - `description`: Description of your project.
   - `bannerUrl`: URL to the project's banner image.
   - `profilePictureUrl`: URL to the project's profile picture.
   - `websiteUrl`: URL to your project's website.
   - `twitterUrl`: URL to your project's Twitter account.
   - `discordUrl`: URL to your project's Discord server.
   - `registrationLimit`: Maximum number of registrations allowed.
   - `registrationStartDate`: Start date and time of registration.
   - `registrationEndDate`: End date and time of registration.
   - `minimumWalletBalance`: Minimum wallet balance required for registration.
   - `mintPrice`: Price in SOL for minting.
   - `totalSupply`: Total number of NFTs to be minted.
   - `numberOfWinners`: Number of winners for the whitelist.
   - `verifyDiscordRole`: Discord role information for verification.
   - `verifyDiscordMembership`: Discord membership information for verification.

## Development
To run the project, run the following command:

```bash
npm run dev
```

This will start the development server, and you can access your project at `http://localhost:3000`.

## Usage
1. Connect your Solana wallet to the project by clicking the "Connect Wallet" button.

2. Ensure your wallet balance meets the minimum requirement.

3. Follow the project's Twitter account and join the Discord server for verification.

4. Click the "Sign up for Test Project Whitelist" button to register.

## Deployment
To deploy your project to a production environment, follow your preferred deployment process. Ensure you configure your environment variables and server settings accordingly.

