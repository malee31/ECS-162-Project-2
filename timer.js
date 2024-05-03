/**
 * This file is intended to be shared among all the games.
 * Treat these variables as configuration settings and change them from other JS files as needed.
 * Reconfiguring anything other than `timeRemaining` while the code is running is undefined behavior.
 * There is only the guarantee that onZero() is called AFTER a timer stop
 * Note: all units are in seconds except tickSpeed which is in milliseconds
 */
// Other files are free to safely modify these two variables with other numbers at any time
let initialTime = 30;
let timeRemaining = initialTime;

// Internal variables
let _timeElapsed = 0;
let _timerInterval = -1;
let _tickSpeed = 1000;
// Set these function values before starting the timer to set up a listener
let onTick = () => {};
let onZero = () => {};

/**
 * Stops timer. Does nothing if it's not running
 */
function timerStop() {
	if(_timerInterval === -1) return;

	clearInterval(_timerInterval);
	_timerInterval = -1;
}

/**
 * Starts/Resumes timer if isn't already running.
 * Calls onTick at each interval.
 * Calls onZero after stopping the timer once it has run out of time
 */
function timerStart() {
	if(_timerInterval !== -1) return;

	_timerInterval = setInterval(() => {
		const tickSeconds = _tickSpeed / 1000;

		_timeElapsed += tickSeconds;
		timeRemaining -= tickSeconds;

		onTick();

		if(timeRemaining <= 0) {
			// Readjust elapsed to never exceed timeRemaining
			_timeElapsed -= Math.abs(timeRemaining);
			timeRemaining = 0;

			timerStop();
			onZero();
		}
	}, _tickSpeed);
}

/**
 * Resets the timer. Safe to do even while the timer is running
 * IMPORTANT: If you need the elapsed time, get it with getElapsed() BEFORE resetting, or it will be 0
 */
function timerReset() {
	_timeElapsed = 0;
	timeRemaining = initialTime;

	// Restart timer if it is running
	if(_timerInterval !== -1) {
		timerStop();
		timerStart();
	}
}

/**
 * Updates the interval tick speed
 * @param {number} newTickSpeed - Interval in milliseconds
 */
function updateTickSpeed(newTickSpeed) {
	if(_timerInterval !== -1) throw new Error("Timer cannot be running when Tick Speed changes");
	if(newTickSpeed <= 0) throw new RangeError("Tick Speed must be positive");

	_tickSpeed = newTickSpeed;
}

/**
 * Gets elapsed time while the timer is running or stopped. Is reset by `timerReset()`
 * @return {number} - Elapsed seconds
 */
function getElapsed() {
	return _timeElapsed;
}

/**
 * Utility function that converts number of seconds to mm:ss format
 * @param {number} seconds
 * @return {string} - Seconds in mm:ss format
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
