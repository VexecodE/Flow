# Flo Finance - Transaction Simulator
# Quick start script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Flo Finance - Transaction Simulator" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location backend

Write-Host "Choose simulator mode:" -ForegroundColor Yellow
Write-Host ""
Write-Host "[1] Generate 5 test transactions (quick batch)" -ForegroundColor Green
Write-Host "[2] Generate 10 test transactions" -ForegroundColor Green
Write-Host "[3] Generate 1 transaction" -ForegroundColor Green
Write-Host "[4] Start continuous mode (every 30 minutes)" -ForegroundColor Green
Write-Host ""

$choice = Read-Host "Enter choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host "`nGenerating 5 test transactions..." -ForegroundColor Yellow
        python transaction_simulator.py --mode batch --count 5
    }
    "2" {
        Write-Host "`nGenerating 10 test transactions..." -ForegroundColor Yellow
        python transaction_simulator.py --mode batch --count 10
    }
    "3" {
        Write-Host "`nGenerating 1 transaction..." -ForegroundColor Yellow
        python transaction_simulator.py --mode once
    }
    "4" {
        Write-Host "`nStarting continuous mode (press Ctrl+C to stop)..." -ForegroundColor Yellow
        python transaction_simulator.py --mode continuous --interval 30
    }
    default {
        Write-Host "Invalid choice!" -ForegroundColor Red
    }
}

Write-Host ""
Read-Host "Press Enter to exit"
