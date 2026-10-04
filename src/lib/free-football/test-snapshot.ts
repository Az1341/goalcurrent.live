// Only enabled by explicit CI browser-test flag outside all Vercel environments.
import { FREE_COMPETITIONS, type FootballSnapshot, type FreeMatch } from './model';
export function testSnapshot(now: Date): FootballSnapshot {
  const day = new Date(now);day.setUTCHours(12,0,0,0);
  const row=(id:number,code:FreeMatch['competition'],offset:number,status:FreeMatch['status'],homeScore:number|null=null,awayScore:number|null=null):FreeMatch=>({id,competition:code,kickoffUtc:new Date(day.getTime()+offset*86400000).toISOString(),home:`Test Home ${id}`,away:`Test Away ${id}`,status,homeScore,awayScore,matchday:1});
  const matches=[row(1,'PL',0,'SCHEDULED'),row(2,'PL',-1,'FINISHED',0,0),row(3,'PL',1,'SCHEDULED'),row(4,'PL',2,'POSTPONED'),row(5,'CL',1,'SCHEDULED'),row(6,'PL',0,'PENDING')];
  return {renderedAt:now.toISOString(),competitions:FREE_COMPETITIONS.map(c=>({code:c.code,available:true,fetchedAt:now.toISOString(),matches:matches.filter(m=>m.competition===c.code)}))};
}
