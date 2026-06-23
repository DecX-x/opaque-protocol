# Opaque Protocol

Opaque Protocol is a privacy-preserving decentralized exchange (dark pool) that leverages Trusted Execution Environments (TEE) via the [iExec](https://iex.ec/) network. By using Intel SGX enclaves, Opaque ensures that trade intents and order data are kept completely hidden from the public, miners, and even the platform operators, while settling securely on-chain.

## Key Features

- **Encrypted Trade Intents**: Orders are encrypted locally in the browser. No one can see your trade intent before it is matched.
- **The Black Box TEE**: Matching happens inside a secure Intel SGX enclave. Data is decrypted, matched, and re-encrypted in milliseconds, guaranteeing privacy and preventing front-running (MEV protection).
- **On-Chain Settlement**: Only the final settlement result is broadcast to Ethereum (Arbitrum Sepolia), ensuring complete trade execution privacy.
- **Supported Assets**: USDC, WETH, WBTC, LINK, SOL.

## Architecture

1. **Frontend**: Built with Next.js 14 (App Router), React, Tailwind CSS, `wagmi`, and `viem`. Uses RainbowKit for wallet connectivity.
2. **Backend API (Next.js Routes)**: Facilitates interaction with the iExec network to trigger TEE execution (`app/api/iexec/*`).
3. **iExec TEE Network**: Workerpools execute the matching engine logic securely inside Intel SGX enclaves and sign the matching results.
4. **Smart Contracts**: A Vault and Reserve contract handle user deposits, withdrawals, and batch settlements using the signature from the TEE enclave.

## Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm
- Web3 Wallet (MetaMask, Rabby, etc.) configured for Arbitrum Sepolia Testnet.

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Environment Variables:**

   Create a `.env.local` or `.env` file in the root directory and add the following variable for the iExec backend API to operate properly:

   ```env
   IEXEC_PRIVATE_KEY=your_ethereum_private_key_with_arbitrum_sepolia_eth
   ```
   *Note: This private key is used by the backend API to interact with the iExec network to dispatch tasks.*

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open the App:**

   Open [http://localhost:3000](http://localhost:3000) with your browser to explore the protocol.

## Smart Contracts (Arbitrum Sepolia)

The platform interacts with the following deployed contracts on Arbitrum Sepolia:

- **Vault**: `0xc4ba886Dde719f8302203ffED1865CBf911cAF97`
- **Reserve**: `0x8b9616c56fc48cf040F7204CFD6D67ef34f6CF21`
- **Oracle**: `0x74425Dd6Cf65BAbDFb83AAe69550C0B4C065FB7c`
- **iExec App (Matching Engine)**: `0xcEeBEe91C442c6345Ae341ed6d51721d8F7e9e17`

### Test Tokens
- **USDC**: `0x6e267555409dd2d9AA2a314C15fC506400c7e648`
- **WETH**: `0xc9406cBCE0C651BA83cca1a9a852486DFE6B9CED`
- **WBTC**: `0xc53f09386F0FA32EA470044f9F4360F6dD894516`
- **LINK**: `0xDfd902FAD9a94EC5aDc30030D1074cC892c0BB31`
- **SOL**: `0xD65697F071fBf3A7A2654F51120e7E3b05E1A591`

## Technology Stack

- **Framework**: Next.js (App Router), React 19
- **Styling**: Tailwind CSS (v4), Framer Motion
- **Web3**: `wagmi`, `viem`, `@rainbow-me/rainbowkit`
- **Privacy & Execution**: `@iexec/dataprotector`, `iexec` SDK
- **Language**: TypeScript

## License

This project is licensed under the MIT License.
