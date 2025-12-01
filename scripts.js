/* vim:set foldmethod=marker: */
let cols = 5, rows = 5;
let grid = [];

let gridSize;   // ← 1マスの大きさ（画面に合わせて可変）
let offsetX;    // ← 左の余白
let offsetY;    // ← 上の余白

let currentColor = null;
let dragging = false;

let showGridLines = true;

// パレットとボタンの配置（後で計算）
let paletteRed, paletteBlue;
let btnGrid, btnReset;
let btnMergedBorders;//境界線表示
let showMergedBorders = true;  // 境界線表示

function setup() {
  createCanvas(windowWidth, windowHeight);
  initGrid();
  calcLayout();
}

function draw() {
  background(255);

  drawPalette();
  drawButtons();
  drawGrid();


  // --- ドラッグ中のアイコン表示 ---
if (dragging && currentColor) {
  let c = color(currentColor);
  c.setAlpha(150);         // 半透明
  fill(c);
  noStroke();
  
  // ドラッグ中の表示サイズ（マスの 80%）
  let iconSize = gridSize * 0.8;

  rect(mouseX - iconSize / 2, mouseY - iconSize / 2, iconSize, iconSize, 5);
}
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calcLayout();   // ← レイアウト再計算
}

function initGrid() {
  grid = [];
  for (let y = 0; y < rows; y++) {
    grid[y] = [];
    for (let x = 0; x < cols; x++) {
      grid[y][x] = null;
    }
  }
}

function calcLayout() {
  // 画面の短い辺に合わせてマスの大きさ決定
  gridSize = min(windowWidth * 0.12, windowHeight * 0.12);

  // グリッドの左上位置
  offsetX = floor(windowWidth * 0.05);
  offsetY = floor(windowHeight * 0.1);

  // パレットとボタン位置（右側）
  let rightX = floor(windowWidth * 0.75);

  paletteRed  = { x: rightX,        y: offsetY, w: gridSize, h: gridSize };
  paletteBlue = { x: rightX,        y: offsetY + gridSize * 1.4, w: gridSize, h: gridSize };

  btnGrid     = { x: rightX,        y: offsetY + gridSize * 3.0, w: gridSize * 1.2, h: gridSize * 0.5 };
  btnReset    = { x: rightX,        y: offsetY + gridSize * 3.8, w: gridSize * 1.2, h: gridSize * 0.5 };

  btnMergedBorders = { x: rightX, y: offsetY + gridSize * 4.6, w: gridSize * 1.2, h: gridSize * 0.5 };

  paletteBlue.y = floor(paletteBlue.y);
  btnGrid.y = floor(btnGrid.y);
  btnReset.y = floor(btnReset.y);
  btnMergedBorders.y = floor(btnMergedBorders.y);
}

function drawPalette() {
  fill("red");
  rect(paletteRed.x, paletteRed.y, paletteRed.w, paletteRed.h);

  fill('#4169e1');
  rect(paletteBlue.x, paletteBlue.y, paletteBlue.w, paletteBlue.h);
}

function drawButtons() {
  /*fill(230);
  rect(btnGrid.x, btnGrid.y, btnGrid.w, btnGrid.h);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(gridSize * 0.25);
  text(showGridLines ? "枠を消す" : "枠を出す", btnGrid.x + btnGrid.w / 2, btnGrid.y + btnGrid.h / 2);
  */

  fill(230);
  rect(btnReset.x, btnReset.y, btnReset.w, btnReset.h);
  fill(0);
  text("リセット", btnReset.x + btnReset.w / 2, btnReset.y + btnReset.h / 2);

  fill(230);
rect(btnMergedBorders.x, btnMergedBorders.y, btnMergedBorders.w, btnMergedBorders.h);

fill(0);
textAlign(CENTER, CENTER);
textSize(gridSize * 0.25);
text(showMergedBorders ? "×" : "◯", 
     btnMergedBorders.x + btnMergedBorders.w / 2, 
     btnMergedBorders.y + btnMergedBorders.h / 2);
}

