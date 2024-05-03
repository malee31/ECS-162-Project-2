// This file has been completely modified and customized
// The game manager is now stored and used to periodically make random moves if the user doesn't to make life harder
const tickBar = document.getElementById("tick-bar");
let gameManager = null;

function start() {
	gameManager = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);

	initialTime = 2;
	tickSpeed = 10;
	timerReset();
	onTick = () => {
		const percentageRemaining = (1 - timeElapsed / initialTime) * 100;

		tickBar.style = `width: ${percentageRemaining.toFixed(2)}%`;
	};

	onZero = () => {
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