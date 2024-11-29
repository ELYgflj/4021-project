const SignInForm = (function() {
    // This function initializes the UI
    const initialize = function() {
        // Populate the avatar selection
        console.log("hi 1")
        // Hide it
        $("#signin-overlay").hide();

        // Submit event for the signin form
        $("#signin-form").on("submit", (e) => {
            // Do not submit the form
            e.preventDefault();

            // Get the input fields
            const username = $("#signin-username").val().trim();
            const password = $("#signin-password").val().trim();
            console.log("check pt3");
            // Send a signin request
            Authentication.signin(username, password,
                () => {
                    hide();
                    //UserPanel.update(Authentication.getUser());
                    //UserPanel.show();
                    $(".signout-button").prop('disabled', false);
                    Socket.connect();
                    $(".start-btn").prop('disabled', false);
                },
                (error) => { $("#signin-message").text(error); }
            );
        });

        // Submit event for the register form
        $("#register-form").on("submit", (e) => {
            // Do not submit the form
            e.preventDefault();

            // Get the input fields
            const username = $("#register-username").val().trim();
            const password = $("#register-password").val().trim();
            const confirmPassword = $("#register-confirm").val().trim();

            // Password and confirmation does not match
            if (password != confirmPassword) {
                $("#register-message").text("Passwords do not match.");
                return;
            }

            // Send a register request
            Registration.register(username, password,
                () => {
                    $("#register-form").get(0).reset();
                    $("#register-message").text("You can sign in now.");
                },
                (error) => { $("#register-message").text(error); }
            );
        });
    };

    // This function shows the form
    const show = function() {
        $("#front-page-container").fadeIn(500);
        $("#signin-overlay").fadeIn(500);
    };

    // This function hides the form
    const hide = function() {
        $("#signin-form").get(0).reset();
        $("#signin-message").text("");
        $("#register-message").text("");
        $("#signin-overlay").fadeOut(500);
    };

    return { initialize, show, hide };
})();


const gameStartPanel = (function() {
    
    const initialize = function() {
        console.log("hi 2");
        $(".signout-button").on("click", () => {
            // Send a signout request
            Authentication.signout(
                () => {
                    Socket.disconnect();
                    SignInForm.show();
                    $(".signout-button").prop("disabled", true); // Use prop instead of disabled
                    $("#log_in_successful").text("");
                }
            );
        });
        $(".start-btn").on("click", () => {
            $(".start-btn").prop('disabled', true);
            $(".start-btn").text("Waiting")
            console.log("Press start button");
            Socket.requestStart();
            console.log(gammingpanel.getPlayerId())
            ////
        });
    };


    const show = function() {
        $("#game-start-panel").fadeIn(500);
    };

    const hide = function() {
        $("#log_in_successful").text("");
        $("#game-start-panel").fadeOut(500);
    };

    return { initialize, show, hide };
})();

const gameOverPanel = (function() {
    const initialize = function() {
        $(".signout-button").on("click", () => {
            // Send a signout request
            Authentication.signout(
                () => {
                    hide();
                    Socket.disconnect();
                    SignInForm.show();
                    $(".signout-button").prop("disabled", true); // Use prop instead of disabled
                    $("#log_in_successful").text("");
                }
            );
        });
        $(".start-btn").on("click", () => {
            $(".start-btn").prop('disabled', true);
            $(".start-btn").text("Waiting")
            console.log("Press start button");
            Socket.requestStart();
            console.log("request successful")
            console.log(gammingpanel.getPlayerId())
            ////
        });
    };

    const handleEndGame = function(){
        Socket.sendEndGame();
        gammingpanel.hide();
        show();
    }

    const show = function() {
        $("#game-over-container").fadeIn(500);
    };

    const hide = function() {
        $("#game-over-container").fadeOut(500);
    };

    return { initialize, show, hide, handleEndGame };
})();

