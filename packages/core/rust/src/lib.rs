use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use chrono::{DateTime, Utc, Duration};

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
}
