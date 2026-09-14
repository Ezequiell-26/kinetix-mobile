use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use chrono::{DateTime, Utc, Duration, Datelike, TimeZone};

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[derive(Serialize, Deserialize, Clone)]
pub struct WorkoutSet {
    pub reps: u32,
    pub weight: f32,
    pub rir: Option<u32>,
    pub completed: bool,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Exercise {
    pub id: String,
    pub name: String,
    pub sets: Vec<WorkoutSet>,
    pub muscle_group: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct WorkoutSession {
    pub id: String,
    pub date: String,
    pub exercises: Vec<Exercise>,
    pub duration_seconds: u32,
    pub completed: bool,
}

#[wasm_bindgen]
pub struct FitnessCore;

#[wasm_bindgen]
impl FitnessCore {
    #[wasm_bindgen(constructor)]
    pub fn new() -> FitnessCore {
        FitnessCore
    }

    /// Calculate total workout volume (sets × reps × weight)
    #[wasm_bindgen]
    pub fn calculate_volume(&self, workout_json: &str) -> f64 {
        let workout: Result<WorkoutSession, _> = serde_json::from_str(workout_json);
        
        match workout {
            Ok(w) => {
                let mut total_volume = 0.0;
                for exercise in &w.exercises {
                    for set in &exercise.sets {
                        if set.completed {
                            total_volume += (set.reps as f64) * (set.weight as f64);
                        }
                    }
                }
                total_volume
            }
            Err(_) => 0.0,
        }
    }

    /// Calculate progressive overload percentage between two workouts
    #[wasm_bindgen]
    pub fn calculate_progressive_overload(&self, previous_volume: f64, current_volume: f64) -> f64 {
        if previous_volume == 0.0 {
            return 0.0;
        }
        ((current_volume - previous_volume) / previous_volume) * 100.0
    }

    /// Calculate XP points based on workout metrics
    #[wasm_bindgen]
    pub fn calculate_xp(&self, volume: f64, duration_seconds: u32, exercises_completed: u32) -> u32 {
        let volume_score = (volume / 1000.0) as u32;
        let duration_score = (duration_seconds / 60) as u32;
        let exercise_bonus = exercises_completed * 50;
        
        100 + volume_score + duration_score + exercise_bonus
    }

    /// Calculate streak bonus multiplier
    #[wasm_bindgen]
    pub fn calculate_streak_multiplier(&self, streak_days: u32) -> f64 {
        if streak_days == 0 {
            return 1.0;
        }
        
        let base_multiplier = 1.0;
        let bonus_per_day = 0.05;
        let max_multiplier = 2.5;
        
        let calculated = base_multiplier + (streak_days as f64 * bonus_per_day);
        calculated.min(max_multiplier)
    }

    /// Detect if a new PR was achieved
    #[wasm_bindgen]
    pub fn detect_pr(&self, exercise_history_json: &str, current_weight: f64, current_reps: u32) -> bool {
        let history: Result<Vec<WorkoutSet>, _> = serde_json::from_str(exercise_history_json);
        
        match history {
            Ok(sets) => {
                let max_previous_weight = sets.iter()
                    .filter(|s| s.completed)
                    .map(|s| s.weight as f64)
                    .fold(0.0_f64, |a, b| a.max(b));
                
                let max_previous_reps_at_weight = sets.iter()
                    .filter(|s| s.completed && (s.weight as f64) >= current_weight)
                    .map(|s| s.reps)
                    .fold(0_u32, |a, b| a.max(b));
                
                current_weight > max_previous_weight || 
                (current_weight == max_previous_weight && current_reps > max_previous_reps_at_weight)
            }
            Err(_) => false,
        }
    }

    /// Calculate training frequency per muscle group
    #[wasm_bindgen]
    pub fn calculate_muscle_frequency(&self, workouts_json: &str, days: u32) -> JsValue {
        let workouts: Result<Vec<WorkoutSession>, _> = serde_json::from_str(workouts_json);
        
        match workouts {
            Ok(session_list) => {
                use std::collections::HashMap;
                let mut muscle_counts: HashMap<String, u32> = HashMap::new();
                
                let cutoff_date = Utc::now() - Duration::days(days as i64);
                
                for workout in session_list {
                    if let Ok(workout_date) = DateTime::parse_from_rfc3339(&workout.date) {
                        if workout_date.with_timezone(&Utc) > cutoff_date {
                            for exercise in workout.exercises {
                                *muscle_counts.entry(exercise.muscle_group).or_insert(0) += 1;
                            }
                        }
                    }
                }
                
                let json_str = serde_json::to_string(&muscle_counts).unwrap_or_default();
                JsValue::from_str(&json_str)
            }
            Err(_) => JsValue::NULL,
        }
    }

    /// Calculate RPE (Rate of Perceived Exertion) based on RIR
    #[wasm_bindgen]
    pub fn calculate_rpe(&self, rir: u32) -> u32 {
        10_u32.saturating_sub(rir)
    }

    /// Estimate 1RM (One Rep Max) using Epley formula
    #[wasm_bindgen]
    pub fn estimate_one_rm(&self, weight: f64, reps: u32) -> f64 {
        if reps == 0 {
            return weight;
        }
        weight * (1.0 + (reps as f64) / 30.0)
    }

    /// Calculate workout intensity score (0-100)
    #[wasm_bindgen]
    pub fn calculate_intensity_score(&self, volume: f64, avg_rpe: f64, duration_minutes: u32) -> u32 {
        let volume_component = (volume / 5000.0).min(40.0);
        let rpe_component = (avg_rpe / 10.0) * 40.0;
        let duration_component = ((duration_minutes as f64) / 90.0) * 20.0;
        
        ((volume_component + rpe_component + duration_component).min(100.0)) as u32
    }

    /// Calculate recovery time recommendation (in hours)
    #[wasm_bindgen]
    pub fn recommend_recovery_hours(&self, intensity_score: u32, fitness_level: u32) -> u32 {
        let base_recovery: f64 = 24.0;
        let intensity_factor = (intensity_score as f64) / 100.0;
        let fitness_modifier = 1.0 - ((fitness_level as f64).min(100.0) / 200.0);
        
        let recommended = base_recovery + (base_recovery * intensity_factor * fitness_modifier);
        recommended.round() as u32
    }
}

// ============================================================================
//  FASE 1: MIGRACIÓN stats.ts -> Rust/WASM
//  Función pesada elegida: weeklyAnalytics (+ helpers computeStreak, countPRs, etc.)
//  Mantiene fallback JS en packages/core/src/index.ts
// ============================================================================

#[derive(Deserialize, Clone)]
struct SetRecord {
    #[serde(alias = "exerciseName", alias = "exercise_name")]
    exerciseName: String,
    weight: Option<f32>,
    reps: Option<u32>,
    rir: Option<u32>,
}

#[derive(Deserialize, Clone)]
struct LogWithSets {
    date: String,
    sets: Vec<SetRecord>,
}

#[derive(Deserialize, Clone)]
struct Measurement {
    date: String,
    weight: Option<f32>,
}

#[derive(Serialize, Deserialize, Clone)]
struct WeeklyPoint {
    week: String,
    volumen: i32,
    oneRM: f64,
    peso: Option<f32>,
    adherencia: u32,
    agua: u32,
}

#[derive(Deserialize, Clone)]
struct PrSet {
    #[serde(alias = "exerciseName")]
    exerciseName: String,
    weight: Option<f32>,
    date: String,
}

fn parse_date(s: &str) -> Option<DateTime<Utc>> {
    if let Ok(dt) = DateTime::parse_from_rfc3339(s) {
        return Some(dt.with_timezone(&Utc));
    }
    if let Ok(dt) = chrono::NaiveDateTime::parse_from_str(s, "%Y-%m-%dT%H:%M:%S%.3fZ") {
        return Some(Utc.from_utc_datetime(&dt));
    }
    if let Ok(dt) = chrono::NaiveDateTime::parse_from_str(s, "%Y-%m-%dT%H:%M:%SZ") {
        return Some(Utc.from_utc_datetime(&dt));
    }
    if let Ok(dt) = chrono::NaiveDateTime::parse_from_str(s, "%Y-%m-%d %H:%M:%S") {
        return Some(Utc.from_utc_datetime(&dt));
    }
    if let Ok(d) = chrono::NaiveDate::parse_from_str(s, "%Y-%m-%d") {
        let dt = d.and_hms_opt(0, 0, 0).unwrap();
        return Some(Utc.from_utc_datetime(&dt));
    }
    // Try timestamp millis
    if let Ok(ms) = s.parse::<i64>() {
        if ms > 1_000_000_000_000 {
            return Some(Utc.timestamp_millis_opt(ms).single()?);
        } else if ms > 1_000_000_000 {
            return Some(Utc.timestamp_opt(ms, 0).single()?);
        }
    }
    // Try parsing as f64 timestamp
    if let Ok(ms) = s.parse::<f64>() {
        let ms_i = ms as i64;
        if ms_i > 1_000_000_000_000 {
            return Some(Utc.timestamp_millis_opt(ms_i).single()?);
        }
    }
    None
}

fn day_key(dt: DateTime<Utc>) -> String {
    // JS semantics: `${year}-${monthZeroIndexed}-${day}`
    // Use UTC (nota: JS usa local time; diferencia documentada)
    let year = dt.year();
    let month0 = dt.month0(); // 0-indexed
    let day = dt.day();
    format!("{}-{}-{}", year, month0, day)
}

fn week_start(dt: DateTime<Utc>) -> DateTime<Utc> {
    // Lunes = 0 (igual que TS: (getDay()+6)%7)
    let dow = dt.weekday().num_days_from_monday() as i64;
    let date = dt.date_naive() - chrono::Duration::days(dow);
    let naive = date.and_hms_opt(0, 0, 0).unwrap();
    Utc.from_utc_datetime(&naive)
}

fn epley(weight: f64, reps: u32) -> f64 {
    if reps == 0 { return weight; }
    if reps == 1 { return weight; }
    (weight * (1.0 + reps as f64 / 30.0) * 10.0).round() / 10.0
}

// --- exported helpers ---

/// Racha actual de días consecutivos (equivalente a computeStreak de stats.ts)
#[wasm_bindgen]
pub fn compute_streak(dates_json: &str) -> u32 {
    compute_streak_with_now(dates_json, Utc::now().timestamp_millis() as f64)
}

#[wasm_bindgen]
pub fn compute_streak_with_now(dates_json: &str, now_ms: f64) -> u32 {
    let dates: Vec<String> = serde_json::from_str(dates_json).unwrap_or_default();
    if dates.is_empty() { return 0; }
    use std::collections::HashSet;
    let mut set: HashSet<String> = HashSet::new();
    for d in &dates {
        if let Some(dt) = parse_date(d) {
            set.insert(day_key(dt));
        } else if let Ok(ms) = d.parse::<i64>() {
            if let Some(dt) = Utc.timestamp_millis_opt(ms).single() {
                set.insert(day_key(dt));
            }
        }
    }
    if set.is_empty() { return 0; }
    let now_dt = Utc.timestamp_millis_opt(now_ms as i64).single().unwrap_or_else(|| Utc::now());
    let mut cursor = now_dt.date_naive().and_hms_opt(0,0,0).unwrap().and_utc();
    // JS: if (!days.has(today)) cursor -= 1 day
    if !set.contains(&day_key(cursor)) {
        cursor = cursor - Duration::days(1);
    }
    let mut streak = 0;
    while set.contains(&day_key(cursor)) {
        streak += 1;
        cursor = cursor - Duration::days(1);
        if streak > 3650 { break; } // safety
    }
    streak
}

#[wasm_bindgen]
pub fn sessions_in_window(dates_json: &str, window_days: u32, now_ms: f64) -> u32 {
    let dates: Vec<String> = serde_json::from_str(dates_json).unwrap_or_default();
    let now = if now_ms == 0.0 { Utc::now().timestamp_millis() } else { now_ms as i64 };
    let since = now - window_days as i64 * 24 * 60 * 60 * 1000;
    let mut count = 0;
    for d in dates {
        let ms = if let Some(dt) = parse_date(&d) {
            dt.timestamp_millis()
        } else if let Ok(v) = d.parse::<i64>() {
            // if seconds vs millis heuristic
            if v < 10_000_000_000 { v * 1000 } else { v }
        } else { continue; };
        if ms >= since { count += 1; }
    }
    count
}

#[wasm_bindgen]
pub fn compute_adherence(dates_json: &str, frequency: u32, window_days: u32) -> u32 {
    compute_adherence_with_now(dates_json, frequency, window_days, Utc::now().timestamp_millis() as f64)
}

#[wasm_bindgen]
pub fn compute_adherence_with_now(dates_json: &str, frequency: u32, window_days: u32, now_ms: f64) -> u32 {
    let freq = if frequency == 0 { 4 } else { frequency };
    let window = if window_days == 0 { 28 } else { window_days };
    let target = freq as f64 * (window as f64 / 7.0);
    let sessions = sessions_in_window(dates_json, window, now_ms) as f64;
    let val = (sessions / target.max(1.0) * 100.0).round() as u32;
    val.min(100)
}

/// Cuenta PRs con regla de sesión (igual que countPRs en stats.ts)
#[wasm_bindgen]
pub fn count_prs(sets_json: &str) -> u32 {
    let sets: Vec<PrSet> = serde_json::from_str(sets_json).unwrap_or_default();
    if sets.is_empty() { return 0; }
    use std::collections::HashMap;
    let mut by_session: HashMap<i64, HashMap<String, f32>> = HashMap::new();
    for s in sets {
        if s.exerciseName.is_empty() { continue; }
        let w = match s.weight { Some(v) => v, None => continue };
        let ts = if let Some(dt) = parse_date(&s.date) { dt.timestamp_millis() }
                 else if let Ok(ms) = s.date.parse::<i64>() { if ms < 10_000_000_000 { ms*1000 } else { ms } }
                 else { continue; };
        let entry = by_session.entry(ts).or_insert_with(HashMap::new);
        let prev = entry.get(&s.exerciseName).copied();
        if prev.is_none() || w > prev.unwrap() {
            entry.insert(s.exerciseName.clone(), w);
        }
    }
    let mut ordered: Vec<(i64, HashMap<String, f32>)> = by_session.into_iter().collect();
    ordered.sort_by_key(|(ts, _)| *ts);
    let mut max_so_far: HashMap<String, f32> = HashMap::new();
    let mut prs = 0u32;
    for (_, bests) in ordered {
        for (ex, weight) in bests {
            match max_so_far.get(&ex).copied() {
                None => { max_so_far.insert(ex, weight); }
                Some(prev_max) => {
                    if weight > prev_max {
                        prs += 1;
                        max_so_far.insert(ex, weight);
                    }
                }
            }
        }
    }
    prs
}

/// Agregados semanales reales para LiftShiftAnalytics (heavy fn migrada)
/// logs_json: JSON array de {date, sets:[{exerciseName, weight, reps}]}
/// measurements_json: JSON array de {date, weight}
/// frequency: sesiones objetivo por semana
/// Retorna JSON string de WeeklyPoint[]
#[wasm_bindgen]
pub fn weekly_analytics(logs_json: &str, measurements_json: &str, frequency: u32) -> String {
    weekly_analytics_impl(logs_json, measurements_json, frequency)
}

fn weekly_analytics_impl(logs_json: &str, measurements_json: &str, frequency: u32) -> String {
    let freq = if frequency == 0 { 4 } else { frequency };
    let logs: Vec<LogWithSets> = serde_json::from_str(logs_json).unwrap_or_default();
    if logs.is_empty() { return "[]".to_string(); }
    let measurements: Vec<Measurement> = serde_json::from_str(measurements_json).unwrap_or_default();

    use std::collections::HashMap;
    struct Bucket {
        start: DateTime<Utc>,
        sessions: u32,
        volume: f64,
        max_one_rm: f64,
    }
    let mut buckets: HashMap<i64, Bucket> = HashMap::new();
    for log in &logs {
        let dt = match parse_date(&log.date) { Some(v) => v, None => continue };
        let ws = week_start(dt);
        let key = ws.timestamp_millis();
        let b = buckets.entry(key).or_insert_with(|| Bucket { start: ws, sessions: 0, volume: 0.0, max_one_rm: 0.0 });
        b.sessions += 1;
        for s in &log.sets {
            let w = match s.weight { Some(v) => v as f64, None => continue };
            let r = match s.reps { Some(v) => v, None => continue };
            b.volume += w * r as f64;
            let orm = epley(w, r);
            if orm > b.max_one_rm { b.max_one_rm = orm; }
        }
    }
    // measurements sorted by date
    let mut sorted_measurements = measurements.clone();
    sorted_measurements.sort_by_key(|m| parse_date(&m.date).map(|d| d.timestamp_millis()).unwrap_or(0));

    let mut ordered: Vec<Bucket> = buckets.into_values().collect();
    ordered.sort_by_key(|b| b.start.timestamp_millis());
    // take last 8
    let start_idx = if ordered.len() > 8 { ordered.len() - 8 } else { 0 };
    let slice = &ordered[start_idx..];

    let mut out: Vec<WeeklyPoint> = Vec::with_capacity(slice.len());
    for b in slice {
        let week_end = b.start + Duration::days(7);
        let week_end_ms = week_end.timestamp_millis();
        let filtered: Vec<&Measurement> = sorted_measurements.iter()
            .filter(|m| parse_date(&m.date).map(|d| d.timestamp_millis() < week_end_ms).unwrap_or(false))
            .collect();
        let peso = filtered.last().and_then(|m| m.weight);
        let week_str = format!("{:02}/{:02}", b.start.day(), b.start.month());
        out.push(WeeklyPoint {
            week: week_str,
            volumen: b.volume.round() as i32,
            oneRM: (b.max_one_rm * 10.0).round() / 10.0,
            peso,
            adherencia: ((b.sessions as f64 / freq.max(1) as f64 * 100.0).round() as u32).min(100),
            agua: 0,
        });
    }
    serde_json::to_string(&out).unwrap_or_else(|_| "[]".to_string())
}

// Optional helpers exposed via FitnessCore for parity

#[wasm_bindgen]
impl FitnessCore {
    #[wasm_bindgen]
    pub fn compute_streak_rs(&self, dates_json: &str) -> u32 {
        compute_streak(dates_json)
    }
    #[wasm_bindgen]
    pub fn weekly_analytics_rs(&self, logs_json: &str, measurements_json: &str, frequency: u32) -> String {
        weekly_analytics(logs_json, measurements_json, frequency)
    }
    #[wasm_bindgen]
    pub fn count_prs_rs(&self, sets_json: &str) -> u32 {
        count_prs(sets_json)
    }
    #[wasm_bindgen]
    pub fn compute_adherence_rs(&self, dates_json: &str, frequency: u32, window_days: u32) -> u32 {
        compute_adherence(dates_json, frequency, window_days)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_calculate_volume() {
        let core = FitnessCore::new();
        let workout = r#"{
            "id": "1",
            "date": "2024-01-01T10:00:00Z",
            "exercises": [{
                "id": "ex1",
                "name": "Bench Press",
                "muscle_group": "Chest",
                "sets": [
                    {"reps": 10, "weight": 80.0, "rir": 2, "completed": true},
                    {"reps": 8, "weight": 85.0, "rir": 1, "completed": true}
                ]
            }],
            "duration_seconds": 3600,
            "completed": true
        }"#;
        
        let volume = core.calculate_volume(workout);
        assert!((volume - 1480.0).abs() < 0.1);
    }

    #[test]
    fn test_progressive_overload() {
        let core = FitnessCore::new();
        let overload = core.calculate_progressive_overload(10000.0, 11000.0);
        assert!((overload - 10.0).abs() < 0.1);
    }

    #[test]
    fn test_xp_calculation() {
        let core = FitnessCore::new();
        let xp = core.calculate_xp(5000.0, 3600, 8);
        assert!(xp > 0);
    }

    #[test]
    fn test_compute_streak() {
        // Fixed now for determinism: 2026-09-11T12:00:00Z
        let now = Utc.with_ymd_and_hms(2026, 9, 11, 12, 0, 0).unwrap().timestamp_millis() as f64;
        let day = 24*60*60*1000i64;
        let iso = |offset_days: i64| {
            let ms = now as i64 - offset_days * day;
            Utc.timestamp_millis_opt(ms).single().unwrap().to_rfc3339()
        };
        let dates = vec![iso(0), iso(1), iso(2)];
        let json = serde_json::to_string(&dates).unwrap();
        let streak = compute_streak_with_now(&json, now);
        assert_eq!(streak, 3);
        // gap
        let dates2 = vec![iso(0), iso(3)];
        let json2 = serde_json::to_string(&dates2).unwrap();
        assert_eq!(compute_streak_with_now(&json2, now), 1);
        // empty
        assert_eq!(compute_streak_with_now("[]", now), 0);
    }

    #[test]
    fn test_count_prs() {
        // same session warmup shouldn't inflate
        let now = Utc::now();
        let t1 = (now - Duration::days(2)).to_rfc3339();
        let json = format!(r#"[
            {{"exerciseName":"Press banca","weight":40,"date":"{}"}},
            {{"exerciseName":"Press banca","weight":60,"date":"{}"}},
            {{"exerciseName":"Press banca","weight":80,"date":"{}"}}
        ]"#, t1, t1, t1);
        assert_eq!(count_prs(&json), 0);
        // progressive PR
        let t2 = (now - Duration::days(5)).to_rfc3339();
        let t3 = (now - Duration::days(3)).to_rfc3339();
        let t4 = (now - Duration::days(1)).to_rfc3339();
        let json2 = format!(r#"[
            {{"exerciseName":"Press banca","weight":60,"date":"{}"}},
            {{"exerciseName":"Press banca","weight":65,"date":"{}"}},
            {{"exerciseName":"Press banca","weight":62,"date":"{}"}}
        ]"#, t2, t3, t4);
        assert_eq!(count_prs(&json2), 1);
        // first entry is baseline not PR
        let json3 = format!(r#"[{{"exerciseName":"Sentadilla","weight":100,"date":"{}"}}]"#, t4);
        assert_eq!(count_prs(&json3), 0);
    }

    #[test]
    fn test_weekly_analytics() {
        let logs = r#"[
            {"date":"2026-08-04T10:00:00Z","sets":[{"exerciseName":"Press","weight":80,"reps":10,"rir":2},{"exerciseName":"Press","weight":90,"reps":5,"rir":1}]},
            {"date":"2026-08-06T10:00:00Z","sets":[{"exerciseName":"Squat","weight":100,"reps":8,"rir":2}]},
            {"date":"2026-08-11T10:00:00Z","sets":[{"exerciseName":"Press","weight":85,"reps":10,"rir":1}]}
        ]"#;
        let measurements = r#"[
            {"date":"2026-08-05T10:00:00Z","weight":80.5},
            {"date":"2026-08-12T10:00:00Z","weight":81.0}
        ]"#;
        let out = weekly_analytics(logs, measurements, 4);
        let parsed: Vec<WeeklyPoint> = serde_json::from_str(&out).unwrap();
        assert!(parsed.len() >= 2);
        // first week volume: 80*10 + 90*5 + 100*8 = 800+450+800=2050
        let first = &parsed[0];
        assert_eq!(first.volumen, 2050);
        assert!(first.oneRM > 100.0);
    }

    #[test]
    fn test_adherence() {
        let now = Utc.with_ymd_and_hms(2026, 9, 11, 12, 0, 0).unwrap().timestamp_millis() as f64;
        let day = 24*60*60*1000i64;
        let iso = |offset: i64| {
            let ms = now as i64 - offset * day;
            Utc.timestamp_millis_opt(ms).single().unwrap().to_rfc3339()
        };
        let dates: Vec<String> = (0..16).map(|i| iso(i)).collect();
        let json = serde_json::to_string(&dates).unwrap();
        assert_eq!(compute_adherence_with_now(&json, 4, 28, now), 100);
        let dates4: Vec<String> = (0..4).map(|i| iso(i)).collect();
        let json4 = serde_json::to_string(&dates4).unwrap();
        assert_eq!(compute_adherence_with_now(&json4, 4, 28, now), 25);
        let old: Vec<String> = (30..130).map(|i| iso(i)).collect();
        let json_old = serde_json::to_string(&old).unwrap();
        assert_eq!(compute_adherence_with_now(&json_old, 4, 28, now), 0);
    }
}
