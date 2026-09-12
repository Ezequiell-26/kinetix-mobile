"use client";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Watch, Heart, Moon, Footprints, Smartphone, Bluetooth, BluetoothConnected, Activity } from "lucide-react";

/**
 * Wearables Hub.
 *
 * Lo que funciona HOY de verdad: sensores de ritmo cardíaco Bluetooth (bandas
 * de pecho y relojes que exponen el service standard "heart_rate") vía Web
 * Bluetooth GATT — Chrome/Edge sobre HTTPS o localhost. La lectura es en vivo,
 * del sensor real del usuario; no se simula nada.
 *
 * Lo que NO funciona todavía (y se muestra como tal): Garmin, Apple Health,
 * Fitbit, Oura y Google Fit requieren OAuth del lado servidor con claves API
 * propias. Hasta que existan esas credenciales y el backend de sync, quedan
 * marcados como pendientes, no como "Conectar" fake.
 */

// Tipos mínimos de Web Bluetooth (la lib DOM estándar no los incluye)
type BluetoothCharacteristic = {
  startNotifications(): Promise<BluetoothCharacteristic>;
  addEventListener(type: "characteristicvaluechanged", listener: (e: Event) => void): void;
};
type BluetoothService = { getCharacteristic(uuid: string): Promise<BluetoothCharacteristic> };
type BluetoothServer = {
  connect(): Promise<BluetoothServer>;
  disconnect(): void;
  getPrimaryService(uuid: string): Promise<BluetoothService>;
  connected: boolean;
};
type BluetoothDevice = {
  name?: string;
  gatt?: BluetoothServer;
  addEventListener(type: "gattserverdisconnected", listener: () => void): void;
};
type BluetoothNavigator = {
  bluetooth?: {
    requestDevice(options: { filters: Array<{ services: string[] }>; optionalServices?: string[] }): Promise<BluetoothDevice>;
  };
};

const PENDING = [
  { name: "Garmin", icon: Watch, desc: "Requiere claves OAuth de Garmin Connect" },
  { name: "Apple Health", icon: Smartphone, desc: "Requiere HealthKit bridge (iOS)" },
  { name: "Fitbit", icon: Heart, desc: "Requiere claves OAuth de Fitbit" },
  { name: "Oura", icon: Moon, desc: "Requiere claves OAuth de Oura" },
  { name: "Google Fit", icon: Footprints, desc: "Requiere claves OAuth de Google" },
] as const;

function parseHeartRate(view: DataView): number | null {
  const flags = view.getUint8(0);
  const is16Bit = (flags & 0x1) !== 0;
  return is16Bit ? view.getUint16(1, true) : view.getUint8(1);
}

