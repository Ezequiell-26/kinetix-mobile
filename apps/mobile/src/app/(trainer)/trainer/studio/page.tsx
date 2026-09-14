"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { TrainerizeAllInOne } from "@/components/trainerize-allinone";
import { EverfitUxBuilder } from "@/components/everfit-ux-builder";
import { PtDistinctionAuto } from "@/components/pt-distinction-auto";
import { FitbodAdaptive } from "@/components/fitbod-adaptive";
import { CrmPipeline } from "@/components/crm-pipeline";
import { RiskMl } from "@/components/risk-ml";
import { AutoMessageRisk } from "@/components/auto-message-risk";
import { ProgramTuner } from "@/components/program-tuner";
import { BulkAssign } from "@/components/bulk-assign";
import { WorkoutCoolBanner } from "@/components/workoutcool-banner";
import { TrainerRevenuePro } from "@/components/trainer-revenue-pro";
import { VoiceLab } from "@/components/voice-lab";

/**
 * Studio: herramientas avanzadas del trainer, agrupadas por trabajo real.
 * Nada se eliminó del dashboard: las piezas competían ahí por atención;
 * acá están organizadas y el dashboard queda enfocado en la operación del día.
 */
export default function StudioPage(){
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-display font-bold">Studio</h1>
        <p className="text-sm text-zinc-500">Herramientas avanzadas: CRM, retención, programación masiva y negocio.</p>
      </div>

      <Tabs
        tabs={[
          {id:"clientes", label:"Clientes & CRM"},
          {id:"programacion", label:"Programación"},
          {id:"plataformas", label:"Plataformas"},
          {id:"negocio", label:"Negocio"},
          {id:"voz", label:"Voz"},
        ]}
        defaultId="clientes"
      >
        {(active)=> (
          <>
            {active==="clientes" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-white">CRM y retención</p>
                  <Badge variant="muted">Pipeline · Riesgo · Automatismos</Badge>
                </div>
                <CrmPipeline />
                <RiskMl />
                <AutoMessageRisk />
                <WorkoutCoolBanner />
              </div>
            )}
            {active==="programacion" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-white">Programación masiva y ajuste fino</p>
                </div>
                <ProgramTuner />
                <BulkAssign />
              </div>
            )}
            {active==="plataformas" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-white">Kits all-in-one inspirados en plataformas pro</p>
                </div>
                <TrainerizeAllInOne />
                <EverfitUxBuilder />
                <PtDistinctionAuto />
                <FitbodAdaptive />
              </div>
            )}
            {active==="negocio" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-white">Ingresos y suscripciones</p>
                </div>
                <TrainerRevenuePro />
              </div>
            )}
            {active==="voz" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-white">Voice Engine</p>
                  <Badge variant="muted">Laboratorio · Tokens · Faltantes</Badge>
                </div>
                <VoiceLab />
              </div>
            )}
          </>
        )}
      </Tabs>
      <p className="text-[11px] text-zinc-600 text-center">
        El dashboard se queda con la operación del día; las herramientas avanzadas viven acá.
      </p>
      <Card className="border-dashed border-zinc-800">
        <CardContent className="py-4 text-center text-[11px] text-zinc-600">
          Consejo: usá la búsqueda (⌘K / botón Buscar) para saltar directo a cualquier herramienta.
        </CardContent>
      </Card>
    </div>
  );
}
