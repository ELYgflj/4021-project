const Socket = (function() {
    // This stores the current Socket.IO socket
    let socket = null;

    // This function gets the socket from the module
    const getSocket = function() {
        return socket;
    };

    // This function connects the server and initializes the socket
    const connect = function() {
        socket = io();

        // Wait for the socket to connect successfully
        socket.on("connect", () => {
            // Get the online user list
            socket.emit("get users");

            // Get the chatroom messages
            socket.emit("get messages");
        });

        // Set up the users event
        socket.on("users", (onlineUsers) => {
            onlineUsers = JSON.parse(onlineUsers);

            // Show the online users
            OnlineUsersPanel.update(onlineUsers);
        });

        // Set up the add user event
        socket.on("add user", (user) => {
            user = JSON.parse(user);

            // Add the online user
            OnlineUsersPanel.addUser(user);
        });

        // Set up the remove user event
        socket.on("remove user", (user) => {
            user = JSON.parse(user);

            // Remove the online user
            OnlineUsersPanel.removeUser(user);
        });


        socket.on("start response",() => {
            //start the game
            if(gammingpanel.getCanPlay()){
                gammingpanel.startGame();
            }
        });

        socket.on("full", () =>{
            $("#full").text("FULL");
        });

        socket.on("your player id", (id) =>{
            //console.log(id);
            gammingpanel.setCanPlay(true);
            gammingpanel.setPlayerId(id);
        });
        socket.on("playerposition",(position)=> {
            position = JSON.parse(position);
            gammingpanel.setPlayerchange(position.playerId)
            gammingpanel.setplayerx(position.x)
            gammingpanel.setplayery(position.y)
        } )

        socket.on("gem_collected",(data) => {
            console.log("gem collect return");
            const {gemId} = JSON.parse(data);
            gammingpanel.gemCollected(gemId);
        })

        socket.on("player_teleported",(data) => {
            const{playerId,targetx,targety} = JSON.parse(data);
            gammingpanel.TP(playerId,targetx,targety);
        })
        
    };

    // This function disconnects the socket from the server
    const disconnect = function() {
        if(socket){
            socket.disconnect();
            socket = null;
        }
    };

    // This function sends a post message event to the server
    const postMessage = function(content) {
        if (socket && socket.connected) {
            socket.emit("post message", content);
        }
    };

    const typing = function(){
        if (socket && socket.connected) {
            socket.emit("typing");
        }
    };
    const playermove = function(content){
        if (socket && socket.connected) {
            console.log(content.x);
            socket.emit("player_move",content);
        }
    };

    const requestStart = function(){
        if (socket && socket.connected) {
            console.log("socket.requestStart")
            socket.emit("request_start");
        }
    };

    const sendEndGame = function(){
        if (socket && socket.connected) {
            console.log("sendEndGame")
            socket.emit("endGame");
        }
    }

    const playerCollectGem = function(playerId, gemId){
        if (socket && socket.connected) {
            console.log("playerCollectGem")
            socket.emit("playerCollectGem", JSON.stringify({
                playerId: playerId,
                gemId: gemId
            }));
        }
    };

    const playerTeleport = function(playerId,targetx,targety){
        if (socket && socket.connected) {
            socket.emit("playerTeleport", JSON.stringify({
                playerId: playerId,
                targetx: targetx,
                targety:targety
            }));
        }
    }

    return { getSocket, connect, disconnect, postMessage, typing ,playermove, requestStart, sendEndGame, playerCollectGem, playerTeleport};
})();

