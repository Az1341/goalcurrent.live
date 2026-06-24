"use client";

import Image from "next/image";
import type { TeamId } from "@/types/team";
import { getTeamFlagAlt, getTeamFlagSrc } from "@/lib/teamFlag";
import { resolveTeamId } from "@/lib/teamIdentity";

type TeamFlagProps = {
  teamName?: string;
  teamId?: TeamId;
  size?: number;
  className?: string;
};

export default function TeamFlag({
  teamName,
  teamId,
  size = 28,
  className,
}: TeamFlagProps) {
  const id =
    teamId ?? (teamName ? (resolveTeamId(teamName) as TeamId | undefined) : undefined);
  const src = id ? getTeamFlagSrc(id) : undefined;
  const alt = id
    ? `${getTeamFlagAlt(id)} flag`
    : teamName
      ? `${teamName} flag`
      : "Team flag";

  if (!src) {
    return (
      <span
        className={className}
        style={{
          display: "inline-block",
          width: size,
          height: Math.round(size * 0.75),
          background: "var(--gc-inset)",
          borderRadius: 2,
          flexShrink: 0,
        }}
        aria-hidden="true"
      />
    );
  }

  const height = Math.round(size * 0.75);

  return (
    <Image
      className={className}
      src={src}
      alt={alt}
      width={size}
      height={height}
      unoptimized
      style={{
        width: size,
        height,
        objectFit: "cover",
        flexShrink: 0,
        borderRadius: 2,
      }}
    />
  );
}
