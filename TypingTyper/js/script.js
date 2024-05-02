const typedText = document.querySelector(".type-container span");
const inputText = document.getElementById("type-area");
const resetButton = document.querySelector(".restart-container button");
const timer = document.querySelector("#timer");
const statChars = document.getElementById("stats-characters");
const statErrors = document.getElementById("stats-errors");
const statWPM = document.getElementById("stats-wpm");
const statAccuracy = document.getElementById("stats-accuracy");
const statOverlay = document.getElementById("stats-overlay");
let paragraphIndex, characters, correctness, typeIndex, startedTyping, totalChars, errors;
let countdown = value = timeLeft = 30;

// TODO: fix auto-focus for typing, only focus is not focused
function onType(keyPressed) {
	if (typeIndex < characters.length) {
		
		if(keyPressed === characters[typeIndex].innerText) {
			if(startedTyping === 0) {
				typeCountdown();
			}
			characters[typeIndex].classList.remove("underline", "color-default");
			characters[typeIndex].classList.add("color-correct"); // = "color: #FFDFE2;";
			
			typeIndex++;
			totalChars++;
			correctness.push(true);
			characters[typeIndex].classList.add("underline");
		} else if(keyPressed === "Backspace") {
			characters[typeIndex].classList.remove("underline");
			if(typeIndex > 0) {
				typeIndex--;
				if(correctness.pop() === false) {
					errors--;
				}
				totalChars++;
			}
			characters[typeIndex].classList.remove("color-correct", "color-incorrect");
			characters[typeIndex].classList.add("color-default", "underline");
		} else if(keyPressed.length === 1) {
			if(startedTyping === 0) {
				typeCountdown();
			}
			characters[typeIndex].classList.remove("underline", "color-default");
			characters[typeIndex].classList.add("color-incorrect");
			correctness.push(false);

			// highlights space if incorrect
			if(characters[typeIndex].innerText === " ") {
				characters[typeIndex].classList.add("highlight-incorrect");
			}

			typeIndex++;
			totalChars++;
			errors++;
			characters[typeIndex].classList.add("underline");
		}
	}
	else {
		endGame(countdown);
	}
}

function setupTyping() {
	inputText.addEventListener("keydown", e => onType(e.key));

	document.getElementById("time-select").addEventListener("click", e => {
		value = document.querySelector('input[name="time"]:checked').value;
		timer.innerText = `00:${value}`;
		reset();
	});	
}

function typeCountdown() {
	value = document.querySelector('input[name="time"]:checked').value;
	countdown = setInterval(decrement, 1000);
	startedTyping = 1;
}

function decrement() {
	if(value > 0) {
		value--;
		let stringVal = value.toFixed();
		if(stringVal.length === 1) {
			timer.innerHTML = `00:0${value}`;
		} else {
			timer.innerHTML = `00:${value}`;
		}
	} else {
		value = document.querySelector('input[name="time"]:checked').value;
		endGame(value);
	}
}

function endGame(timeLeft) {
	clearInterval(countdown);
	inputText.disabled = true;
	startedTyping = 0;

	// stats calculations
	statChars.innerText = totalChars;
	statErrors.innerText = errors;
	const wpm = Math.max(Math.round((totalChars / 5 - errors) / (timeLeft / 60)), 0);
	statWPM.innerText = wpm;
	const accuracy = (((totalChars - errors) / totalChars) * 100).toFixed(2);
	statAccuracy.innerText = accuracy;

	statOverlay.style = "";
}

function reset() {
	startedTyping = 0;
	clearInterval(countdown);

	value = document.querySelector('input[name="time"]:checked').value;
	timer.innerHTML = `00:${value}`;
	inputText.value = "";
	inputText.disabled = false;
	characters = [];
	correctness = [];
	typeIndex = 0;
	totalChars = 0;
	errors = 0;

	let typedTextHTML = "";
	characters = [];
    paragraphIndex = Math.floor(Math.random() * textToType.length);

	textToType[paragraphIndex].split('').forEach(char => {
		typedTextHTML += `<span>${char}</span>`;
	});

	typedText.innerHTML = typedTextHTML;

	typedText.childNodes.forEach(span => {
		characters.push(span);
	});
	statOverlay.style = "z-index: -1; opacity: 0";
}

reset();
setupTyping();

resetButton.addEventListener("click", reset);
