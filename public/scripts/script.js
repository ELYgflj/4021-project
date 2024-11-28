document.addEventListener("DOMContentLoaded", function () {
    // References to DOM elements
    const loginForm = document.querySelector("#signin-form");
    const registerForm = document.querySelector("#register-form");
    const startButton = document.querySelector("#start-btn");
    const playersLoggedIn = [];
    const maxPlayers = 2;

    // Placeholder for registered users
    const users = {}; // Format: { username: password }

    // Helper function to update Start Button state
    function updateStartButtonState() {
        if (playersLoggedIn.length === maxPlayers) {
            startButton.disabled = false;
        } else {
            startButton.disabled = true;
        }
    }

    // Event Listener: Handle Login Form Submission
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.querySelector("#login-username").value.trim();
        const password = document.querySelector("#login-password").value.trim();

        if (users[username] && users[username] === password) {
            if (playersLoggedIn.includes(username)) {
                alert("This player is already logged in.");
            } else if (playersLoggedIn.length < maxPlayers) {
                playersLoggedIn.push(username);
                alert(`Player ${username} logged in successfully!`);
                updateStartButtonState();
            } else {
                alert("Two players are already logged in. Please wait.");
            }
        } else {
            alert("Invalid username or password. Please try again.");
        }

        // Clear input fields
        loginForm.reset();
    });

    // Event Listener: Handle Registration Form Submission
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.querySelector("#register-username").value.trim();
        const password = document.querySelector("#register-password").value.trim();

        if (!username || !password) {
            alert("Both fields are required!");
        } else if (users[username]) {
            alert("Username already exists. Please choose a different one.");
        } else {
            users[username] = password;
            alert(`Registration successful for ${username}! You can now log in.`);
        }

        // Clear input fields
        registerForm.reset();
    });

    // Event Listener: Handle Start Button Click
    startButton.addEventListener("click", function () {
        if (playersLoggedIn.length === maxPlayers) {
            alert(`Game starting with players: ${playersLoggedIn.join(" and ")}!`);
            // Redirect to the gameplay page (gameplay.html)
            window.location.href = "gameplay.html";
        } else {
            alert("Please wait for another player to log in.");
        }
    });

    // Initialize Start Button State
    updateStartButtonState();
});
