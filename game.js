const canvas = document.getElementById('spaceInvader');
const ctx = canvas.getContext('2d');

let shipX = canvas.width / 2 - 15;
const shipWidth = 30;
const shipHeight = 10;

let bullets = [];
let enemies = [];
const rows = 3;
const cols = 5;

// 敵の初期配置
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    enemies.push({ x: 50 + c * 60, y: 30 + r * 40, w: 30, h: 20 });
  }
}

// キー操作
let left = false, right = false, space = false;
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') left = true;
  if (e.key === 'ArrowRight') right = true;
  if (e.key === ' ') space = true;
});
document.addEventListener('keyup', e => {
  if (e.key === 'ArrowLeft') left = false;
  if (e.key === 'ArrowRight') right = false;
  if (e.key === ' ') space = false;
});

// ゲームループ
function loop() {
  ctx.fillStyle = '#001f3f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // プレイヤー描画
  ctx.fillStyle = '#fdf6e3';
  ctx.fillRect(shipX, canvas.height - 20, shipWidth, shipHeight);

  // 移動
  if (left && shipX > 0) shipX -= 3;
  if (right && shipX + shipWidth < canvas.width) shipX += 3;

  // 弾
  if (space && bullets.length < 1) bullets.push({ x: shipX + shipWidth/2 - 2, y: canvas.height - 25, w: 4, h: 10 });
  bullets.forEach((b, i) => {
    b.y -= 5;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    if (b.y < 0) bullets.splice(i, 1);
  });

  // 敵描画
  enemies.forEach((e, i) => {
    ctx.fillStyle = '#fdf6e3';
    ctx.fillRect(e.x, e.y, e.w, e.h);

    // 弾との当たり判定
    bullets.forEach((b, j) => {
      if (b.x < e.x + e.w && b.x + b.w > e.x && b.y < e.y + e.h && b.y + b.h > e.y) {
        enemies.splice(i, 1);
        bullets.splice(j, 1);
      }
    });
  });

  requestAnimationFrame(loop);
}

loop();
