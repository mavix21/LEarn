# ✳️ SkillBased

A professional social network where users can build their verifiable, onchain, professional profile.

## 📦 Monorepo Structure

This repository is a pnpm monorepo. It consists of the following main parts:

- `apps/web`: This is the main Next.js application. It contains all the user-facing pages, API routes, and application-specific logic.
- `packages/ui`: This package holds all the shared UI components, primarily built using shadcn/ui. These components are designed to be reusable across different parts of the application or even other applications within the monorepo in the future
- `packages/contracts`: This package contains the hardhat project for the smart contracts.
- `tooling/`: This directory contains configuration files for common development tools like ESLint, Prettier, TypeScript, etc., ensuring consistent code quality and development experience across the monorepo.

## 🧰 Tech Stack

- **Next.js 15 & Turbopack:** Modern, fast, and scalable React framework for the frontend.

- **Blockchain Integration (Web3):**

  - Utilizes OnchainKit, Wagmi, and Viem for connecting to and interacting with EVM-compatible blockchains.
  - Interacts with smart contracts deployed via the Hardhat project in `packages/contracts`.
  - Supports "Sign-In with Ethereum" (SIWE) via `@reown/appkit-siwe`.

- **Convex Backend:** Reactive backend-as-a-service for data storage, server functions, and real-time updates.

- **User Authentication:** Robust authentication system using NextAuth.js (`@auth/core`, `next-auth`).

- **Rich Text Editing:** Includes a Tiptap-based rich text editor for content creation.

- **File Uploads & IPFS:** Supports file uploads with `react-dropzone`, using Pinata for decentralized storage on IPFS.

- **Internationalization (i18n):** Built with `next-intl` to support multiple languages.

- **Robust Form Handling:** Uses `react-hook-form` and `zod` for creating and validating forms.

- **Custom UI Library:** Leverages `@skill-based/ui` for a consistent look and feel, built with shadcn/ui components.

- **Server State Management:** Uses `@tanstack/react-query` for managing server state and caching.

- **Modern Tooling:** Includes ESLint, Prettier, TypeScript for code quality and development experience.

- ...and more!

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (version specified in `.nvmrc` - make sure to use a Node version manager like nvm or fnm)
- pnpm (version specified in `package.json` under `packageManager`)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/mavix21/SkillBased
    cd skill-based
    ```

2.  **Install dependencies:**
    This project uses pnpm workspaces. Install all dependencies from the root of the monorepo:
    ```bash
    pnpm install
    ```

### Environment Variables

The Next.js application in `apps/web` requires some environment variables to run correctly.

1.  Create a `.env.local` file by copying the example environment file

    ```bash
    cp .env.example .env.local
    ```

### Running the Development Server

1.  To start the development server for the Next.js web application from the root:

    ```bash
    pnpm dev
    ```

    The application should now be running on [http://localhost:3000](http://localhost:3000) (or the port specified in your Next.js configuration).
