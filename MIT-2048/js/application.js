// Modifications made: Stores the game manager and periodically makes random moves for you to make life harder
let gameManager = null;

function start() {
  gameManager = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);

  initialTime = 2;
  timerReset();
  onZero = () => {
    console.log("Out of time! Random swipe!");

    // Move random direction
    gameManager.move(Math.floor(Math.random() * 4));

    // Reset timer again
    timerReset();
    timerStart();
  };

  timerStart();
}

// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(start);