const canvas = document.getElementById('spaceBg');
console.log(canvas);
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ターミナルカーソル
const cursor = document.querySelector('.cursor');
let cursorOpacity = 1;
let cursorDir = -0.05; // 点滅の方向

// 敵ブロック
const cols = 10;
const rows = 5;
const enemies = [];
const enemySize = 20;
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    enemies.push({ x: c*40 + 50, y: r*30 + 50 });
  }
}
let dir = 1;

// ランダム弾
const bullets = [];
function spawnBullet() {
  const x = Math.random() * canvas.width;
  bullets.push({ x, y: 0, size: 4 + Math.random()*3, speed: 2 + Math.random()*2 });
}
//中くらいの宇宙船
const ships = [];
for (let i = 0; i < 3; i++) {
  ships.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height / 2,
    w: 20,
    h: 12,
    dx: (Math.random() < 0.5 ? -1 : 1) * 0.7,
    dy: (Math.random() < 0.5 ? -1 : 1) * 0.3
  });
}

// ノイズ描画
function drawNoise() {
  for (let i = 0; i < 200; i++) {
    const size = Math.random() < 0.2 ? 2 : 1; // ちょっと大きめの星も
    ctx.fillStyle = `rgba(255,255,255,${Math.random()*0.2})`;
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, size, size);
  }
}


// メインループ
function loop() {
  // 背景
  ctx.fillStyle = '#001f3f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ノイズ
  drawNoise();

  // 敵描画
  ctx.fillStyle = '#fdf6e3';
  enemies.forEach(e => {
    ctx.fillRect(e.x, e.y, enemySize, enemySize);
    e.x += dir * 0.5;
  });

  // 端で反転
  const rightMost = Math.max(...enemies.map(e => e.x + enemySize));
  const leftMost = Math.min(...enemies.map(e => e.x));
  if (rightMost > canvas.width - 20 || leftMost < 20) dir *= -1;

  // 弾描画
  ctx.fillStyle = '#fdf6e3';
  bullets.forEach((b, i) => {
    b.y += b.speed;
    ctx.fillRect(b.x, b.y, b.size, b.size);
    if (b.y > canvas.height) bullets.splice(i, 1);
  });

  // ランダムで弾生成
  if (Math.random() < 0.05) spawnBullet();

  // カーソル点滅同期
  cursorOpacity += cursorDir;
  if (cursorOpacity <= 0.1 || cursorOpacity >= 1) cursorDir *= -1;
  cursor.style.opacity = cursorOpacity;

  requestAnimationFrame(loop);
　//宇宙船描画
  ctx.fillStyle = '#ffddaa'; // 宇宙船色
ships.forEach(s => {
  ctx.fillRect(s.x, s.y, s.w, s.h);
  s.x += s.dx;
  s.y += s.dy;

  // 画面端で反転
  if (s.x < 0 || s.x + s.w > canvas.width) s.dx *= -1;
  if (s.y < 0 || s.y + s.h > canvas.height / 2) s.dy *= -1;
});
}

// ウィンドウリサイズ対応
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

loop();
