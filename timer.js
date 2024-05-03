// This file is intended to be shared among all the games.
// Treat these variables as configuration settings and change them from other JS files as needed (No setters).
// Note: all units are in seconds except tickSpeed which is in milliseconds
let initialTime = 30;
let timeRemaining = initialTime;
let timeElapsed = 0;
let timerInterval = -1;
let tickSpeed = 1000;
let timerDecreasing = true;  // Set false to increase instead
// Set these function values before starting the timer to set up a listener
let onTick = () => {};
let onZero = () => {};

function timerStop() {
	if(timerInterval === -1) return;

	clearInterval(timerInterval);
	timerInterval = -1;
}

// Starts timer if it hasn't already. Calls onTick and onZero as needed
function timerStart() {
	if(timerInterval === -1) return;

	timerInterval = setInterval(() => {
		const tickSeconds = tickSpeed / 1000;

		timeElapsed += tickSeconds;
		if(timerDecreasing) {
			timeRemaining -= tickSeconds;
		} else {
			timeRemaining += tickSeconds;
		}

		onTick();

		if(timeRemaining <= 0) {
			// Readjust elapsed to never exceed timeRemaining
			timeElapsed -= Math.abs(timeRemaining);
			timeRemaining = 0;

			onZero();
			timerStop();
		}
	}, tickSpeed);
}

function timerReset() {
	timeElapsed = 0;
	timeRemaining = initialTime;

	// Restart timer if it is running
	if(timerInterval !== -1) {
		timerStop();
		timerStart();
	}
}

/**
 * Utility function that converts number of seconds to mm:ss format
 * @param {number} seconds
 * @return {string}
 */
function formatSeconds(seconds) {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	let formattedString = "";
	if(mins < 10) {
		formattedString += "0";
	}
	formattedString += mins;

	formattedString += ":";

	if(secs < 10) {
		formattedString += "0";
	}
	formattedString += secs;

	return formattedString;
}
