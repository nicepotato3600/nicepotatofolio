const canvas = document.getElementById('spaceBg');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.font = '14px monospace';

// ターミナルカーソル
const cursor = document.querySelector('.cursor');
let cursorOpacity = 1;
let cursorDir = -0.05;

// マップ設定
const cols = Math.floor(canvas.width / 14);
const rows = Math.floor(canvas.height / 14);
const terrainChars = ['.', ',', '^', '~', '♣', '#'];
const terrainColors = ['#33FF33','#33AA33','#AA8833','#0033FF','#55FF55','#FFCC33'];

// 小キャラ
const npcs = [];
for(let i=0;i<5;i++){
  npcs.push({
    x: Math.floor(Math.random()*cols),
    y: Math.floor(Math.random()*rows),
    char: '@',
    color:'#FF5555',
    dx: Math.random()<0.5?-1:1,
    dy: Math.random()<0.5?-1:1
  });
}

function drawRPGWorld() {
  // 背景
  ctx.fillStyle = '#000';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // マップ描画
  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){
      const char = terrainChars[Math.floor(Math.random()*terrainChars.length)];
      const color = terrainColors[Math.floor(Math.random()*terrainColors.length)];
      ctx.fillStyle = color;
      ctx.fillText(char, x*14, y*14);
    }
  }

  // 小キャラ描画＆移動
  npcs.forEach(n => {
    ctx.fillStyle = n.color;
    ctx.fillText(n.char, n.x*14, n.y*14);

    n.x += n.dx * Math.random();
    n.y += n.dy * Math.random();

    if(n.x<0 || n.x>cols-1) n.dx*=-1;
    if(n.y<0 || n.y>rows-1) n.dy*=-1;
  });

  // ノイズ
  for(let i=0;i<300;i++){
    const nx = Math.random()*canvas.width;
    const ny = Math.random()*canvas.height;
    ctx.fillStyle = `rgba(255,255,255,${Math.random()*0.3})`;
    ctx.fillText(terrainChars[Math.floor(Math.random()*terrainChars.length)], nx, ny);
  }

  // カーソル点滅
  cursorOpacity += cursorDir;
  if(cursorOpacity<=0.1 || cursorOpacity>=1) cursorDir*=-1;
  cursor.style.opacity = cursorOpacity;

  requestAnimationFrame(drawRPGWorld);
}

// リサイズ対応
window.addEventListener('resize',()=>{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

drawRPGWorld();
