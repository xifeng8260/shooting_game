# 启用 GitHub Pages - 最后一步

## ✅ 已完成

1. ✅ 代码已推送到 GitHub
2. ✅ GitHub Actions workflow 已创建并推送
3. ✅ 自动部署配置已完成

## 🚀 现在需要手动启用 Pages（只需一次）

由于 GitHub Pages 的设置需要在网页界面操作，请按照以下步骤：

### 方法一：通过网页设置（推荐）

1. **访问设置页面**
   ```
   https://github.com/xifeng8260/shooting_game/settings/pages
   ```

2. **配置 Pages**
   - 在 **Build and deployment** 部分：
     - Source 选择：**GitHub Actions**
   - 点击 **Save**

3. **等待部署**
   - GitHub Actions 会自动开始部署
   - 等待 1-2 分钟
   - 部署完成后，访问：
     ```
     https://xifeng8260.github.io/shooting_game/
     ```

### 方法二：使用 GitHub CLI（如果已安装）

如果你安装了 GitHub CLI，可以运行：

```powershell
gh api repos/xifeng8260/shooting_game/pages -X POST -f source[branch]=main -f source[path]=/
```

## 📋 快速链接

- **仓库**：https://github.com/xifeng8260/shooting_game
- **Pages 设置**：https://github.com/xifeng8260/shooting_game/settings/pages
- **Actions 状态**：https://github.com/xifeng8260/shooting_game/actions
- **游戏地址**（设置后）：https://xifeng8260.github.io/shooting_game/

## ⚡ 自动部署说明

我已经创建了 GitHub Actions workflow，它会：
- ✅ 每次推送到 main 分支时自动部署
- ✅ 自动更新网站内容
- ✅ 无需手动操作

## 🎯 操作步骤总结

1. 访问：https://github.com/xifeng8260/shooting_game/settings/pages
2. Source 选择：**GitHub Actions**
3. 点击 **Save**
4. 等待部署完成（1-2分钟）
5. 访问游戏：https://xifeng8260.github.io/shooting_game/

就这么简单！🎉
