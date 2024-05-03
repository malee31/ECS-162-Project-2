const scoreText = document.getElementById("score");
const timeText = document.getElementById("time");
const playArea = document.getElementById("tap-play-area");
const spawnZone = document.getElementById("tap-spawn-zone");
const statOverlay = document.getElementById("tap-overlay");
// Spawn rate as a percentage. Calculated 10 times a second
let initialButtonPoints = 15;
let maxPenalty = -0.5;
let spawnRate = 0.1;
let points = 0;
let gameRunning = true;

function spawnButton(xPercent, yPercent) {
	const tapButton = document.createElement("button");
	tapButton.classList.add("tap-button");
	// Random position
	tapButton.style = `top: ${xPercent}%; left: ${yPercent}%`;
	tapButton.innerText = initialButtonPoints;

	// Longer lived buttons give less, or even negative, points. Lifetime is measured in tenths of a second
	let lifetime = 0;
	const buttonTimer = setInterval(() => {
		lifetime++;
		const value = initialButtonPoints - lifetime;
		tapButton.innerText = (value).toString();

		// Expire the button once it reaches maximum penalty
		if(value <= maxPenalty) {
			handleDisperse();
		}
	}, 100);

	const handleDisperse = () => {
		// Add more points based on how fast the button was tapped
		points += Math.max(initialButtonPoints - lifetime, maxPenalty);
		updateScore();

		// Button deletes self and cleans up
		tapButton.parentNode.removeChild(tapButton);
		clearInterval(buttonTimer);
	};

	// Put button into action
	tapButton.addEventListener("click", handleDisperse);
	spawnZone.appendChild(tapButton);
}

function randomPercent() {
	return Math.floor(Math.random() * 101);
}

function updateScore() {
	scoreText.innerText = points;
}

function endGame() {
	const elapsed = timeElapsed;

	document.getElementById("stats-points").innerText = points;
	document.getElementById("stats-rate").innerText = points / elapsed;
	// Show overlay
	statOverlay.style = "";

	timerReset();
	timeText.innerText = formatSeconds(initialTime);
	gameRunning = false;
}

function resetGame() {
	points = 0;
	gameRunning = false;
	updateScore();
}

function initializeGame() {
	resetGame();

	// Add start game when game area is clicked
	playArea.addEventListener("click", () => {
		if(gameRunning) return;
		resetGame();

		statOverlay.style = "z-index: -1; opacity: 0";
		timerStart();
		gameRunning = true;
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

initializeGame();
