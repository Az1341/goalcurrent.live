import type { Metadata } from "next";

import LiveMatchCentre from "@/components/live/LiveMatchCentre";



export const metadata: Metadata = {

  title: "Live Scores",

  description: "World Cup 2026 live scores on GoalCurrent.online.",

};



export default function LivePage() {

  return <LiveMatchCentre />;

}