export function WearablesHub() {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [hrDeviceName, setHrDeviceName] = useState<string | null>(null);
  const [bpm, setBpm] = useState<number | null>(null);
  const [maxBpm, setMaxBpm] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const deviceRef = useRef<BluetoothDevice | null>(null);

  useEffect(() => {
    setSupported(typeof navigator !== "undefined" && "bluetooth" in navigator);
    return () => {
      deviceRef.current?.gatt?.disconnect();
    };
  }, []);

  async function connectHR() {
    setError(null);
    setConnecting(true);
    try {
      const bt = (navigator as unknown as BluetoothNavigator).bluetooth;
      if (!bt) throw new Error("unsupported");
      const device = await bt.requestDevice({ filters: [{ services: ["heart_rate"] }] });
      deviceRef.current = device;
      const server = await device.gatt!.connect();
      const service = await server.getPrimaryService("heart_rate");
      const char = await service.getCharacteristic("heart_rate_measurement");
      await char.startNotifications();
      char.addEventListener("characteristicvaluechanged", (e: Event) => {
        const view = (e.target as unknown as { value: DataView }).value;
        const value = parseHeartRate(view);
        if (value !== null && value > 0) {
          setBpm(value);
          setMaxBpm(m => (value > m ? value : m));
        }
      });
      device.addEventListener("gattserverdisconnected", () => {
        setHrDeviceName(null);
        setBpm(null);
      });
      setHrDeviceName(device.name || "Sensor de ritmo cardíaco");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg === "unsupported") {
        setError("Tu navegador no soporta Web Bluetooth. Usá Chrome o Edge en Android o desktop.");
      } else if (err instanceof DOMException && err.name === "NotFoundError") {
        // El usuario canceló el chooser: no es un error que valga mostrar.
      } else {
        setError("No se pudo conectar. Verificá que el sensor esté en modo emparejamiento y cerca.");
      }
    } finally {
      setConnecting(false);
    }
  }

  function disconnectHR() {
    deviceRef.current?.gatt?.disconnect();
    deviceRef.current = null;
    setHrDeviceName(null);
    setBpm(null);
    setMaxBpm(0);
  }

  return (
    <Card className="border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Watch size={18} className="text-blue-400" /> Wearables Hub <Badge variant="muted">Web Bluetooth</Badge>
        </CardTitle>
        <p className="text-xs text-zinc-500">Conectá tu banda o reloj por Bluetooth y medí tu ritmo cardíaco en vivo durante la sesión.</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Ritmo cardíaco real por Web Bluetooth */}
        <div className={`p-4 rounded-2xl border transition ${hrDeviceName ? "bg-rose-500/10 border-rose-500/30" : "bg-zinc-900 border-zinc-800"}`}>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${hrDeviceName ? "bg-rose-500 text-white animate-pulse" : "bg-zinc-800 text-zinc-400"}`}>
              {hrDeviceName ? <BluetoothConnected size={20} /> : <Bluetooth size={20} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-white">{hrDeviceName ?? "Sensor de ritmo cardíaco"}</p>
              <p className="text-xs text-zinc-500">
                {hrDeviceName ? "Conectado — lectura en vivo" : "Bandas de pecho y relojes compatibles (Bluetooth Smart)"}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-3xl font-black text-rose-400 tabular-nums leading-none flex items-center gap-1 justify-end">
                {bpm ?? "--"} {bpm && <Heart size={16} className="fill-rose-400 text-rose-400 animate-pulse" />}
              </p>
              <p className="text-[10px] text-zinc-500">bpm {maxBpm > 0 && `· máx ${maxBpm}`}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            {hrDeviceName ? (
              <button onClick={disconnectHR} className="px-3 py-2 rounded-xl border border-zinc-700 text-xs font-bold text-zinc-300 hover:border-zinc-500 transition">
                Desconectar
              </button>
            ) : (
              <button
                onClick={connectHR}
                disabled={connecting || supported === false}
                className="px-3 py-2 rounded-xl bg-rose-500 text-white text-xs font-black disabled:opacity-40 hover:brightness-110 transition"
              >
                {connecting ? "Buscando…" : "Conectar sensor"}
              </button>
            )}
          </div>
          {error && <p className="text-[11px] text-amber-500 mt-2">{error}</p>}
          {supported === false && !error && (
            <p className="text-[11px] text-zinc-600 mt-2">Este navegador no soporta Web Bluetooth — usá Chrome o Edge.</p>
          )}
        </div>

        {/* Ecosistemas que requieren backend: estado honesto, no fake */}
        <div className="grid sm:grid-cols-2 gap-2">
          {PENDING.map(w => {
            const Icon = w.icon;
            return (
              <div key={w.name} className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/50 flex items-center gap-3 opacity-60">
                <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 shrink-0"><Icon size={16} /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-zinc-400 flex items-center gap-1.5">{w.name} <Activity size={10} className="text-zinc-600" /></p>
                  <p className="text-[11px] text-zinc-600 truncate">{w.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-zinc-600 text-center">
          La lectura cardíaca es real y en vivo vía Web Bluetooth GATT (estándar Heart Rate). El resto de las integraciones
          se activan cuando existan las claves OAuth del servidor — no simulo conexiones.
        </p>
      </CardContent>
    </Card>
  );
}
