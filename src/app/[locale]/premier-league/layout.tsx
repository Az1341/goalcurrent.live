import PlCommercialStrip from "@/components/pl/PlCommercialStrip";
import plStyles from "@/components/pl/PlCommercialStrip.module.css";

type PremierLeagueLayoutProps = {
  children: React.ReactNode;
};

export default function PremierLeagueLayout({
  children,
}: PremierLeagueLayoutProps) {
  return (
    <div className={plStyles.plWrap}>
      <PlCommercialStrip />
      {children}
    </div>
  );
}
