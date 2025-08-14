// DwarfFortress風アスキーアートRPGマップアニメーション - GitHub Pages最適化版
class AsciiRPGMap {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.mapWidth = 80;
        this.mapHeight = 40;
        this.cellSize = 10;
        this.map = [];
        this.characters = [];
        this.animationFrame = 0;
        this.lastTime = 0;
        this.isInitialized = false;
        
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
        console.log('AsciiRPGMap initialization started');
        
        if (!this.createCanvas()) {
            console.error('Canvas initialization failed');
            return false;
        }
        
        console.log('Generating world map...');
        this.generateMap();
        
        console.log('Spawning characters...');
        this.spawnCharacters();
        
        console.log('Starting animation loop...');
        this.isInitialized = true;
        this.animate();
        
        return true;
    }
    
    createCanvas() {
        this.canvas = document.getElementById('asciiBg');
        
        if (!this.canvas) {
            console.error('Canvas element with id "asciiBg" not found');
            return false;
        }
        
        // キャンバスサイズを設定
        this.canvas.width = this.mapWidth * this.cellSize;
        this.canvas.height = this.mapHeight * this.cellSize;
        
        console.log(`Canvas initialized: ${this.canvas.width}x${this.canvas.height}`);
        
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('Could not get 2D context');
            return false;
        }
        
        this.ctx.font = `${this.cellSize - 2}px monospace`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        return true;
    }
    
    generateMap() {
        // マップを初期化（海で埋める）
        this.map = [];
        for (let y = 0; y < this.mapHeight; y++) {
            this.map[y] = [];
            for (let x = 0; x < this.mapWidth; x++) {
                this.map[y][x] = this.TERRAIN.DEEP_WATER;
            }
        }
        
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
        const numContinents = Math.floor(Math.random() * 2) + 2;
        
        for (let i = 0; i < numContinents; i++) {
            const centerX = Math.floor(Math.random() * (this.mapWidth - 20)) + 10;
            const centerY = Math.floor(Math.random() * (this.mapHeight - 20)) + 10;
            const size = Math.floor(Math.random() * 10) + 8;
            
            this.generateContinent(centerX, centerY, size);
        }
    }
    
    generateContinent(centerX, centerY, size) {
        for (let y = Math.max(0, centerY - size); y < Math.min(this.mapHeight, centerY + size); y++) {
            for (let x = Math.max(0, centerX - size); x < Math.min(this.mapWidth, centerX + size); x++) {
                const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                const noise = (Math.random() - 0.5) * 2;
                
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
        const numRivers = Math.floor(Math.random() * 2) + 2;
        
        for (let i = 0; i < numRivers; i++) {
            // 山から始める
            let startX = -1, startY = -1;
            let attempts = 0;
            
            while (attempts < 50) {
                const x = Math.floor(Math.random() * this.mapWidth);
                const y = Math.floor(Math.random() * this.mapHeight);
                
                if (this.map[y][x] === this.TERRAIN.MOUNTAIN) {
                    startX = x;
                    startY = y;
                    break;
                }
                attempts++;
            }
            
            if (startX !== -1) {
                this.generateRiver(startX, startY);
            }
        }
    }
    
    generateRiver(startX, startY) {
        let x = startX;
        let y = startY;
        const riverLength = Math.floor(Math.random() * 20) + 15;
        
        for (let i = 0; i < riverLength; i++) {
            if (x >= 0 && x < this.mapWidth && y >= 0 && y < this.mapHeight) {
                if (this.map[y][x] === this.TERRAIN.DEEP_WATER) break;
                this.map[y][x] = this.TERRAIN.RIVER;
            }
            
            // ランダムな方向に流れる
            const directions = [
                { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
                { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
                { dx: -1, dy: -1 }, { dx: 1, dy: 1 },
                { dx: -1, dy: 1 }, { dx: 1, dy: -1 }
            ];
            
            const direction = directions[Math.floor(Math.random() * directions.length)];
            x += direction.dx;
            y += direction.dy;
        }
    }
    
    generateDetailedTerrain() {
        // フォレストを追加
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                if (this.map[y][x] === this.TERRAIN.GRASS && Math.random() < 0.25) {
                    this.map[y][x] = this.TERRAIN.FOREST;
                }
                
                // 海岸線に砂浜を作る
                if (this.map[y][x] === this.TERRAIN.DEEP_WATER) {
                    let hasLand = false;
                    for (let dy = -1; dy <= 1 && !hasLand; dy++) {
                        for (let dx = -1; dx <= 1 && !hasLand; dx++) {
                            const ny = y + dy;
                            const nx = x + dx;
                            if (ny >= 0 && ny < this.mapHeight && nx >= 0 && nx < this.mapWidth) {
                                if (this.map[ny][nx] !== this.TERRAIN.DEEP_WATER && 
                                    this.map[ny][nx] !== this.TERRAIN.SHALLOW_WATER &&
                                    this.map[ny][nx] !== this.TERRAIN.RIVER) {
                                    hasLand = true;
                                }
                            }
                        }
                    }
                    if (hasLand && Math.random() < 0.6) {
                        this.map[y][x] = this.TERRAIN.SHALLOW_WATER;
                    }
                }
            }
        }
    }
    
    generateCivilization() {
        // 町を生成
        const numTowns = Math.floor(Math.random() * 3) + 2;
        const towns = [];
        
        for (let i = 0; i < numTowns; i++) {
            let x, y;
            let attempts = 0;
            
            do {
                x = Math.floor(Math.random() * this.mapWidth);
                y = Math.floor(Math.random() * this.mapHeight);
                attempts++;
            } while (attempts < 50 && (
                this.map[y][x] === this.TERRAIN.DEEP_WATER ||
                this.map[y][x] === this.TERRAIN.SHALLOW_WATER ||
                this.map[y][x] === this.TERRAIN.RIVER ||
                this.map[y][x] === this.TERRAIN.MOUNTAIN
            ));
            
            if (attempts < 50) {
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
        
        while ((x !== end.x || y !== end.y) && Math.abs(x - start.x) + Math.abs(y - start.y) < 50) {
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
        const numCharacters = Math.floor(Math.random() * 8) + 6;
        this.characters = [];
        
        for (let i = 0; i < numCharacters; i++) {
            let x, y;
            let attempts = 0;
            
            do {
                x = Math.floor(Math.random() * this.mapWidth);
                y = Math.floor(Math.random() * this.mapHeight);
                attempts++;
            } while (attempts < 50 && (
                this.map[y][x] === this.TERRAIN.DEEP_WATER ||
                this.map[y][x] === this.TERRAIN.SHALLOW_WATER ||
                this.map[y][x] === this.TERRAIN.MOUNTAIN
            ));
            
            if (attempts < 50) {
                const characterType = this.CHARACTER_TYPES[Math.floor(Math.random() * this.CHARACTER_TYPES.length)];
                this.characters.push({
                    x: x,
                    y: y,
                    char: characterType.char,
                    color: characterType.color,
                    name: characterType.name,
                    speed: Math.random() * 0.3 + 0.15,
                    lastMove: 0,
                    target: null
                });
            }
        }
        
        console.log(`Spawned ${this.characters.length} characters`);
    }
    
    updateCharacters(currentTime) {
        this.characters.forEach(character => {
            if (currentTime - character.lastMove > 2000 / character.speed) {
                // 新しい目標を設定
                if (!character.target || Math.random() < 0.15) {
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
        if (!this.ctx || !this.isInitialized) return;
        
        // 背景をクリア
        this.ctx.fillStyle = '#001122';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 地形を描画
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                if (!this.map[y] || !this.map[y][x]) continue;
                
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
                    char = waveChars[Math.floor((this.animationFrame / 15 + x + y) % 3)];
                }
                
                this.ctx.fillText(char, screenX + this.cellSize / 2, screenY + this.cellSize / 2);
            }
        }
        
        // キャラクターを描画
        this.characters.forEach(character => {
            const screenX = character.x * this.cellSize;
            const screenY = character.y * this.cellSize;
            
            // キャラクターの背景
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            this.ctx.fillRect(screenX, screenY, this.cellSize, this.cellSize);
            
            // キャラクター
            this.ctx.fillStyle = character.color;
            this.ctx.fillText(character.char, screenX + this.cellSize / 2, screenY + this.cellSize / 2);
        });
    }
    
    animate(currentTime = 0) {
        if (!this.isInitialized) return;
        
        // 30 FPS
        if (currentTime - this.lastTime > 33) {
            this.updateCharacters(currentTime);
            this.render();
            this.animationFrame++;
            this.lastTime = currentTime;
        }
        
        requestAnimationFrame((time) => this.animate(time));
    }
}

// GitHub Pages最適化初期化関数
function initializeAsciiRPG() {
    console.log('Attempting to initialize AsciiRPGMap...');
    
    const canvas = document.getElementById('asciiBg');
    if (!canvas) {
        console.warn('Canvas not found, retrying in 100ms...');
        setTimeout(initializeAsciiRPG, 100);
        return;
    }
    
    try {
        window.asciiRPGMapInstance = new AsciiRPGMap();
        console.log('AsciiRPGMap successfully initialized!');
    } catch (error) {
        console.error('Failed to initialize AsciiRPGMap:', error);
    }
}

// 複数のタイミングで初期化を試行（GitHub Pagesの安定性向上）
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAsciiRPG);
} else {
    initializeAsciiRPG();
}

window.addEventListener('load', () => {
    if (!window.asciiRPGMapInstance) {
        console.log('Fallback initialization on window load');
        setTimeout(initializeAsciiRPG, 50);
    }
});

// リサイズ対応
window.addEventListener('resize', () => {
    if (window.asciiRPGMapInstance && window.asciiRPGMapInstance.canvas) {
        const map = window.asciiRPGMapInstance;
        map.canvas.width = map.mapWidth * map.cellSize;
        map.canvas.height = map.mapHeight * map.cellSize;
    }
});