const canvas = document.getElementById('asciiBg');
const ctx = canvas.getContext('2d');

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

ctx.font = '14px monospace';

const cols = Math.floor(canvas.width / 14);
const rows = Math.floor(canvas.height / 14);

// ASCIIマップ用文字と色
const terrain = [
  {char:'^', color:'#55AA55'}, // 山
  {char:'#', color:'#228822'}, // 木
  {char:'~', color:'#3399FF'}, // 川
  {char:'.', color:'#33FF33'}, // 草原
  {char:'=', color:'#AA7733'}  // 土地
];

// 小キャラ
const npcs = [];
const walkChars = ['@','&','%']; // 歩行アニメ用
for(let i=0;i<5;i++){
  npcs.push({
    x: Math.floor(Math.random()*cols),
    y: Math.floor(Math.random()*rows),
    charIndex:0,
    color:'#FF5555',
    dx: Math.random()<0.5?-1:1,
    dy: Math.random()<0.5?-1:1
  });
}

// カーソル
const cursor = document.querySelector('.cursor');
let cursorOpacity=1, cursorDir=-0.05;

// 揺れ用カウンター
let frame=0;

function draw(){
  frame++;

  // 背景
  ctx.fillStyle='#000';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // ASCIIマップ
  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){
      let t = terrain[Math.floor(Math.random()*terrain.length)];

      // 川の揺れ
      if(t.char==='~'){
        t.char = Math.random()<0.5?'~':'≈';
      }

      // 木の揺れ
      if(t.char==='#'){
        t.char = Math.random()<0.3?'♣':'#';
      }

      ctx.fillStyle=t.color;
      ctx.fillText(t.char, x*14, y*14);
    }
  }

  // 小キャラ描画＆歩行アニメ
  npcs.forEach(n=>{
    n.charIndex = (n.charIndex+1)%walkChars.length;
    const c = walkChars[n.charIndex];
    ctx.fillStyle=n.color;
    ctx.fillText(c, n.x*14, n.y*14);

    n.x += n.dx * Math.random();
    n.y += n.dy * Math.random();

    if(n.x<0 || n.x>cols-1) n.dx*=-1;
    if(n.y<0 || n.y>rows-1) n.dy*=-1;
  });

  // ノイズ
  for(let i=0;i<300;i++){
    const nx=Math.random()*canvas.width;
    const ny=Math.random()*canvas.height;
    const t = terrain[Math.floor(Math.random()*terrain.length)];
    ctx.fillStyle=`rgba(255,255,255,${Math.random()*0.3})`;
    ctx.fillText(t.char,nx,ny);
  }

  // カーソル点滅
  cursorOpacity+=cursorDir;
  if(cursorOpacity<=0.1 || cursorOpacity>=1) cursorDir*=-1;
  cursor.style.opacity=cursorOpacity;

  requestAnimationFrame(draw);
}

draw();
