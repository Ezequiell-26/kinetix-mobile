"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ExportActions(){
  function exportCSV(){
    const csv = "Fecha,Peso,Adherencia,Volumen\n2026-04-01,88.0,78%,12t\n2026-04-08,87.5,82%,14t\n2026-04-15,86.8,92%,18t";
    const blob = new Blob([csv], {type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "progreso-ezequiel.csv"; a.click();
  }
  function printPDF(){ window.print(); }
  return (
    <Card className="border-dashed">
      <CardContent className="pt-4 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={exportCSV}>Descargar CSV</Button>
        <Button variant="outline" size="sm" className="flex-1" onClick={printPDF}>Imprimir PDF</Button>
        <Button
          variant="accent"
          size="sm"
          className="flex-1 min-h-[44px]"
          onClick={async ()=>{
            const data = {title:"Mi progreso", text:"Mira mi progreso en EZEQUIEL COACHING"};
            try{
              if(navigator.share){
                await navigator.share(data);
              }else{
                exportCSV();
              }
            }catch(e){
              // Cancelar no descarga nada; otro error sí cae al CSV.
              if((e as Error)?.name !== "AbortError") exportCSV();
            }
          }}
        >
          Compartir
        </Button>
      </CardContent>
    </Card>
  );
}
