const Socket = (function() {
    // This stores the current Socket.IO socket
    let socket = null;

    // This function connects the server and initializes the socket
    const connect = function() {
        socket = io();

        // Wait for the socket to connect successfully
        socket.on("connect", () => {
            console.log("Connected to the server");
        });

        // Set up the game state event
        socket.on('gameState', (data) => {
            const { players, items, portals } = JSON.parse(data);
            updateGame(players, items, portals);
        });

        // Set up the timer event
        socket.on('timer', (data) => {
            document.getElementById('time').textContent = data.time;
        });

        // Set up the game over event
        socket.on('gameOver', () => {
            UI.showGameOver();
        });
    };
    // This function creates a character for user when the user press on the button
    const createCharacter = function(){
        console.log("pt 1")
        if (socket) {
            socket.emit('createCharacter');
        }else{
            console.log("pt 3")
        }
    }
    // This function sends a request to start the game
    const startGame = function() {
        if (socket) {
            socket.emit('startGame');
        }
    };

    // This function sends a move event to the server
    const move = function(direction) {
        if (socket && socket.connected) {
            socket.emit('move', direction);
        }
    };

    // This function updates the game UI with the current state
    const updateGame = function(players, items, portals) {
        const gameDiv = document.getElementById('game');
        gameDiv.innerHTML = ''; // Clear the game area

        // Update players
        for (const id in players) {
            const player = document.createElement('div');
            player.classList.add('player');
            player.style.left = `${players[id].x * 20}px`;
            player.style.top = `${players[id].y * 20}px`;
            gameDiv.appendChild(player);
        }

        // Update items
        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');
            itemDiv.style.left = `${item.x * 20}px`;
            itemDiv.style.top = `${item.y * 20}px`;
            gameDiv.appendChild(itemDiv);
        });

        // Update portals
        portals.forEach(portal => {
            const portalDiv = document.createElement('div');
            portalDiv.classList.add('portal');
            portalDiv.style.left = `${portal.x * 20}px`;
            portalDiv.style.top = `${portal.y * 20}px`;
            gameDiv.appendChild(portalDiv);
        });
    };

    return { connect, createCharacter, startGame, move };
})();