// 射击游戏 - 完整实现
// 手枪射击游戏，8发子弹，虚拟对手，每人10滴血

class ShootingGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // 游戏配置（可设置）
        this.config = {
            maxAmmo: 8,        // 最大子弹数
            bulletSpeed: 8      // 子弹飞行速度
        };
        
        // 玩家属性
        this.player = {
            x: 100,
            y: this.canvas.height / 2,
            width: 40,
            height: 60,
            health: 10,
            maxHealth: 10,
            ammo: this.config.maxAmmo,
            maxAmmo: this.config.maxAmmo,
            speed: 5, // 移动速度
            moveDirection: {x: 0, y: 0} // 移动方向
        };
        
        // 键盘状态
        this.keys = {};
        
        // 对手属性
        this.enemy = {
            x: this.canvas.width - 150,
            y: this.canvas.height / 2,
            width: 40,
            height: 60,
            health: 10,
            maxHealth: 10,
            speed: 2,
            moveDirection: 1, // 1 = 向下, -1 = 向上
            lastShot: 0,
            shootInterval: 2000 // 2秒射击一次
        };
        
        // 子弹数组
        this.bullets = [];
        this.enemyBullets = [];
        
        // 游戏状态
        this.gameRunning = false;
        this.gameOver = false;
        this.winner = null;
        
        // 瞄准位置
        this.aimX = 0;
        this.aimY = 0;
        
        // 绑定事件
        this.bindEvents();
        this.updateDisplay();
        this.draw();
    }
    
    // 绑定事件
    bindEvents() {
        // 鼠标移动 - 更新瞄准位置
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.aimX = e.clientX - rect.left;
            this.aimY = e.clientY - rect.top;
        });
        
        // 键盘按下事件
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            // 空格键射击
            if (e.key === ' ' && this.gameRunning && !this.gameOver) {
                e.preventDefault();
                this.shoot();
            }
        });
        
        // 键盘释放事件
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // 按钮事件
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('reloadBtn').addEventListener('click', () => this.reload());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('restartBtn').addEventListener('click', () => {
            document.getElementById('gameOver').classList.add('hidden');
            this.reset();
            this.start();
        });
        
        // 设置面板事件
        this.bindSettingsEvents();
    }
    
    // 绑定设置面板事件
    bindSettingsEvents() {
        const ammoInput = document.getElementById('ammoSetting');
        const speedSlider = document.getElementById('bulletSpeedSetting');
        const ammoValue = document.getElementById('ammoValue');
        const speedValue = document.getElementById('speedValue');
        const applyBtn = document.getElementById('applySettingsBtn');
        
        // 子弹数量输入实时更新
        ammoInput.addEventListener('input', (e) => {
            ammoValue.textContent = e.target.value;
        });
        
        // 子弹速度滑块实时更新
        speedSlider.addEventListener('input', (e) => {
            speedValue.textContent = e.target.value;
        });
        
        // 应用设置按钮
        applyBtn.addEventListener('click', () => {
            this.applySettings();
        });
        
        // 初始化显示
        ammoValue.textContent = ammoInput.value;
        speedValue.textContent = speedSlider.value;
    }
    
    // 应用设置
    applySettings() {
        const ammoInput = document.getElementById('ammoSetting');
        const speedSlider = document.getElementById('bulletSpeedSetting');
        
        const newAmmo = parseInt(ammoInput.value);
        const newSpeed = parseInt(speedSlider.value);
        
        if (newAmmo > 0 && newSpeed > 0) {
            this.config.maxAmmo = newAmmo;
            this.config.bulletSpeed = newSpeed;
            
            // 如果游戏未运行，更新玩家子弹数
            if (!this.gameRunning) {
                this.player.maxAmmo = newAmmo;
                this.player.ammo = newAmmo;
            }
            
            // 更新显示
            document.getElementById('ammoDisplay').textContent = newAmmo;
            this.updateDisplay();
            
            alert(`设置已应用！\n子弹数量: ${newAmmo}\n子弹速度: ${newSpeed}`);
        }
    }
    
    // 更新玩家移动
    updatePlayerMovement() {
        // 重置移动方向
        this.player.moveDirection.x = 0;
        this.player.moveDirection.y = 0;
        
        // WASD键控制
        if (this.keys['w'] || this.keys['W']) {
            this.player.moveDirection.y = -1;
        }
        if (this.keys['s'] || this.keys['S']) {
            this.player.moveDirection.y = 1;
        }
        if (this.keys['a'] || this.keys['A']) {
            this.player.moveDirection.x = -1;
        }
        if (this.keys['d'] || this.keys['D']) {
            this.player.moveDirection.x = 1;
        }
        
        // 对角线移动时速度归一化
        if (this.player.moveDirection.x !== 0 && this.player.moveDirection.y !== 0) {
            this.player.moveDirection.x *= 0.707; // 1/√2
            this.player.moveDirection.y *= 0.707;
        }
        
        // 更新玩家位置
        const newX = this.player.x + this.player.moveDirection.x * this.player.speed;
        const newY = this.player.y + this.player.moveDirection.y * this.player.speed;
        
        // 边界检测
        if (newX >= 0 && newX <= this.canvas.width - this.player.width) {
            this.player.x = newX;
        }
        if (newY >= 0 && newY <= this.canvas.height - this.player.height) {
            this.player.y = newY;
        }
    }
    
    // 玩家射击
    shoot() {
        if (this.player.ammo <= 0) {
            alert('没有子弹了！点击"重新装弹"按钮装弹');
            return;
        }
        
        // 计算子弹方向（从玩家位置到瞄准点）
        const dx = this.aimX - (this.player.x + this.player.width / 2);
        const dy = this.aimY - (this.player.y + this.player.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = this.config.bulletSpeed; // 使用可配置的速度
        
        this.bullets.push({
            x: this.player.x + this.player.width / 2,
            y: this.player.y + this.player.height / 2,
            vx: (dx / distance) * speed,
            vy: (dy / distance) * speed,
            radius: 5
        });
        
        this.player.ammo--;
        this.updateDisplay();
    }
    
    // 对手射击
    enemyShoot() {
        const now = Date.now();
        if (now - this.enemy.lastShot < this.enemy.shootInterval) {
            return;
        }
        
        // 对手瞄准玩家
        const dx = (this.player.x + this.player.width / 2) - (this.enemy.x + this.enemy.width / 2);
        const dy = (this.player.y + this.player.height / 2) - (this.enemy.y + this.enemy.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 6;
        
        this.enemyBullets.push({
            x: this.enemy.x + this.enemy.width / 2,
            y: this.enemy.y + this.enemy.height / 2,
            vx: (dx / distance) * speed,
            vy: (dy / distance) * speed,
            radius: 5
        });
        
        this.enemy.lastShot = now;
    }
    
    // 重新装弹
    reload() {
        if (this.gameRunning && !this.gameOver) {
            this.player.ammo = this.config.maxAmmo;
            this.player.maxAmmo = this.config.maxAmmo;
            this.updateDisplay();
        }
    }
    
    // 更新游戏状态
    update() {
        if (!this.gameRunning || this.gameOver) return;
        
        // 更新玩家移动（WASD控制）
        this.updatePlayerMovement();
        
        // 更新对手移动（上下移动）
        this.enemy.y += this.enemy.speed * this.enemy.moveDirection;
        
        // 边界反弹
        if (this.enemy.y <= 0 || this.enemy.y >= this.canvas.height - this.enemy.height) {
            this.enemy.moveDirection *= -1;
        }
        
        // 对手射击
        this.enemyShoot();
        
        // 更新玩家子弹
        this.bullets.forEach((bullet, index) => {
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            
            // 检查子弹是否击中对手
            if (this.checkBulletHit(bullet, this.enemy)) {
                this.enemy.health -= 2;
                this.bullets.splice(index, 1);
                this.updateDisplay();
                this.checkGameOver();
                return;
            }
            
            // 移除超出屏幕的子弹
            if (bullet.x < 0 || bullet.x > this.canvas.width ||
                bullet.y < 0 || bullet.y > this.canvas.height) {
                this.bullets.splice(index, 1);
            }
        });
        
        // 更新对手子弹
        this.enemyBullets.forEach((bullet, index) => {
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            
            // 检查子弹是否击中玩家
            if (this.checkBulletHit(bullet, this.player)) {
                this.player.health -= 2;
                this.enemyBullets.splice(index, 1);
                this.updateDisplay();
                this.checkGameOver();
                return;
            }
            
            // 移除超出屏幕的子弹
            if (bullet.x < 0 || bullet.x > this.canvas.width ||
                bullet.y < 0 || bullet.y > this.canvas.height) {
                this.enemyBullets.splice(index, 1);
            }
        });
    }
    
    // 检查子弹是否击中目标
    checkBulletHit(bullet, target) {
        return bullet.x >= target.x &&
               bullet.x <= target.x + target.width &&
               bullet.y >= target.y &&
               bullet.y <= target.y + target.height;
    }
    
    // 检查游戏是否结束
    checkGameOver() {
        if (this.player.health <= 0) {
            this.gameOver = true;
            this.winner = 'enemy';
            this.showGameOver('你被击败了！', '对手获胜！');
        } else if (this.enemy.health <= 0) {
            this.gameOver = true;
            this.winner = 'player';
            this.showGameOver('恭喜！', '你击败了对手！');
        }
    }
    
    // 显示游戏结束界面
    showGameOver(title, message) {
        document.getElementById('gameOverTitle').textContent = title;
        document.getElementById('gameOverMessage').textContent = message;
        document.getElementById('gameOver').classList.remove('hidden');
    }
    
    // 绘制游戏画面
    draw() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制背景网格（可选）
        this.drawGrid();
        
        // 绘制玩家
        this.drawPlayer();
        
        // 绘制对手
        this.drawEnemy();
        
        // 绘制子弹
        this.bullets.forEach(bullet => this.drawBullet(bullet, '#ff6b6b'));
        this.enemyBullets.forEach(bullet => this.drawBullet(bullet, '#4ecdc4'));
        
        // 绘制瞄准线（从玩家到鼠标位置）
        if (this.gameRunning && !this.gameOver) {
            this.drawAimLine();
        }
        
        // 绘制血量条（在角色上方）
        this.drawHealthBars();
    }
    
    // 绘制背景网格
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        const gridSize = 50;
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    // 绘制玩家
    drawPlayer() {
        // 玩家身体（蓝色）
        this.ctx.fillStyle = '#3498db';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // 玩家轮廓
        this.ctx.strokeStyle = '#2980b9';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // 玩家头部
        this.ctx.fillStyle = '#ecf0f1';
        this.ctx.fillRect(this.player.x + 10, this.player.y + 5, 20, 20);
        
        // 手枪（简单绘制）
        this.ctx.fillStyle = '#34495e';
        this.ctx.fillRect(this.player.x + this.player.width, this.player.y + 20, 15, 8);
    }
    
    // 绘制对手
    drawEnemy() {
        // 对手身体（红色）
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillRect(this.enemy.x, this.enemy.y, this.enemy.width, this.enemy.height);
        
        // 对手轮廓
        this.ctx.strokeStyle = '#c0392b';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.enemy.x, this.enemy.y, this.enemy.width, this.enemy.height);
        
        // 对手头部
        this.ctx.fillStyle = '#ecf0f1';
        this.ctx.fillRect(this.enemy.x + 10, this.enemy.y + 5, 20, 20);
        
        // 对手手枪
        this.ctx.fillStyle = '#34495e';
        this.ctx.fillRect(this.enemy.x - 15, this.enemy.y + 20, 15, 8);
    }
    
    // 绘制子弹
    drawBullet(bullet, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 子弹光晕效果
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = color;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }
    
    // 绘制瞄准线
    drawAimLine() {
        const startX = this.player.x + this.player.width / 2;
        const startY = this.player.y + this.player.height / 2;
        
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(this.aimX, this.aimY);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // 瞄准点
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.6)';
        this.ctx.beginPath();
        this.ctx.arc(this.aimX, this.aimY, 8, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    // 绘制血量条（在角色上方）
    drawHealthBars() {
        // 玩家血量条
        const playerBarWidth = this.player.width;
        const playerBarHeight = 6;
        const playerBarX = this.player.x;
        const playerBarY = this.player.y - 15;
        
        this.ctx.fillStyle = '#e0e0e0';
        this.ctx.fillRect(playerBarX, playerBarY, playerBarWidth, playerBarHeight);
        
        const playerHealthPercent = this.player.health / this.player.maxHealth;
        this.ctx.fillStyle = '#27ae60';
        this.ctx.fillRect(playerBarX, playerBarY, playerBarWidth * playerHealthPercent, playerBarHeight);
        
        // 对手血量条
        const enemyBarWidth = this.enemy.width;
        const enemyBarHeight = 6;
        const enemyBarX = this.enemy.x;
        const enemyBarY = this.enemy.y - 15;
        
        this.ctx.fillStyle = '#e0e0e0';
        this.ctx.fillRect(enemyBarX, enemyBarY, enemyBarWidth, enemyBarHeight);
        
        const enemyHealthPercent = this.enemy.health / this.enemy.maxHealth;
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillRect(enemyBarX, enemyBarY, enemyBarWidth * enemyHealthPercent, enemyBarHeight);
    }
    
    // 游戏主循环
    gameLoop() {
        if (this.gameRunning) {
            this.update();
            this.draw();
            requestAnimationFrame(() => this.gameLoop());
        }
    }
    
    // 开始游戏
    start() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.gameOver = false;
            this.gameLoop();
        }
    }
    
    // 重置游戏
    reset() {
        this.player.health = this.player.maxHealth;
        this.player.maxAmmo = this.config.maxAmmo;
        this.player.ammo = this.config.maxAmmo;
        this.player.x = 100;
        this.player.y = this.canvas.height / 2;
        this.player.moveDirection = {x: 0, y: 0};
        this.enemy.health = this.enemy.maxHealth;
        this.enemy.x = this.canvas.width - 150;
        this.enemy.y = this.canvas.height / 2;
        this.bullets = [];
        this.enemyBullets = [];
        this.keys = {}; // 重置键盘状态
        this.gameRunning = false;
        this.gameOver = false;
        this.winner = null;
        this.updateDisplay();
        this.draw();
    }
    
    // 更新显示
    updateDisplay() {
        // 更新血量显示
        document.getElementById('playerHealth').textContent = 
            `${this.player.health} / ${this.player.maxHealth}`;
        document.getElementById('enemyHealth').textContent = 
            `${this.enemy.health} / ${this.enemy.maxHealth}`;
        
        // 更新血量条
        const playerHealthPercent = (this.player.health / this.player.maxHealth) * 100;
        document.getElementById('playerHealthBar').style.width = `${playerHealthPercent}%`;
        
        const enemyHealthPercent = (this.enemy.health / this.enemy.maxHealth) * 100;
        document.getElementById('enemyHealthBar').style.width = `${enemyHealthPercent}%`;
        
        // 更新子弹数
        document.getElementById('ammoCount').textContent = 
            `${this.player.ammo} / ${this.player.maxAmmo}`;
        
        // 更新重新装弹按钮文本
        document.getElementById('reloadBtn').textContent = 
            `重新装弹 (${this.config.maxAmmo}发)`;
        
        // 子弹数颜色提示
        const ammoElement = document.getElementById('ammoCount');
        if (this.player.ammo === 0) {
            ammoElement.style.color = '#e74c3c';
        } else if (this.player.ammo <= Math.floor(this.player.maxAmmo / 3)) {
            ammoElement.style.color = '#f39c12';
        } else {
            ammoElement.style.color = '#667eea';
        }
    }
}

// 初始化游戏
window.addEventListener('DOMContentLoaded', () => {
    const game = new ShootingGame('gameCanvas');
});
