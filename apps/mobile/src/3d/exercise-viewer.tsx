'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import * as THREE from 'three';

// Tipos para la configuración del viewer
export interface Exercise3DViewerProps {
  exerciseName?: string;
  muscleGroup?: string;
  movementPattern?: 'push' | 'pull' | 'hinge' | 'squat' | 'carry';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  showMuscles?: boolean;
  showMovement?: boolean;
  autoRotate?: boolean;
  quality?: 'high' | 'medium' | 'low';
  className?: string;
}

// Componente de carga para fallback
function ViewerFallback() {
  return (
    <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-lime-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-300 text-sm">Cargando visualizador 3D...</p>
      </div>
    </div>
  );
}

// Cuerpo humano simplificado para anatomía
function HumanBody({ 
  highlightMuscles = [], 
  opacity = 0.8,
  autoRotate = false
}: { 
  highlightMuscles?: string[]; 
  opacity?: number;
  autoRotate?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Colores de músculos principales - KinetixFitt brand colors
  const muscleColors: Record<string, THREE.Color> = {
    chest: new THREE.Color('#ff6b6b'),
    shoulders: new THREE.Color('#ffd93d'),
    biceps: new THREE.Color('#6bcb77'),
    triceps: new THREE.Color('#4d96ff'),
    back: new THREE.Color('#9b5de5'),
    abs: new THREE.Color('#f15bb5'),
    quads: new THREE.Color('#00bbf9'),
    hamstrings: new THREE.Color('#00f5d4'),
    glutes: new THREE.Color('#fee440'),
    calves: new THREE.Color('#ff9f1c'),
  };

  useFrame((state) => {
    if (groupRef.current && autoRotate) {
      // Smooth auto-rotation when enabled
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    } else if (groupRef.current && !autoRotate) {
      // Subtle breathing effect when not rotating
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Cabeza */}
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#d4a574" opacity={opacity} transparent />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.5, 0.7, 0.3]} />
        <meshStandardMaterial 
          color={highlightMuscles.includes('chest') ? muscleColors.chest : '#d4a574'}
          opacity={opacity} 
          transparent 
        />
      </mesh>

      {/* Abdomen */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[0.45, 0.4, 0.28]} />
        <meshStandardMaterial 
          color={highlightMuscles.includes('abs') ? muscleColors.abs : '#d4a574'}
          opacity={opacity} 
          transparent 
        />
      </mesh>

      {/* Hombros */}
      <mesh position={[-0.35, 1.5, 0]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial 
          color={highlightMuscles.includes('shoulders') ? muscleColors.shoulders : '#d4a574'}
          opacity={opacity} 
          transparent 
        />
      </mesh>
      <mesh position={[0.35, 1.5, 0]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial 
          color={highlightMuscles.includes('shoulders') ? muscleColors.shoulders : '#d4a574'}
          opacity={opacity} 
          transparent 
        />
      </mesh>

      {/* Brazos */}
      <mesh position={[-0.5, 1.2, 0]}>
        <capsuleGeometry args={[0.08, 0.5, 32, 16]} />
        <meshStandardMaterial 
          color={highlightMuscles.includes('biceps') || highlightMuscles.includes('triceps') ? muscleColors.biceps : '#d4a574'}
          opacity={opacity} 
          transparent 
        />
      </mesh>
      <mesh position={[0.5, 1.2, 0]}>
        <capsuleGeometry args={[0.08, 0.5, 32, 16]} />
        <meshStandardMaterial 
          color={highlightMuscles.includes('biceps') || highlightMuscles.includes('triceps') ? muscleColors.biceps : '#d4a574'}
          opacity={opacity} 
          transparent 
        />
      </mesh>

      {/* Piernas */}
      <mesh position={[-0.2, 0.4, 0]}>
        <capsuleGeometry args={[0.12, 0.7, 32, 16]} />
        <meshStandardMaterial 
          color={highlightMuscles.includes('quads') || highlightMuscles.includes('hamstrings') ? muscleColors.quads : '#d4a574'}
          opacity={opacity} 
          transparent 
        />
      </mesh>
      <mesh position={[0.2, 0.4, 0]}>
        <capsuleGeometry args={[0.12, 0.7, 32, 16]} />
        <meshStandardMaterial 
          color={highlightMuscles.includes('quads') || highlightMuscles.includes('hamstrings') ? muscleColors.quads : '#d4a574'}
          opacity={opacity} 
          transparent 
        />
      </mesh>
    </group>
  );
}

// Indicador de movimiento
function MovementIndicator({ type }: { type: 'up' | 'down' | 'push' | 'pull' }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1 + (type === 'up' ? 0.5 : -0.5);
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }
  });

  const direction = type === 'up' || type === 'push' ? 1 : -1;

  return (
    <group position={[0.8, 1.2, 0]}>
      <mesh ref={ref}>
        <coneGeometry args={[0.15, 0.4, 32]} />
        <meshStandardMaterial color="#D6FF2A" emissive="#D6FF2A" emissiveIntensity={0.5} />
      </mesh>
      <mesh rotation={[Math.PI * direction * 0.5, 0, 0]} position={[0, direction * 0.3, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 16]} />
        <meshStandardMaterial color="#666" />
      </mesh>
    </group>
  );
}

// Escena principal del viewer
function ExerciseScene({ 
  exerciseName, 
  showMuscles, 
  showMovement,
  muscleGroup,
  autoRotate = false,
  onControlsReady
}: { 
  exerciseName?: string;
  showMuscles?: boolean;
  showMovement?: boolean;
  muscleGroup?: string;
  autoRotate?: boolean;
  onControlsReady?: (controls: any) => void;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  
  // Mapeo simple de ejercicios a músculos - TODO: migrate to structured domain data
  const getMusclesForExercise = (name?: string): string[] => {
    if (!name) return [];
    
    const lowerName = name.toLowerCase();
    if (lowerName.includes('press') || lowerName.includes('bench')) return ['chest', 'shoulders', 'triceps'];
    if (lowerName.includes('curl')) return ['biceps'];
    if (lowerName.includes('squat')) return ['quads', 'glutes', 'hamstrings'];
    if (lowerName.includes('deadlift')) return ['back', 'hamstrings', 'glutes'];
    if (lowerName.includes('row')) return ['back', 'biceps'];
    if (lowerName.includes('shoulder')) return ['shoulders'];
    if (lowerName.includes('leg')) return ['quads', 'hamstrings', 'calves'];
    if (lowerName.includes('abs') || lowerName.includes('crunch')) return ['abs'];
    
    return [];
  };

  const highlightedMuscles = useMemo(() => 
    showMuscles ? getMusclesForExercise(exerciseName) : [],
    [showMuscles, exerciseName]
  );

  useEffect(() => {
    camera.position.set(2.5, 1.5, 2.5);
    camera.lookAt(0, 1, 0);
  }, [camera]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[2.5, 1.5, 2.5]} fov={50} />
      <OrbitControls 
        ref={controlsRef}
        enablePan={false} 
        minDistance={1.5} 
        maxDistance={4}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        autoRotate={autoRotate}
        autoRotateSpeed={0.5}
        onInit={(controls) => {
          controlsRef.current = controls;
          onControlsReady?.(controls);
        }}
      />
      
      {/* Iluminación */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-3, 2, -3]} intensity={0.5} />
      <pointLight position={[0, 3, 0]} intensity={0.3} color="#D6FF2A" />
      
      {/* Ambiente */}
      <Environment preset="studio" />
      
      {/* Cuerpo humano */}
      <HumanBody highlightMuscles={highlightedMuscles} autoRotate={false} />
      
      {/* Indicador de movimiento */}
      {showMovement && exerciseName && (
        <MovementIndicator 
          type={exerciseName.toLowerCase().includes('press') || exerciseName.toLowerCase().includes('squat') ? 'up' : 'down'} 
        />
      )}
      
      {/* Sombras */}
      <ContactShadows 
        position={[0, 0, 0]} 
        opacity={0.4} 
        scale={10} 
        blur={2} 
        far={4} 
        resolution={256} 
        color="#000000" 
      />
    </>
  );
}

