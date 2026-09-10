"use client";
import { OnboardingFlow } from "@/components/onboarding-flow";

export default function Onboarding(){
  return (<OnboardingFlow onComplete={()=> location.href="/client/dashboard"} />
  );
}
