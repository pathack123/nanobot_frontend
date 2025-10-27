# Test Build Script for Windows PowerShell

Write-Host "🏗️  Building Nanobot Frontend..." -ForegroundColor Cyan
Write-Host ""

# Clean previous build
if (Test-Path "dist") {
    Write-Host "🧹 Cleaning previous build..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force dist
}

# Run build
Write-Host "📦 Running npm build..." -ForegroundColor Green
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host ""
    
    # Check if _redirects file exists in dist
    if (Test-Path "dist\_redirects") {
        Write-Host "✅ _redirects file found in dist" -ForegroundColor Green
        Get-Content "dist\_redirects"
    } else {
        Write-Host "❌ _redirects file NOT found in dist" -ForegroundColor Red
        Write-Host "⚠️  Copying _redirects manually..." -ForegroundColor Yellow
        Copy-Item "public\_redirects" -Destination "dist\_redirects"
    }
    
    Write-Host ""
    Write-Host "📂 Build directory structure:" -ForegroundColor Cyan
    Get-ChildItem dist -Name
    
    Write-Host ""
    Write-Host "🚀 Starting preview server..." -ForegroundColor Magenta
    Write-Host "📍 Test these URLs:" -ForegroundColor Yellow
    Write-Host "   http://localhost:5173/" -ForegroundColor White
    Write-Host "   http://localhost:5173/login" -ForegroundColor White
    Write-Host "   http://localhost:5173/home" -ForegroundColor White
    Write-Host ""
    Write-Host "🧪 Test by:" -ForegroundColor Cyan
    Write-Host "   1. Click each URL above" -ForegroundColor White
    Write-Host "   2. Press F5 to refresh" -ForegroundColor White
    Write-Host "   3. Should NOT get 404" -ForegroundColor White
    Write-Host ""
    
    npm run preview
} else {
    Write-Host ""
    Write-Host "❌ Build failed!" -ForegroundColor Red
    Write-Host "Check the error messages above" -ForegroundColor Yellow
}
