const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const rect = canvas.getBoundingClientRect();

let isDrawing = false
let selectedBrushSize = 5
let brushColor = "#000"

canvas.width = 900
canvas.height = 700

function getPosition(e) {
  if (e.touches && e.touches.length > 0) {
    return {
      x: e.touches[0].pageX - rect.left,
      y: e.touches[0].pageY - rect.top
    };
  } else {
    // save this data to send on web socket
    console.log(e.pageX - rect.left, e.pageY - rect.top, selectedBrushSize, brushColor)
    return {
      x: e.pageX - rect.left,
      y: e.pageY - rect.top
    };
  }

}

function draw(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, selectedBrushSize, 0, 2 * Math.PI);
  ctx.fillStyle = brushColor;
  ctx.fill();
}

function onMouseMove(e) {
  if (!isDrawing) return;
  let pos = getPosition(e);
  draw(pos.x, pos.y);
}

function onMouseDown(e) {
  isDrawing = true;
  let pos = getPosition(e);
  draw(pos.x, pos.y);
}

function onMouseUp() {
  isDrawing = false;
}

function onMouseOut() {
  isDrawing = false;
}

canvas.addEventListener("mousemove", onMouseMove);
canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mouseup", onMouseUp);
canvas.addEventListener("mouseout", onMouseOut);