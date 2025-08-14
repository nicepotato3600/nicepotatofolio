const canvas = document.getElementById('asciiBg');
const ctx = canvas.getContext('2d');

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

ctx.font = '14px monospace';
const cellSize = 14;
const cols = Math.floor(canvas.width / cellSize);
const rows = Math.floor(canvas.height / cellSize);

// マップ配列初期化（空白=海）
const mapData = Array.from({length: rows}, () => Array(cols).fill(' '));

// 大陸をランダム配置
function generateContinent(x0, y0, width, height){
  for(let y=y0; y<y0+height && y<rows; y++){
    for(let x=x0; x<x0+width && x<cols; x++){
      const r = Math.random();
      if(r<0.05) mapData[y][x]='^';      // 山
      else if(r<0.15) mapData[y][x]='#'; // 森
      else if(r<0.25) mapData[y][x]='~'; // 川
      else mapData[y][x]='.';            // 草原
    }
  }
}

// いくつか大陸をランダム生成
for(let i=0; i<5; i++){
  const w = 10 + Math.floor(Math.random()*15);
  const h = 5 + Math.floor(Math.random()*10);
  const x0 = Math.floor(Math.random()*(cols-w));
  const y0 = Math.floor(Math.random()*(rows-h));
  generateContinent(x0, y0, w, h);
}

// 小キャラ（陸上のみ）
const npcs = [];
const walkChars = ['@','&','%'];
for(let i=0;i<10;i++){
  let placed=false;
  while(!placed){
    const x=Math.floor(Math.random()*cols);
    const y=Math.floor(Math.random()*rows);
    if(mapData[y][x]!=' ' && mapData[y][x]!='~'){
      npcs.push({x, y, charIndex:0, color:'#FF5555', dx: Math.random()<0.5?-1:1, dy: Math.random()<0.5?-1:1});
      placed=true;
    }
  }
}

// カーソル
const cursor = document.querySelector('.cursor');
let cursorOpacity=1, cursorDir=-0.05;

function draw(){
  // 背景（海=黒）
  ctx.fillStyle='#000';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // マップ描画
  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){
      let ch = mapData[y][x];
      let color='#33FF33';

      if(ch==='^') color='#55AA55';
      else if(ch==='#') color='#228822';
      else if(ch==='~'){
        color='#3399FF';
        ch = Math.random()<0.5?'~':'≈'; // 揺れ
      }

      if(ch!==' ') ctx.fillStyle=color, ctx.fillText(ch, x*cellSize, y*cellSize);
    }
  }

  // 小キャラ描画＆歩行アニメ
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
  cursorOpacity+=cursorDir;
  if(cursorOpacity<=0.1 || cursorOpacity>=1) cursorDir*=-1;
  cursor.style.opacity=cursorOpacity;

  requestAnimationFrame(draw);
}

draw();
