// Wait till the browser is ready to render the game (avoids glitches)
let gameManager = null;
window.requestAnimationFrame(function () {
  game = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
});
