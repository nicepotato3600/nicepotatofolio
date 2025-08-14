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

// マップ配列初期化（空白＝海）
const mapData = Array.from({ length: rows }, () => Array(cols).fill(' '));

// 複数島生成
const islands = [
    { cx: 0.3, cy: 0.4, r: 0.15 },
    { cx: 0.7, cy: 0.5, r: 0.12 },
    { cx: 0.5, cy: 0.75, r: 0.1 }
];

function isLand(x, y) {
    const nx = x / cols;
    const ny = y / rows;
    for (const isl of islands) {
        const dx = nx - isl.cx;
        const dy = ny - isl.cy;
        const distance = Math.sqrt(dx*dx + dy*dy);
        const angle = Math.atan2(dy, dx);
        const radius = isl.r + 0.05*Math.sin(5*angle) + 0.03*Math.cos(7*angle + 3);
        if (distance < radius) return true;
    }
    return false;
}

// 草原を生成
for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
        if (isLand(x, y)) mapData[y][x] = '.';
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

// アニメーション用カウンター
let frame = 0;

function draw() {
    frame++;

    // 背景（黒）
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            let ch = mapData[y][x];
            let color = '#33FF33';

            if(ch==='^') { // 山アニメ
                color = frame % 20 < 10 ? '#55AA55' : '#77CC77';
            }
            else if(ch==='#') color = '#228822'; // 森は固定
            else if(ch==='~') { // 川アニメ
                color = frame % 30 < 15 ? '#3399FF' : '#66BBFF';
                ch = Math.random()<0.5?'~':'≈';
            }
            else if(ch==='.'){
                color = '#66FF66'; // 草原固定
            }
            else { // 海アニメ
                color = frame % 40 < 20 ? '#0033AA' : '#0044CC';
                ch = Math.random()<0.2 ? '~' : '≈';
            }

            ctx.fillStyle = color;
            ctx.fillText(ch, x * cellSize, y * cellSize);
        }
    }

    // 小キャラ描画
    npcs.forEach(n=>{
        n.charIndex=(n.charIndex+1)%walkChars.length;
        const c=walkChars[n.charIndex];
        ctx.fillStyle=n.color;
        ctx.fillText(c, n.x*cellSize, n.y*cellSize);

        // 移動（陸上のみ）
        let nx=n.x+n.dx*Math.random();
        let ny=n.y+n.dy*Math.random();
        if(nx<0 || nx>=cols || mapData[n.y][Math.floor(nx)]===' ' || mapData[n.y][Math.floor(nx)]==='~') n.dx*=-1;
        else n.x=nx;
        if(ny<0 || ny>=rows || mapData[Math.floor(ny)][n.x]===' ' || mapData[Math.floor(ny)][n.x]==='~') n.dy*=-1;
        else n.y=ny;
    });

    // カーソル点滅
    cursorOpacity += cursorDir;
    if(cursorOpacity <= 0.1 || cursorOpacity >= 1) cursorDir*=-1;
    cursor.style.opacity=cursorOpacity;

    requestAnimationFrame(draw);
}

draw();
