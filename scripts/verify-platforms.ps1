# Script de verificación multiplataforma
# Verifica que la app funcione en Windows, macOS, Android, iOS

param(
    [string]$Platform = "all"
)

$ErrorActionPreference = "Continue"
$script:Errors = @()
$script:Warnings = @()
$script:Success = @()

function Write-Status {
    param($Message, $Type = "info")
    $color = switch ($Type) {
        "success" { "Green" }
        "error" { "Red" }
        "warning" { "Yellow" }
        default { "White" }
    }
    Write-Host "[$Type] $Message" -ForegroundColor $color
}

function Test-Command {
    param($Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    } catch {
        return $false
    }
}

function Add-Result {
    param($Message, $Type)
    switch ($Type) {
        "success" { $script:Success += $Message }
        "error" { $script:Errors += $Message }
        "warning" { $script:Warnings += $Message }
    }
}

Write-Host "`n=== VERIFICACIÓN MULTIPLATAFORMA EZEQUIEL COACHING ===" -ForegroundColor Cyan
Write-Host "Plataforma: $Platform`n" -ForegroundColor Cyan

# 1. Verificar Node.js y dependencias
Write-Host "`n[1/8] Verificando Node.js y dependencias..." -ForegroundColor Yellow
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Status "Node.js $nodeVersion instalado" "success"
    Add-Result "Node.js $nodeVersion" "success"
} else {
    Write-Status "Node.js NO instalado" "error"
    Add-Result "Node.js faltante" "error"
}

if (Test-Path ".\node_modules") {
    Write-Status "node_modules encontrado" "success"
    Add-Result "Dependencias instaladas" "success"
} else {
    Write-Status "node_modules NO encontrado - ejecutar: npm install" "error"
    Add-Result "Dependencias faltantes" "error"
}

# 2. Verificar configuración PWA
Write-Host "`n[2/8] Verificando PWA..." -ForegroundColor Yellow
$requiredPWAFiles = @(
    ".\public\manifest.json",
    ".\public\sw.js",
    ".\public\icons\icon-192.png",
    ".\public\icons\icon-512.png"
)

foreach ($file in $requiredPWAFiles) {
    if (Test-Path $file) {
        Write-Status "+ $file" "success"
    } else {
        Write-Status "- $file FALTANTE" "error"
        Add-Result "PWA: $file faltante" "error"
    }
}

# Verificar manifest.json
if (Test-Path ".\public\manifest.json") {
    $manifest = Get-Content ".\public\manifest.json" | ConvertFrom-Json
    if ($manifest.icons -and $manifest.icons.Count -ge 2) {
        Write-Status "Manifest tiene $($manifest.icons.Count) iconos" "success"
        Add-Result "PWA manifest OK" "success"
    } else {
        Write-Status "Manifest sin suficientes iconos" "warning"
        Add-Result "PWA manifest incompleto" "warning"
    }
}

# 3. Verificar Electron Desktop
Write-Host "`n[3/8] Verificando Electron Desktop..." -ForegroundColor Yellow
if (Test-Path ".\electron") {
    Write-Status "Carpeta electron/ encontrada" "success"
    
    if (Test-Path ".\electron\package.json") {
        $electronPkg = Get-Content ".\electron\package.json" | ConvertFrom-Json
        Write-Status "Electron $($electronPkg.devDependencies.electron) configurado" "success"
        Add-Result "Electron configurado" "success"
        
        # Verificar scripts
        $requiredScripts = @("start", "dev", "build:win", "build:mac")
        foreach ($script in $requiredScripts) {
            if ($electronPkg.scripts.$script) {
                Write-Status "+ Script '$script' definido" "success"
            } else {
                Write-Status "- Script '$script' faltante" "warning"
            }
        }
    }
} else {
    Write-Status "Electron NO configurado" "warning"
    Add-Result "Electron faltante" "warning"
}

# 4. Verificar builds de Next.js
Write-Host "`n[4/8] Verificando Next.js..." -ForegroundColor Yellow
if (Test-Path ".\next.config.mjs") {
    Write-Status "next.config.mjs encontrado" "success"
    $config = Get-Content ".\next.config.mjs" -Raw
    
    if ($config -match "output.*export") {
        Write-Status "Export estático configurado (para Capacitor)" "success"
        Add-Result "Next.js export ready" "success"
    } else {
        Write-Status "Export estático NO configurado (opcional)" "warning"
        Add-Result "Export no configurado (usar para Capacitor)" "warning"
    }
}

