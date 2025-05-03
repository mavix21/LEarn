import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

export default async function Protected() {
  const session = await auth();
  console.log("****************** Protected ******************", { session });

  if (!session) {
    redirect("/example");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Protected</h1>
      <div>{session.address}</div>
      <div>{session.chainId}</div>
      <div>{session.userId}</div>
      <Link href="/example">Example</Link>
    </div>
  );
}
