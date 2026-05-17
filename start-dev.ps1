#!/usr/bin/env pwsh

# PostRoast Development Start Script
# Starts both frontend and backend servers

Write-Host "🚀 PostRoast Development Environment" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found" -ForegroundColor Red
    Write-Host "Please run this script from the my-app directory" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found package.json" -ForegroundColor Green
Write-Host ""

# Start both servers
Write-Host "Starting development servers..." -ForegroundColor Yellow
Write-Host ""

# Run the dev:all command which uses concurrently
npm run dev:all

Write-Host ""
Write-Host "🎉 Development environment ready!" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:5175" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test Flow:" -ForegroundColor Yellow
Write-Host "1. Sign up at /signup" -ForegroundColor Gray
Write-Host "2. Complete onboarding" -ForegroundColor Gray
Write-Host "3. Go to dashboard" -ForegroundColor Gray
Write-Host "4. Paste LinkedIn draft" -ForegroundColor Gray
Write-Host "5. Click 'Roast it'" -ForegroundColor Gray
