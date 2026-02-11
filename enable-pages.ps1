# 通过 GitHub API 启用 Pages 的脚本
# 需要 GitHub Personal Access Token

param(
    [Parameter(Mandatory=$false)]
    [string]$Token = ""
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  启用 GitHub Pages" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ([string]::IsNullOrWhiteSpace($Token)) {
    Write-Host "请输入你的 GitHub Personal Access Token：" -ForegroundColor Yellow
    Write-Host "（如果没有，请访问 https://github.com/settings/tokens 创建）" -ForegroundColor Gray
    Write-Host ""
    $Token = Read-Host "Token" -AsSecureString
    $Token = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($Token)
    )
}

if ([string]::IsNullOrWhiteSpace($Token)) {
    Write-Host "错误：Token 不能为空" -ForegroundColor Red
    exit 1
}

$owner = "xifeng8260"
$repo = "shooting_game"
$apiUrl = "https://api.github.com/repos/$owner/$repo/pages"

Write-Host "正在启用 GitHub Pages..." -ForegroundColor Yellow

try {
    $body = @{
        source = @{
            branch = "main"
            path = "/"
        }
    } | ConvertTo-Json

    $headers = @{
        "Accept" = "application/vnd.github+json"
        "Authorization" = "Bearer $Token"
        "X-GitHub-Api-Version" = "2022-11-28"
    }

    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Headers $headers -Body $body -ContentType "application/json"
    
    Write-Host ""
    Write-Host "✓ GitHub Pages 已启用！" -ForegroundColor Green
    Write-Host ""
    Write-Host "游戏地址：" -ForegroundColor Cyan
    Write-Host "https://$owner.github.io/$repo/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "等待 1-2 分钟让 GitHub 完成部署..." -ForegroundColor Gray
    
} catch {
    Write-Host ""
    Write-Host "错误：" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response.StatusCode -eq 422) {
        Write-Host ""
        Write-Host "提示：Pages 可能已经启用，或者需要先手动在网页上设置一次" -ForegroundColor Yellow
        Write-Host "请访问：https://github.com/$owner/$repo/settings/pages" -ForegroundColor Cyan
    }
    
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
