const express = require("express");
const fs = require("fs");
const session = require("express-session");
const app = express();
app.use(express.static("public"));
app.use(express.json());
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer( app );
const io = new Server(httpServer);
const bcrypt = require("bcrypt");

const sockets = {}

const gameSession = session({
    secret: "game",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 300000 }
});
app.use(gameSession);

let players = {};
let gems = [];
let fires = [];
const MAX_GEMS = 5;
const MAX_FIRES = 3;

// Initialize gems and fires
function containWordCharsOnly(text) {
    return /^\w+$/.test(text);
}

// Handle the /register endpoint
app.post("/register", (req, res) => {
    // Get the JSON data from the body
    const { username, password } = req.body;

    //
    // D. Reading the users.json file
    //
    const users = JSON.parse(fs.readFileSync("./data/users.json"));
    //
    // E. Checking for the user data correctness
    //
    if(!username || !password){
        res.json({
            status: "error",
            error: "Fill in username/avatar/name/password"
        });
        return;
    }
    if(!containWordCharsOnly(username)){
        res.json({
            status: "error",
            error: "Username should only contain characters"
        })
        return;
    }
    if(username in users){
        res.json({
            status: "error",
            error: "Username used"
        })
        return;
    }
    
    //
    // G. Adding the new user account
    //
    const hash = bcrypt.hashSync(password,10);
    let wins = 0;
    users[username] = {hash,wins};
    //
    // H. Saving the users.json file
    //
    fs.writeFileSync("./data/users.json",
        JSON.stringify(users,null, " ")
    );
    //
    // I. Sending a success response to the browser
    //
    res.json({status: "success"});
    // Delete when appropriate
});

// Handle the /signin endpoint
app.post("/signin", (req, res) => {
    // Get the JSON data from the body
    const { username, password } = req.body;
    console.log("check pt2");
    //
    // D. Reading the users.json file
    //
    const users = JSON.parse(fs.readFileSync("./data/users.json"));
    //
    // E. Checking for username/password
    //
    if(!(username in users)){
        res.json({
            status: "error",
            error: "Username not found"
        })
        return;
    }
    const hash = users[username].hash;
    if (!(bcrypt.compareSync(password, hash))){
        res.json({
            status: "error",
            error: "Wrong password"
        })
        return;
    }
    //
    // G. Sending a success response with the user account
    //
    req.session.user = {username};
    console.log("check pt1");
    res.json({status: "success", user: {username}});
    // Delete when appropriate
});

// Handle the /validate endpoint
app.get("/validate", (req, res) => {
    //
    // B. Getting req.session.user
    //
    const user = req.session.user;
    //
    // D. Sending a success response with the user account
    //
    if(user){
        res.json({status: "success", user});
        return;
    }else{
        res.json({status: "error", error: "Validation fail"});
    }
    // Delete when appropriate
});

// Handle the /signout endpoint
app.get("/signout", (req, res) => {

    //
    // Deleting req.session.user
    //
    req.session.destroy();
    //
    // Sending a success response
    //
    res.json({status: "success"});
    // Delete when appropriate
});

function initializeGameObjects() {
    for (let i = 0; i < MAX_GEMS; i++) {
        gems.push({ x: Math.random() * 800, y: Math.random() * 480, collected: false });
    }
    for (let i = 0; i < MAX_FIRES; i++) {
        fires.push({ x: Math.random() * 800, y: Math.random() * 480 });
    }
}

initializeGameObjects();

io.on('connection', (socket) => {
    const playerId = Date.now(); // Simple unique ID based on timestamp
    players[playerId] = { x: 427, y: 240, gems: 0 }; // Initial position and gems count
    socket.on("request_start",() => {
        if(Object.keys(sockets).length<2){
            if(Object.keys(sockets).length == 0){
                sockets[socket.id] = socket;
                socket.emit(("your player id"),0);
            }
            else{
                if( sockets[socket.id] == null){
                    sockets[socket.id] = socket;
                    socket.emit(("your player id"),1);
                    io.emit("start response");
                }

            }
        }
        else{
            socket.emit(("full"));
        }

    })
    socket.on("player_move", (content) => {
        console.log("Player moved to:", content); // { x: mouseX, y: mouseY }

        // 处理移动逻辑，例如更新玩家位置
        // 假设你有 players 对象来存储玩家信息 
        // const playerId = socket.id; // 使用 socket.id 唯一标识每个玩家
        // players[playerId] = {
        //     x: content.x,
        //     y: content.y
        // };
        // 可以选择广播给其他客户端
        const position = {
            playerId:content.playerId,
            x: content.x,
            y: content.y
        }
        io.emit("playerposition", JSON.stringify(position));
    });

    
    socket.on('message', (message) => {
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
    socket.on('close', () => {
        delete sockets[socket.id];
    });

    // socket.on("request_start")
    socket.on('connection', (socket) => {
        console.log('A user connected');
    
        // 监听 playermove 事件



    
    });
});

//setInterval(() => {
//    io.clients.forEach((client) => {
//        if (client.readyState === WebSocket.OPEN) {
//            client.send(JSON.stringify({ players, gems, fires }));
//        }
//    });
//}, 1000 / 60); // 60 FPS

httpServer.listen(8000, () => {
    console.log("The game server has started...");
});
