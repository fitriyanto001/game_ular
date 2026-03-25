const socket = new WebSocket("ws://" + location.hostname + ":3000");
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const tile = 20;

let myId = null;
let players = {};
let fruit = { x: 10, y: 10 };
let highscore = 0;

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "init") {
    myId = data.id;
  }

  if (data.type === "state") {
    players = data.players;
    fruit = data.fruit;

    const me = players[myId];
    if (me) {
      document.getElementById("score").innerText = me.score || 0;

      if (me.score > highscore) {
        highscore = me.score;
        document.getElementById("highscore").innerText = highscore;
      }
    }

    draw();
  }

  if (data.type === "gameOver") {
    if (data.winner === myId) {
      alert("🎉 Kamu MENANG! Score 15 tercapai!");
    } else {
      alert("❌ Kamu KALAH! Pemain lain menang!");
    }
  }
};

function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let id in players) {
    const p = players[id];
    ctx.fillStyle = id === myId ? "lime" : "red";

    p.trail.forEach((part) => {
      ctx.fillRect(part.x * tile, part.y * tile, tile - 2, tile - 2);
    });
  }

  ctx.fillStyle = "yellow";
  ctx.fillRect(fruit.x * tile, fruit.y * tile, tile - 2, tile - 2);
}

function setDirection(dir) {
  socket.send(JSON.stringify({ type: "direction", direction: dir }));
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") setDirection("up");
  if (e.key === "ArrowDown") setDirection("down");
  if (e.key === "ArrowLeft") setDirection("left");
  if (e.key === "ArrowRight") setDirection("right");
});
