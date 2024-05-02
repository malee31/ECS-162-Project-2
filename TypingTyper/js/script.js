const typedText = document.querySelector(".type-container span");
const inputText = document.getElementById("type-area");
const resetButton = document.querySelector(".restart-container button");
const timer = document.querySelector("#timer");
let characters;
let correctness;
let typeIndex;
let startedTyping;
let totalChars;
let errors;
let countdown = 30;
let value = 30;
let timeLeft = 30;


// TODO: deal with index out of bounds
function onType(keyPressed) {
	if(keyPressed === characters[typeIndex].innerText) {
		if(startedTyping === 0) {
			typeCountdown();
		}
		characters[typeIndex].style = "color: #FFDFE2;";
		typeIndex++;
		totalChars++;
		correctness.push("o");
		characters[typeIndex].style = "text-decoration: underline; text-decoration-color: #FFDFE2";
	} else if(keyPressed === "Backspace") {
		characters[typeIndex].style = "text-decoration: none;";
		if(typeIndex > 0) {
			typeIndex--;
			if(correctness.pop() === "x") {
				errors--;
			}
			// totalChars++;
		}
		characters[typeIndex].style = "color: #D8A4BA;";
		characters[typeIndex].style = "text-decoration: underline; text-decoration-color: #FFDFE2";

	} else if(keyPressed.length === 1) {
		if(startedTyping === 0) {
			typeCountdown();
		}
		characters[typeIndex].style = "color: #AE0E2A;";
		correctness.push("x");

		// highlights space if incorrect
		if(characters[typeIndex].innerText === " ") {
			characters[typeIndex].style = "background-color: #AE0E2A;"
		}

		typeIndex++;
		totalChars++;
		errors++;
		characters[typeIndex].style = "text-decoration: underline; text-decoration-color: #FFDFE2;";
	}
}

function setupTyping() {
	inputText.addEventListener("keydown", e => onType(e.key));

	// TODO: for some reason clicking in between the spaces also resets the time...
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
		clearInterval(countdown);
		inputText.disabled = true;
		startedTyping = 0;

		// TODO: create overlay w/ stats
		// stats calculations
		console.log("chars: ", totalChars); // total chars including ones that were deleted
		console.log("errors: ", errors);
		value = document.querySelector('input[name="time"]:checked').value;
		let wpm = Math.round((totalChars / 5 - errors) / (value / 60));
		let accuracy = (((totalChars - errors) / totalChars) * 100).toFixed(2);
		console.log("wpm: ", wpm);
		console.log("accuracy: ", accuracy);
	}

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

	textToType[0].split('').forEach(char => {
		typedTextHTML += `<span>${char}</span>`;
	});

	typedText.innerHTML = typedTextHTML;

	typedText.childNodes.forEach(span => {
		characters.push(span);
	});
}

reset();
setupTyping();

resetButton.addEventListener("click", reset);
