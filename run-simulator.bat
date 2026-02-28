@echo off
echo ========================================
echo Flo Finance - Transaction Simulator
echo ========================================
echo.

cd backend

echo Choose simulator mode:
echo.
echo [1] Generate 5 test transactions (quick batch)
echo [2] Generate 10 test transactions
echo [3] Generate 1 transaction
echo [4] Start continuous mode (every 30 minutes)
echo.

set /p choice="Enter choice (1-4): "

if "%choice%"=="1" (
    echo.
    echo Generating 5 test transactions...
    python transaction_simulator.py --mode batch --count 5
) else if "%choice%"=="2" (
    echo.
    echo Generating 10 test transactions...
    python transaction_simulator.py --mode batch --count 10
) else if "%choice%"=="3" (
    echo.
    echo Generating 1 transaction...
    python transaction_simulator.py --mode once
) else if "%choice%"=="4" (
    echo.
    echo Starting continuous mode (press Ctrl+C to stop)...
    python transaction_simulator.py --mode continuous --interval 30
) else (
    echo Invalid choice!
)

echo.
pause
