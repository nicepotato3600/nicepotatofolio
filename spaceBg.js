const canvas = document.getElementById('spaceBg');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Terminal cursor の取得
const cursor = document.querySelector('.cursor');

let cursorOpacity = 1;
let cursorDir = -0.05; // 点滅の方向

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

  // ランダム弾生成
  if (Math.random() < 0.05) spawnBullet();

  // ーー ここから Terminal カーソル点滅を同期 ーー
  cursorOpacity += cursorDir;
  if (cursorOpacity <= 0.1 || cursorOpacity >= 1) cursorDir *= -1;
  cursor.style.opacity = cursorOpacity;

  requestAnimationFrame(loop);
}
