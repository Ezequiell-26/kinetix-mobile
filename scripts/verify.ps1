# Script simple de verificacion multiplataforma
Write-Host "`n=== VERIFICACION KINETIXFITT ===`n" -ForegroundColor Cyan

$checks = @{
    "Node.js instalado" = { Test-Command "node" }
    "Dependencias instaladas" = { Test-Path ".\node_modules" }
    "Manifest PWA" = { Test-Path ".\public\manifest.json" }
    "Service Worker" = { Test-Path ".\public\sw.js" }
    "Iconos PWA" = { (Test-Path ".\public\icons\icon-192.png") -and (Test-Path ".\public\icons\icon-512.png") }
    "Electron configurado" = { Test-Path ".\electron\package.json" }
    "Prisma schema" = { Test-Path ".\prisma\schema.prisma" }
    "Base de datos" = { Test-Path ".\prisma\dev.db" }
    "Prisma Client" = { Test-Path ".\node_modules\.prisma\client" }
    "TypeScript config" = { Test-Path ".\tsconfig.json" }
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

$passed = 0
$failed = 0

foreach ($check in $checks.GetEnumerator()) {
    $result = & $check.Value
    if ($result) {
        Write-Host "[OK] $($check.Key)" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "[FAIL] $($check.Key)" -ForegroundColor Red
        $failed++
    }
}

Write-Host "`n=== RESUMEN ===" -ForegroundColor Cyan
Write-Host "Pasaron: $passed" -ForegroundColor Green
Write-Host "Fallaron: $failed" -ForegroundColor Red

if ($failed -eq 0) {
    Write-Host "`nESTADO: LISTO PARA DESARROLLO" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`nESTADO: REQUIERE ATENCION" -ForegroundColor Yellow
    exit 1
}
