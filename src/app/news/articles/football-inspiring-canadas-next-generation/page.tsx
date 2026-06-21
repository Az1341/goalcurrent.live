import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Football Is Inspiring Canada's Next Generation",
  description: "In Toronto and across Canada, boys and girls are discovering football's power during the FIFA World Cup 2026 era. A GoalCurrent.live community feature with original photography from Toronto.",
  path: "/news/articles/football-inspiring-canadas-next-generation",
});

export default function FootballInspiringCanadaPage() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "24px 16px 120px" }}>

      {/* Breadcrumb */}
      <nav style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>
        <Link href="/" style={{ color: "#94a3b8", textDecoration: "none" }}>Home</Link>
        {" › "}
        <Link href="/news" style={{ color: "#94a3b8", textDecoration: "none" }}>News</Link>
        {" › "}
        <Link href="/news/articles" style={{ color: "#94a3b8", textDecoration: "none" }}>Articles</Link>
        {" › "}
        <strong style={{ color: "#0f172a" }}>Football Is Inspiring Canada</strong>
      </nav>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, rgba(220,38,38,0.07) 0%, rgba(239,68,68,0.04) 50%, #f8fafc 100%)",
        border: "1px solid rgba(220,38,38,0.15)",
        borderRadius: 16,
        padding: "24px 20px",
        marginBottom: 28,
      }}>
        <div style={{ marginBottom: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ background: "rgba(37,99,235,0.1)", color: "#2563eb", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.05em" }}>
            ✍️ GoalCurrent Editorial
          </span>
          <span style={{ background: "rgba(220,38,38,0.1)", color: "#dc2626", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>
            📍 Toronto, Canada
          </span>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", lineHeight: 1.2, marginBottom: 12 }}>
          Football Is Inspiring Canada&apos;s Next Generation
        </h1>
        <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, marginBottom: 14 }}>
          As the FIFA World Cup 2026 arrives on Canadian soil, boys and girls across Toronto are not just watching history — they are living it on pitches, in parks, and in programmes built for every child who wants a ball at their feet.
        </p>
        <div style={{ display: "flex", gap: 14, fontSize: 12, color: "#94a3b8", flexWrap: "wrap" }}>
          <span>📅 16 June 2026</span>
          <span>✍️ GoalCurrent.live</span>
          <span>⏱ 13 min read</span>
        </div>
      </div>

      {/* Article body */}
      <article style={{ color: "#374151", lineHeight: 1.85, fontSize: 15.5 }}>

        <p style={{ fontSize: 17, fontWeight: 500, color: "#1e293b", marginBottom: 20, lineHeight: 1.7 }}>
          There is a particular sound on a Toronto evening when twenty children chase the same ball — laughter cutting through traffic, coaches calling names, parents leaning on fence rails with coffee cups cooling in their hands. It is ordinary. It is everywhere. And in the summer of 2026, it feels like the centre of the football world.
        </p>

        <p style={{ marginBottom: 16 }}>Canada is a co-host of the FIFA World Cup for the first time since 1986. Matches will be played in Toronto and Vancouver. The national team opened the tournament at BMO Field. For a generation of Canadian children — especially in the Greater Toronto Area — the biggest sporting event on earth is not a television fantasy. It is a neighbour.</p>

        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "28px 0 12px", paddingBottom: 8, borderBottom: "2px solid #dc2626" }}>
          A tournament on home soil changes how children dream
        </h2>

        <p style={{ marginBottom: 16 }}>Psychologists talk about <strong>proximity</strong> — how ambition grows when success feels close. For Canadian youth football, 2026 has collapsed distance. A child in Scarborough can ride the subway to BMO Field. A girl in Mississauga can picture herself on the same grass Alphonso Davies once crossed.</p>

        <p style={{ marginBottom: 16 }}>Grassroots coaches report something subtle but unmistakable: children are asking smarter questions. Not only <em>who will win?</em> but <em>how do I get there?</em> Registration for mixed-gender recreational leagues has climbed. Girls&apos; programmes — long fighting for equal pitch time — are seeing waiting lists in neighbourhoods where football was once considered a boys&apos; game.</p>

        {/* Quote */}
        <blockquote style={{
          borderLeft: "4px solid #dc2626",
          margin: "24px 0",
          padding: "16px 20px",
          background: "rgba(220,38,38,0.04)",
          borderRadius: "0 10px 10px 0",
        }}>
          <p style={{ fontSize: 17, fontStyle: "italic", color: "#1e293b", fontWeight: 500, marginBottom: 8 }}>
            &ldquo;When the World Cup is in your city, football stops being something on a screen. It becomes something you can touch.&rdquo;
          </p>
          <cite style={{ fontSize: 13, color: "#64748b", fontStyle: "normal" }}>Community coach, east Toronto</cite>
        </blockquote>

        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "28px 0 12px", paddingBottom: 8, borderBottom: "2px solid #dc2626" }}>
          Meet a young captain: Radin Hajipour
        </h2>

        <p style={{ marginBottom: 16 }}>On pitches across Toronto, leadership shows up in small gestures — encouraging a teammate, resetting after a mistake, wearing the captain&apos;s armband when the whistle blows. <strong>Radin Hajipour</strong> is one of those young captains: focused on the pitch, proud of his club, and growing up in a city where the World Cup is not a faraway story but a neighbour.</p>

        {/* Q&A */}
        <div style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 14,
          padding: "20px 20px",
          margin: "24px 0",
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: "#2563eb", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16 }}>
            Q&amp;A — Radin Hajipour
          </h3>
          {[
            { q: "What does being captain mean to you?", a: "It means I have to lead my team — talk to everyone, stay calm, and make sure we all work together. I like helping the younger players when they need advice." },
            { q: "How has the World Cup in Canada inspired you and your friends?", a: "Everyone at school is talking about it. More kids want to play football now. When the World Cup is in Canada, it feels like the game belongs to us — not just on TV, but here in Toronto." },
            { q: "What's special about playing football in Toronto?", a: "Our park, our team, and all the different people who love the game. You hear so many languages on the pitch, but everyone understands football." },
            { q: "Who inspires you in football?", a: "Alphonso Davies — he shows that a kid from Canada can reach the top if they work hard. I also look at captains who lead by example, not just by shouting." },
            { q: "What would you tell other young players in Toronto?", a: "Come and try. Don't wait for perfect weather or perfect boots. The World Cup is here — this is our time to dream big and enjoy every minute on the pitch." },
          ].map((item, i) => (
            <div key={i} style={{ marginBottom: i < 4 ? 16 : 0, paddingBottom: i < 4 ? 16 : 0, borderBottom: i < 4 ? "1px solid #e2e8f0" : "none" }}>
              <p style={{ fontWeight: 700, color: "#0f172a", fontSize: 14, marginBottom: 6 }}>Q: {item.q}</p>
              <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.65 }}>{item.a}</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "28px 0 12px", paddingBottom: 8, borderBottom: "2px solid #dc2626" }}>
          Coaches building more than technique
        </h2>

        <p style={{ marginBottom: 16 }}>On weekday evenings, volunteer coaches arrive before players. They chalk lines on uneven grass. They carry balls in mesh bags slung over shoulders. They know that for many children in Toronto, this hour is sanctuary — away from screens, away from pressure, inside a game that rewards effort before pedigree.</p>

        <p style={{ marginBottom: 16 }}>Coaches speak of <strong>transferable hope</strong> — the idea that watching Canada compete teaches persistence. A missed penalty in a group stage match becomes a Monday-night conversation about resilience. An underdog victory becomes proof that rankings are not destiny.</p>

        <blockquote style={{
          borderLeft: "4px solid #dc2626",
          margin: "24px 0",
          padding: "16px 20px",
          background: "rgba(220,38,38,0.04)",
          borderRadius: "0 10px 10px 0",
        }}>
          <p style={{ fontSize: 17, fontStyle: "italic", color: "#1e293b", fontWeight: 500, marginBottom: 8 }}>
            &ldquo;We tell them: Davies was once a kid on a pitch like this. The difference is work — and believing the work matters.&rdquo;
          </p>
          <cite style={{ fontSize: 13, color: "#64748b", fontStyle: "normal" }}>Youth programme director, Toronto</cite>
        </blockquote>

        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "28px 0 12px", paddingBottom: 8, borderBottom: "2px solid #dc2626" }}>
          Toronto&apos;s parks become classrooms
        </h2>

        <p style={{ marginBottom: 16 }}>BMO Field — home of Toronto FC and a World Cup 2026 venue — sits on the lakefront like a promise made concrete. For children who have only seen it from the outside, host-nation status means tours, school projects, and match-day dreams that feel achievable. Teachers assign World Cup geography. Families plan watch parties around Canada fixtures. The stadium is no longer a distant landmark; it is <strong>theirs</strong>.</p>

        <p style={{ marginBottom: 16 }}>When Canada kicked off at the tournament, millions watched on television. Thousands of children in Toronto watched knowing the echo of that crowd could be theirs one day — not as spectators, but as players.</p>

        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "28px 0 12px", paddingBottom: 8, borderBottom: "2px solid #dc2626" }}>
          A city of many backgrounds, one game
        </h2>

        <p style={{ marginBottom: 16 }}>Toronto&apos;s strength is diversity. Pitches reflect it. You hear instructions in English, French, Urdu, Somali, Portuguese, Tagalog — a chorus of communities that found common grammar in a round ball. World Cup 2026 amplifies that unity. Every nation competing has fans in this city. Children wear jerseys from countries their grandparents left and countries their classmates call home.</p>

        <p style={{ marginBottom: 16 }}>Organisers say the tournament has helped funding conversations too. Municipal grants, corporate sponsorship, and school partnerships are easier to justify when the world&apos;s attention turns north. Equipment arrives. Girls&apos; teams get new kits. Winter indoor slots expand.</p>

        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "28px 0 12px", paddingBottom: 8, borderBottom: "2px solid #dc2626" }}>
          Behind every young footballer is a family that believes
        </h2>

        <p style={{ marginBottom: 16 }}>On every community pitch in Canada, there is a story that does not always make the highlight reel: the parent who drives across the city after work, the sibling who waits on the sideline, the family that rearranges weekends so a child can train, play, and grow. Youth football runs on more than coaching — it runs on belief at home.</p>

        <p style={{ marginBottom: 16 }}>Parents invest time and encouragement long before any trophy arrives. That steady presence helps young players take risks on the ball, recover from mistakes, and keep showing up when the path is hard. Across Canada, families remain one of the strongest foundations behind every dream on the pitch.</p>

        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "28px 0 12px", paddingBottom: 8, borderBottom: "2px solid #dc2626" }}>
          What happens after the final whistle?
        </h2>

        <p style={{ marginBottom: 16 }}>Legacy is the word everyone uses. Legacy is also the word everyone must earn. Host nations have seen spikes in participation before — and watched them fade when spotlights moved on. Toronto coaches are determined to convert 2026 energy into infrastructure: more girls&apos; coaches, safer facilities, affordable transport to training, pathways from recreation to academy without excluding late bloomers.</p>

        <blockquote style={{
          borderLeft: "4px solid #dc2626",
          margin: "24px 0",
          padding: "16px 20px",
          background: "rgba(220,38,38,0.04)",
          borderRadius: "0 10px 10px 0",
        }}>
          <p style={{ fontSize: 17, fontStyle: "italic", color: "#1e293b", fontWeight: 500, marginBottom: 8 }}>
            &ldquo;The World Cup lasts a month. Inspiration can last a lifetime — if we build for the children who are eight years old today.&rdquo;
          </p>
          <cite style={{ fontSize: 13, color: "#64748b", fontStyle: "normal" }}>Grassroots organiser, Greater Toronto Area</cite>
        </blockquote>

        <p style={{ marginBottom: 16 }}>On a cool June evening, as lights hum on above an east-end pitch, a boy asks his coach whether Canada can win the World Cup. The coach smiles. &ldquo;Let&apos;s win our next practice first,&rdquo; he says. The boy nods, already sprinting toward the centre circle.</p>

        <p style={{ marginBottom: 24 }}>That is the story of football in Canada in 2026 — not only the matches inside stadiums, but the millions of small beginnings outside them. Boys and girls who will remember this summer as the moment the game felt theirs. A nation co-hosting the world. A city teaching its children to believe.</p>

      </article>

      {/* Related */}
      <div style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 14,
        padding: "18px 20px",
        marginBottom: 24,
      }}>
        <h3 style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 14, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          More from GoalCurrent.live
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
          {[
            { href: "/worldcup2026/groups", label: "🌍 WC26 Group Tables", sub: "All 12 groups" },
            { href: "/worldcup2026/fixtures", label: "📅 Fixtures", sub: "Full schedule" },
            { href: "/news/articles", label: "✍️ All Articles", sub: "Editorial & analysis" },
            { href: "/worldcup2026/venues", label: "🏟️ Venues", sub: "BMO Field & more" },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{
              display: "block",
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 10,
              padding: "12px 14px",
              textDecoration: "none",
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 3 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{item.sub}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link href="/news/articles" style={{ padding: "8px 16px", background: "rgba(37,99,235,0.1)", color: "#2563eb", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 13 }}>
          ← All Articles
        </Link>
        <Link href="/worldcup2026" style={{ padding: "8px 16px", background: "#dc2626", color: "#fff", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 13 }}>
          🌍 World Cup 2026
        </Link>
      </div>

    </main>
  );
}
