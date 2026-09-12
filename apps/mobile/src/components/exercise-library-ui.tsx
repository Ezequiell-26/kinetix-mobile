"use client";

import React, { useState, useMemo } from "react";
import {
  Exercise,
  EXERCISE_LIBRARY,
  MuscleGroup,
  ExerciseCategory,
  Equipment,
  Difficulty,
  searchExercises,
  getExercisesByMuscle,
  getExercisesByCategory,
  getExercisesByEquipment,
  getExercisesByDifficulty,
} from "@/lib/exercise-library";
import { Search, Dumbbell, Target, Zap, Filter, X, Play, Info } from "lucide-react";
import { FadeInUp, HoverScale } from "./ui/animations";

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect?: (exercise: Exercise) => void;
}

export function ExerciseCard({ exercise, onSelect }: ExerciseCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const difficultyColor = {
    beginner: "text-green-400 bg-green-500/10 border-green-500/20",
    intermediate: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    advanced: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    expert: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  const difficultyLabel = {
    beginner: "Principiante",
    intermediate: "Intermedio",
    advanced: "Avanzado",
    expert: "Experto",
  };

  return (
    <HoverScale>
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-white mb-1">{exercise.nameES}</h3>
            <p className="text-xs text-zinc-500">{exercise.name}</p>
          </div>
          <span
            className={`px-2 py-1 rounded-lg text-xs font-bold border ${
              difficultyColor[exercise.difficulty]
            }`}
          >
            {difficultyLabel[exercise.difficulty]}
          </span>
        </div>

        {/* Primary Muscles */}
        <div className="flex flex-wrap gap-1 mb-3">
          {exercise.primaryMuscles.map((muscle) => (
            <span
              key={muscle}
              className="px-2 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-medium"
            >
              {muscle}
            </span>
          ))}
        </div>

        {/* Equipment */}
        <div className="flex items-center gap-2 mb-3 text-xs text-zinc-400">
          <Dumbbell size={14} />
          <span>{exercise.equipment.join(", ")}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-400 mb-3 line-clamp-2">
          {exercise.description}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-zinc-800 text-white text-sm font-bold hover:bg-zinc-700 transition-colors"
          >
            <Info size={16} />
            {showDetails ? "Ocultar" : "Ver más"}
          </button>
          {onSelect && (
            <button
              onClick={() => onSelect(exercise)}
              className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-primary text-black text-sm font-bold hover:bg-primary/90 transition-colors"
            >
              <Zap size={16} />
              Seleccionar
            </button>
          )}
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-zinc-800 space-y-4">
            {/* Instructions */}
            <div>
              <h4 className="text-sm font-bold text-white mb-2">Instrucciones:</h4>
              <ol className="space-y-1">
                {exercise.instructions.map((instruction, i) => (
                  <li key={i} className="text-xs text-zinc-400 flex gap-2">
                    <span className="text-primary font-bold">{i + 1}.</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Tips */}
            {exercise.tips.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-white mb-2">Tips:</h4>
                <ul className="space-y-1">
                  {exercise.tips.map((tip, i) => (
                    <li key={i} className="text-xs text-zinc-400 flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Variations */}
            {exercise.variations && exercise.variations.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-white mb-2">Variaciones:</h4>
                <div className="flex flex-wrap gap-2">
                  {exercise.variations.map((variation, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded-lg bg-zinc-800 text-zinc-300 text-xs"
                    >
                      {variation}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Common Mistakes */}
            {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-red-400 mb-2">
                  Errores comunes:
                </h4>
                <ul className="space-y-1">
                  {exercise.commonMistakes.map((mistake, i) => (
                    <li key={i} className="text-xs text-zinc-400 flex gap-2">
                      <span className="text-red-400">⚠</span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </HoverScale>
  );
}

interface ExerciseLibraryBrowserProps {
  onSelect?: (exercise: Exercise) => void;
  showSelectButton?: boolean;
}

export function ExerciseLibraryBrowser({
  onSelect,
  showSelectButton = false,
}: ExerciseLibraryBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | "all">(
    "all"
  );
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "all">(
    "all"
  );
  const [showFilters, setShowFilters] = useState(false);

  const filteredExercises = useMemo(() => {
    let exercises = EXERCISE_LIBRARY;

    // Search
    if (searchQuery) {
      exercises = searchExercises(searchQuery);
    }

    // Muscle filter
    if (selectedMuscle !== "all") {
      exercises = exercises.filter(
        (ex) =>
          ex.primaryMuscles.includes(selectedMuscle) ||
          ex.secondaryMuscles.includes(selectedMuscle)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      exercises = exercises.filter((ex) => ex.category === selectedCategory);
    }

    // Equipment filter
    if (selectedEquipment !== "all") {
      exercises = exercises.filter((ex) => ex.equipment.includes(selectedEquipment));
    }

    // Difficulty filter
    if (selectedDifficulty !== "all") {
      exercises = exercises.filter((ex) => ex.difficulty === selectedDifficulty);
    }

    return exercises;
  }, [searchQuery, selectedMuscle, selectedCategory, selectedEquipment, selectedDifficulty]);

  const clearFilters = () => {
    setSelectedMuscle("all");
    setSelectedCategory("all");
    setSelectedEquipment("all");
    setSelectedDifficulty("all");
    setSearchQuery("");
  };

  const activeFiltersCount = [
    selectedMuscle !== "all",
    selectedCategory !== "all",
    selectedEquipment !== "all",
    selectedDifficulty !== "all",
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <input
          type="text"
          placeholder="Buscar ejercicios..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 pl-12 pr-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-bold hover:bg-zinc-800 transition-colors"
        >
          <Filter size={16} />
          Filtros
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-primary text-black text-xs font-bold">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-zinc-400 text-sm hover:text-white transition-colors"
          >
            <X size={16} />
            Limpiar
          </button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
          {/* Muscle Group */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Grupo Muscular
            </label>
            <select
              value={selectedMuscle}
              onChange={(e) => setSelectedMuscle(e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-primary"
            >
              <option value="all">Todos</option>
              <option value="chest">Pecho</option>
              <option value="back">Espalda</option>
              <option value="shoulders">Hombros</option>
              <option value="biceps">Bíceps</option>
              <option value="triceps">Tríceps</option>
              <option value="abs">Abdominales</option>
              <option value="quadriceps">Cuádriceps</option>
              <option value="hamstrings">Isquiotibiales</option>
              <option value="glutes">Glúteos</option>
              <option value="calves">Pantorrillas</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Categoría
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-primary"
            >
              <option value="all">Todas</option>
              <option value="strength">Fuerza</option>
              <option value="powerlifting">Powerlifting</option>
              <option value="bodyweight">Peso Corporal</option>
              <option value="cardio">Cardio</option>
              <option value="plyometric">Pliométrico</option>
            </select>
          </div>

          {/* Equipment */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Equipamiento
            </label>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-primary"
            >
              <option value="all">Todo</option>
              <option value="barbell">Barra</option>
              <option value="dumbbell">Mancuernas</option>
              <option value="bodyweight">Peso Corporal</option>
              <option value="machine">Máquina</option>
              <option value="cable">Cable</option>
              <option value="kettlebell">Kettlebell</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Dificultad
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-primary"
            >
              <option value="all">Todas</option>
              <option value="beginner">Principiante</option>
              <option value="intermediate">Intermedio</option>
              <option value="advanced">Avanzado</option>
              <option value="expert">Experto</option>
            </select>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-zinc-400">
          <span className="text-white font-bold">{filteredExercises.length}</span>{" "}
          ejercicio{filteredExercises.length !== 1 ? "s" : ""} encontrado
          {filteredExercises.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map((exercise, index) => (
          <FadeInUp key={exercise.id} delay={index * 0.05}>
            <ExerciseCard
              exercise={exercise}
              onSelect={showSelectButton ? onSelect : undefined}
            />
          </FadeInUp>
        ))}
      </div>

      {/* Empty State */}
      {filteredExercises.length === 0 && (
        <div className="py-12 text-center">
          <Target size={48} className="text-zinc-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">
            No se encontraron ejercicios
          </h3>
          <p className="text-sm text-zinc-400 mb-4">
            Intenta ajustar los filtros o buscar con otros términos
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-2 rounded-xl bg-primary text-black font-bold hover:bg-primary/90 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}

// Quick exercise selector for workout builder
export function QuickExerciseSelector({ onSelect }: { onSelect: (exercise: Exercise) => void }) {
  const [search, setSearch] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | "all">("all");

  const exercises = useMemo(() => {
    let filtered = EXERCISE_LIBRARY;
    
    if (search) {
      filtered = searchExercises(search);
    }
    
    if (selectedMuscle !== "all") {
      filtered = getExercisesByMuscle(selectedMuscle);
    }
    
    return filtered.slice(0, 10); // Limit to 10 for quick selection
  }, [search, selectedMuscle]);

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Buscar ejercicio..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full h-10 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-primary"
      />
      
      <div className="flex gap-2 flex-wrap">
        {["all", "chest", "back", "shoulders", "quadriceps"].map((muscle) => (
          <button
            key={muscle}
            onClick={() => setSelectedMuscle(muscle as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedMuscle === muscle
                ? "bg-primary text-black"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            {muscle === "all" ? "Todos" : muscle}
          </button>
        ))}
      </div>

      <div className="max-h-64 overflow-y-auto space-y-2">
        {exercises.map((exercise) => (
          <button
            key={exercise.id}
            onClick={() => onSelect(exercise)}
            className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-left transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                  {exercise.nameES}
                </p>
                <p className="text-xs text-zinc-500">{exercise.primaryMuscles.join(", ")}</p>
              </div>
              <Zap size={16} className="text-zinc-600 group-hover:text-primary transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
