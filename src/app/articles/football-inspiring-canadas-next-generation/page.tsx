import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Football Is Inspiring Canada's Next Generation",
  description: "In Toronto and across Canada, boys and girls are discovering football's power during the FIFA World Cup 2026 era. A GoalCurrent.live community feature with original photography from Toronto.",
  path: "/articles/football-inspiring-canadas-next-generation",
});

const IMG = "/images/news/football-inspiring-canadas-next-generation";

function Fig({ file, alt, caption }: { file: string; alt: string; caption: string }) {
  return (
    <figure style={{ margin: "28px 0" }}>
      <div style={{ borderRadius: 12, overflow: "hidden", background: "#e2e8f0" }}>
        <Image
          src={`${IMG}/${file}`}
          alt={alt}
          width={760}
          height={428}
          sizes="(max-width: 760px) 100vw, 760px"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>
      <figcaption style={{ fontSize: 12, color: "#64748b", marginTop: 8, lineHeight: 1.5, textAlign: "center", fontStyle: "italic" }}>
        {caption} <span style={{ color: "#94a3b8" }}>· Photo: GoalCurrent.live</span>
      </figcaption>
    </figure>
  );
}

function Q({ q, a }: { q: string; a: string }) {
  return (
    <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #e2e8f0" }}>
      <p style={{ fontWeight: 700, color: "#0f172a", fontSize: 14, marginBottom: 6 }}>Q: {q}</p>
      <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.65 }}>{a}</p>
    </div>
  );
}

function BQ({ text, cite }: { text: string; cite: string }) {
  return (
    <blockquote style={{ borderLeft: "4px solid #dc2626", margin: "24px 0", padding: "16px 20px", background: "rgba(220,38,38,0.04)", borderRadius: "0 10px 10px 0" }}>
      <p style={{ fontSize: 17, fontStyle: "italic", color: "#1e293b", fontWeight: 500, marginBottom: 8 }}>&ldquo;{text}&rdquo;</p>
      <cite style={{ fontSize: 13, color: "#64748b", fontStyle: "normal" }}>{cite}</cite>
    </blockquote>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "32px 0 12px", paddingBottom: 8, borderBottom: "2px solid #dc2626" }}>
      {children}
    </h2>
  );
}

