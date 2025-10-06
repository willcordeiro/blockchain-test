# Web3 USDC Dashboard

A modern Web3 dashboard for managing USDC tokens on the Sepolia testnet with MetaMask integration.

## Features

- Connect your MetaMask wallet
- View USDC balance and transaction history
- Send USDC transfers
- Interactive charts and analytics
- Dark mode support
- Fully responsive design

## Tech Stack

- Next.js 15 (Turbopack)
- Ethers.js v6
- Zustand
- TailwindCSS v4
- Chart.js
- Framer Motion

## Quick Start

### Prerequisites

- Node.js 18+
- MetaMask browser extension
- Etherscan API key ([Get one here](https://etherscan.io/apis))

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create a `.env.local` file:

```env
NEXT_PUBLIC_ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable                        | Description                          | Required |
| ------------------------------- | ------------------------------------ | -------- |
| `NEXT_PUBLIC_ETHERSCAN_API_KEY` | Etherscan API key (server-side only) | Yes      |

The API key is used in server-side Route Handlers (`/app/api/etherscan/*`) to proxy requests to the Etherscan API, keeping your key secure and never exposed to the client.

## Project Structure

```
├── app/
│   ├── api/etherscan/      # Server-side API routes
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Dashboard page
│   └── globals.css         # Global styles
├── components/
│   ├── dashboard/          # Dashboard components
│   ├── wallet/             # Wallet components
│   └── ui/                 # shadcn/ui components
├── stores/                 # Zustand stores
├── hooks/                  # Custom hooks
├── lib/                    # Utilities
└── types/                  # TypeScript types
```

## Testing

Run tests:

```bash
npm test
```

## Deploy to Vercel

1. Push the project to GitHub.
2. Import the project on [Vercel](https://vercel.com).
3. Add environment variable:

   - Name: `NEXT_PUBLIC_ETHERSCAN_API_KEY`
   - Value: Your Etherscan API key

4. Deploy

## Usage

1. Click "Connect Wallet" to connect MetaMask.
2. View your USDC balance and transaction history.
3. Use the transfer form to send USDC.

## Sepolia Testnet

This app uses the Sepolia testnet. Get test ETH from:

- [Alchemy Faucet](https://sepoliafaucet.com/)
- [Infura Faucet](https://www.infura.io/faucet/sepolia)

USDC Contract: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`

## Live Project

- [link](https://blockchain-test-gray.vercel.app/)
