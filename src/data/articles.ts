export type Article = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: "world-cup-2026" | "premier-league" | "champions-league" | "editorial";
  readTime: number;
  content: string;
};

export const ARTICLES: Article[] = [
  {
    slug: "world-cup-2026-complete-guide",
    title: "FIFA World Cup 2026 — The Complete Fan Guide",
    description: "Everything you need to know about the 2026 FIFA World Cup — 48 teams, 104 matches, 16 venues across USA, Mexico and Canada.",
    date: "2026-06-01",
    category: "world-cup-2026",
    readTime: 5,
    content: `<h2>The Biggest World Cup Ever</h2><p>The 2026 FIFA World Cup is the largest in the tournament's history, expanding to 48 teams for the first time. Hosted jointly by the United States, Canada, and Mexico, the tournament features 104 matches across 16 world-class venues from 11 June to 19 July 2026.</p><h2>Format and Groups</h2><p>Twelve groups of four teams each compete in the group stage. The top two from each group and the eight best third-placed sides advance to a 32-team knockout round — creating more matches, more drama, and more opportunity for smaller nations to shine on the world stage.</p><h2>Host Cities and Venues</h2><p>Matches are spread across iconic stadiums in New York/New Jersey, Los Angeles, Dallas, San Francisco, Seattle, Miami, Boston, Philadelphia, Kansas City, Atlanta, Houston, Guadalajara, Mexico City, Monterrey, Toronto, and Vancouver.</p><h2>Teams to Watch</h2><p>France, Brazil, Argentina, Spain, England and Germany are all strong contenders. The reigning champions Argentina, led by their world-class squad, will be looking to defend their title from Qatar 2022.</p><h2>Key Dates</h2><p>The group stage runs from 11 June to 2 July. The round of 32 begins 4 July, with quarter-finals on 11-12 July, semi-finals on 14-15 July, and the Grand Final on 19 July 2026 at MetLife Stadium in New Jersey.</p>`
  },
  {
    slug: "premier-league-2025-26-season-review",
    title: "Premier League 2025/26 — Season Review: Arsenal Champions",
    description: "Arsenal ended their 22-year title drought with an 85-point season. A complete review of the 2025/26 Premier League campaign.",
    date: "2026-05-25",
    category: "premier-league",
    readTime: 6,
    content: `<h2>Arsenal End 22-Year Wait</h2><p>Arsenal Football Club ended a 22-year title drought to claim the Premier League trophy in the 2025/26 season with 85 points. Mikel Arteta's side were dominant throughout, combining defensive solidity with breathtaking attacking football that captivated fans at the Emirates and around the world.</p><h2>The Title Race</h2><p>The race for the title was tight throughout the campaign, with Manchester City and Liverpool pushing Arsenal all the way. City eventually finished second while Liverpool claimed third, ensuring a thrilling conclusion to the final gameweek.</p><h2>Relegation Battle</h2><p>At the bottom of the table, West Ham, Burnley, and Wolves suffered the heartbreak of relegation. All three clubs will now compete in the Championship next season, looking to bounce back at the first attempt.</p><h2>Looking Ahead</h2><p>With World Cup 2026 taking centre stage this summer, many Premier League stars will be representing their nations. The 2026/27 season will see three newly promoted sides come up from the Championship.</p>`
  },
  {
    slug: "psg-vs-arsenal-ucl-final-2026",
    title: "PSG vs Arsenal — 2026 Champions League Final Report",
    description: "Full report from the 2026 UEFA Champions League Final at Puskás Aréna, Budapest, between PSG and Arsenal.",
    date: "2026-05-30",
    category: "champions-league",
    readTime: 5,
    content: `<h2>Budapest Hosts Historic Final</h2><p>The 2026 UEFA Champions League Final took place at the magnificent Puskás Aréna in Budapest, Hungary on 30 May 2026. Over 65,000 fans packed the stadium as PSG faced Arsenal in a clash of two European giants.</p><h2>Match Report</h2><p>The final was a tense, tactical affair that went deep into the match before a winner was found. Both teams created chances throughout, with the goalkeepers producing outstanding saves to keep the tie in the balance.</p><h2>Tactical Analysis</h2><p>PSG looked to dominate possession in the early stages while Arsenal's Arteta set up his side to hit on the counter. The tactical battle between the two managers was one of the highlights of the evening at the beautiful Puskás Aréna.</p><h2>Reaction</h2><p>Fans of both clubs created an unforgettable atmosphere inside and outside the stadium. Budapest proved a worthy host city, with supporters from across Europe making the journey to Hungary for this historic occasion.</p>`
  },
  {
    slug: "world-cup-2026-group-stage-guide",
    title: "World Cup 2026 Group Stage — All 12 Groups Explained",
    description: "Complete guide to all 12 World Cup 2026 groups with team analysis, key fixtures, and predictions.",
    date: "2026-06-10",
    category: "world-cup-2026",
    readTime: 8,
    content: `<h2>Group A — The Host Group</h2><p>Mexico, South Africa, Korea Republic, and Czechia make up Group A. Mexico, as one of the co-hosts, will be roared on by passionate home support and must be considered favourites to top the group.</p><h2>Group B — Qualification Battle</h2><p>Canada enjoy home advantage as another co-host nation in Group B. Bosnia-Herzegovina, Qatar, and Switzerland complete a balanced group where nothing can be taken for granted.</p><h2>Groups C through L</h2><p>The remaining ten groups feature all the major European and South American powers. Brazil face Morocco, Haiti and Scotland in Group C. The USA take on Paraguay, Australia and Turkey in Group D, playing on home soil.</p><h2>Groups of Death</h2><p>Group E featuring Germany, Curaçao, Côte d'Ivoire and Ecuador looks particularly tough. Group H — Spain, Cape Verde, Saudi Arabia and Uruguay — also promises spectacular football from the very first match day.</p><h2>Dark Horses</h2><p>Keep an eye on Morocco, Japan, and South Korea as potential quarter-final dark horses. All three nations have shown in recent tournaments that they are capable of causing major upsets on the biggest stage.</p>`
  },
  {
    slug: "england-world-cup-2026",
    title: "England at World Cup 2026 — Can the Lions Win It?",
    description: "England's World Cup 2026 campaign preview — squad, tactics, key players, fixtures and prediction.",
    date: "2026-06-05",
    category: "world-cup-2026",
    readTime: 5,
    content: `<h2>Sixty Years of Hurt</h2><p>England haven't won the World Cup since 1966, and the 2026 tournament represents another golden opportunity. With a talented squad featuring Premier League stars from across the top clubs, expectations are high going into the tournament in Group L alongside Croatia, Ghana and Panama.</p><h2>Squad Strength</h2><p>England's squad is arguably one of the most talented in a generation. Blessed with quality in every position, the manager has plenty of options when it comes to team selection. The depth of Premier League-hardened talent gives England genuine belief they can go all the way.</p><h2>Key Players</h2><p>England have match-winners throughout the squad. Their attack is capable of causing any defence in the world problems, while the defensive unit has been solid throughout the qualification campaign.</p><h2>Prediction</h2><p>England have the quality to reach the final. Consistency, avoiding injuries, and performing in the knockout rounds will be crucial. A semi-final berth looks realistic, with the final not out of the question if everything clicks at the right time — could 2026 be the year football finally comes home?</p>`
  },
  {
    slug: "world-cup-2026-venues-guide",
    title: "World Cup 2026 Venues — Guide to All 16 Stadiums",
    description: "Complete guide to all 16 FIFA World Cup 2026 venues across USA, Canada and Mexico — capacities, locations, and match schedules.",
    date: "2026-06-03",
    category: "world-cup-2026",
    readTime: 6,
    content: `<h2>16 Iconic Venues Across Three Nations</h2><p>The 2026 FIFA World Cup will be played across 16 stunning stadiums in the United States, Canada, and Mexico. From iconic NFL venues converted for football to purpose-built soccer stadiums, the facilities on offer are truly world-class.</p><h2>United States Venues</h2><p>The USA hosts the majority of matches, with venues in New York/New Jersey, Los Angeles, Dallas, San Francisco, Seattle, Miami, Boston, Philadelphia, Kansas City, Atlanta, and Houston. MetLife Stadium in New Jersey will host the Grand Final on 19 July.</p><h2>Canadian Venues</h2><p>Canada hosts matches in Toronto at BMO Field and Vancouver at BC Place. Both cities are passionate about football and will provide an excellent atmosphere for group stage matches.</p><h2>Mexican Venues</h2><p>Mexico City's iconic Estadio Azteca is one of the most famous football venues in the world, having hosted two previous World Cup finals. Guadalajara's Estadio Akron and Monterrey's Estadio BBVA complete the Mexican trio of host cities.</p><h2>Attending a Match</h2><p>If you are planning to attend, check the official FIFA ticketing portal for availability. Planning well in advance is essential — demand for the expanded 48-team tournament has been enormous across all three host nations.</p>`
  },
  {
    slug: "champions-league-2025-26-review",
    title: "Champions League 2025/26 — Season Review",
    description: "Complete UEFA Champions League 2025/26 review from the group stage through to the Budapest final.",
    date: "2026-06-01",
    category: "champions-league",
    readTime: 5,
    content: `<h2>Another Memorable UCL Season</h2><p>The 2025/26 UEFA Champions League delivered drama, upsets, and incredible football from the opening round all the way to the final in Budapest. Europe's elite clubs competed for the most prestigious prize in club football over nine months of captivating action.</p><h2>Knockout Rounds</h2><p>The round of 16 produced some classic two-legged ties, with dramatic comebacks keeping fans on the edge of their seats. The quarter-finals and semi-finals continued the high standard, ultimately producing a PSG vs Arsenal final that captured global attention.</p><h2>The Road to Budapest</h2><p>PSG's journey through the knockout rounds showcased their individual brilliance, while Arsenal's progress demonstrated Mikel Arteta's tactical excellence and remarkable squad depth. Both clubs fully deserved their places at Puskás Aréna.</p><h2>Looking Ahead</h2><p>The 2026/27 Champions League will begin in the autumn, with clubs across Europe already working on their squads for another assault on Europe's biggest prize. The competition continues to grow in stature and global reach with each passing season.</p>`
  },
  {
    slug: "football-world-cup-history",
    title: "FIFA World Cup History — Every Winner Since 1930",
    description: "Complete history of the FIFA World Cup from Uruguay 1930 to Argentina 2022 — all winners, hosts, and greatest moments.",
    date: "2026-06-07",
    category: "editorial",
    readTime: 7,
    content: `<h2>The World Cup — Football's Greatest Tournament</h2><p>The FIFA World Cup has been the pinnacle of international football since its inaugural edition in Uruguay in 1930. Every four years, the world stops to watch the greatest players on the planet compete for football's most coveted prize.</p><h2>Early Years (1930-1950)</h2><p>Uruguay hosted and won the first World Cup in 1930, defeating Argentina in the final. Italy claimed back-to-back titles in 1934 and 1938 before the tournament was suspended during World War II. Uruguay won again in 1950 in the famous Maracanazo, defeating hosts Brazil.</p><h2>The Brazilian Era</h2><p>Brazil became the dominant force in world football, winning the World Cup in 1958, 1962, 1970, 1994, and 2002. The 1970 squad featuring Pelé, Jairzinho, and Rivelino is widely regarded as the greatest team ever assembled.</p><h2>European Dominance</h2><p>Germany, Italy, France, Spain, and England have all claimed World Cup glory. Germany's four titles make them Europe's most successful nation, while Spain's 2010 triumph with tiki-taka football remains one of the tournament's most aesthetically beautiful winning campaigns.</p><h2>Recent Winners</h2><p>France won in 2018 with a talented diverse squad, before Argentina reclaimed the trophy in 2022 in Qatar — Lionel Messi finally adding the one trophy that had eluded him throughout his extraordinary career. Argentina enter 2026 as defending champions, hungry for back-to-back titles.</p>`
  },
  {
    slug: "premier-league-2026-27-preview",
    title: "Premier League 2026/27 — What to Expect Next Season",
    description: "A look ahead to the Premier League 2026/27 season — new managers, transfers, promoted clubs and title predictions.",
    date: "2026-06-08",
    category: "premier-league",
    readTime: 5,
    content: `<h2>A Summer of Change</h2><p>With the 2025/26 Premier League season complete and World Cup 2026 taking centre stage, clubs across England are already planning for the 2026/27 campaign. Transfers, managerial decisions, and the arrival of three promoted clubs will reshape the league landscape.</p><h2>Title Contenders</h2><p>Arsenal will be looking to defend their title, while Manchester City, Liverpool, and Chelsea will invest heavily to close the gap. The summer transfer window following the World Cup could significantly alter the balance of power before a ball is kicked in August.</p><h2>Newly Promoted Clubs</h2><p>Three clubs will join the Premier League from the Championship. They face the classic challenge of establishing themselves in the top flight while competing against clubs with far greater financial resources — only the best-prepared sides survive their first season back.</p><h2>Transfer Window</h2><p>Following the World Cup, several high-profile players will attract Premier League attention. Performances in the tournament often accelerate transfer moves, with clubs acting quickly to sign players who have impressed on the global stage in North America.</p>`
  },
  {
    slug: "football-inspiring-canadas-next-generation",
    title: "Football Is Inspiring Canada's Next Generation",
    description: "In Toronto and across Canada, boys and girls are discovering football's power during the FIFA World Cup 2026 era. A GoalCurrent.live community feature with original photography from Toronto.",
    date: "2026-06-16",
    category: "editorial",
    readTime: 13,
    content: `<p>A rich community feature with original photography from Toronto — including a Q&A with young captain Radin Hajipour and quotes from grassroots coaches across the GTA. Read the full article for the complete story.</p>`
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find(a => a.slug === slug);
}

export function getAllArticleSlugs(): string[] {
  return ARTICLES.map(a => a.slug);
}

export function getArticlesByCategory(category: Article["category"]): Article[] {
  return ARTICLES.filter(a => a.category === category);
}
