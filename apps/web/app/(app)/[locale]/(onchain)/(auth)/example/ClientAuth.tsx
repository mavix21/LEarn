"use client";

import React from "react";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export default function ClientAuth() {
  const data = useQuery(api.dummy.viewerInfo);
  return (
    <div className="flex flex-col gap-4">
      <h1>Data</h1>
      <div>{JSON.stringify(data)}</div>
    </div>
  );
}
