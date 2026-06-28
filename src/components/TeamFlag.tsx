"use client";

import Image from "next/image";
import type { TeamId } from "@/types/team";
import { isKnockoutPlaceholderTeam } from "@/data/wc26/knockout-fixtures";
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
  const resolvedFromName =
    teamName && (!teamId || isKnockoutPlaceholderTeam(teamId))
      ? (resolveTeamId(teamName) as TeamId | undefined)
      : undefined;
  const id =
    teamId && !isKnockoutPlaceholderTeam(teamId)
      ? teamId
      : (resolvedFromName ??
        teamId ??
        (teamName ? (resolveTeamId(teamName) as TeamId | undefined) : undefined));
  let src = id ? getTeamFlagSrc(id) : undefined;
  if (!src && teamName) {
    const fromName = resolveTeamId(teamName) as TeamId | undefined;
    if (fromName) {
      src = getTeamFlagSrc(fromName);
    }
  }
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
