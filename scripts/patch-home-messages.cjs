const fs = require("fs");
const path = require("path");

const dir = path.join(process.cwd(), "messages");
const locales = ["en", "fa", "ar", "fr", "de", "nl", "es", "pt", "it"];

const homeByLocale = {
  en: {
    subtitle:
      "Live results, fixtures and news from {siteName} — World Cup 2026 is the lead competition.",
    matchDetails: "Match details",
    allFixtures: "All fixtures",
    noFixturesLoaded: "No World Cup fixtures loaded.",
    latestResults: "Latest Results",
    viewAllResults: "View All Results",
    noRecentResults: "No recent full-time results.",
    upcomingFixtures: "Upcoming Fixtures",
    viewAllFixtures: "View All Fixtures",
    noUpcomingFixtures: "No upcoming fixtures scheduled.",
    wc26Title: "World Cup 2026",
    viewAll: "View All",
    wc26Summary:
      "USA · Mexico · Canada · 11 Jun – 19 Jul 2026 · {gamesPlayed} played · {gamesLeft} remaining",
    featuredMatch: "Featured match",
    liveNow: "Live Now",
    viewAllLive: "View All Live Matches",
    noLiveMatches: "No live matches right now.",
  },
  fa: {
    subtitle:
      "نتایج زنده، برنامه بازی‌ها و اخبار از {siteName} — جام جهانی ۲۰۲۶ مسابقه اصلی است.",
    matchDetails: "جزئیات مسابقه",
    allFixtures: "همه بازی‌ها",
    noFixturesLoaded: "برنامه جام جهانی بارگذاری نشده است.",
    latestResults: "آخرین نتایج",
    viewAllResults: "مشاهده همه نتایج",
    noRecentResults: "نتیجه تمام‌شده‌ای در این بازه نیست.",
    upcomingFixtures: "بازی‌های پیش‌رو",
    viewAllFixtures: "مشاهده همه برنامه‌ها",
    noUpcomingFixtures: "بازی پیش‌رویی برنامه‌ریزی نشده است.",
    wc26Title: "جام جهانی ۲۰۲۶",
    viewAll: "مشاهده همه",
    wc26Summary:
      "آمریکا · مکزیک · کانادا · ۱۱ ژوئن – ۱۹ جولای ۲۰۲۶ · {gamesPlayed} بازی انجام‌شده · {gamesLeft} بازی باقی‌مانده",
    featuredMatch: "مسابقه ویژه",
    liveNow: "در حال پخش",
    viewAllLive: "مشاهده همه بازی‌های زنده",
    noLiveMatches: "اکنون بازی زنده‌ای نیست.",
  },
};

const favByLocale = {
  en: {
    stripTitle: "Your Favourites",
    manage: "Manage",
    emptyStripLead: "Star a match or team to see them here. Browse",
    liveScores: "live scores",
    worldCupTeams: "World Cup teams",
    or: "or",
  },
  fa: {
    stripTitle: "علاقه‌مندی‌های شما",
    manage: "مدیریت",
    emptyStripLead: "برای دیدن اینجا، یک مسابقه یا تیم را ستاره‌دار کنید. مرور کنید",
    liveScores: "نتایج زنده",
    worldCupTeams: "تیم‌های جام جهانی",
    or: "یا",
  },
};

const ribbonByLocale = {
  en: {
    worldCup2026: "WORLD CUP 2026",
    liveNow: "LIVE NOW",
    latestResults: "LATEST RESULTS",
    emptyMessage:
      "Fixtures from local schedule — scores when API sync is active",
    liveMatchesAria: "Live matches",
    latestResultsAria: "Latest results",
    moreMatches: "+{count} More Matches",
    viewMoreMatchesAria: "View {count} more matches",
    allFixtures: "ALL FIXTURES",
    viewAllFixturesAria: "View all fixtures",
    tickerAria: "Live scores ticker",
    liveElapsed: "LIVE {elapsed}'",
  },
  fa: {
    worldCup2026: "جام جهانی ۲۰۲۶",
    liveNow: "زنده اکنون",
    latestResults: "آخرین نتایج",
    emptyMessage:
      "برنامه از تقویم محلی — نتایج با فعال شدن همگام‌سازی API",
    liveMatchesAria: "مسابقات زنده",
    latestResultsAria: "آخرین نتایج",
    moreMatches: "+{count} مسابقه بیشتر",
    viewMoreMatchesAria: "مشاهده {count} مسابقه بیشتر",
    allFixtures: "همه برنامه‌ها",
    viewAllFixturesAria: "مشاهده همه برنامه‌ها",
    tickerAria: "نوار نتایج زنده",
    liveElapsed: "زنده {elapsed}'",
  },
};

for (const loc of locales) {
  const file = path.join(dir, `${loc}.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  data.home = { ...data.home, ...(homeByLocale[loc] || homeByLocale.en) };
  data.favourites = {
    ...data.favourites,
    ...(favByLocale[loc] || favByLocale.en),
  };
  data.layout.liveRibbon = {
    ...data.layout.liveRibbon,
    ...(ribbonByLocale[loc] || ribbonByLocale.en),
  };
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

console.log("Message keys patched for home, favourites, liveRibbon");
