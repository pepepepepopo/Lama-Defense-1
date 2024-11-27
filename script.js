// Tower class (updated shoot method)
class Tower {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.range = 100;
        this.cooldown = 0;
        this.type = type;
    }

    draw() {
        if (this.type === 'minigun') {
            ctx.fillStyle = 'gray';
            ctx.fillRect(this.x - 20, this.y - 20, 40, 40);
            ctx.fillStyle = 'white';
            ctx.font = '18px Arial';
            ctx.fillText('MG', this.x - 10, this.y + 7);
        } else if (this.type === 'freeze') {
            ctx.fillStyle = 'lightblue';
            ctx.fillRect(this.x - 20, this.y - 20, 40, 40);
            ctx.fillStyle = 'white';
            ctx.font = '18px Arial';
            ctx.fillText('FR', this.x - 10, this.y + 7);
        } else if (this.type === 'camo') {
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x - 20, this.y - 20, 40, 40);
            ctx.fillStyle = 'white';
            ctx.font = '18px Arial';
            ctx.fillText('CM', this.x - 10, this.y + 7);
        } else {
            ctx.fillStyle = 'brown';
            ctx.fillRect(this.x - 20, this.y - 20, 40, 40);
            ctx.fillStyle = 'white';
            ctx.font = '18px Arial';
            ctx.fillText('L', this.x - 7, this.y + 7);
        }
    }

    update() {
        if (this.cooldown > 0) this.cooldown--;
        else {
            for (let enemy of enemies) {
                const dx = enemy.x - this.x;
                const dy = enemy.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.range) {
                    this.shoot(enemy);
                    this.cooldown = 10; // Faster cooldown
                    break;
                }
            }
        }
    }

    shoot(target) {
        if (this.type === 'minigun') {
            target.health -= 5; // Minigun does less damage per shot
        } else if (this.type === 'freeze') {
            target.speed = 0.5; // Freeze ray slows down the enemy
        } else if (this.type === 'camo' && target.type === 'camo') {
            target.health -= 10; // Camo tower can only shoot camo enemies
        } else if (this.type === 'standard') {
            target.health -= 10;
        }

        if (target.health <= 0) {
            killCount++;
            if (target.type === 'blue') {
                money += 70; // Reward for killing blue enemy
            } else if (target.type === 'red') {
                money += 300; // Reward for killing red enemy
            } else if (target.type === 'camo') {
                money += 100; // Reward for killing camo enemy
            }
            const index = enemies.indexOf(target);
            enemies.splice(index, 1);

            // Update counters
            document.getElementById('money-counter').textContent = 'Money: $' + money;
            document.getElementById('kill-counter').textContent = 'Kills: ' + killCount;

            // Spawn a red enemy every 100 kills
            if (killCount % 100 === 0) {
                spawnRedEnemy();
            }

            // Spawn more enemies every 25 kills
            if (killCount % 25 === 0) {
                spawnMoreEnemies();
            }
        }
    }
}

// Function to spawn more enemies based on kill count
function spawnMoreEnemies() {
    const additionalEnemies = Math.floor(killCount / 25);
    for (let i = 0; i < additionalEnemies; i++) {
        // Spawn a new blue enemy for simplicity
        const speed = 2 + (additionalEnemies * 0.5); // Increase speed with more enemies
        enemies.push(new Enemy(0, Math.random() * canvas.height, 50, speed, 'blue'));
    }
}

// Adjust game loop to reflect changes if needed
function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '48px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 120, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let tower of towers) {
        tower.update();
        tower.draw();
    }

    for (let enemy of enemies) {
        enemy.update();
        enemy.draw();
    }

    requestAnimationFrame(gameLoop);
}

// Call the game loop to start the game
gameLoop();
