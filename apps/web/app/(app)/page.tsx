"use client";

import {
  Address,
  Avatar,
  EthBalance,
  Identity,
  Name,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
  WalletDropdownLink,
} from "@coinbase/onchainkit/wallet";

import { ThemeSwitcher } from "@/app/_shared/ui/theme-switcher";

import ArrowSvg from "../_shared/ui/svg/ArrowSvg";
import ImageSvg from "../_shared/ui/svg/Image";
import OnchainkitSvg from "../_shared/ui/svg/OnchainKit";

const components = [
  {
    name: "Transaction",
    url: "https://onchainkit.xyz/transaction/transaction",
  },
  { name: "Swap", url: "https://onchainkit.xyz/swap/swap" },
  { name: "Checkout", url: "https://onchainkit.xyz/checkout/checkout" },
  { name: "Wallet", url: "https://onchainkit.xyz/wallet/wallet" },
  { name: "Identity", url: "https://onchainkit.xyz/identity/identity" },
];

const templates = [
  { name: "NFT", url: "https://github.com/coinbase/onchain-app-template" },
  {
    name: "Commerce",
    url: "https://github.com/coinbase/onchain-commerce-template",
  },
  { name: "Fund", url: "https://github.com/fakepixels/fund-component" },
];

export default function App() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <header className="px-6 pt-4">
        <div className="flex items-center justify-between">
          <ThemeSwitcher />
          <div className="wallet-container">
            <Wallet>
              <ConnectWallet>
                <Avatar className="h-6 w-6" />
                <Name />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pb-2 pt-3" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownLink
                  icon="wallet"
                  href="https://keys.coinbase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wallet
                </WalletDropdownLink>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
          </div>
        </div>
      </header>

      <main className="flex flex-grow items-center justify-center">
        <div className="w-full max-w-4xl p-4">
          <div className="mx-auto mb-6 w-1/3">
            <ImageSvg />
          </div>
          <div className="mb-6 flex justify-center">
            <a target="_blank" rel="_template" href="https://onchainkit.xyz">
              <OnchainkitSvg className="" />
            </a>
          </div>
          <p className="mb-6 text-center">
            Get started by editing
            <code className="bg-muted ml-1 rounded p-1">app/page.tsx</code>.
          </p>
          <div className="flex flex-col items-center">
            <div className="w-full max-w-2xl">
              <div className="mt-4 flex flex-col justify-between md:flex-row">
                <div className="mb-4 flex flex-col items-center md:mb-0 md:w-1/2">
                  <p className="mb-2 text-center font-semibold">
                    Explore components
                  </p>
                  <ul className="inline-block list-disc space-y-2 pl-5 text-left">
                    {components.map((component, index) => (
                      <li key={index}>
                        <a
                          href={component.url}
                          className="inline-flex items-center hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {component.name}
                          <ArrowSvg />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col items-center md:w-1/2">
                  <p className="mb-2 text-center font-semibold">
                    Explore templates
                  </p>
                  <ul className="inline-block list-disc space-y-2 pl-5 text-left">
                    {templates.map((template, index) => (
                      <li key={index}>
                        <a
                          href={template.url}
                          className="inline-flex items-center text-black hover:underline dark:text-white"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {template.name}
                          <ArrowSvg />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
