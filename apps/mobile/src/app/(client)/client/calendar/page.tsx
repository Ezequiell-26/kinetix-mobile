import { PremiumCalendar } from "@/components/premium-calendar";

export const metadata = {
  title: "Calendario | KinetixFitt",
};

export default function ClientCalendarPage() {
  return (
    <div className="mx-auto max-w-[1240px] space-y-6 pb-10">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#8193A5]">Planificación</p>
          <h1 className="mt-2 font-display text-4xl font-black tracking-tight text-white sm:text-5xl">Calendario</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8193A5]">
            Visualizá tus entrenamientos completados y mantené el control de tu constancia mes a mes.
          </p>
        </div>
        <div className="rounded-xl border border-[#1C3142] bg-[#0B151E] px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8193A5]">
          Vista mensual
        </div>
      </header>

      <PremiumCalendar />
    </div>
  );
}
