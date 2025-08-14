// DwarfFortress風アスキーアートRPGマップアニメーション - GitHub Pages最適化版（スマホ対応）
class AsciiRPGMap {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.mapWidth = 80;
        this.mapHeight = 40;
        this.cellSize = 10; // 基準セルサイズ
        this.map = [];
        this.characters = [];
        this.animationFrame = 0;
        this.lastTime = 0;
        this.isInitialized = false;

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
        if (!this.createCanvas()) return false;
        this.generateMap();
        this.spawnCharacters();
        this.isInitialized = true;

        // 初期キャンバス調整
        this.adjustCanvasSize();
        window.addEventListener('resize', () => this.adjustCanvasSize());

        this.animate();
        return true;
    }

    createCanvas() {
        this.canvas = document.getElementById('asciiBg');
        if (!this.canvas) return false;

        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) return false;

        return true;
    }

    // スマホでも全体表示されるようセルサイズを画面幅に合わせて調整
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
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
        }
    }

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
                    if (distance + noise < size * 0.3) this.map[y][x] = this.TERRAIN.MOUNTAIN;
                    else if (distance + noise < size * 0.6) this.map[y][x] = this.TERRAIN.HILL;
                    else if (distance + noise < size * 0.8) this.map[y][x] = this.TERRAIN.GRASS;
                    else this.map[y][x] = this.TERRAIN.SAND;
                }
            }
        }
    }

    generateRivers() { /* river logic unchanged */ }
    generateDetailedTerrain() { /* terrain logic unchanged */ }
    generateCivilization() { /* towns & roads logic unchanged */ }
    spawnCharacters() { /* character logic unchanged */ }
    updateCharacters(currentTime) { /* movement logic unchanged */ }

    render() {
        if (!this.ctx || !this.isInitialized) return;

        this.ctx.fillStyle = '#001122';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 地形描画
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
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

        // キャラクター描画
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

function initializeAsciiRPG() {
    if (!document.getElementById('asciiBg')) return setTimeout(initializeAsciiRPG, 100);
    window.asciiRPGMapInstance = new AsciiRPGMap();
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
    if (window.asciiRPGMapInstance) window.asciiRPGMapInstance.adjustCanvasSize();
});
