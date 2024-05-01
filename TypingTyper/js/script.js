// const timeLeft = document.querySelector('input[name="time"]:checked').value;
// document.getElementById("test11").innerHTML = timeLeft;

const typedText = document.querySelector(".type-container p");

function loadText() {
    typedText.innerHTML = "";

    textToType[0].split('').forEach(char => {
        let span = `<span>${char}</span>`
        typedText.innerHTML += span;
    });
}

loadText();
// window.onload = function() {
//     typedText.innerHTML = textToType[0];
// }