function drawGrid() {
  /*
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let px = offsetX + x * gridSize;
      let py = offsetY + y * gridSize;

      // 塗りつぶし
      fill(grid[y][x] || 255);
      rect(px, py, gridSize, gridSize);

      // 枠線の描画
      stroke(showGridLines ? 0 : color(0, 0));
      
      // 上
      if (!(y > 0 && grid[y][x] && grid[y - 1][x] === grid[y][x])) {
        line(px, py, px + gridSize, py);
      }
      // 左
      if (!(x > 0 && grid[y][x] && grid[y][x - 1] === grid[y][x])) {
        line(px, py, px, py + gridSize);
      }
      // 下
      if (!(y < rows - 1 && grid[y][x] && grid[y + 1][x] === grid[y][x])) {
        line(px, py + gridSize, px + gridSize, py + gridSize);
      }
      // 右
      if (!(x < cols - 1 && grid[y][x] && grid[y][x + 1] === grid[y][x])) {
        line(px + gridSize, py, px + gridSize, py + gridSize);
      }
    }
  }
  */
   noStroke();

  // まず塗りつぶしを描く
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let px = offsetX + x * gridSize;
      let py = offsetY + y * gridSize;

      fill(grid[y][x] || 255);
      rect(px-1, py-1, gridSize+2, gridSize+2);
    }
  }

  // 次に枠線を描く（塗りの上に重ねる：重要）
  //stroke(showGridLines ? 0 : color(0,0));
  stroke(showGridLines ? 0 : color(0,0));
  strokeWeight(2);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {

      let px = offsetX + x * gridSize;
      let py = offsetY + y * gridSize;

      let col = grid[y][x];

      // 🔻 1. 上の線
      /*if (!showGridLines || !showMergedBorders || y === 0 || grid[y - 1][x] !== col || !col) {
        line(px, py, px + gridSize, py);
      }
      */// !showGridLines で描画 !showMergedBordersで描画
      if (!showGridLines || !showMergedBorders || y === 0 || grid[y - 1][x] !== col || !col) {
        line(px, py, px + gridSize, py);
      }
      // 🔻 2. 左の線
      if (!showGridLines || !showMergedBorders || x === 0 || grid[y][x - 1] !== col || !col) {
        line(px, py, px, py + gridSize);
      }

      // 🔻 3. 下の線
      if (!showGridLines || !showMergedBorders || y === rows - 1 || grid[y + 1][x] !== col || !col) {
        line(px, py + gridSize, px + gridSize, py + gridSize);
      }

      // 🔻 4. 右の線
      if (!showGridLines || !showMergedBorders || x === cols - 1 || grid[y][x + 1] !== col || !col) {
        line(px + gridSize, py, px + gridSize, py + gridSize);
      }
    }
  }
}

function mousePressed() {
  // パレットチェック
  if (inside(mouseX, mouseY, paletteRed)) {
    currentColor = "red"; dragging = true;
  }
  if (inside(mouseX, mouseY, paletteBlue)) {
    currentColor = "#4169e1"; dragging = true;
  }

  // ボタン
  /*if (inside(mouseX, mouseY, btnGrid)) {
    showGridLines = !showGridLines;
  }
  */
  if (inside(mouseX, mouseY, btnReset)) {
    initGrid();
  }
  
  if (inside(mouseX, mouseY, btnMergedBorders)) {
    showMergedBorders = !showMergedBorders;
  }


}

function mouseReleased() {
  if (dragging && currentColor) {
    let gx = floor((mouseX - offsetX) / gridSize);
    let gy = floor((mouseY - offsetY) / gridSize);

    if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) {
      grid[gy][gx] = currentColor;
    }
  }
  dragging = false;
  currentColor = null;
}

function inside(mx, my, box) {
  return mx >= box.x && mx <= box.x + box.w &&
         my >= box.y && my <= box.y + box.h;
}


function touchStarted() {
  mousePressed();   // タッチ開始 → マウス押下と同じ処理
  return false;     // スクロール防止
}

function touchEnded() {
  mouseReleased();  // タッチ終了 → マウス離しと同じ処理
  return false;
}
