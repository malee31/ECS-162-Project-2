const scoreText = document.getElementById("score");
const spawnZone = document.getElementById("tap-spawn-zone");
// Spawn rate as a percentage. Calculated 10 times a second
let initialButtonPoints = 15;
let maxPenalty = -0.5;
let spawnRate = 0.1;
let points = 0;

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
	}

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

let spawnInterval = setInterval(() => {
	if(Math.random() < spawnRate) {
		spawnButton(randomPercent(), randomPercent());
	}
}, 100);