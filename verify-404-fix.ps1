# Verify 404 Fix Script
# Check if all necessary files exist

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Nanobot 404 Fix Verification" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$script:allChecksPassed = $true

function Test-FileExists {
    param (
        [string]$FilePath,
        [string]$Description
    )
    
    if (Test-Path $FilePath) {
        Write-Host "[OK] $Description" -ForegroundColor Green
        Write-Host "     File: $FilePath" -ForegroundColor Gray
        return $true
    }
    else {
        Write-Host "[FAIL] $Description" -ForegroundColor Red
        Write-Host "       Missing: $FilePath" -ForegroundColor Gray
        $script:allChecksPassed = $false
        return $false
    }
}

function Test-FileContent {
    param (
        [string]$FilePath,
        [string]$Pattern,
        [string]$Description
    )
    
    if (Test-Path $FilePath) {
        $content = Get-Content $FilePath -Raw
        if ($content -match $Pattern) {
            Write-Host "[OK] $Description" -ForegroundColor Green
            return $true
        }
        else {
            Write-Host "[WARN] $Description - Pattern not found" -ForegroundColor Yellow
            $script:allChecksPassed = $false
            return $false
        }
    }
    else {
        Write-Host "[FAIL] $Description - File not found" -ForegroundColor Red
        $script:allChecksPassed = $false
        return $false
    }
}

Write-Host "Checking Frontend Files..." -ForegroundColor Cyan
Write-Host ""

# Check critical files
Test-FileExists -FilePath ".\public\200.html" -Description "200.html (SPA fallback)"
Test-FileExists -FilePath ".\public\_redirects" -Description "_redirects (Netlify/Render)"
Test-FileExists -FilePath ".\public\_headers" -Description "_headers (Security headers)"
Test-FileExists -FilePath ".\render.yaml" -Description "render.yaml (Render config)"
Test-FileExists -FilePath ".\render.json" -Description "render.json (Render routes)"
Test-FileExists -FilePath ".\vite.config.js" -Description "vite.config.js"
Test-FileExists -FilePath ".\package.json" -Description "package.json"

Write-Host ""
Write-Host "Checking File Contents..." -ForegroundColor Cyan
Write-Host ""

# Check _redirects content
Test-FileContent -FilePath ".\public\_redirects" -Pattern "/\* /index\.html 200" -Description "_redirects has correct rewrite rule"

# Check render.yaml content
Test-FileContent -FilePath ".\render.yaml" -Pattern "type: rewrite" -Description "render.yaml has rewrite rules"

# Check vite.config.js content
Test-FileContent -FilePath ".\vite.config.js" -Pattern "build:" -Description "vite.config.js has build configuration"

# Check package.json scripts
Test-FileContent -FilePath ".\package.json" -Pattern "vite build" -Description "package.json has build script"

Write-Host ""
Write-Host "Checking Environment Files..." -ForegroundColor Cyan
Write-Host ""

Test-FileExists -FilePath ".\.env.example" -Description ".env.example (Template)"

if (Test-Path ".\.env") {
    Write-Host "[OK] .env file exists" -ForegroundColor Green
    
    # Check for required env vars
    $envContent = Get-Content ".\.env" -Raw
    
    if ($envContent -match "VITE_API_URL") {
        Write-Host "     VITE_API_URL configured" -ForegroundColor Green
    }
    else {
        Write-Host "     [WARN] VITE_API_URL not found" -ForegroundColor Yellow
    }
    
    if ($envContent -match "VITE_WS_URL") {
        Write-Host "     VITE_WS_URL configured" -ForegroundColor Green
    }
    else {
        Write-Host "     [WARN] VITE_WS_URL not found" -ForegroundColor Yellow
    }
}
else {
    Write-Host "[WARN] .env file not found (create from .env.example)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verification Summary" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($script:allChecksPassed) {
    Write-Host "[SUCCESS] All checks passed! Ready to deploy!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. Build the project: npm run build" -ForegroundColor White
    Write-Host "   2. Test locally: npm run preview" -ForegroundColor White
    Write-Host "   3. Deploy to Render.com" -ForegroundColor White
    Write-Host "   4. Test refresh on production URLs" -ForegroundColor White
    Write-Host ""
    exit 0
}
else {
    Write-Host "[FAIL] Some checks failed. Please fix the issues above." -ForegroundColor Red
    Write-Host ""
    Write-Host "Common fixes:" -ForegroundColor Yellow
    Write-Host "   - Make sure you're in the nanobot_frontend directory" -ForegroundColor White
    Write-Host "   - Run this script again after creating missing files" -ForegroundColor White
    Write-Host "   - Check FIX_404_COMPLETE.md for details" -ForegroundColor White
    Write-Host ""
    exit 1
}

