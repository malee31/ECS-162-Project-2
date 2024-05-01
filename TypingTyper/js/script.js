// const timeLeft = document.querySelector('input[name="time"]:checked').value;
// document.getElementById("test11").innerHTML = timeLeft;

const typedText = document.querySelector(".type-container p");
const characters = [];
let typeIndex = 0;

function loadText() {
	typedText.innerHTML = "";

	textToType[0].split('').forEach(char => {
		let span = `<span>${char}</span>`
		typedText.innerHTML += span;
	});

	typedText.childNodes.forEach(span => {
		characters.push(span);
	})

	document.getElementById("type-area").addEventListener("keydown", e => {
		const keyPressed = e.key;

		if(keyPressed === characters[typeIndex].innerText) {
			characters[typeIndex].style = "color: green;";
		} else {
			characters[typeIndex].style = "color: red;";
		}

		typeIndex++;
	});
}

loadText();
