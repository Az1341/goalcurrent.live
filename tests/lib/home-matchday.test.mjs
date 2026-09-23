import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { selectFeaturedMatches } = require("../../src/lib/home/matchday.ts");

const now = new Date("2026-09-20T14:00:00Z");
const fixture = (fixtureId, status, kickoffUtc) => ({ fixtureId, status, kickoffUtc });

test("live games precede today's results and old finished games are excluded", () => {
  const rows = [fixture(1,"FT","2026-09-01T12:00:00Z"),fixture(2,"FT","2026-09-20T12:00:00Z"),fixture(3,"LIVE","2026-09-20T13:00:00Z"),fixture(4,"UPCOMING","2026-09-21T13:00:00Z")];
  assert.deepEqual(selectFeaturedMatches(rows, now).map(x => x.fixtureId), [3,2,4]);
});

const { todayMatches, scorePair, sourceHealth, matchStatusKey, matchdayHref, parseMatchdayId } = require("../../src/lib/home/matchday.ts");
const row = (patch = {}) => ({fixtureId: 7, status: "LIVE", statusShort: "2H", kickoffUtc: now.toISOString(), homeScore: 0, awayScore: 0, ...patch});

test("only confirmed numeric score pairs display; genuine zero scores survive", () => {
  assert.deepEqual(scorePair(row()), [0, 0]);
  for (const patch of [{homeScore:null},{awayScore:null},{homeScore:undefined},{homeScore:-1},{awayScore:NaN},{status:"UPCOMING"},{status:"POSTPONED"}]) assert.equal(scorePair(row(patch)), null);
  assert.deepEqual(scorePair(row({status:"PEN",homeScore:2,awayScore:2})), [2,2]);
});

test("status mapping covers half-time, extra time, penalties and interruptions", () => {
  for (const [patch,expected] of [[{statusShort:"HT"},"halfTime"],[{statusShort:"ET"},"extraTime"],[{statusShort:"P"},"penalties"],[{status:"AET"},"finishedExtraTime"],[{status:"PEN"},"finishedPenalties"],[{statusShort:"SUSP"},"interrupted"],[{status:"CANCELLED"},"cancelled"],[{status:"ABANDONED"},"abandoned"]]) assert.equal(matchStatusKey(row(patch)),expected);
});

test("filtering keeps all matches, deduplicates ids, and uses latest duplicate", () => {
  const many=Array.from({length:9},(_,i)=>row({fixtureId:i, status:i===0?"FT":"LIVE"}));
  assert.equal(todayMatches([...many,row({fixtureId:8,homeScore:3})],now).length,9);
  assert.equal(todayMatches(many,now,"live").length,8);
  assert.equal(todayMatches(many,now,"finished").length,1);
  assert.equal(todayMatches(many,now,"upcoming").length,0);
  assert.equal(todayMatches([...many,row({fixtureId:8,homeScore:3})],now).find(f=>f.fixtureId===8).homeScore,3);
});

test("today follows device timezone and live games survive midnight", () => {
  const previous=process.env.TZ;
  try {
    process.env.TZ="America/Los_Angeles";
    const midnight=new Date("2026-09-21T01:00:00Z");
    assert.equal(todayMatches([row({status:"FT",kickoffUtc:"2026-09-20T20:00:00Z"})],midnight).length,1);
    process.env.TZ="Asia/Tokyo";
    assert.equal(todayMatches([row({status:"FT",kickoffUtc:"2026-09-20T01:00:00Z"})],midnight).length,0);
    assert.equal(todayMatches([row({kickoffUtc:"2026-09-20T14:59:00Z"})],midnight).length,1);
  } finally { if(previous===undefined) delete process.env.TZ; else process.env.TZ=previous; }
});

test("coverage health distinguishes fresh empty feeds from outages and stale scores", () => {
  const data={fixtures:[],configured:true,source:"api-football",fetchedAt:now.toISOString()};
  const src={key:"pl",loading:false,failed:false,data};
  assert.equal(sourceHealth(src,now),"available");
  assert.equal(sourceHealth({...src,data:undefined,loading:true},now),"loading");
  assert.equal(sourceHealth({...src,data:undefined},now),"unavailable");
  assert.equal(sourceHealth({...src,failed:true},now),"delayed");
  for(const patch of [{stale:true},{error:"Rate limit"},{fetchedAt:"2026-09-20T12:00:00Z"}]) assert.equal(sourceHealth({...src,data:{...data,...patch}},now),"delayed");
  assert.equal(sourceHealth({...src,data:{...data,source:"fallback",fixtures:[row()]}},now),"scheduleOnly");
  assert.equal(sourceHealth({...src,data:{...data,fetchedAt:"bad"}},now),"unknown");
  assert.equal(sourceHealth({...src,data:{error:"Unavailable"}},now),"unavailable");
});

test("every supported competition has a dedicated hub and malformed ids are rejected",()=>{
  for(const [key,path] of [["pl","premier-league"],["ucl","champions-league"],["facup","fa-cup"],["unl","nations-league"]]) assert.equal(matchdayHref(key,123),`/${path}/match/123`);
  assert.equal(parseMatchdayId("123"),123);
  for(const raw of ["0","-1","1.5","1e3","nope","99999999999999999","%2F"]) assert.equal(parseMatchdayId(raw),null);
});

test("competition-qualified routing keeps identical fixture ids distinct", () => {
  const pl=todayMatches([row()],now);
  const unl=todayMatches([row({homeScore:4})],now);
  assert.equal(pl.length+unl.length,2);
  assert.notEqual(matchdayHref("pl",pl[0].fixtureId),matchdayHref("unl",unl[0].fixtureId));
});

test("today handles DST and the next local day without a reload", () => {
  const previous=process.env.TZ;
  try {
    process.env.TZ="Europe/London";
    const game=row({status:"UPCOMING",kickoffUtc:"2026-10-25T00:30:00Z"});
    assert.equal(todayMatches([game],new Date("2026-10-25T01:30:00Z")).length,1);
    assert.equal(todayMatches([game],new Date("2026-10-26T00:01:00Z")).length,0);
    assert.equal(todayMatches([row({status:"FT",kickoffUtc:"invalid"})],now).length,0);
  } finally { if(previous===undefined) delete process.env.TZ; else process.env.TZ=previous; }
});
