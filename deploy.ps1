# 快速部署脚本 - PowerShell版本
# 用于快速部署游戏到 GitHub Pages

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  射击游戏部署脚本" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查当前目录
$currentDir = Get-Location
Write-Host "当前目录: $currentDir" -ForegroundColor Yellow

# 检查必要文件
$requiredFiles = @("index.html", "game.js", "style.css")
$missingFiles = @()

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "错误：缺少以下文件：" -ForegroundColor Red
    $missingFiles | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    exit 1
}

Write-Host "✓ 所有必要文件都存在" -ForegroundColor Green
Write-Host ""

# 检查 Git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "错误：未安装 Git" -ForegroundColor Red
    Write-Host "请先安装 Git: https://git-scm.com/downloads" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Git 已安装" -ForegroundColor Green
Write-Host ""

# 检查是否已初始化 Git 仓库
if (-not (Test-Path .git)) {
    Write-Host "初始化 Git 仓库..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit: 射击游戏"
    Write-Host "✓ Git 仓库已初始化" -ForegroundColor Green
    Write-Host ""
    Write-Host "下一步：" -ForegroundColor Cyan
    Write-Host "1. 访问 https://github.com 创建新仓库" -ForegroundColor White
    Write-Host "2. 运行以下命令连接远程仓库：" -ForegroundColor White
    Write-Host "   git remote add origin https://github.com/你的用户名/仓库名.git" -ForegroundColor Yellow
    Write-Host "   git branch -M main" -ForegroundColor Yellow
    Write-Host "   git push -u origin main" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "3. 在 GitHub 仓库设置中启用 Pages：" -ForegroundColor White
    Write-Host "   Settings → Pages → Source: main → Save" -ForegroundColor Yellow
} else {
    Write-Host "检测到已有 Git 仓库" -ForegroundColor Yellow
    
    # 检查是否有未提交的更改
    $status = git status --porcelain
    if ($status) {
        Write-Host "发现未提交的更改，正在提交..." -ForegroundColor Yellow
        git add .
        $commitMessage = Read-Host "输入提交信息（直接回车使用默认）"
        if ([string]::IsNullOrWhiteSpace($commitMessage)) {
            $commitMessage = "Update game files"
        }
        git commit -m $commitMessage
        Write-Host "✓ 更改已提交" -ForegroundColor Green
    }
    
    # 检查是否有远程仓库
    $remote = git remote -v
    if ($remote) {
        Write-Host "发现远程仓库：" -ForegroundColor Yellow
        Write-Host $remote -ForegroundColor White
        Write-Host ""
        
        $push = Read-Host "是否推送到远程仓库？(Y/N)"
        if ($push -eq 'Y' -or $push -eq 'y') {
            git push
            Write-Host "✓ 已推送到远程仓库" -ForegroundColor Green
            Write-Host ""
            Write-Host "如果已启用 GitHub Pages，游戏会自动更新！" -ForegroundColor Cyan
        }
    } else {
        Write-Host "未发现远程仓库" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "添加远程仓库：" -ForegroundColor Cyan
        Write-Host "git remote add origin https://github.com/你的用户名/仓库名.git" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  部署完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "其他部署方式：" -ForegroundColor Cyan
Write-Host "• Netlify: https://app.netlify.com/drop (拖拽文件夹即可)" -ForegroundColor White
Write-Host "• Vercel: https://vercel.com (连接 GitHub 仓库)" -ForegroundColor White
Write-Host ""
