const canvas = document.getElementById('spaceBg');
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

// ノイズ描画
function drawNoise() {
  const noiseCount = 150;
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  for (let i = 0; i < noiseCount; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillRect(x, y, 1, 1);
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
}

// ウィンドウリサイズ対応
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

loop();
