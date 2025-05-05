"use client";

import Link from "next/link";
import { useAccount } from "wagmi";

export default function Home() {
  const { address } = useAccount();

  return (
    <div className="grid place-content-center gap-6">
      <appkit-button />
      <div className="text-2xl font-bold">{address}</div>
      <Link href="/protected">Protected</Link>
    </div>
  );
}
