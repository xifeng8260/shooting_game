# 游戏发布指南

这个游戏是纯 HTML/CSS/JavaScript 实现，可以直接部署到任何静态网站托管服务。

## 发布方式

### 方式一：GitHub Pages（推荐，免费）

#### 步骤：

1. **创建 GitHub 仓库**
   - 访问 https://github.com
   - 点击右上角 "+" → "New repository"
   - 仓库名：`shooting-game`（或其他名字）
   - 选择 Public（公开）
   - 点击 "Create repository"

2. **上传游戏文件**
   ```bash
   # 在游戏目录下执行
   git init
   git add .
   git commit -m "Initial commit: 射击游戏"
   git branch -M main
   git remote add origin https://github.com/你的用户名/shooting-game.git
   git push -u origin main
   ```

   或者使用 GitHub Desktop：
   - 下载 GitHub Desktop
   - File → Add Local Repository
   - 选择游戏文件夹
   - 点击 "Publish repository"

3. **启用 GitHub Pages**
   - 进入仓库页面
   - 点击 Settings（设置）
   - 左侧菜单找到 Pages
   - Source 选择 "main" 分支
   - 点击 Save
   - 等待几分钟，会显示你的网站地址：
     `https://你的用户名.github.io/shooting-game/`

#### 优点：
- ✅ 完全免费
- ✅ 自动 HTTPS
- ✅ 简单易用
- ✅ 可以绑定自定义域名

---

### 方式二：Netlify（最简单，推荐）

#### 步骤：

1. **访问 Netlify**
   - 访问 https://www.netlify.com
   - 使用 GitHub 账号登录（或注册）

2. **部署**
   - 点击 "Add new site" → "Deploy manually"
   - 直接将整个 `shooting-game` 文件夹拖拽到页面
   - 等待上传完成
   - 自动获得一个网址：`https://随机名字.netlify.app`

3. **自定义域名（可选）**
   - 在 Site settings → Domain management
   - 可以修改为自定义名字

#### 优点：
- ✅ 最简单，拖拽即可
- ✅ 完全免费
- ✅ 自动 HTTPS
- ✅ 可以绑定自定义域名
- ✅ 支持持续部署（连接 GitHub 后自动更新）

---

### 方式三：Vercel（快速，推荐）

#### 步骤：

1. **访问 Vercel**
   - 访问 https://vercel.com
   - 使用 GitHub 账号登录

2. **部署**
   - 点击 "Add New Project"
   - 选择 GitHub 仓库（需要先上传到 GitHub）
   - 或者使用 Vercel CLI：
     ```bash
     npm i -g vercel
     cd shooting-game
     vercel
     ```

#### 优点：
- ✅ 快速部署
- ✅ 完全免费
- ✅ 自动 HTTPS
- ✅ 全球 CDN 加速

---

### 方式四：直接分享文件

如果只是临时分享给朋友：

1. **压缩文件**
   - 将整个 `shooting-game` 文件夹压缩成 ZIP
   - 发送给朋友

2. **朋友打开方式**
   - 解压文件
   - 双击 `index.html` 即可在浏览器中打开

---

## 快速部署脚本

### 使用 PowerShell（Windows）

创建 `deploy.ps1` 文件：

```powershell
# 部署到 GitHub Pages 的快速脚本

Write-Host "准备部署游戏到 GitHub Pages..." -ForegroundColor Green

# 检查是否已初始化 git
if (-not (Test-Path .git)) {
    Write-Host "初始化 Git 仓库..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit: 射击游戏"
    Write-Host "请先创建 GitHub 仓库，然后运行以下命令：" -ForegroundColor Cyan
    Write-Host "git remote add origin https://github.com/你的用户名/仓库名.git" -ForegroundColor Cyan
    Write-Host "git push -u origin main" -ForegroundColor Cyan
} else {
    Write-Host "提交更改..." -ForegroundColor Yellow
    git add .
    git commit -m "Update game files"
    git push
    Write-Host "部署完成！" -ForegroundColor Green
}
```

### 使用 Bash（Linux/Mac）

创建 `deploy.sh` 文件：

```bash
#!/bin/bash
echo "准备部署游戏到 GitHub Pages..."

if [ ! -d .git ]; then
    echo "初始化 Git 仓库..."
    git init
    git add .
    git commit -m "Initial commit: 射击游戏"
    echo "请先创建 GitHub 仓库，然后运行："
    echo "git remote add origin https://github.com/你的用户名/仓库名.git"
    echo "git push -u origin main"
else
    echo "提交更改..."
    git add .
    git commit -m "Update game files"
    git push
    echo "部署完成！"
fi
```

---

## 部署检查清单

部署前确保：

- [ ] 所有文件都在 `shooting-game` 文件夹中
- [ ] `index.html` 是主文件
- [ ] `game.js` 和 `style.css` 文件存在
- [ ] 在本地浏览器测试游戏可以正常运行
- [ ] 没有使用本地文件路径（如 `file://`）

---

## 推荐方案对比

| 方案 | 难度 | 速度 | 免费 | 推荐度 |
|------|------|------|------|--------|
| **Netlify** | ⭐ 最简单 | ⚡ 最快 | ✅ | ⭐⭐⭐⭐⭐ |
| **GitHub Pages** | ⭐⭐ 简单 | ⚡ 快 | ✅ | ⭐⭐⭐⭐ |
| **Vercel** | ⭐⭐ 简单 | ⚡ 快 | ✅ | ⭐⭐⭐⭐ |
| **直接分享** | ⭐ 最简单 | ⚡ 最快 | ✅ | ⭐⭐⭐ |

---

## 推荐：使用 Netlify（最简单）

**最快的方式：**

1. 访问 https://app.netlify.com/drop
2. 直接将 `shooting-game` 文件夹拖拽到页面
3. 等待上传完成
4. 获得网址，分享给朋友！

**就这么简单！** 🎉

---

## 自定义域名（可选）

如果你有自己的域名：

1. **GitHub Pages**：
   - Settings → Pages → Custom domain
   - 输入你的域名
   - 按照提示配置 DNS

2. **Netlify**：
   - Site settings → Domain management
   - Add custom domain
   - 按照提示配置 DNS

---

## 常见问题

**Q: 部署后游戏无法运行？**
- 检查浏览器控制台是否有错误（F12）
- 确保所有文件路径正确（使用相对路径）

**Q: 如何更新游戏？**
- GitHub Pages：推送新代码到仓库即可自动更新
- Netlify：重新拖拽文件夹或连接 GitHub 自动部署

**Q: 可以离线玩吗？**
- 可以！下载整个文件夹，双击 `index.html` 即可

---

## 分享链接示例

部署完成后，你会得到类似这样的链接：

- GitHub Pages: `https://你的用户名.github.io/shooting-game/`
- Netlify: `https://shooting-game-123.netlify.app`
- Vercel: `https://shooting-game.vercel.app`

直接分享这个链接，任何人都可以在浏览器中打开游戏！
