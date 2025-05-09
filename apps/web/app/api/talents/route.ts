import { NextResponse } from "next/server";

import { env } from "@/src/env";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const accountSource = searchParams.get("accountSource");

  const url = new URL("https://api.talentprotocol.com/credentials");
  if (id) url.searchParams.append("id", id);
  if (accountSource) url.searchParams.append("account_source", accountSource);

  const response = await fetch(url.toString(), {
    headers: {
      "X-API-KEY": env.TALENT_API_KEY,
    },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: `Error fetching data: ${response.status}` },
      { status: response.status },
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
