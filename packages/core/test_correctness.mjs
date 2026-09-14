import * as wasm from './pkg-node/kinetix_core.js';

function weekStart(d){const dt=new Date(d); const day=(dt.getDay()+6)%7; dt.setDate(dt.getDate()-day); dt.setHours(0,0,0,0);return dt;}
function epley(w,r){if(r<=0)return w; if(r===1)return w; return Math.round(w*(1+r/30)*10)/10;}
function weeklyAnalyticsJS(logs, measurements, frequency=4){
  if(!logs.length) return [];
  const buckets=new Map();
  for(const log of logs){
    const start=weekStart(log.date); const key=start.getTime();
    const bucket=buckets.get(key)??{start,sessions:0,volume:0,maxOneRM:0};
    bucket.sessions++;
    for(const s of log.sets){ if(s.weight===null||s.reps===null) continue; bucket.volume+=s.weight*s.reps; const orm=epley(s.weight,s.reps); if(orm>bucket.maxOneRM) bucket.maxOneRM=orm; }
    buckets.set(key,bucket);
  }
  const sorted=[...measurements].filter(m=>m.weight!==null).sort((a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime());
  return Array.from(buckets.values()).sort((a,b)=>a.start.getTime()-b.start.getTime()).slice(-8).map(b=>{
    const weekEnd=new Date(b.start.getTime()+7*24*60*60*1000);
    const wiw=sorted.filter(m=>new Date(m.date)<weekEnd);
    const peso=wiw.length?wiw[wiw.length-1].weight:null;
    return {week:b.start.toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit'}), volumen:Math.round(b.volume), oneRM:Math.round(b.maxOneRM*10)/10, peso, adherencia:Math.min(100,Math.round((b.sessions/Math.max(1,frequency))*100)), agua:0};
  });
}
function computeStreakJS(dates){
  if(!dates.length) return 0;
  const dayKey=d=>{const dt=new Date(d); return `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;};
  const days=new Set(dates.map(dayKey));
  const cursor=new Date(); cursor.setHours(0,0,0,0);
  if(!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate()-1);
  let s=0; while(days.has(dayKey(cursor))){s++; cursor.setDate(cursor.getDate()-1);} return s;
}
function countPRsJS(sets){
  const bySession=new Map();
  for(const s of sets){
    if(!s.exerciseName||s.weight===null||s.weight===undefined) continue;
    const key=String(new Date(s.date).getTime());
    const session=bySession.get(key)??new Map();
    const prev=session.get(s.exerciseName);
    if(prev===undefined||s.weight>prev) session.set(s.exerciseName,s.weight);
    bySession.set(key,session);
  }
  const ordered=Array.from(bySession.entries()).map(([ts,bests])=>({ts:Number(ts),bests})).sort((a,b)=>a.ts-b.ts);
  const maxSoFar=new Map(); let prs=0;
  for(const {bests} of ordered){ for(const [ex,w] of bests){ const prev=maxSoFar.get(ex); if(prev===undefined){maxSoFar.set(ex,w);} else if(w>prev){prs++; maxSoFar.set(ex,w);} } }
  return prs;
}

// Test 1: weeklyAnalytics
const logs = [
  {date:'2026-08-04T10:00:00Z', sets:[{exerciseName:'Press', weight:80, reps:10, rir:2},{exerciseName:'Press', weight:90, reps:5, rir:1}]},
  {date:'2026-08-06T10:00:00Z', sets:[{exerciseName:'Squat', weight:100, reps:8, rir:2}]},
  {date:'2026-08-11T10:00:00Z', sets:[{exerciseName:'Press', weight:85, reps:10, rir:1}]}
];
const meas = [
  {date:'2026-08-05T10:00:00Z', weight:80.5},
  {date:'2026-08-12T10:00:00Z', weight:81.0}
];
const js = weeklyAnalyticsJS(logs, meas,4);
const wasmJson = wasm.weekly_analytics(JSON.stringify(logs.map(l=>({date:l.date, sets:l.sets}))), JSON.stringify(meas.map(m=>({date:m.date, weight:m.weight}))),4);
const wasmPar = JSON.parse(wasmJson);
console.log('weeklyAnalytics JS:', JSON.stringify(js));
console.log('weeklyAnalytics WASM:', JSON.stringify(wasmPar));
console.log('weeklyAnalytics equal:', JSON.stringify(js)===JSON.stringify(wasmPar) ? 'PASS' : 'FAIL');

// Test 2: streak - use fixed now variant for determinism
const fixedNow = new Date('2026-09-11T12:00:00Z');
const day=24*60*60*1000;
const iso = n=> new Date(fixedNow.getTime()-n*day).toISOString();
const dates=[iso(0),iso(1),iso(2)];
const jsStreak=( ()=>{ // use withNow js
  const dayKey=d=>{const dt=new Date(d); return `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;};
  const days=new Set(dates.map(dayKey)); const cursor=new Date(fixedNow); cursor.setHours(0,0,0,0);
  if(!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate()-1); let s=0; while(days.has(dayKey(cursor))){s++; cursor.setDate(cursor.getDate()-1);} return s;
})();
const wasmStreak=wasm.compute_streak_with_now(JSON.stringify(dates), fixedNow.getTime());
console.log(`streak JS:${jsStreak} WASM:${wasmStreak} ${jsStreak===wasmStreak?'PASS':'FAIL'}`);

// Test 3: countPRs
const now=new Date();
const t1=new Date(now.getTime()-2*day).toISOString();
const json=`[{"exerciseName":"Press banca","weight":40,"date":"${t1}"},{"exerciseName":"Press banca","weight":60,"date":"${t1}"},{"exerciseName":"Press banca","weight":80,"date":"${t1}"}]`;
console.log('countPRs warmup JS:', countPRsJS(JSON.parse(json)), 'WASM:', wasm.count_prs(json), countPRsJS(JSON.parse(json))===wasm.count_prs(json)?'PASS':'FAIL');
const t2=new Date(now.getTime()-5*day).toISOString();
const t3=new Date(now.getTime()-3*day).toISOString();
const t4=new Date(now.getTime()-1*day).toISOString();
const json2=`[{"exerciseName":"Press banca","weight":60,"date":"${t2}"},{"exerciseName":"Press banca","weight":65,"date":"${t3}"},{"exerciseName":"Press banca","weight":62,"date":"${t4}"}]`;
console.log('countPRs progressive JS:', countPRsJS(JSON.parse(json2)), 'WASM:', wasm.count_prs(json2), countPRsJS(JSON.parse(json2))===wasm.count_prs(json2)?'PASS':'FAIL');

// Test 4: computeAdherence
const adherenceDates = Array.from({length:16},(_,i)=> new Date(fixedNow.getTime()-i*day).toISOString());
const datesJson=JSON.stringify(adherenceDates);
console.log('adherence 16/16 JS vs WASM:', wasm.compute_adherence_with_now(datesJson,4,28,fixedNow.getTime()), 'expected 100');

console.log('\nAll correctness checks done');
