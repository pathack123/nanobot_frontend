# Deploy Checklist for Render.com

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Render.com Deployment Checklist - Nanobot" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

$checks = @(
    @{
        name = "_redirects file in public/"
        path = "public\_redirects"
        required = $true
        critical = $true
    },
    @{
        name = "render.yaml configured"
        path = "render.yaml"
        required = $true
        critical = $true
    },
    @{
        name = "vite.config.js configured"
        path = "vite.config.js"
        required = $true
        critical = $false
    },
    @{
        name = "package.json has build script"
        path = "package.json"
        required = $true
        critical = $false
    }
)

$allPassed = $true
$criticalPassed = $true

foreach ($check in $checks) {
    Write-Host "Checking: $($check.name)..." -NoNewline
    
    if (Test-Path $check.path) {
        Write-Host " OK" -ForegroundColor Green
        
        if ($check.path -eq "public\_redirects") {
            $content = Get-Content $check.path -Raw
            Write-Host "   Content: $content" -ForegroundColor Yellow
            
            if ($content -match "/\*.*index\.html.*200") {
                Write-Host "   Verified: Content is correct!" -ForegroundColor Green
            } else {
                Write-Host "   WARNING: Content might be wrong" -ForegroundColor Red
                $criticalPassed = $false
            }
        }
        
        if ($check.path -eq "render.yaml") {
            $content = Get-Content $check.path -Raw
            if ($content -match "type:\s*static") {
                Write-Host "   Verified: Service type is 'static'" -ForegroundColor Green
            } elseif ($content -match "type:\s*web") {
                Write-Host "   ERROR: Service type is 'web' (should be 'static')" -ForegroundColor Red
                $criticalPassed = $false
                $allPassed = $false
            }
            
            if ($content -match "type:\s*rewrite") {
                Write-Host "   Verified: Rewrite rule found" -ForegroundColor Green
            } else {
                Write-Host "   WARNING: Rewrite rule not found" -ForegroundColor Yellow
            }
        }
    } else {
        if ($check.required) {
            Write-Host " MISSING!" -ForegroundColor Red
            $allPassed = $false
            if ($check.critical) {
                $criticalPassed = $false
            }
        } else {
            Write-Host " Not found (optional)" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

if ($criticalPassed -and $allPassed) {
    Write-Host "SUCCESS: All checks passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Commit and Push:" -ForegroundColor Yellow
    Write-Host '   git add .' -ForegroundColor White
    Write-Host '   git commit -m "fix: Configure SPA routing for Render"' -ForegroundColor White
    Write-Host '   git push origin main' -ForegroundColor White
    Write-Host ""
    Write-Host "2. Go to Render Dashboard:" -ForegroundColor Yellow
    Write-Host "   https://dashboard.render.com" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "3. Check Service Type:" -ForegroundColor Yellow
    Write-Host "   If Web Service -> DELETE and recreate as Static Site" -ForegroundColor Red
    Write-Host "   If Static Site -> Just redeploy" -ForegroundColor Green
    Write-Host ""
    Write-Host "4. Add Rewrite Rule (if not exists):" -ForegroundColor Yellow
    Write-Host "   Settings -> Redirects/Rewrites -> Add Rule" -ForegroundColor White
    Write-Host "   Source: /*" -ForegroundColor White
    Write-Host "   Destination: /index.html" -ForegroundColor White
    Write-Host "   Action: Rewrite" -ForegroundColor White
    Write-Host ""
    Write-Host "5. Deploy and Test!" -ForegroundColor Yellow
    Write-Host ""
    
} else {
    Write-Host "WARNING: Issues found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please fix the errors above before deploying." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Read these guides:" -ForegroundColor Cyan
    Write-Host "   - QUICK_FIX_TH.md (Thai guide)" -ForegroundColor White
    Write-Host "   - FIX_404_REFRESH.md (English guide)" -ForegroundColor White
    Write-Host ""
}

Write-Host "Pro Tips:" -ForegroundColor Magenta
Write-Host "   Service Type MUST be 'Static Site'" -ForegroundColor White
Write-Host "   Rewrite Rule: /* -> /index.html" -ForegroundColor White
Write-Host "   Build Command: npm install && npm run build" -ForegroundColor White
Write-Host "   Publish Directory: dist" -ForegroundColor White
Write-Host ""

if (Test-Path "dist") {
    Write-Host "Build directory (dist) exists:" -ForegroundColor Green
    Get-ChildItem dist -Name | ForEach-Object { Write-Host "   - $_" -ForegroundColor Gray }
    Write-Host ""
}
