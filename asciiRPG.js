// DwarfFortress風アスキーアートRPGマップアニメーション - GitHub Pages最適化版（スマホ対応版）
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

    // 初期化
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

    // キャンバス作成
    createCanvas() {
        this.canvas = document.getElementById('asciiBg');
        if (!this.canvas) {
            console.error('Canvas element with id "asciiBg" not found');
            return false;
        }

        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('Could not get 2D context');
            return false;
        }

        this.adjustCanvasSize();
        window.addEventListener('resize', () => this.adjustCanvasSize());

        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        return true;
    }

    // スマホ対応：キャンバスサイズとセルサイズを画面幅に合わせる
    adjustCanvasSize() {
        const padding = 20;
        const availableWidth = window.innerWidth - padding;
        const availableHeight = window.innerHeight - padding;

        const cellSizeX = Math.floor(availableWidth / this.mapWidth);
        const cellSizeY = Math.floor(availableHeight / this.mapHeight);
        this.cellSize = Math.max(6, Math.min(cellSizeX, cellSizeY)); // 最小6px

        this.canvas.width = this.mapWidth * this.cellSize;
        this.canvas.height = this.mapHeight * this.cellSize;

        if (this.ctx) {
            this.ctx.font = `${this.cellSize - 2}px monospace`;
        }
    }

    // マップ生成
    generateMap() {
        this.map = [];
        for (let y = 0; y < this.mapHeight; y++) {
            this.map[y] = [];
            for (let x = 0; x < this.mapWidth; x++) {
                this.map[y][x] = this.TERRAIN.DEEP_WATER;
            }
        }
        this.generateContinents();
        this.generateRivers();
        this.generateDetailedTerrain();
        this.generateCivilization();
    }

    // 以下、既存コードはそのまま残す
    generateContinents() { /* ... */ }
    generateContinent(centerX, centerY, size) { /* ... */ }
    generateRivers() { /* ... */ }
    generateRiver(startX, startY) { /* ... */ }
    generateDetailedTerrain() { /* ... */ }
    generateCivilization() { /* ... */ }
    generateRoad(start, end) { /* ... */ }

    spawnCharacters() { /* ... */ }
    updateCharacters(currentTime) { /* ... */ }

    // 描画
    render() {
        if (!this.ctx || !this.isInitialized) return;

        this.ctx.fillStyle = '#001122';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                if (!this.map[y] || !this.map[y][x]) continue;
                const terrain = this.map[y][x];
                const screenX = x * this.cellSize;
                const screenY = y * this.cellSize;

                this.ctx.fillStyle = terrain.bg;
                this.ctx.fillRect(screenX, screenY, this.cellSize, this.cellSize);

                this.ctx.fillStyle = terrain.color;
                let char = terrain.char;
                if ([this.TERRAIN.DEEP_WATER, this.TERRAIN.SHALLOW_WATER, this.TERRAIN.RIVER].includes(terrain)) {
                    const waveChars = ['~', '≈', '∼'];
                    char = waveChars[Math.floor((this.animationFrame / 15 + x + y) % 3)];
                }

                this.ctx.fillText(char, screenX + this.cellSize / 2, screenY + this.cellSize / 2);
            }
        }

        this.characters.forEach(character => {
            const screenX = character.x * this.cellSize;
            const screenY = character.y * this.cellSize;

            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            this.ctx.fillRect(screenX, screenY, this.cellSize, this.cellSize);

            this.ctx.fillStyle = character.color;
            this.ctx.fillText(character.char, screenX + this.cellSize / 2, screenY + this.cellSize / 2);
        });
    }

    animate(currentTime = 0) {
        if (!this.isInitialized) return;
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
        setTimeout(initializeAsciiRPG, 100);
        return;
    }
    try { window.asciiRPGMapInstance = new AsciiRPGMap(); } 
    catch (error) { console.error(error); }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAsciiRPG);
} else {
    initializeAsciiRPG();
}

window.addEventListener('load', () => {
    if (!window.asciiRPGMapInstance) setTimeout(initializeAsciiRPG, 50);
});

window.addEventListener('resize', () => {
    if (window.asciiRPGMapInstance && window.asciiRPGMapInstance.canvas) {
        window.asciiRPGMapInstance.adjustCanvasSize();
    }
});