# 5. Verificar Capacitor (apps nativas)
Write-Host "`n[5/8] Verificando Capacitor..." -ForegroundColor Yellow
if (Test-Path ".\capacitor.config.ts") {
    Write-Status "Capacitor configurado" "success"
    Add-Result "Capacitor configurado" "success"
    
    if (Test-Path ".\ios") {
        Write-Status "+ Proyecto iOS generado" "success"
    } else {
        Write-Status "- Proyecto iOS NO generado" "warning"
    }
    
    if (Test-Path ".\android") {
        Write-Status "+ Proyecto Android generado" "success"
    } else {
        Write-Status "- Proyecto Android NO generado" "warning"
    }
} else {
    Write-Status "Capacitor NO configurado (opcional para apps nativas)" "warning"
    Add-Result "Capacitor no instalado" "warning"
}

# 6. Verificar Prisma y base de datos
Write-Host "`n[6/8] Verificando Prisma..." -ForegroundColor Yellow
if (Test-Path ".\prisma\schema.prisma") {
    Write-Status "schema.prisma encontrado" "success"
    
    if (Test-Path ".\prisma\dev.db") {
        Write-Status "Base de datos dev.db existe" "success"
        Add-Result "Base de datos OK" "success"
    } else {
        Write-Status "dev.db NO existe - ejecutar: npm run db:migrate" "warning"
        Add-Result "DB faltante" "warning"
    }
    
    if (Test-Path ".\node_modules\.prisma\client") {
        Write-Status "Prisma Client generado" "success"
    } else {
        Write-Status "Prisma Client NO generado - ejecutar: npm run db:generate" "error"
        Add-Result "Prisma Client faltante" "error"
    }
}

# 7. Verificar assets y audio
Write-Host "`n[7/8] Verificando assets..." -ForegroundColor Yellow
$audioFiles = Get-ChildItem -Path ".\public\audio" -Recurse -Filter "*.mp3" -ErrorAction SilentlyContinue
if ($audioFiles) {
    Write-Status "Encontrados $($audioFiles.Count) archivos de audio" "success"
    Add-Result "$($audioFiles.Count) archivos de audio" "success"
} else {
    Write-Status "Archivos de audio NO encontrados" "warning"
    Add-Result "Audio faltante" "warning"
}

# 8. Verificar TypeScript
Write-Host "`n[8/8] Verificando TypeScript..." -ForegroundColor Yellow
if (Test-Path ".\tsconfig.json") {
    Write-Status "tsconfig.json encontrado" "success"
    
    Write-Host "Ejecutando type check..." -ForegroundColor Gray
    $tscOutput = & npx tsc --noEmit 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Status "+ Sin errores de TypeScript" "success"
        Add-Result "TypeScript OK" "success"
    } else {
        Write-Status "- Errores de TypeScript encontrados" "error"
        Add-Result "Errores de TypeScript" "error"
        Write-Host $tscOutput -ForegroundColor Red
    }
}

# Resumen final
Write-Host "`n" + "="*60 -ForegroundColor Cyan
Write-Host "RESUMEN DE VERIFICACIÓN" -ForegroundColor Cyan
Write-Host "="*60 -ForegroundColor Cyan

Write-Host "`n+ EXITOS ($($script:Success.Count)):" -ForegroundColor Green
foreach ($msg in $script:Success) {
    Write-Host "  - $msg" -ForegroundColor Green
}

if ($script:Warnings.Count -gt 0) {
    Write-Host "`n! ADVERTENCIAS ($($script:Warnings.Count)):" -ForegroundColor Yellow
    foreach ($msg in $script:Warnings) {
        Write-Host "  - $msg" -ForegroundColor Yellow
    }
}

if ($script:Errors.Count -gt 0) {
    Write-Host "`nX ERRORES ($($script:Errors.Count)):" -ForegroundColor Red
    foreach ($msg in $script:Errors) {
        Write-Host "  - $msg" -ForegroundColor Red
    }
}

# Estado general
Write-Host "`n" + "="*60 -ForegroundColor Cyan
if ($script:Errors.Count -eq 0) {
    Write-Host "OK ESTADO: LISTO PARA DESARROLLO" -ForegroundColor Green
    exit 0
} elseif ($script:Errors.Count -le 2) {
    Write-Host "! ESTADO: REQUIERE CORRECCIONES MENORES" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "X ESTADO: REQUIERE CORRECCIONES CRITICAS" -ForegroundColor Red
    exit 2
}