const gammingpanel = (function() {
    let playerId = -1;
    let player_change = -1;
    let player_x = -1;
    let player_y = -1;
    let canPlay = false;
    let gameStart = false;
    const initialize = function(){
        $("#game-container").on("mousedown", function(event) {
            /* 获取鼠标点击位置 */
            let mouseX = event.clientX; // 获取鼠标的 X 坐标
            let mouseY = event.clientY; // 获取鼠标的 Y 坐标
            /* 处理鼠标按下，移动玩家到点击位置 */
            //player1.moveTo(mouseX, mouseY); // 假设 player1 有 moveTo 方法
            // io.exit()
            const content = {
                playerId:getPlayerId(),
                x: mouseX,
                y: mouseY,

            };
            Socket.playermove(content);
        });
    };

    const setPlayerId = function(id){
        playerId = id;
        console.log(playerId);
    }
    const setPlayerchange = function(id){
        player_change = id;
    }
    const setplayerx = function(id){
        player_x = id;
    }
    const setplayery= function(id){
        player_y = id;
    }
    const getPlayerchange = function(){
        return player_change;
    }
    const getplayerx = function(){
        return player_x;
    }
    const getplayery= function(){
        return player_y;
    }
    const getGameStart = function(){
        return gameStart;
    }
    const startGame = function(){
        gameStart = true;
        $(".start-btn").prop('disabled', false);
        $(".start-btn").text("Start");
        gameOverPanel.hide();
        $("#front-page-container").fadeOut(500);

        $("#game-container").fadeIn(500);

        const canvas = document.getElementById("gameCanvas");
        const context = canvas.getContext("2d");
        const gameArea = BoundingBox(context, 165, 60, 420, 800);
        const walls = [BoundingBox(context, 310, 200, 320, 800)];
        let gameStartTime = 0;   
        const totalGameTime = 20; 
        let player1 = Player(context, 427, 240, gameArea, walls); // 玩家 1
        let player2 = Player2(context, 427, 240, gameArea, walls); // 玩家 2
        let gems = [Gem(context, 427, 350, "green")];
        const cornerPoints = gameArea.getPoints();
        let collectedGems = 0;
        let fires = [
            Fire(context, cornerPoints.topLeft[0], cornerPoints.topLeft[1], "realfire"),
            Fire(context, cornerPoints.topRight[0], cornerPoints.topRight[1], "realfire"), 
            Fire(context, cornerPoints.bottomLeft[0], cornerPoints.bottomLeft[1], "realfire"), 
            Fire(context, cornerPoints.bottomRight[0], cornerPoints.bottomRight[1], "realfire")
        ];
        drawGame(0);   
        // socket.onmessage = function(event) {
        //     const data = JSON.parse(event.data);
        //     const players = data.players;
        //     Object.assign(players, {
        //         player1: { name: "Alice", score: 0 },
        //         player2: { name: "Bob", score: 0 }
        //     });
        //     drawGame(0);
        // };

        function drawGame(now) {
            if (gameStartTime == 0) gameStartTime = now;
            const gameTimeSoFar = now - gameStartTime;
            const timeRemaining = Math.ceil((totalGameTime * 1000 - gameTimeSoFar) / 1000);
            $("#time-remaining").text(timeRemaining);
            if(timeRemaining == 0){
                gameStart = false;
                hide();
                gameOverPanel.handleEndGame();
                return
            }
            context.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < walls.length; i++) {
                context.fillStyle = 'white'; // 设置填充颜色
                context.fillRect(200, 330, 600, 10); // 绘制墙壁
            }

            gems.forEach(gem => {
                if (!gem.collected) {
                    gem.update(now);
                    gem.draw();
                }
            });
            console.log(getPlayerchange());
            if(getPlayerchange()!=-1){
                if(getPlayerchange()==0){
                    player1.moveTo(getplayerx(),getplayery())
                    setPlayerchange(-1)
                }
                else{
                    player2.moveTo(getplayerx(),getplayery())
                    setPlayerchange(-1)
                }
            }
            player1.update(now);
            player1.draw();
            player2.update(now);
            player2.draw();

            fires.forEach(f => f.update(now));
            fires.forEach(f => f.draw());

            requestAnimationFrame(drawGame); // 循环调用绘制函数
        }

        // 当游戏开始按钮被点击时
        // $("#game-start").on("click", function() {
        //     $("#game-start").hide(); // 隐藏开始界面
        //     // 游戏逻辑开始
        //     $("#game-container").on("mousedown", function(event) {
        //         const mouseX = event.clientX; // 获取鼠标点击位置
        //         const mouseY = event.clientY; // 获取鼠标的 Y 坐标
        //         // if(playerId==0){
        //         //     player1.moveTo(mouseX, mouseY);
        //         // }
        //         // else{
        //         //     player2.moveTo(mouseX, mouseY); // 假设 player1 有 moveTo 方法
        //         // }
        //         // player1.moveTo(mouseX, mouseY); // 假设 player1 有 moveTo 方法
        //     });
        //     requestAnimationFrame(drawGame); // 开始游戏的绘制循环
        // });
    };

    const setCanPlay = function(play){
        canPlay = play;
    }
    const getPlayerId = function(){
        return playerId;
    }
    const getCanPlay = function(){
        return canPlay;
    }
    const show = function() {
        $("#game-container").fadeIn(500);
    };

    const hide = function() {
        $("#game-container").fadeOut(500);
    };
    return { initialize, show, hide, setPlayerId,startGame,setCanPlay,getCanPlay,getPlayerId
        ,setPlayerchange,setplayerx ,setplayery,getPlayerchange,getplayerx,getplayery, getGameStart
     };
}

)();



const UI = (function() {
    // This function gets the user display
    const getUserDisplay = function(user) {
        return $("<div class='field-content row shadow'></div>")
            .append($("<span class='user-avatar'>" +
			        Avatar.getCode(user.avatar) + "</span>"))
            .append($("<span class='user-name'>" + user.name + "</span>"));
    };

    // The components of the UI are put here
    const components = [SignInForm, gameStartPanel, gameOverPanel,gammingpanel];

    // This function initializes the UI
    const initialize = function() {
        // Initialize the components
        for (const component of components) {
            component.initialize();
        }
    };

    return { getUserDisplay, initialize };
})();

