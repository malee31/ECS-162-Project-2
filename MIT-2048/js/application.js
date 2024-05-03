// This file has been completely modified and customized
// The game manager is now stored and used to periodically make random moves if the user doesn't to make life harder
const restartButton = document.querySelector(".restart-button");
const retryButton = document.querySelector(".retry-button");
const tickBar = document.getElementById("tick-bar");
const initialDecisionTime = 3;  // Starts on a 3-second countdown
const minTime = 0.75;  // 0.75s minimum time to decide
const timeReductionRate = 0.5;  // Time to decide reduces by 0.05s per cycle
let gameManager = null;

function resetTicking() {
	initialTime = initialDecisionTime;
	updateTickSpeed(10);
	timerReset();
	onTick = () => {
		// Stop timer if it ended
		if(gameManager.isGameTerminated()) timerStop();

		const percentageRemaining = (1 - getElapsed() / initialTime) * 100;

		// Animate ticking time remaining bar width from 100% to 0%
		tickBar.style = `width: ${percentageRemaining.toFixed(2)}%`;
	};

	onZero = () => {
		// Move random direction
		gameManager.move(Math.floor(Math.random() * 4));

		// Adjust and reduce tick duration each cycle
		if(initialTime > minTime) {
			initialTime = Math.max(initialTime - timeReductionRate, minTime);
		}

		// Reset timer again
		timerReset();
		timerStart();
	};

	timerStart();
}

function start() {
	gameManager = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);

	// Add reset listeners
	retryButton.addEventListener("click", () => resetTicking());
	restartButton.addEventListener("click", () => resetTicking());
	resetTicking();
}

// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(start);