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
                    $("#start-btn").prop('disabled', false);
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
        $("#start-btn").on("click", () => {
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
                    Socket.disconnect();
                    SignInForm.show();
                    $(".signout-button").prop("disabled", true); // Use prop instead of disabled
                    $("#log_in_successful").text("");
                }
            );
        });
        $("#re-start-btn").on("click", () => {
            console.log("Press re-start button")
        });
    };

    const show = function() {
        $("#game-over-container").fadeIn(500);
    };

    const hide = function() {
        $("#game-over-container").fadeOut(500);
    };

    return { initialize, show, hide };
})();

const gammingpanel = (function() {
    let playerId = -1;
    let canPlay = false;
    const initialize = function(){
        $("#game-container").on("mousedown", function(event) {
            /* 获取鼠标点击位置 */
            let mouseX = event.clientX; // 获取鼠标的 X 坐标
            let mouseY = event.clientY; // 获取鼠标的 Y 坐标
            /* 处理鼠标按下，移动玩家到点击位置 */
            //player1.moveTo(mouseX, mouseY); // 假设 player1 有 moveTo 方法
            // io.exit()
            const content = {
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
    const startGame = function(){
        $("#front-page-container").fadeOut(500);
        $("#game-container").fadeIn(500);
        console.log("Everythin ok!")
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
    return { initialize, show, hide, setPlayerId,startGame,setCanPlay,getCanPlay,getPlayerId };
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
