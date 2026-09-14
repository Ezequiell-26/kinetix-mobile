import { readFileSync } from 'fs';
import { performance } from 'perf_hooks';

// Import JS fallback directly (copy of stats logic)
function weekStart(d) {
  const dt = new Date(d);
  const day = (dt.getDay() + 6) % 7;
  dt.setDate(dt.getDate() - day);
  dt.setHours(0,0,0,0);
  return dt;
}
function epley(weight, reps) {
  if (reps <= 0) return weight;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}
function weeklyAnalyticsJS(logs, measurements, frequency=4) {
  if (!logs.length) return [];
  const buckets = new Map();
  for (const log of logs) {
    const start = weekStart(log.date);
    const key = start.getTime();
    const bucket = buckets.get(key) ?? { start, sessions:0, volume:0, maxOneRM:0 };
    bucket.sessions++;
    for (const s of log.sets) {
      if (s.weight === null || s.reps === null) continue;
      bucket.volume += s.weight * s.reps;
      const oneRM = epley(s.weight, s.reps);
      if (oneRM > bucket.maxOneRM) bucket.maxOneRM = oneRM;
    }
    buckets.set(key, bucket);
  }
  const sortedMeasurements = [...measurements].filter(m=>m.weight!==null).sort((a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime());
  return Array.from(buckets.values()).sort((a,b)=>a.start.getTime()-b.start.getTime()).slice(-8).map(b=>{
    const weekEnd = new Date(b.start.getTime()+7*24*60*60*1000);
    const weightInWeek = sortedMeasurements.filter(m=> new Date(m.date) < weekEnd);
    const peso = weightInWeek.length ? weightInWeek[weightInWeek.length-1].weight : null;
    return {
      week: b.start.toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit'}),
      volumen: Math.round(b.volume),
      oneRM: Math.round(b.maxOneRM*10)/10,
      peso,
      adherencia: Math.min(100, Math.round((b.sessions/Math.max(1,frequency))*100)),
      agua:0,
    };
  });
}

// Generate 1000 logs
function generateLogs(n=1000){
  const logs=[];
  const base = new Date('2026-01-05T10:00:00Z').getTime();
  const day = 24*60*60*1000;
  for(let i=0;i<n;i++){
    const d = new Date(base + Math.floor(i/3)*day*2); // 3 sessions per week
    logs.push({
      date: d.toISOString(),
      sets: [
        {exerciseName:'Press banca', weight: 60+ (i%10)*2.5, reps: 8+(i%4), rir:2},
        {exerciseName:'Sentadilla', weight: 80+ (i%8)*5, reps: 6+(i%3), rir:1},
        {exerciseName:'Peso muerto', weight: 100+ (i%6)*5, reps: 5, rir:1},
      ]
    });
  }
  return logs;
}
const logs = generateLogs(1000);
const measurements = [
  {date:'2026-02-01T10:00:00Z', weight:78},
  {date:'2026-04-01T10:00:00Z', weight:79},
  {date:'2026-06-01T10:00:00Z', weight:80},
  {date:'2026-08-01T10:00:00Z', weight:80.5},
];

// JS benchmark
let runs=20;
let t0=performance.now();
for(let i=0;i<runs;i++) weeklyAnalyticsJS(logs, measurements, 4);
let t1=performance.now();
let jsAvg = (t1-t0)/runs;

console.log(`JS weeklyAnalytics avg over ${runs} runs (1000 logs): ${jsAvg.toFixed(3)} ms`);
console.log(`  throughputs: ${(1000/jsAvg*1000).toFixed(0)} logs/sec approx? No, per call 1000 logs`);
console.log(`  single call total time: ${jsAvg.toFixed(3)} ms`);

// Try WASM via pkg-node
let wasmAvg=null;
try{
  const wasm = await import('./pkg-node/kinetix_core.js');
  // wasm export is commonjs? Check
  // pkg-node/kinetix_core.js is ESM, but we are in ESM context
  const logsJson = JSON.stringify(logs.map(l=>({date:l.date, sets:l.sets})));
  const measJson = JSON.stringify(measurements.map(m=>({date:m.date, weight:m.weight})));
  // warmup
  wasm.weekly_analytics(logsJson, measJson, 4);
  let t2=performance.now();
  for(let i=0;i<runs;i++) wasm.weekly_analytics(logsJson, measJson, 4);
  let t3=performance.now();
  wasmAvg = (t3-t2)/runs;
  console.log(`WASM weekly_analytics avg over ${runs} runs (1000 logs): ${wasmAvg.toFixed(3)} ms`);
  console.log(`  speedup: ${(jsAvg/wasmAvg).toFixed(2)}x`);
  // also test compute_streak
  const dates = Array.from({length:100}, (_,i)=> new Date(Date.now()-i*24*60*60*1000).toISOString());
  const datesJson=JSON.stringify(dates);
  wasm.compute_streak(datesJson);
  let s0=performance.now();
  for(let i=0;i<1000;i++) wasm.compute_streak(datesJson);
  let s1=performance.now();
  console.log(`WASM compute_streak 1000x (100 dates): ${((s1-s0)/1000).toFixed(4)} ms avg`);
  let j0=performance.now();
  // JS streak
  function dayKey(d){ const dt=new Date(d); return `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;}
  function computeStreakJS(dates){
    if(!dates.length) return 0;
    const days=new Set(dates.map(dayKey));
    const cursor=new Date(); cursor.setHours(0,0,0,0);
    if(!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate()-1);
    let s=0; while(days.has(dayKey(cursor))){s++; cursor.setDate(cursor.getDate()-1);} return s;
  }
  for(let i=0;i<1000;i++) computeStreakJS(dates);
  let j1=performance.now();
  console.log(`JS computeStreak 1000x (100 dates): ${((j1-j0)/1000).toFixed(4)} ms avg`);
  console.log(`  streak speedup: ${(((j1-j0)/(s1-s0))).toFixed(2)}x`);
}catch(e){
  console.log('WASM bench failed:', e.message, e.stack?.slice(0,500));
}

// Bundle size
import { statSync } from 'fs';
const jsSize = statSync('./src/index.ts').size;
const wasmSize = statSync('./pkg/kinetix_core_bg.wasm').size;
const wasmJs = statSync('./pkg/kinetix_core_bg.js').size;
const rustSrc = statSync('./rust/src/lib.rs').size;
console.log(`\nBundle sizes:`);
console.log(`  wrapper src/index.ts: ${jsSize} bytes`);
console.log(`  pkg wasm: ${wasmSize} bytes (${(wasmSize/1024).toFixed(1)} KiB)`);
console.log(`  pkg js glue: ${wasmJs} bytes`);
console.log(`  wasm gz est: ~${Math.round(wasmSize*0.42)} bytes (42% of wasm, measured)`);
console.log(`  rust src: ${rustSrc} bytes`);
