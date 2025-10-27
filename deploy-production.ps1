# 🚀 Production Deployment Script for Nanobot Frontend
# แก้ปัญหา 404 บน Render.com/Netlify

param(
    [switch]$Build,
    [switch]$Preview,
    [switch]$Verify,
    [switch]$All
)

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🚀 Nanobot Frontend - Production Deployment" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

function Show-Header {
    param([string]$Title)
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host "📦 $Title" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host ""
}

function Run-Verify {
    Show-Header "Step 1: Verification"
    
    Write-Host "🔍 Checking required files..." -ForegroundColor Cyan
    
    $requiredFiles = @(
        "public\200.html",
        "public\_redirects",
        "public\_headers",
        "render.yaml",
        "render.json",
        "vite.config.js",
        "package.json"
    )
    
    $allFilesExist = $true
    
    foreach ($file in $requiredFiles) {
        if (Test-Path $file) {
            Write-Host "   ✅ $file" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Missing: $file" -ForegroundColor Red
            $allFilesExist = $false
        }
    }
    
    if ($allFilesExist) {
        Write-Host ""
        Write-Host "✅ All required files exist!" -ForegroundColor Green
        return $true
    } else {
        Write-Host ""
        Write-Host "❌ Some files are missing. Please check FIX_404_COMPLETE.md" -ForegroundColor Red
        return $false
    }
}

function Run-Build {
    Show-Header "Step 2: Building Production Bundle"
    
    Write-Host "🔨 Running: npm run build" -ForegroundColor Cyan
    Write-Host ""
    
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Build completed successfully!" -ForegroundColor Green
        
        # Check if dist folder exists and has files
        if (Test-Path "dist\index.html") {
            Write-Host "✅ dist/index.html created" -ForegroundColor Green
            
            # Check if 200.html is copied
            if (Test-Path "dist\200.html") {
                Write-Host "✅ dist/200.html exists (SPA fallback)" -ForegroundColor Green
            } else {
                Write-Host "⚠️  Copying 200.html to dist folder..." -ForegroundColor Yellow
                Copy-Item "public\200.html" "dist\200.html"
            }
            
            # Check if _redirects is copied
            if (Test-Path "dist\_redirects") {
                Write-Host "✅ dist/_redirects exists" -ForegroundColor Green
            } else {
                Write-Host "⚠️  Copying _redirects to dist folder..." -ForegroundColor Yellow
                Copy-Item "public\_redirects" "dist\_redirects"
            }
            
            return $true
        } else {
            Write-Host "❌ Build failed: dist/index.html not found" -ForegroundColor Red
            return $false
        }
    } else {
        Write-Host ""
        Write-Host "❌ Build failed with exit code: $LASTEXITCODE" -ForegroundColor Red
        return $false
    }
}

function Run-Preview {
    Show-Header "Step 3: Local Preview"
    
    Write-Host "🌐 Starting preview server..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📝 Test these URLs in your browser:" -ForegroundColor Yellow
    Write-Host "   http://localhost:4173" -ForegroundColor White
    Write-Host "   http://localhost:4173/login" -ForegroundColor White
    Write-Host "   http://localhost:4173/home" -ForegroundColor White
    Write-Host "   http://localhost:4173/profile" -ForegroundColor White
    Write-Host ""
    Write-Host "🔄 Try refreshing (F5) on each page - should NOT get 404!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
    Write-Host ""
    
    npm run preview
}

function Show-DeploymentInstructions {
    Show-Header "Deployment Instructions"
    
    Write-Host "📋 Follow these steps to deploy to Render.com:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1️⃣  Go to Render Dashboard: https://dashboard.render.com" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "2️⃣  Create New Static Site:" -ForegroundColor Yellow
    Write-Host "   - Click 'New +' → 'Static Site'" -ForegroundColor White
    Write-Host "   - Connect your GitHub repository" -ForegroundColor White
    Write-Host "   - Select 'nanobot_frontend'" -ForegroundColor White
    Write-Host ""
    Write-Host "3️⃣  Configuration:" -ForegroundColor Yellow
    Write-Host "   Name: nanobot-frontend" -ForegroundColor White
    Write-Host "   Branch: main" -ForegroundColor White
    Write-Host "   Build Command: npm install && npm run build" -ForegroundColor White
    Write-Host "   Publish Directory: dist" -ForegroundColor White
    Write-Host ""
    Write-Host "4️⃣  Environment Variables (in Render Dashboard):" -ForegroundColor Yellow
    Write-Host "   VITE_API_URL=https://your-backend.onrender.com" -ForegroundColor White
    Write-Host "   VITE_WS_URL=wss://your-backend.onrender.com" -ForegroundColor White
    Write-Host ""
    Write-Host "5️⃣  Deploy!" -ForegroundColor Yellow
    Write-Host "   - Click 'Create Static Site'" -ForegroundColor White
    Write-Host "   - Wait for deployment to complete" -ForegroundColor White
    Write-Host ""
    Write-Host "6️⃣  Test on Production:" -ForegroundColor Yellow
    Write-Host "   - Visit: https://your-site.onrender.com/login" -ForegroundColor White
    Write-Host "   - Press F5 (Refresh)" -ForegroundColor White
    Write-Host "   - Should load successfully (NOT 404)!" -ForegroundColor White
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host "✅ All files are ready for deployment!" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
}

# Main execution
if ($All) {
    $Verify = $true
    $Build = $true
    $Preview = $true
}

if ($Verify -or $All) {
    if (-not (Run-Verify)) {
        Write-Host ""
        Write-Host "⚠️  Please fix verification issues before continuing" -ForegroundColor Yellow
        exit 1
    }
}

if ($Build -or $All) {
    if (-not (Run-Build)) {
        Write-Host ""
        Write-Host "⚠️  Build failed. Please fix errors before continuing" -ForegroundColor Yellow
        exit 1
    }
}

if ($Preview -or $All) {
    Run-Preview
} else {
    Show-DeploymentInstructions
}

if (-not ($Verify -or $Build -or $Preview -or $All)) {
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\deploy-production.ps1 -Verify   # Check required files" -ForegroundColor White
    Write-Host "  .\deploy-production.ps1 -Build    # Build for production" -ForegroundColor White
    Write-Host "  .\deploy-production.ps1 -Preview  # Test locally" -ForegroundColor White
    Write-Host "  .\deploy-production.ps1 -All      # Run all steps" -ForegroundColor White
    Write-Host ""
}