export default function FootballInspiringCanadaPage() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "24px 16px 120px" }}>

      <nav style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>
        <Link href="/" style={{ color: "#94a3b8", textDecoration: "none" }}>Home</Link>{" › "}
        <Link href="/news" style={{ color: "#94a3b8", textDecoration: "none" }}>News</Link>{" › "}
        <Link href="/articles" style={{ color: "#94a3b8", textDecoration: "none" }}>Articles</Link>{" › "}
        <strong style={{ color: "#0f172a" }}>Football Is Inspiring Canada</strong>
      </nav>

      {/* Hero image */}
      <div style={{ borderRadius: 14, overflow: "hidden", marginBottom: 24, background: "#e2e8f0" }}>
        <Image
          src={`${IMG}/hero.jpg`}
          alt="Young footballers train on a grass pitch in a Toronto park"
          width={1600}
          height={900}
          priority
          sizes="(max-width: 760px) 100vw, 760px"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>

      {/* Meta */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ background: "rgba(37,99,235,0.1)", color: "#2563eb", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>✍️ GoalCurrent Editorial</span>
          <span style={{ background: "rgba(220,38,38,0.1)", color: "#dc2626", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>📍 Toronto, Canada</span>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", lineHeight: 1.2, marginBottom: 12 }}>
          Football Is Inspiring Canada&apos;s Next Generation
        </h1>
        <div style={{ display: "flex", gap: 14, fontSize: 12, color: "#94a3b8", flexWrap: "wrap" }}>
          <span>📅 16 June 2026</span><span>✍️ GoalCurrent.live</span><span>⏱ 13 min read</span>
        </div>
      </div>

      <article style={{ color: "#374151", lineHeight: 1.85, fontSize: 15.5 }}>

        <p style={{ fontSize: 17, fontWeight: 500, color: "#1e293b", marginBottom: 20, lineHeight: 1.7 }}>
          There is a particular sound on a Toronto evening when twenty children chase the same ball — laughter cutting through traffic, coaches calling names, parents leaning on fence rails with coffee cups cooling in their hands. It is ordinary. It is everywhere. And in the summer of 2026, it feels like the centre of the football world.
        </p>

        <p style={{ marginBottom: 16 }}>Canada is a co-host of the FIFA World Cup for the first time since 1986. Matches are being played in Toronto and Vancouver. The national team opened the tournament at BMO Field. For a generation of Canadian children — especially in the Greater Toronto Area — the biggest sporting event on earth is not a television fantasy. It is a neighbour.</p>

        <H2>A tournament on home soil changes how children dream</H2>

        <p style={{ marginBottom: 16 }}>Psychologists talk about <strong>proximity</strong> — how ambition grows when success feels close. For Canadian youth football, 2026 has collapsed distance. A child in Scarborough can ride the subway to BMO Field. A girl in Mississauga can picture herself on the same grass Alphonso Davies once crossed.</p>

        <Fig file="02-community-pitch.jpg" alt="Children sprint across a community football pitch in Toronto during an after-school session" caption="After school, before dark. Community programmes across the GTA are reporting record sign-ups as World Cup fever meets everyday habit." />

        <p style={{ marginBottom: 16 }}>Grassroots coaches report something subtle but unmistakable: children are asking smarter questions. Not only <em>who will win?</em> but <em>how do I get there?</em> Registration for mixed-gender recreational leagues has climbed. Girls&apos; programmes — long fighting for equal pitch time — are seeing waiting lists in neighbourhoods where football was once considered a boys&apos; game.</p>

        <BQ text="When the World Cup is in your city, football stops being something on a screen. It becomes something you can touch." cite="Community coach, east Toronto" />

        <H2>Meet a young captain: Radin Hajipour</H2>

        <p style={{ marginBottom: 16 }}>On pitches across Toronto, leadership shows up in small gestures — encouraging a teammate, resetting after a mistake, wearing the captain&apos;s armband when the whistle blows. <strong>Radin Hajipour</strong> is one of those young captains: focused on the pitch, proud of his club, and growing up in a city where the World Cup is not a faraway story but a neighbour.</p>

        <Fig file="04-coaching-moment.jpg" alt="Radin Hajipour, young football captain in Toronto, wearing the captain's armband" caption="Radin Hajipour — young captain, Toronto, Canada. Responsibility, focus, and pride in every step." />

        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: "20px", margin: "24px 0" }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: "#2563eb", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16 }}>Q&amp;A — Radin Hajipour</h3>
          <Q q="What does being captain mean to you?" a="It means I have to lead my team — talk to everyone, stay calm, and make sure we all work together. I like helping the younger players when they need advice." />
          <Q q="How has the World Cup in Canada inspired you and your friends?" a="Everyone at school is talking about it. More kids want to play football now. When the World Cup is in Canada, it feels like the game belongs to us — not just on TV, but here in Toronto." />
          <Q q="What's special about playing football in Toronto?" a="Our park, our team, and all the different people who love the game. You hear so many languages on the pitch, but everyone understands football." />
          <Q q="Who inspires you in football?" a="Alphonso Davies — he shows that a kid from Canada can reach the top if they work hard. I also look at captains who lead by example, not just by shouting." />
          <div style={{ marginBottom: 0 }}>
            <p style={{ fontWeight: 700, color: "#0f172a", fontSize: 14, marginBottom: 6 }}>Q: What would you tell other young players in Toronto?</p>
            <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.65 }}>Come and try. Don&apos;t wait for perfect weather or perfect boots. The World Cup is here — this is our time to dream big and enjoy every minute on the pitch.</p>
          </div>
        </div>

        <Fig file="03-girls-training.jpg" alt="Radin Hajipour wears a Canadian flag captain's armband during youth football training in Toronto" caption="Captain's armband. Community clubs across the GTA are nurturing young captains who wear the armband with pride." />

        <H2>Coaches building more than technique</H2>

        <p style={{ marginBottom: 16 }}>On weekday evenings, volunteer coaches arrive before players. They chalk lines on uneven grass. They carry balls in mesh bags slung over shoulders. They know that for many children in Toronto, this hour is sanctuary — away from screens, away from pressure, inside a game that rewards effort before pedigree.</p>

        <p style={{ marginBottom: 16 }}>Coaches speak of <strong>transferable hope</strong> — the idea that watching Canada compete teaches persistence. A missed penalty in a group stage match becomes a Monday-night conversation about resilience. An underdog victory becomes proof that rankings are not destiny.</p>

        <BQ text="We tell them: Davies was once a kid on a pitch like this. The difference is work — and believing the work matters." cite="Youth programme director, Toronto" />

        <H2>Toronto&apos;s parks become classrooms</H2>

        <Fig file="05-bmo-field.jpg" alt="Two young footballers pause on a grass field in a Toronto park" caption="City parks, city dreams. Before BMO Field hosts Canada's matches, thousands of children learn the game on pitches tucked between condos, schools, and tree lines." />

        <p style={{ marginBottom: 16 }}>BMO Field — home of Toronto FC and a World Cup 2026 venue — sits on the lakefront like a promise made concrete. For children who have only seen it from the outside, host-nation status means tours, school projects, and match-day dreams that feel achievable. The stadium is no longer a distant landmark; it is <strong>theirs</strong>.</p>

        <H2>A city of many backgrounds, one game</H2>

        <Fig file="06-youth-team.jpg" alt="A young player in navy and orange kit moves across a Toronto grass field in golden-hour light" caption="Golden hour. Football in Toronto is a meeting place — World Cup year makes that visible on every corner pitch." />

        <p style={{ marginBottom: 16 }}>Toronto&apos;s strength is diversity. Pitches reflect it. You hear instructions in English, French, Urdu, Somali, Portuguese, Tagalog — a chorus of communities that found common grammar in a round ball. World Cup 2026 amplifies that unity. Every nation competing has fans in this city.</p>

        <H2>Behind every young footballer is a family that believes</H2>

        <Fig file="09-family-support.jpg" alt="A young football captain stands with a family member on an artificial turf pitch in Toronto" caption="Family support remains one of the most important influences in youth football across Canada." />

        <p style={{ marginBottom: 16 }}>On every community pitch in Canada, there is a story that does not always make the highlight reel: the parent who drives across the city after work, the sibling who waits on the sideline, the family that rearranges weekends so a child can train, play, and grow. Youth football runs on more than coaching — it runs on belief at home.</p>

        <H2>What happens after the final whistle?</H2>

        <Fig file="07-celebration.jpg" alt="A young footballer drives a ball across a Toronto grass field in late-afternoon sunlight" caption="Joy as infrastructure. The work on community pitches is real — organisers hope 2026 leaves more than memories." />

        <Fig file="08-turf-session.jpg" alt="A young player in a pink training top walks across an artificial turf pitch in Toronto" caption="Every season. Snow on the bleachers, ball at the feet — football in Canada does not wait for perfect weather." />

        <BQ text="The World Cup lasts a month. Inspiration can last a lifetime — if we build for the children who are eight years old today." cite="Grassroots organiser, Greater Toronto Area" />

        <p style={{ marginBottom: 16 }}>On a cool June evening, as lights hum on above an east-end pitch, a boy asks his coach whether Canada can win the World Cup. The coach smiles. &ldquo;Let&apos;s win our next practice first,&rdquo; he says. The boy nods, already sprinting toward the centre circle.</p>

        <p style={{ marginBottom: 24 }}>That is the story of football in Canada in 2026 — not only the matches inside stadiums, but the millions of small beginnings outside them. Boys and girls who will remember this summer as the moment the game felt theirs. A nation co-hosting the world. A city teaching its children to believe.</p>

      </article>

      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: "18px 20px", marginBottom: 24 }}>
        <h3 style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 14, letterSpacing: "0.05em", textTransform: "uppercase" }}>More from GoalCurrent.live</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
          {[
            { href: "/worldcup2026/groups", label: "🌍 WC26 Groups", sub: "All 12 groups" },
            { href: "/worldcup2026/fixtures", label: "📅 Fixtures", sub: "Full schedule" },
            { href: "/articles", label: "✍️ All Articles", sub: "Editorial & analysis" },
            { href: "/worldcup2026/venues", label: "🏟️ Venues", sub: "BMO Field & more" },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{ display: "block", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 14px", textDecoration: "none" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 3 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{item.sub}</div>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link href="/articles" style={{ padding: "8px 16px", background: "rgba(37,99,235,0.1)", color: "#2563eb", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 13 }}>← All Articles</Link>
        <Link href="/worldcup2026" style={{ padding: "8px 16px", background: "#dc2626", color: "#fff", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 13 }}>🌍 World Cup 2026</Link>
      </div>

    </main>
  );
}
