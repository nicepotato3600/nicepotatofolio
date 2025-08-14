const canvas = document.getElementById('asciiBg');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

ctx.font = '14px monospace';
const cellSize = 14;
const cols = Math.floor(canvas.width / cellSize);
const rows = Math.floor(canvas.height / cellSize);

// マップ配列初期化（海）
const mapData = Array.from({ length: rows }, () => Array(cols).fill(' '));

// 大陸形状生成（複数波形を組み合わせて自然な曲線）
function isLand(x, y) {
    const nx = x / cols - 0.5;
    const ny = y / rows - 0.5;
    const distance = Math.sqrt(nx*nx + ny*ny);
    const angle = Math.atan2(ny, nx);
    const radius = 0.4 + 0.05*Math.sin(5*angle) + 0.03*Math.cos(7*angle + 3);
    return distance < radius;
}

// マップ作成
for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
        if (isLand(x, y)) mapData[y][x] = '.'; // 草原
    }
}

// 山ブロック
for (let y = 5; y < 15; y++) {
    for (let x = 15; x < 30; x++) {
        if(mapData[y][x]==='.') mapData[y][x]='^';
    }
}

// 森ブロック
for (let y = 18; y < 28; y++) {
    for (let x = 25; x < 45; x++) {
        if(mapData[y][x]==='.') mapData[y][x]='#';
    }
}

// 川（曲線）
for (let y = 10; y < rows-10; y++) {
    let x = Math.floor(10 + 15 * Math.sin(y/5));
    if(mapData[y][x]==='.') mapData[y][x]='~';
    if(mapData[y][x+1]==='.') mapData[y][x+1]='~';
}

// 小キャラ
const npcs = [];
const walkChars = ['@', '&', '%'];
for (let i = 0; i < 10; i++) {
    let placed = false;
    while (!placed) {
        const x = Math.floor(Math.random() * cols);
        const y = Math.floor(Math.random() * rows);
        if (mapData[y][x] != ' ' && mapData[y][x] != '~') {
            npcs.push({ x, y, charIndex: 0, color: '#FF5555', dx: Math.random() < 0.5 ? -1 : 1, dy: Math.random() < 0.5 ? -1 : 1 });
            placed = true;
        }
    }
}

// カーソル
const cursor = document.querySelector('.cursor');
let cursorOpacity = 1, cursorDir = -0.05;

function draw() {
    // 背景＋海の波アニメーション
    ctx.fillStyle = '#001144';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            let ch = mapData[y][x];
            let color = '#33FF33';

            if (ch === '^') color = '#55AA55';       // 山
            else if (ch === '#') color = '#228822';  // 森
            else if (ch === '~') {                   // 川
                color = '#3399FF';
                ch = Math.random() < 0.5 ? '~' : '≈'; // 揺れ
            } 
            else if (ch === '.') color = '#66FF66';  // 草原
            else {                                  // 海
                color = '#0033AA';
                ch = Math.random() < 0.2 ? '~' : '≈';
            }

            ctx.fillStyle = color;
            ctx.fillText(ch, x * cellSize, y * cellSize);
        }
    }

    // 小キャラ描画＆歩行アニメ
    npcs.forEach(n => {
        n.charIndex = (n.charIndex + 1) % walkChars.length;
        const c = walkChars[n.charIndex];
        ctx.fillStyle = n.color;
        ctx.fillText(c, n.x * cellSize, n.y * cellSize);

        // 移動（陸上のみ）
        let nx = n.x + n.dx * Math.random();
        let ny = n.y + n.dy * Math.random();
        if (nx < 0 || nx >= cols || mapData[n.y][Math.floor(nx)] === ' ' || mapData[n.y][Math.floor(nx)] === '~') n.dx *= -1;
        else n.x = nx;
        if (ny < 0 || ny >= rows || mapData[Math.floor(ny)][n.x] === ' ' || mapData[Math.floor(ny)][n.x] === '~') n.dy *= -1;
        else n.y = ny;
    });

    // カーソル点滅
    cursorOpacity += cursorDir;
    if (cursorOpacity <= 0.1 || cursorOpacity >= 1) cursorDir *= -1;
    cursor.style.opacity = cursorOpacity;

    requestAnimationFrame(draw);
}

draw();