// Componente principal exportado
export function Exercise3DViewer({
  exerciseName = 'Bench Press',
  muscleGroup,
  movementPattern,
  difficulty,
  showMuscles = true,
  showMovement = true,
  autoRotate = false,
  quality = 'medium',
  className = '',
}: Exercise3DViewerProps) {
  const [isClient, setIsClient] = useState(false);
  const [rotationEnabled, setRotationEnabled] = useState(autoRotate);
  const [controlsRef, setControlsRef] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Sync autoRotate prop with internal state
  useEffect(() => {
    setRotationEnabled(autoRotate);
  }, [autoRotate]);

  // Reset camera handler
  const handleResetCamera = () => {
    if (controlsRef) {
      controlsRef.reset();
    }
  };

  // Configuración de calidad
  const qualitySettings = useMemo(() => {
    switch (quality) {
      case 'high':
        return { antialias: true, shadows: true, pixelRatio: 2 };
      case 'low':
        return { antialias: false, shadows: false, pixelRatio: 0.5 };
      default:
        return { antialias: true, shadows: false, pixelRatio: 1 };
    }
  }, [quality]);

  if (!isClient) {
    return <ViewerFallback />;
  }

  return (
    <div className={`relative w-full h-full min-h-[400px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl overflow-hidden ${className}`}>
      {/* Overlay de información */}
      <div className="absolute top-4 left-4 z-10 space-y-2 pointer-events-none">
        <h3 className="text-white font-bold text-lg drop-shadow-lg">{exerciseName}</h3>
        {muscleGroup && (
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-lime-400/20 backdrop-blur-sm rounded text-lime-400 text-xs font-medium">
              {muscleGroup}
            </span>
          </div>
        )}
        {difficulty && (
          <div className="flex gap-1">
            {['beginner', 'intermediate', 'advanced'].map((level) => (
              <div
                key={level}
                className={`w-2 h-2 rounded-full ${
                  level === difficulty 
                    ? 'bg-lime-400' 
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Controles de UI */}
      <div className="absolute bottom-4 right-4 z-10 flex gap-2">
        <button
          className="p-2 bg-gray-800/80 backdrop-blur-sm rounded-lg text-gray-300 hover:text-lime-400 transition-colors"
          title={rotationEnabled ? "Pausar rotación" : "Activar rotación"}
          onClick={() => setRotationEnabled(!rotationEnabled)}
        >
          <svg className={`w-5 h-5 ${rotationEnabled ? 'text-lime-400' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <button
          className="p-2 bg-gray-800/80 backdrop-blur-sm rounded-lg text-gray-300 hover:text-lime-400 transition-colors"
          title="Resetear vista"
          onClick={handleResetCamera}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10V19a2 2 0 002 2h.5M21 10V19a2 2 0 01-2 2h-.5M7 10l5-5 5 5M7 14l5 5 5-5" />
          </svg>
        </button>
      </div>

      {/* Canvas 3D */}
      <Canvas
        {...qualitySettings}
        className="w-full h-full"
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: false }}
      >
        <Suspense fallback={null}>
          <ExerciseScene 
            exerciseName={exerciseName}
            showMuscles={showMuscles}
            showMovement={showMovement}
            muscleGroup={muscleGroup}
            autoRotate={rotationEnabled}
            onControlsReady={setControlsRef}
          />
        </Suspense>
      </Canvas>

      {/* Gradiente decorativo */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-black/10" />
    </div>
  );
}

export default Exercise3DViewer;
