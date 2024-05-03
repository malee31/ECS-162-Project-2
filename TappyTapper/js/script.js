const scoreText = document.getElementById("score");
const timeText = document.getElementById("time");
const playArea = document.getElementById("tap-play-area");
const spawnZone = document.getElementById("tap-spawn-zone");
const statOverlay = document.getElementById("tap-overlay");
const overlayRestart = document.getElementById("restart-button");
// Spawn rate as a percentage. Calculated 10 times a second
let initialButtonPoints = 15;
let maxPenalty = -0.5;
let spawnRate = 0.1;
let points = 0;
let buttonsClicked = 0;
let buttonsMissed = 0;
let gameRunning = true;

/**
 * Spawns a new button to click at the x and y positions specified
 * Buttons will take care of its own expiration and point tracking/granting
 * @param {number} xPercent - Percentage from 0-100
 * @param {number} yPercent - Percentage from 0-100
 */
function spawnButton(xPercent, yPercent) {
	// Button element chosen instead of `div` for accessibility reasons.
	// It is possible to play the game with a keyboard instead of a mouse
	const tapButton = document.createElement("button");
	tapButton.classList.add("tap-button");
	// Random position
	tapButton.style = `top: ${xPercent}%; left: ${yPercent}%`;
	tapButton.innerText = initialButtonPoints;

	// Longer lived buttons give less, or even negative, points. Lifetime is measured in tenths of a second
	let lifetime = 0;
	// Continuously decrement the number of points a button is worth
	const buttonTimer = setInterval(() => {
		lifetime++;
		const value = initialButtonPoints - lifetime;
		tapButton.innerText = (value).toString();

		// Expire the button once it reaches maximum penalty
		if(value <= maxPenalty) {
			handleDisperse();
		}
	}, 100);

	/**
	 * Handles the point granting and deletion of the button
	 */
	const handleDisperse = () => {
		// Add more points based on how fast the button was tapped
		points += Math.max(initialButtonPoints - lifetime, maxPenalty);
		if(Math.max(initialButtonPoints - lifetime, maxPenalty) === maxPenalty) {
			buttonsMissed++;
		} else {
			buttonsClicked++;
		}
		updateScore();

		// Button deletes self and cleans up
		tapButton.parentNode.removeChild(tapButton);
		clearInterval(buttonTimer);
	};

	// Put button into action
	tapButton.addEventListener("click", handleDisperse);
	spawnZone.appendChild(tapButton);
}

// Random number from 0-100 inclusive
function randomPercent() {
	return Math.floor(Math.random() * 101);
}

// Updates the score in HTML
function updateScore() {
	scoreText.innerText = points;
}

// Ends the game and shows stats
function endGame() {
	const elapsed = getElapsed();

	document.getElementById("stats-points").innerText = points;
	document.getElementById("stats-rate").innerText = (points / elapsed).toFixed(2);
	document.getElementById("buttons-clicked").innerText = buttonsClicked.toString();
	document.getElementById("buttons-missed").innerText = buttonsMissed.toString();
	// Show overlay
	statOverlay.classList.remove("game-overlay-hidden");

	timerReset();
	timeText.innerText = formatSeconds(initialTime);
	gameRunning = false;
}

// Resets the game to prepare to play again
function resetGame() {
	points = 0;
	gameRunning = false;
	updateScore();
}

// Initializes variables and adds all listeners
function initializeGame() {
	resetGame();

	// Add start game when game area is clicked
	const restartHandler = () => {
		if(gameRunning) return;
		resetGame();

		statOverlay.classList.add("game-overlay-hidden");
		timerStart();
		gameRunning = true;
	};
	playArea.addEventListener("click", restartHandler, { once: true });
	overlayRestart.addEventListener("click", restartHandler);

	document.getElementById("difficulty-select").addEventListener("click", () => {
		const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked').value;

		switch(selectedDifficulty) {
			// Hard
			case "3":
				spawnRate = 0.3;
				initialButtonPoints = 9;
				resetGame();
				break;

			// Medium
			case "2":
				spawnRate = 0.15;
				initialButtonPoints = 10;
				resetGame();
				break;

			// Easy
			case "1":
			default:
				spawnRate = 0.1;
				initialButtonPoints = 15;
				resetGame();
		}

		timeText.innerText = formatSeconds(initialTime);
		timerReset();
		gameRunning = true;
		timerStart();
	});

	setInterval(() => {
		if(!gameRunning) return;

		if(Math.random() < spawnRate) {
			spawnButton(randomPercent(), randomPercent());
		}
	}, 100);

	// Set up timer
	initialTime = 30;
	timeText.innerText = formatSeconds(initialTime);
	onTick = () => {
		timeText.innerText = formatSeconds(timeRemaining);
	};
	onZero = () => {
		endGame();
	};
}

// One-time initial initialization and setup
initializeGame();
