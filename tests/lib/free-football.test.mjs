import test from 'node:test';
import assert from 'node:assert/strict';
const model = await import('../../src/lib/free-football/model.ts');
const { partitionMatches, hasFinalScore, isStale } = model.default ?? model;
const normalization = await import('../../src/lib/free-football/normalize.ts');
const { normalizeMatches } = normalization.default ?? normalization;
const m=(id,kickoffUtc,status='SCHEDULED')=>({id,kickoffUtc,status,competition:'PL',home:'Home',away:'Away',homeScore:null,awayScore:null,matchday:1});
test('today uses visitor calendar across UTC midnight and daylight saving',()=>{
 const matches=[m(1,'2026-10-03T23:30:00Z'),m(2,'2026-10-04T23:30:00Z')];
 const now=new Date('2026-10-04T08:00:00Z');
 assert.deepEqual(partitionMatches(matches,now,'Europe/London').today.map(x=>x.id),[1]);
 assert.deepEqual(partitionMatches(matches,now,'America/New_York').today.map(x=>x.id),[2]);
});
test('results newest first, next games soonest first, postponed excluded from next',()=>{
 const matches=[m(1,'2026-10-01T12:00:00Z','FINISHED'),m(2,'2026-10-02T12:00:00Z','FINISHED'),m(3,'2026-10-05T12:00:00Z'),m(4,'2026-10-04T12:00:00Z'),m(5,'2026-10-04T10:00:00Z','POSTPONED')];
 const p=partitionMatches(matches,new Date('2026-10-04T08:00:00Z'),'Europe/London');
 assert.deepEqual(p.results.map(x=>x.id),[2,1]);assert.deepEqual(p.upcoming.map(x=>x.id),[4,3]);
});
const raw=(status,home=2,away=1)=>({id:1,utcDate:'2026-10-04T12:00:00Z',status,competition:{code:'PL'},homeTeam:{name:'Home'},awayTeam:{name:'Away'},score:{fullTime:{home,away}}});
test('in-play scores never leave normalizer; finished zero-zero is valid',()=>{
 for(const status of ['IN_PLAY','PAUSED','EXTRA_TIME','PENALTY_SHOOTOUT']) {
  const [row]=normalizeMatches({matches:[raw(status)]},'PL');assert.equal(row.status,'PENDING');assert.equal(row.homeScore,null);assert.equal(row.awayScore,null);
 }
 const [zero]=normalizeMatches({matches:[raw('FINISHED',0,0)]},'PL');assert.equal(hasFinalScore(zero),true);
 const [missing]=normalizeMatches({matches:[raw('FINISHED',null,null)]},'PL');assert.equal(hasFinalScore(missing),false);
});
test('invalid provider payload rejected rather than creating invented results',()=>{
 assert.throws(()=>normalizeMatches({matches:[{id:1}]},'PL'));
 assert.deepEqual(normalizeMatches({matches:[{...raw('FINISHED'),competition:{code:'PD'}}]},'PL'),[]);
 assert.equal(normalizeMatches({matches:[raw('FINISHED'),raw('FINISHED')]},'PL').length,1);
});
test('missing and old timestamps are stale; provider timestamp is never moved forward',()=>{
 const now=new Date('2026-10-04T09:00:00Z');assert.equal(isStale(null,now),true);assert.equal(isStale('2026-10-01T09:00:00Z',now),true);assert.equal(isStale('2026-10-04T05:00:00Z',now),false);
});
