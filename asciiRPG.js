// DwarfFortress風アスキーアートRPGマップアニメーション
class AsciiRPGMap {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.mapWidth = 120;
        this.mapHeight = 60;
        this.cellSize = 12;
        this.map = [];
        this.characters = [];
        this.animationFrame = 0;
        this.lastTime = 0;
        
        // 地形タイプ
        this.TERRAIN = {
            DEEP_WATER: { char: '≈', color: '#0066cc', bg: '#004499' },
            SHALLOW_WATER: { char: '~', color: '#3388dd', bg: '#0066cc' },
            RIVER: { char: '~', color: '#4499ee', bg: '#0077dd' },
            SAND: { char: '.', color: '#ddcc99', bg: '#ccbb88' },
            GRASS: { char: '"', color: '#66aa33', bg: '#559922' },
            FOREST: { char: '♠', color: '#225511', bg: '#559922' },
            MOUNTAIN: { char: '▲', color: '#888888', bg: '#666666' },
            HILL: { char: '∩', color: '#aa9966', bg: '#998855' },
            TOWN: { char: '■', color: '#8B4513', bg: '#A0522D' },
            ROAD: { char: '═', color: '#996633', bg: '#559922' }
        };
        
        // キャラクタータイプ
        this.CHARACTER_TYPES = [
            { char: '@', color: '#ffff00', name: 'Player' },
            { char: 'D', color: '#8B4513', name: 'Dwarf' },
            { char: 'E', color: '#90EE90', name: 'Elf' },
            { char: 'H', color: '#DEB887', name: 'Human' },
            { char: 'O', color: '#654321', name: 'Orc' },
            { char: 'G', color: '#32CD32', name: 'Goblin' },
            { char: 'T', color: '#228B22', name: 'Troll' },
            { char: 'K', color: '#FFD700', name: 'Knight' },
            { char: 'W', color: '#4169E1', name: 'Wizard' },
            { char: 'R', color: '#DC143C', name: 'Rogue' }
        ];
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.generateMap();
        this.spawnCharacters();
        this.animate();
    }
    
    createCanvas() {
        // 既存のcanvas要素を使用
        this.canvas = document.getElementById('asciiBg');
        if (!this.canvas) {
            console.error('Canvas element with id "asciiBg" not found');
            return;
        }
        
        this.canvas.width = this.mapWidth * this.cellSize;
        this.canvas.height = this.mapHeight * this.cellSize;
        
        this.ctx = this.canvas.getContext('2d');
        this.ctx.font = `${this.cellSize - 2}px monospace`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
    }
    
    generateMap() {
        // マップを初期化（海で埋める）
        this.map = Array(this.mapHeight).fill().map(() => 
            Array(this.mapWidth).fill(this.TERRAIN.DEEP_WATER)
        );
        
        // 大陸を生成
        this.generateContinents();
        
        // 川を生成
        this.generateRivers();
        
        // 詳細地形を生成
        this.generateDetailedTerrain();
        
        // 街や道を生成
        this.generateCivilization();
    }
    
    generateContinents() {
        const numContinents = Math.random() * 2 + 2;
        
        for (let i = 0; i < numContinents; i++) {
            const centerX = Math.random() * (this.mapWidth - 20) + 10;
            const centerY = Math.random() * (this.mapHeight - 20) + 10;
            const size = Math.random() * 15 + 10;
            
            this.generateContinent(centerX, centerY, size);
        }
    }
    
    generateContinent(centerX, centerY, size) {
        for (let y = Math.max(0, centerY - size); y < Math.min(this.mapHeight, centerY + size); y++) {
            for (let x = Math.max(0, centerX - size); x < Math.min(this.mapWidth, centerX + size); x++) {
                const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                const noise = (Math.random() - 0.5) * 3;
                
                if (distance + noise < size) {
                    if (distance + noise < size * 0.3) {
                        this.map[y][x] = this.TERRAIN.MOUNTAIN;
                    } else if (distance + noise < size * 0.6) {
                        this.map[y][x] = this.TERRAIN.HILL;
                    } else if (distance + noise < size * 0.8) {
                        this.map[y][x] = this.TERRAIN.GRASS;
                    } else {
                        this.map[y][x] = this.TERRAIN.SAND;
                    }
                }
            }
        }
    }
    
    generateRivers() {
        const numRivers = Math.random() * 3 + 2;
        
        for (let i = 0; i < numRivers; i++) {
            let x = Math.floor(Math.random() * this.mapWidth);
            let y = Math.floor(Math.random() * this.mapHeight);
            
            // 山から始める
            while (this.map[y] && this.map[y][x] && this.map[y][x] !== this.TERRAIN.MOUNTAIN) {
                x = Math.floor(Math.random() * this.mapWidth);
                y = Math.floor(Math.random() * this.mapHeight);
            }
            
            this.generateRiver(x, y);
        }
    }
    
    generateRiver(startX, startY) {
        let x = startX;
        let y = startY;
        const riverLength = Math.random() * 30 + 20;
        
        for (let i = 0; i < riverLength; i++) {
            if (x >= 0 && x < this.mapWidth && y >= 0 && y < this.mapHeight) {
                if (this.map[y][x] === this.TERRAIN.DEEP_WATER) break;
                this.map[y][x] = this.TERRAIN.RIVER;
            }
            
            // 海に向かって流れる傾向
            const directionX = Math.random() < 0.6 ? (Math.random() < 0.5 ? -1 : 1) : 0;
            const directionY = Math.random() < 0.6 ? (Math.random() < 0.5 ? -1 : 1) : 0;
            
            x += directionX;
            y += directionY;
        }
    }
    
    generateDetailedTerrain() {
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                if (this.map[y][x] === this.TERRAIN.GRASS && Math.random() < 0.3) {
                    this.map[y][x] = this.TERRAIN.FOREST;
                }
                
                // 海岸線に砂浜を作る
                if (this.map[y][x] === this.TERRAIN.DEEP_WATER) {
                    let hasLand = false;
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            const ny = y + dy;
                            const nx = x + dx;
                            if (ny >= 0 && ny < this.mapHeight && nx >= 0 && nx < this.mapWidth) {
                                if (this.map[ny][nx] !== this.TERRAIN.DEEP_WATER && 
                                    this.map[ny][nx] !== this.TERRAIN.SHALLOW_WATER &&
                                    this.map[ny][nx] !== this.TERRAIN.RIVER) {
                                    hasLand = true;
                                    break;
                                }
                            }
                        }
                        if (hasLand) break;
                    }
                    if (hasLand && Math.random() < 0.7) {
                        this.map[y][x] = this.TERRAIN.SHALLOW_WATER;
                    }
                }
            }
        }
    }
    
    generateCivilization() {
        // 町を生成
        const numTowns = Math.random() * 5 + 3;
        const towns = [];
        
        for (let i = 0; i < numTowns; i++) {
            let x, y;
            let attempts = 0;
            do {
                x = Math.floor(Math.random() * this.mapWidth);
                y = Math.floor(Math.random() * this.mapHeight);
                attempts++;
            } while (attempts < 100 && (
                !this.map[y] || 
                !this.map[y][x] || 
                this.map[y][x] === this.TERRAIN.DEEP_WATER ||
                this.map[y][x] === this.TERRAIN.SHALLOW_WATER ||
                this.map[y][x] === this.TERRAIN.RIVER ||
                this.map[y][x] === this.TERRAIN.MOUNTAIN
            ));
            
            if (attempts < 100) {
                this.map[y][x] = this.TERRAIN.TOWN;
                towns.push({ x, y });
            }
        }
        
        // 町を道で繋ぐ
        for (let i = 0; i < towns.length - 1; i++) {
            this.generateRoad(towns[i], towns[i + 1]);
        }
    }
    
    generateRoad(start, end) {
        let x = start.x;
        let y = start.y;
        
        while (x !== end.x || y !== end.y) {
            if (x < end.x) x++;
            else if (x > end.x) x--;
            
            if (y < end.y) y++;
            else if (y > end.y) y--;
            
            if (x >= 0 && x < this.mapWidth && y >= 0 && y < this.mapHeight) {
                if (this.map[y][x] !== this.TERRAIN.DEEP_WATER && 
                    this.map[y][x] !== this.TERRAIN.SHALLOW_WATER &&
                    this.map[y][x] !== this.TERRAIN.RIVER &&
                    this.map[y][x] !== this.TERRAIN.TOWN &&
                    Math.random() < 0.7) {
                    this.map[y][x] = this.TERRAIN.ROAD;
                }
            }
        }
    }
    
    spawnCharacters() {
        const numCharacters = Math.random() * 15 + 10;
        
        for (let i = 0; i < numCharacters; i++) {
            let x, y;
            let attempts = 0;
            
            do {
                x = Math.floor(Math.random() * this.mapWidth);
                y = Math.floor(Math.random() * this.mapHeight);
                attempts++;
            } while (attempts < 100 && (
                !this.map[y] || 
                !this.map[y][x] || 
                this.map[y][x] === this.TERRAIN.DEEP_WATER ||
                this.map[y][x] === this.TERRAIN.SHALLOW_WATER ||
                this.map[y][x] === this.TERRAIN.MOUNTAIN
            ));
            
            if (attempts < 100) {
                const characterType = this.CHARACTER_TYPES[Math.floor(Math.random() * this.CHARACTER_TYPES.length)];
                this.characters.push({
                    x: x,
                    y: y,
                    char: characterType.char,
                    color: characterType.color,
                    name: characterType.name,
                    direction: { x: 0, y: 0 },
                    speed: Math.random() * 0.5 + 0.2,
                    lastMove: 0,
                    target: null,
                    pathIndex: 0
                });
            }
        }
    }
    
    updateCharacters(currentTime) {
        this.characters.forEach(character => {
            if (currentTime - character.lastMove > 1000 / character.speed) {
                // 新しい目標を設定（時々）
                if (!character.target || Math.random() < 0.1) {
                    character.target = {
                        x: Math.floor(Math.random() * this.mapWidth),
                        y: Math.floor(Math.random() * this.mapHeight)
                    };
                }
                
                // 目標に向かって移動
                const dx = character.target.x - character.x;
                const dy = character.target.y - character.y;
                
                let moveX = 0, moveY = 0;
                if (Math.abs(dx) > Math.abs(dy)) {
                    moveX = dx > 0 ? 1 : -1;
                } else if (dy !== 0) {
                    moveY = dy > 0 ? 1 : -1;
                }
                
                const newX = Math.max(0, Math.min(this.mapWidth - 1, character.x + moveX));
                const newY = Math.max(0, Math.min(this.mapHeight - 1, character.y + moveY));
                
                // 移動可能かチェック
                if (this.map[newY] && this.map[newY][newX] && 
                    this.map[newY][newX] !== this.TERRAIN.DEEP_WATER &&
                    this.map[newY][newX] !== this.TERRAIN.SHALLOW_WATER &&
                    this.map[newY][newX] !== this.TERRAIN.MOUNTAIN) {
                    character.x = newX;
                    character.y = newY;
                }
                
                character.lastMove = currentTime;
            }
        });
    }
    
    render() {
        this.ctx.fillStyle = '#001122';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 地形を描画
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                const terrain = this.map[y][x];
                const screenX = x * this.cellSize;
                const screenY = y * this.cellSize;
                
                // 背景色
                this.ctx.fillStyle = terrain.bg;
                this.ctx.fillRect(screenX, screenY, this.cellSize, this.cellSize);
                
                // 文字（水のアニメーション）
                this.ctx.fillStyle = terrain.color;
                let char = terrain.char;
                
                if (terrain === this.TERRAIN.DEEP_WATER || 
                    terrain === this.TERRAIN.SHALLOW_WATER || 
                    terrain === this.TERRAIN.RIVER) {
                    const waveChars = ['~', '≈', '∼'];
                    char = waveChars[Math.floor((this.animationFrame / 10 + x + y) % 3)];
                }
                
                this.ctx.fillText(char, screenX + this.cellSize / 2, screenY + this.cellSize / 2);
            }
        }
        
        // キャラクターを描画
        this.characters.forEach(character => {
            const screenX = character.x * this.cellSize;
            const screenY = character.y * this.cellSize;
            
            // キャラクターの背景（少し暗く）
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this.ctx.fillRect(screenX, screenY, this.cellSize, this.cellSize);
            
            // キャラクター
            this.ctx.fillStyle = character.color;
            this.ctx.fillText(character.char, screenX + this.cellSize / 2, screenY + this.cellSize / 2);
        });
    }
    
    animate(currentTime = 0) {
        if (currentTime - this.lastTime > 50) { // 20 FPS
            this.updateCharacters(currentTime);
            this.render();
            this.animationFrame++;
            this.lastTime = currentTime;
        }
        
        requestAnimationFrame((time) => this.animate(time));
    }
}

// ページ読み込み時に自動開始
document.addEventListener('DOMContentLoaded', () => {
    window.asciiRPGMapInstance = new AsciiRPGMap();
});

// ウィンドウリサイズ時の対応
window.addEventListener('resize', () => {
    const canvas = document.getElementById('asciiBg');
    if (canvas) {
        // キャンバスサイズを再調整
        const map = window.asciiRPGMapInstance;
        if (map) {
            canvas.width = map.mapWidth * map.cellSize;
            canvas.height = map.mapHeight * map.cellSize;
        }
    }
});

// グローバルインスタンスを保持
window.asciiRPGMapInstance = null;