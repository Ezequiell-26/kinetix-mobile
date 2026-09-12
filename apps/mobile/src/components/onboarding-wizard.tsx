"use client";

import React, { useState } from "react";
import {
  OnboardingData,
  OnboardingStep,
  CLIENT_ONBOARDING_STEPS,
  FITNESS_GOALS,
  FITNESS_LEVELS,
  getRecommendedProgram,
  getOnboardingProgress,
  type FitnessGoal,
  type FitnessLevel,
  type UserRole,
  type WorkoutFrequency,
  type WorkoutLocation,
} from "@/lib/onboarding-flow";
import { FadeIn, FadeInUp, SlideIn, ConfettiBurst } from "./ui/animations";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  User,
  Dumbbell,
  Target,
  BarChart3,
  Settings,
  Sparkles,
} from "lucide-react";

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => void;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    role: "client",
  });
  const [showConfetti, setShowConfetti] = useState(false);

  const steps = CLIENT_ONBOARDING_STEPS;
  const currentStep = steps[currentStepIndex];
  const progress = getOnboardingProgress(data);
  const isLastStep = currentStepIndex === steps.length - 1;

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (isLastStep) {
      setShowConfetti(true);
      setTimeout(() => {
        onComplete({ ...data, completedAt: new Date() });
      }, 2000);
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep.id) {
      case "role":
        return !!data.role;
      case "personal":
        return !!data.firstName && !!data.age;
      case "fitness-profile":
        return !!(
          data.fitnessGoal &&
          data.fitnessLevel &&
          data.workoutFrequency &&
          data.workoutLocation
        );
      case "experience":
        return data.yearsTraining !== undefined;
      case "preferences":
        return data.notificationsEnabled !== undefined;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <ConfettiBurst trigger={showConfetti} />

      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <FadeIn>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-zinc-400">
                Paso {currentStepIndex + 1} de {steps.length}
              </p>
              <p className="text-sm font-bold text-primary">{progress}% completo</p>
            </div>
            <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-green-400 transition-all duration-500"
                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </FadeIn>

        {/* Card Container */}
        <FadeInUp>
          <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

            {/* Step Content */}
            <div className="relative z-10">
              {/* Icon & Title */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-green-400 flex items-center justify-center text-4xl mx-auto mb-4">
                  {currentStep.icon}
                </div>
                <h2 className="text-3xl font-black text-white mb-2">
                  {currentStep.titleES}
                </h2>
                <p className="text-zinc-400">{currentStep.descriptionES}</p>
              </div>

              {/* Step-specific content */}
              <div className="mb-8">
                {currentStep.id === "role" && <RoleStep data={data} updateData={updateData} />}
                {currentStep.id === "personal" && (
                  <PersonalStep data={data} updateData={updateData} />
                )}
                {currentStep.id === "fitness-profile" && (
                  <FitnessProfileStep data={data} updateData={updateData} />
                )}
                {currentStep.id === "current-stats" && (
                  <CurrentStatsStep data={data} updateData={updateData} />
                )}
                {currentStep.id === "experience" && (
                  <ExperienceStep data={data} updateData={updateData} />
                )}
                {currentStep.id === "preferences" && (
                  <PreferencesStep data={data} updateData={updateData} />
                )}
                {currentStep.id === "complete" && (
                  <CompleteStep data={data} />
                )}
              </div>

              {/* Navigation */}
              <div className="flex gap-3">
                {currentStepIndex > 0 && !isLastStep && (
                  <button
                    onClick={prevStep}
                    className="flex items-center justify-center gap-2 px-6 h-12 rounded-xl border border-zinc-700 bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-colors"
                  >
                    <ChevronLeft size={20} />
                    Atrás
                  </button>
                )}

                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-bold transition-colors ${
                    canProceed()
                      ? "bg-primary text-black hover:bg-primary/90"
                      : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                  }`}
                >
                  {isLastStep ? "Comenzar" : "Siguiente"}
                  {isLastStep ? <Sparkles size={20} /> : <ChevronRight size={20} />}
                </button>
              </div>

              {/* Skip option */}
              {currentStep.optional && (
                <button
                  onClick={nextStep}
                  className="w-full mt-3 text-sm text-zinc-500 hover:text-zinc-400 transition-colors"
                >
                  Saltar este paso
                </button>
              )}
            </div>
          </div>
        </FadeInUp>

        {/* KinetixFitt branding */}
        <p className="text-center text-zinc-600 text-sm mt-6">
          Powered by <span className="text-primary font-bold">KinetixFitt</span>
        </p>
      </div>
    </div>
  );
}

// Step Components

function RoleStep({
  data,
  updateData,
}: {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
}) {
  const roles: { value: UserRole; label: string; icon: string; description: string }[] = [
    {
      value: "client",
      label: "Soy Cliente",
      icon: "💪",
      description: "Quiero entrenar y alcanzar mis objetivos",
    },
    {
      value: "trainer",
      label: "Soy Entrenador",
      icon: "🏋️",
      description: "Quiero gestionar mis clientes",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {roles.map((role, index) => (
        <FadeInUp key={role.value} delay={index * 0.1}>
          <button
            onClick={() => updateData({ role: role.value })}
            className={`p-6 rounded-2xl border-2 transition-all text-left ${
              data.role === role.value
                ? "border-primary bg-primary/10"
                : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
            }`}
          >
            <div className="text-4xl mb-3">{role.icon}</div>
            <p className="text-lg font-bold text-white mb-1">{role.label}</p>
            <p className="text-sm text-zinc-400">{role.description}</p>
            {data.role === role.value && (
              <div className="mt-3 flex items-center gap-2 text-primary text-sm font-bold">
                <Check size={16} />
                Seleccionado
              </div>
            )}
          </button>
        </FadeInUp>
      ))}
    </div>
  );
}

function PersonalStep({
  data,
  updateData,
}: {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Nombre <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={data.firstName || ""}
          onChange={(e) => updateData({ firstName: e.target.value })}
          placeholder="Tu nombre"
          className="w-full h-12 px-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Edad <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            value={data.age || ""}
            onChange={(e) => updateData({ age: parseInt(e.target.value) })}
            placeholder="25"
            className="w-full h-12 px-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-white mb-2">Género</label>
          <select
            value={data.gender || ""}
            onChange={(e) => updateData({ gender: e.target.value as any })}
            className="w-full h-12 px-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-primary transition-colors"
          >
            <option value="">Seleccionar</option>
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
            <option value="other">Otro</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function FitnessProfileStep({
  data,
  updateData,
}: {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Goals */}
      <div>
        <label className="block text-sm font-bold text-white mb-3">
          Objetivo Principal
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {FITNESS_GOALS.map((goal) => (
            <button
              key={goal.id}
              onClick={() => updateData({ fitnessGoal: goal.id })}
              className={`p-4 rounded-xl border-2 transition-all ${
                data.fitnessGoal === goal.id
                  ? "border-primary bg-primary/10"
                  : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
              }`}
            >
              <div className="text-2xl mb-2">{goal.icon}</div>
              <p className="text-sm font-bold text-white">{goal.labelES}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Level */}
      <div>
        <label className="block text-sm font-bold text-white mb-3">Nivel</label>
        <div className="grid grid-cols-2 gap-3">
          {FITNESS_LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => updateData({ fitnessLevel: level.id })}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                data.fitnessLevel === level.id
                  ? "border-primary bg-primary/10"
                  : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
              }`}
            >
              <p className="text-sm font-bold text-white mb-1">{level.labelES}</p>
              <p className="text-xs text-zinc-400">{level.descriptionES}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Frequency & Location */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Frecuencia
          </label>
          <select
            value={data.workoutFrequency || ""}
            onChange={(e) =>
              updateData({ workoutFrequency: e.target.value as WorkoutFrequency })
            }
            className="w-full h-12 px-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-primary"
          >
            <option value="">Seleccionar</option>
            <option value="1-2">1-2 días/semana</option>
            <option value="3-4">3-4 días/semana</option>
            <option value="5-6">5-6 días/semana</option>
            <option value="7+">7+ días/semana</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-white mb-2">Lugar</label>
          <select
            value={data.workoutLocation || ""}
            onChange={(e) =>
              updateData({ workoutLocation: e.target.value as WorkoutLocation })
            }
            className="w-full h-12 px-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-primary"
          >
            <option value="">Seleccionar</option>
            <option value="gym">Gimnasio</option>
            <option value="home">Casa</option>
            <option value="both">Ambos</option>
            <option value="outdoor">Exterior</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function CurrentStatsStep({
  data,
  updateData,
}: {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Peso Actual (kg)
          </label>
          <input
            type="number"
            value={data.currentWeight || ""}
            onChange={(e) => updateData({ currentWeight: parseFloat(e.target.value) })}
            placeholder="70"
            className="w-full h-12 px-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Peso Objetivo (kg)
          </label>
          <input
            type="number"
            value={data.targetWeight || ""}
            onChange={(e) => updateData({ targetWeight: parseFloat(e.target.value) })}
            placeholder="75"
            className="w-full h-12 px-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-white mb-2">Altura (cm)</label>
        <input
          type="number"
          value={data.height || ""}
          onChange={(e) => updateData({ height: parseInt(e.target.value) })}
          placeholder="175"
          className="w-full h-12 px-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:border-primary"
        />
      </div>
    </div>
  );
}

function ExperienceStep({
  data,
  updateData,
}: {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-white mb-3">
        ¿Cuántos años entrenás?
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { value: 0, label: "< 1 año" },
          { value: 1, label: "1-2 años" },
          { value: 3, label: "3-5 años" },
          { value: 5, label: "5+ años" },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => updateData({ yearsTraining: option.value })}
            className={`p-4 rounded-xl border-2 transition-all ${
              data.yearsTraining === option.value
                ? "border-primary bg-primary/10"
                : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
            }`}
          >
            <p className="text-sm font-bold text-white">{option.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function PreferencesStep({
  data,
  updateData,
}: {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-zinc-800 border border-zinc-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-white mb-1">Notificaciones</p>
            <p className="text-xs text-zinc-400">
              Recordatorios de entrenamientos y progreso
            </p>
          </div>
          <button
            onClick={() =>
              updateData({ notificationsEnabled: !data.notificationsEnabled })
            }
            className={`w-14 h-8 rounded-full transition-colors ${
              data.notificationsEnabled ? "bg-primary" : "bg-zinc-600"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white transition-transform ${
                data.notificationsEnabled ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

function CompleteStep({ data }: { data: OnboardingData }) {
  const recommendation = getRecommendedProgram(data);

  return (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-green-400 flex items-center justify-center text-5xl mx-auto">
        ✅
      </div>

      <div>
        <h3 className="text-2xl font-black text-white mb-2">
          ¡Bienvenido, {data.firstName}!
        </h3>
        <p className="text-zinc-400">Tu perfil está listo</p>
      </div>

      {/* Recommended Program */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-green-400/10 border border-primary/20">
        <p className="text-sm text-zinc-400 mb-2">Programa recomendado</p>
        <p className="text-lg font-bold text-white mb-2">{recommendation.programName}</p>
        <p className="text-sm text-zinc-300">{recommendation.reason}</p>
      </div>
    </div>
  );
}
