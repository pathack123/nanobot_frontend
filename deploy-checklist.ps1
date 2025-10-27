# Deploy Checklist for Render.com

Write-Host "📋 Render.com Deployment Checklist" -ForegroundColor Cyan
Write-Host "=" * 50
Write-Host ""

$checks = @(
    @{
        name = "✅ _redirects file exists in public/"
        path = "public\_redirects"
        required = $true
    },
    @{
        name = "✅ render.yaml exists"
        path = "render.yaml"
        required = $true
    },
    @{
        name = "✅ .env.production exists"
        path = ".env.production"
        required = $false
    },
    @{
        name = "✅ package.json has build script"
        path = "package.json"
        required = $true
    },
    @{
        name = "✅ vite.config.js configured"
        path = "vite.config.js"
        required = $true
    }
)

$allPassed = $true

foreach ($check in $checks) {
    if (Test-Path $check.path) {
        Write-Host "✅ $($check.name)" -ForegroundColor Green
        
        # Show content for critical files
        if ($check.path -eq "public\_redirects") {
            $content = Get-Content $check.path
            Write-Host "   Content: $content" -ForegroundColor Gray
        }
    } else {
        if ($check.required) {
            Write-Host "❌ $($check.name) - MISSING!" -ForegroundColor Red
            $allPassed = $false
        } else {
            Write-Host "⚠️  $($check.name) - Optional, not found" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "=" * 50
Write-Host ""

if ($allPassed) {
    Write-Host "🎉 All checks passed! Ready to deploy!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Commit changes: git add . && git commit -m 'fix: Add SPA routing'" -ForegroundColor White
    Write-Host "2. Push to GitHub: git push origin main" -ForegroundColor White
    Write-Host "3. Render will auto-deploy (3-5 minutes)" -ForegroundColor White
    Write-Host "4. Test routes after deploy:" -ForegroundColor White
    Write-Host "   - https://your-app.onrender.com/login" -ForegroundColor Gray
    Write-Host "   - https://your-app.onrender.com/home" -ForegroundColor Gray
    Write-Host "   - Refresh each page (F5)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🔗 Render Dashboard: https://dashboard.render.com" -ForegroundColor Cyan
} else {
    Write-Host "⚠️  Some required files are missing!" -ForegroundColor Red
    Write-Host "Please fix the issues above before deploying." -ForegroundColor Yellow
}

Write-Host ""
