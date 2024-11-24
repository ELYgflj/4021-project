const express = require("express");
const fs = require("fs");
const session = require("express-session");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = 8000;

// Game state
let players = {};
let items = [];
let gameTime = 180; // 3 minutes in seconds
let gameStarted = false; // Track if the game has started
let speed = 50
// Fixed locations for portals
const portals = [
    { x: 5, y: 5 },
    { x: 15, y: 15 },
];

// Fixed item locations
const itemLocations = [
    { x: 3, y: 3 },
    { x: 10, y: 10 },
    { x: 7, y: 8 },
];

// Initialize items
function initializeItems() {
    items = []
    itemLocations.forEach(location => {
        const itemType = Math.floor(Math.random() * 3) + 1; // Randomize item type (1-3)
        items.push({ ...location, type: itemType });
    });
}


var i = 0;
io.on('connection', (socket) => {
    const playerId = socket.id; // Use socket ID as player ID
    
    console.log(i,": ",socket.id)
    i += 1;
    // Send the current game state to the new player
    socket.emit('gameState', JSON.stringify({ players, items, portals, gameStarted }));

    socket.on('startGame', () => {
        if (!gameStarted) {
            gameStarted = true;
            startGame();
        }
    });
    socket.on('createCharacter',()=>{
        if(gameStarted){
            console.log("pt 2")
            players[playerId] = { x: 0, y: 0, health: 100, traps: 0 };
            socket.emit('gameState', JSON.stringify({ players, items, portals, gameStarted }));
        }else{
            console.log("pt 4")
        }
    })
    socket.on('move', (direction) => {
        if (gameStarted) {
            const player = players[playerId];
            switch(direction){
                case 'W': player.y -= speed/60;
                break;
                case 'S': player.y += speed/60;
                break;
                case 'A': player.x -= speed/60;
                break;
                case 'D': player.x += speed/60;
                break;
            }
            
            // Check for item collection
            items = items.filter(item => {
                if (Math.abs(item.x - player.x) < 1 && Math.abs(item.y - player.y) < 1) {
                    // Item collected
                    if (item.type === 1) player.traps += 1; // Boom
                    if (item.type === 2) player.health += 20; // Heart
                    if (item.type === 3) player.shield = true; // Shield
                    return false; // Remove item
                }
                return true; // Keep item
            });

            
            if (Math.abs(portals[0].x -player.x) < 0.5 && Math.abs(portals[0].y - player.y) < 0.5){
                player.x = portals[1].x;
                player.y = portals[1].y;
            }else{
                if (Math.abs(portals[1].x -player.x) < 0.5 && Math.abs(portals[1].y - player.y) < 0.5){
                    player.x = portals[0].x;
                    player.y = portals[0].y;
                }
            }

            // Broadcast updated player positions
            const state = { players, items, portals };
            io.emit('gameState', JSON.stringify(state));
        }
    });

    socket.on('disconnect', () => {
        delete players[playerId];
        io.emit('gameState', JSON.stringify({ players, items, portals }) );
    });
});

// Start the game countdown
function startGame() {
    gameTime = 180;
    initializeItems();
    const countdownInterval = setInterval(() => {
        if (gameTime > 0) {
            gameTime--;
            io.emit('timer', { time: gameTime });
        } else {
            io.emit('gameOver');
            gameStarted = false; // Reset game state
            clearInterval(countdownInterval);
        }
    }, 1000);
}

app.use(express.static("public"));

httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
