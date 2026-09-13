# ONNX Runtime for KinetixFitt AI
# Modelos optimizados para inferencia on-device

import onnxruntime as ort
import numpy as np
from typing import Dict, List, Any
import json

class KineticAIModel:
    """Clase base para modelos de IA en dispositivo"""
    
    def __init__(self, model_path: str):
        self.session = ort.InferenceSession(
            model_path, 
            providers=['CPUExecutionProvider']
        )
        self.input_names = [i.name for i in self.session.get_inputs()]
        self.output_names = [o.name for o in self.session.get_outputs()]
    
    def predict(self, input_data: Dict[str, np.ndarray]) -> Dict[str, np.ndarray]:
        """Ejecuta inferencia con el modelo"""
        inputs = {name: input_data[name] for name in self.input_names}
        outputs = self.session.run(self.output_names, inputs)
        return {name: outputs[i] for i, name in enumerate(self.output_names)}

class FormCorrectionModel(KineticAIModel):
    """Modelo para corrección de forma en ejercicios"""
    
    def analyze_movement(self, keypoints: List[float]) -> Dict[str, Any]:
        """Analiza postura y devuelve correcciones"""
        input_data = {
            'keypoints': np.array(keypoints, dtype=np.float32).reshape(1, -1)
        }
        result = self.predict(input_data)
        
        return {
            'score': float(result['score'][0][0]),
            'corrections': result['corrections'][0].tolist(),
            'risk_level': int(result['risk'][0][0])
        }

class WorkoutRecommenderModel(KineticAIModel):
    """Modelo para recomendación de rutinas personalizadas"""
    
    def recommend(self, user_profile: Dict[str, Any], history: List[Dict]) -> List[Dict]:
        """Genera recomendaciones basadas en perfil e historial"""
        # Procesar perfil de usuario
        profile_vector = self._encode_profile(user_profile)
        history_vector = self._encode_history(history)
        
        input_data = {
            'profile': np.array(profile_vector, dtype=np.float32).reshape(1, -1),
            'history': np.array(history_vector, dtype=np.float32).reshape(1, -1)
        }
        
        result = self.predict(input_data)
        return self._decode_recommendations(result['recommendations'][0])
    
    def _encode_profile(self, profile: Dict) -> List[float]:
        # Codificar perfil de usuario en vector numérico
        return [
            profile.get('age', 30) / 100.0,
            profile.get('weight', 70) / 150.0,
            profile.get('height', 170) / 220.0,
            float(profile.get('fitness_level', 3) / 5.0),
            float(profile.get('goal_type', 0) / 3.0)
        ]
    
    def _encode_history(self, history: List[Dict]) -> List[float]:
        # Codificar historial de entrenamientos
        if not history:
            return [0.0] * 10
        
        recent = history[-5:]
        features = []
        for workout in recent:
            features.extend([
                workout.get('duration', 30) / 120.0,
                workout.get('intensity', 5) / 10.0,
                workout.get('completed', 1.0)
            ])
        
        # Rellenar si hay menos de 5 entrenamientos
        while len(features) < 15:
            features.append(0.0)
        
        return features[:15]
    
    def _decode_recommendations(self, output: np.ndarray) -> List[Dict]:
        # Decodificar salida del modelo a recomendaciones legibles
        exercises = [
            "bench_press", "squat", "deadlift", "pull_up", "push_up",
            "lunge", "plank", "burpee", "mountain_climber", "jump_rope"
        ]
        
        recommendations = []
        top_indices = np.argsort(output)[-3:][::-1]
        
        for idx in top_indices:
            recommendations.append({
                'exercise': exercises[idx],
                'confidence': float(output[idx]),
                'sets': int(np.random.randint(3, 5)),
                'reps': int(np.random.randint(8, 15))
            })
        
        return recommendations

# Función de utilidad para cargar modelos
def load_model(model_name: str) -> KineticAIModel:
    """Carga un modelo pre-entrenado por nombre"""
    model_paths = {
        'form_correction': 'packages/ai-models/models/form_correction.onnx',
        'workout_recommender': 'packages/ai-models/models/workout_recommender.onnx',
        'injury_prediction': 'packages/ai-models/models/injury_prediction.onnx'
    }
    
    if model_name not in model_paths:
        raise ValueError(f"Modelo {model_name} no encontrado")
    
    if model_name == 'form_correction':
        return FormCorrectionModel(model_paths[model_name])
    elif model_name == 'workout_recommender':
        return WorkoutRecommenderModel(model_paths[model_name])
    else:
        return KineticAIModel(model_paths[model_name])

if __name__ == "__main__":
    # Ejemplo de uso
    print("KinetixFitt AI Models - ONNX Runtime")
    print("Modelos listos para inferencia on-device")
