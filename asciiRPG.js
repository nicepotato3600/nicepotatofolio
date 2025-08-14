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

// 世界地図データ（. = 草原, ^ = 山, # = 森, ~ = 川, 空白 = 海）
const mapData = [
  "                     ^^^^^^                    ",
  "         #####     ^^^^^^^^     #####         ",
  "     ~~~~~     ^^^         ^^^      ~~~~~     ",
  "   #####            #####            #####    ",
  "                                           ",
  "       ^^^                   ^^^           ",
  "   ####       ~~~       ####             ",
  "                         ######           ",
  "         ^^^^^^                 ~~~       ",
  "                                           "
];

const rows = mapData.length;
const cols = mapData[0].length;

// 小キャラ（陸上にのみ出現）
const npcs = [];
const walkChars = ['@','&','%'];
for(let i=0;i<5;i++){
  let placed = false;
  while(!placed){
    const x = Math.floor(Math.random()*cols);
    const y = Math.floor(Math.random()*rows);
    if(mapData[y][x] !== ' ' && mapData[y][x] !== '~'){
      npcs.push({x, y, charIndex:0, color:'#FF5555', dx: Math.random()<0.5?-1:1, dy: Math.random()<0.5?-1:1});
      placed = true;
    }
  }
}

// カーソル
const cursor = document.querySelector('.cursor');
let cursorOpacity=1, cursorDir=-0.05;

function draw(){
  // 背景（余白は黒）
  ctx.fillStyle='#000';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  const offsetX = Math.floor((canvas.width - cols*cellSize)/2);
  const offsetY = Math.floor((canvas.height - rows*cellSize)/2);

  // マップ描画
  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){
      let ch = mapData[y][x];
      let color = '#33FF33';

      if(ch==='^') color='#55AA55';          // 山
      else if(ch==='#') color='#228822';     // 森
      else if(ch==='~'){                     // 川
        color='#3399FF';
        ch = Math.random()<0.5?'~':'≈';      // 揺れ
      }

      ctx.fillStyle=color;
      ctx.fillText(ch, x*cellSize + offsetX, y*cellSize + offsetY);
    }
  }

  // 小キャラ描画＆歩行アニメ
  npcs.forEach(n=>{
    n.charIndex = (n.charIndex+1)%walkChars.length;
    const c = walkChars[n.charIndex];
    ctx.fillStyle=n.color;
    ctx.fillText(c, n.x*cellSize + offsetX, n.y*cellSize + offsetY);

    // 移動（陸上のみ）
    let nx = n.x + n.dx * Math.random();
    let ny = n.y + n.dy * Math.random();

    if(nx<0 || nx>=cols || mapData[n.y][Math.floor(nx)]===' ' || mapData[n.y][Math.floor(nx)]==='~') n.dx*=-1;
    else n.x = nx;

    if(ny<0 || ny>=rows || mapData[Math.floor(ny)][n.x]===' ' || mapData[Math.floor(ny)][n.x]==='~') n.dy*=-1;
    else n.y = ny;
  });

  // カーソル点滅
  cursorOpacity+=cursorDir;
  if(cursorOpacity<=0.1 || cursorOpacity>=1) cursorDir*=-1;
  cursor.style.opacity=cursorOpacity;

  requestAnimationFrame(draw);
}

draw();
