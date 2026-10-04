import { NextResponse } from "next/server";
import { getFootballSnapshot } from "@/lib/free-football/server";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({error:"unauthorized"},{status:401});
  const snapshot = await getFootballSnapshot();
  const coverage = snapshot.competitions.map(c=>({code:c.code,available:c.available,count:c.matches.length,fetchedAt:c.fetchedAt}));
  return NextResponse.json({coverage},{status:coverage.some(c=>c.available)?200:503,headers:{"Cache-Control":"no-store"}});
}
