const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

let players = {};
let gems = [];
let fires = [];
const MAX_GEMS = 5;
const MAX_FIRES = 3;

// Initialize gems and fires
function initializeGameObjects() {
    for (let i = 0; i < MAX_GEMS; i++) {
        gems.push({ x: Math.random() * 800, y: Math.random() * 480, collected: false });
    }
    for (let i = 0; i < MAX_FIRES; i++) {
        fires.push({ x: Math.random() * 800, y: Math.random() * 480 });
    }
}

initializeGameObjects();

wss.on('connection', (ws) => {
    const playerId = Date.now(); // Simple unique ID based on timestamp
    players[playerId] = { x: 427, y: 240, gems: 0 }; // Initial position and gems count

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'move') {
            players[playerId].x += data.dx;
            players[playerId].y += data.dy;
        }

        // Check for gem collection
        gems.forEach(gem => {
            if (!gem.collected && Math.abs(gem.x - players[playerId].x) < 20 && Math.abs(gem.y - players[playerId].y) < 20) {
                gem.collected = true;
                players[playerId].gems++;
            }
        });
    });

    ws.on('close', () => {
        delete players[playerId];
    });
});

setInterval(() => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ players, gems, fires }));
        }
    });
}, 1000 / 60); // 60 FPS

server.listen(8000, () => {
    console.log('Server is listening on http://localhost:8000');
});
