// Select elements
const typedText = document.querySelector(".type-container span");
const inputText = document.getElementById("type-area");
const resetButton = document.getElementById("restart-button");
const overlayResetButton = document.getElementById("overlay-restart");
const timer = document.getElementById("timer");

const statChars = document.getElementById("stats-characters");
const statErrors = document.getElementById("stats-errors");
const statWPM = document.getElementById("stats-wpm");
const statAccuracy = document.getElementById("stats-accuracy");
const statOverlay = document.getElementById("stats-overlay");

// Typing stats
let paragraphIndex, characters, correctness, typeIndex, startedTyping, totalChars, errors;

function handleCharacter(char) {
	// Start the timer once a character is pressed
	if(startedTyping === 0) {
		typeCountdown();
	}

	// Remove cursor underline
	characters[typeIndex].classList.remove("underline", "color-default");

	const cursorChar = characters[typeIndex].innerText;

	// Updates colors and correctness/errors appropriately
	if(char === cursorChar) {
		characters[typeIndex].classList.add("color-correct");

		correctness.push(true);
	} else {
		characters[typeIndex].classList.add("color-incorrect");

		// highlights space if incorrect
		if(cursorChar === " ") {
			characters[typeIndex].classList.add("highlight-incorrect");
		}

		errors++;
		correctness.push(false);
	}

	typeIndex++;
	totalChars++;
	// Move cursor underline
	characters[typeIndex].classList.add("underline");
}

function handleBackspace() {
	// Check if able to backspace
	if(typeIndex <= 0) return;
	console.log("BACK")

	// Move cursor styling and undo styling and statistics on previous character
	characters[typeIndex].classList.remove("underline");
	typeIndex--;
	if(correctness.pop() === false) {
		errors--;
	}
	totalChars--;
	characters[typeIndex].classList.remove("color-correct", "color-incorrect", "highlight-incorrect");
	characters[typeIndex].classList.add("color-default", "underline");
}

// TODO: fix auto-focus for typing, only focus is not focused
function onType(keyPressed) {
	// Do nothing if text length is exceeded
	if(typeIndex >= characters.length) return;

	// Special case: Backspace needs to backtrack
	if(keyPressed === "Backspace") {
		handleBackspace();
	}

	// Singular characters only (Ignores special keys like "Enter" and "Shift")
	if(keyPressed.length === 1) {
		handleCharacter(keyPressed);
	}

	// Game has ended
	if(typeIndex >= characters.length) {
		endGame();
	}
}

function initializeGame() {
	// Set up listeners for key presses
	inputText.addEventListener("keydown", e => onType(e.key));
	document.addEventListener("keydown", e => {
		// Automatically focus the input and type first character if a key is pressed anywhere
		if(document.activeElement === inputText || e.key.length !== 1) return;
		inputText.focus();
		onType(e.key);
	});

	// Set up listeners for time changes
	document.getElementById("time-select").addEventListener("click", () => {
		initialTime = Number(document.querySelector('input[name="time"]:checked').value);
		timer.innerText = formatSeconds(initialTime);
		reset();
	});

	// Set up listeners for reset button
	resetButton.addEventListener("click", reset);
	overlayResetButton.addEventListener("click", reset);

	// Reset everything
	reset();
}

function typeCountdown() {
	initialTime = Number(document.querySelector('input[name="time"]:checked').value);
	timerReset();

	onTick = () => {
		timer.innerText = formatSeconds(timeRemaining);
	};

	onZero = () => {
		endGame();
	};

	timerStart();
	startedTyping = 1;
}

function endGame() {
	// Get elapsed time from timer and reset it
	timerStop();
	const elapsed = timeElapsed;
	timerReset();

	startedTyping = 0;
	inputText.disabled = true;

	// stats calculations
	statChars.innerText = totalChars;
	statErrors.innerText = errors;
	const wpm = Math.round((totalChars / 5 - errors) / (elapsed / 60));
	statWPM.innerText = Math.max(wpm, 0).toString();
	const accuracy = ((totalChars - errors) / totalChars) * 100;
	statAccuracy.innerText = accuracy.toFixed(2);

	// Show overlay
	statOverlay.style = "";
}

function reset() {
	startedTyping = 0;

	initialTime = Number(document.querySelector('input[name="time"]:checked').value);
	timerStop();
	timerReset();

	timer.innerHTML = formatSeconds(initialTime);
	inputText.value = "";
	inputText.disabled = false;
	characters = [];
	correctness = [];
	typeIndex = 0;
	totalChars = 0;
	errors = 0;

	// Regenerate paragraph to type
	let typedTextHTML = "";
	paragraphIndex = Math.floor(Math.random() * textToType.length);
	textToType[paragraphIndex].split('').forEach(char => {
		typedTextHTML += `<span>${char}</span>`;
	});

	typedText.innerHTML = typedTextHTML;

	typedText.childNodes.forEach(span => {
		characters.push(span);
	});

	// Hide overlay
	statOverlay.style = "z-index: -1; opacity: 0";
}

// Setup listeners (one-time call)
initializeGame();
