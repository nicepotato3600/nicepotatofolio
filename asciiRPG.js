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

// マップ配列（決め打ちで大陸を作る）
const mapData = Array.from({length: rows}, () => Array(cols).fill(' '));

// シンプルな大陸形状サンプル（複雑な形にしたい場合は手打ちで'#', '^', '~', '.'を配置）
for(let y=5; y<rows-5; y++){
    for(let x=5; x<cols-5; x++){
        if((y>10 && y<rows-10 && x>10 && x<cols-10) && Math.random()<0.7){
            mapData[y][x]='.'; // 草原
        }
    }
}
// 山、森、川セクションを決め打ちで配置
for(let y=12; y<18; y++){
    for(let x=15; x<25; x++){
        mapData[y][x]='^'; // 山
    }
}
for(let y=20; y<25; y++){
    for(let x=30; x<40; x++){
        mapData[y][x]='#'; // 森
    }
}
for(let y=28; y<rows-5; y++){
    for(let x=10; x<12; x++){
        mapData[y][x]='~'; // 川
    }
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
    // 背景（黒ではなく濃い青にして海アニメ）
    ctx.fillStyle='#001144';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // マップ描画
    for(let y=0;y<rows;y++){
        for(let x=0;x<cols;x++){
            let ch = mapData[y][x];
            let color='#33FF33';

            if(ch==='^') color='#55AA55';      // 山
            else if(ch==='#') color='#228822'; // 森
            else if(ch==='~'){                  // 川
                color='#3399FF';
                ch = Math.random()<0.5?'~':'≈'; // 揺れるアニメ
            } 
            else if(ch==='.') color='#66FF66';  // 草原

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
