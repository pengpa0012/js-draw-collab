const canvas = document.querySelector("canvas")
const inputRoom = document.querySelector(".input-room")
const roomUI = document.querySelector(".room")
const canvasCover = document.querySelector(".canvas-cover")
const ctx = canvas.getContext("2d")
const rect = canvas.getBoundingClientRect();
const socket = new WebSocket('ws://localhost:3001')

let isDrawing = false
let selectedBrushSize = 5
let brushColor = "#000"
let roomID = ""
let rectPos = {
  left: rect.left,
  top: rect.top
}

canvas.width = 900
canvas.height = 700

window.addEventListener("resize", () => {
  const updatedRect = canvas.getBoundingClientRect();
  rectPos.top = updatedRect.top
  rectPos.left = updatedRect.left
})


inputRoom.addEventListener("keydown", e => {
  if(e.key == "Enter") {
    roomID = e.target.value
    const roomData = {
      roomEntered: true,
      room: roomID
    }
    roomUI.textContent = `Room ID: ${roomID}`
    inputRoom.value = ""
    sendData(JSON.stringify(roomData))
    inputRoom.classList.add("hidden")
    canvasCover.classList.remove("hidden")
  }
})

function getPosition(e) {
  const drawdata = {
    x: e.pageX - rectPos.left,
    y: e.pageY - rectPos.top,
    selectedBrushSize,
    brushColor,
    room: roomID
  }
  sendData(JSON.stringify(drawdata))
  return {
    x: e.pageX - rectPos.left,
    y: e.pageY - rectPos.top
  };
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

canvas.addEventListener("mousemove", onMouseMove);
canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mouseout", () => isDrawing = false);


socket.addEventListener('open', (event) => {
  console.log('Connected to the server', event)
})

socket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data)
  // draw from other client
  draw(data.x, data.y)
})

function sendData(data) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(data);
  } else {
    console.error('WebSocket connection is not open');
  }
}
