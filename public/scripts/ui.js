const UI = (function() {
    // This function initializes the UI
    const initialize = function() {
        // Hide the game and game over screens initially
        document.getElementById('game').style.display = 'none';
        document.getElementById('game-over').style.display = 'none';

        // Set up event listeners for buttons
        document.getElementById('start-button').addEventListener('click', () => {
            Socket.connect();
            Socket.startGame();
            Socket.createCharacter();
            showGame();
        });

        document.getElementById('restart-button').addEventListener('click', () => {
            Socket.startGame();
            hideGameOver();
            showGame();
        });

        // Add event listener for keydown events for movement
        document.addEventListener('keydown', (event) => {
            if (['W', 'A', 'S', 'D'].includes(event.key.toUpperCase())) {
                Socket.move(event.key.toUpperCase());
            }
        });
    };

    // This function shows the game screen
    const showGame = function() {
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('game').style.display = 'block';
        document.getElementById('timer').style.display = 'block';
    };

    // This function hides the game over screen
    const hideGameOver = function() {
        document.getElementById('game-over').style.display = 'none';
    };

    // This function shows the game over screen
    const showGameOver = function() {
        document.getElementById('game').style.display = 'none';
        document.getElementById('game-over').style.display = 'flex';
    };

    return { initialize, showGame, showGameOver, hideGameOver };
})();

document.addEventListener('DOMContentLoaded', () => {
    UI.initialize();
});