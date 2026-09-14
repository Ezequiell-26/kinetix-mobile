/**
 * Electron shell — KINETIXFITT desktop (Windows/Mac/Linux).
 *
 * No empaqueta servidor: es un wrapper del deploy de producción
 * (misma sesión/cookie, misma Supabase). En dev apunta a localhost:3001.
 */
const { app, BrowserWindow, shell } = require("electron");
const path = require("path");

const APP_URL =
  process.env.KINETIXFITT_APP_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://kinetixfitt-world-ia.vercel.app");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 360,
    minHeight: 640,
    backgroundColor: "#080808",
    autoHideMenuBar: true,
    icon: path.join(__dirname, "../public/icons/icon-512.png"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL(APP_URL);

  // Links externos (Mercado Pago, Stripe, stores) al navegador real.
  win.webContents.setWindowOpenHandler(({ url }) => {
    try {
      const target = new URL(url);
      const home = new URL(APP_URL);
      if (target.origin !== home.origin) {
        shell.openExternal(url);
        return { action: "deny" };
      }
    } catch {
      /* URL relativa: navegar dentro */
    }
    return { action: "allow" };
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
