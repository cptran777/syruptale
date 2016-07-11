'use strict';

/* ***************************** APP INITIATION ******************************* */

// Using create.js to set up and render background:

var stage, loader, canvasWidth, canvasHeight;
var background, player;

// The purpose of keyMap is to hold the possible keypresses for keydown events that may happen
var keyMap = {
	65: 'left',
	68: 'right'
};
var xTest = 0;

function init() {

	stage = new createjs.Stage('forest-dungeon');

	// Canvas width and height stored in var w and h for future use.
	canvasWidth = stage.canvas.width;
	canvasHeight = stage.canvas.height;

	// Manifest will create and store background image for future use. Looks like
	// the render will need to be adjusted to align the image properly.
	var manifest = [{ src: 'background.png', id: 'background' }, { src: 'default-sprite.png', id: 'playerSprite' }];
	// Loader will render the necessary items
	loader = new createjs.LoadQueue(false);
	loader.addEventListener('complete', handleComplete);
	loader.loadManifest(manifest, true, 'assets/images/');

	// Detect keypress:

	window.document.onkeydown = handleKeyDown;
	window.document.onkeyup = handleKeyUp;
}

init();

/* **************************** CREATE THE STAGE ***************************** */

function handleComplete(event) {

	// Creates background image.
	background = new createjs.Shape();
	var backgroundImg = loader.getResult('background');
	background.graphics.beginBitmapFill(backgroundImg).drawRect(0, 0, canvasWidth + backgroundImg.width, canvasHeight + backgroundImg.height);
	stage.addChild(background);

	// Adjustment to line the image mentioned above.
	background.y = -105;

	// Creation of the player to render on the screen.
	player = new Player(loader.getResult('playerSprite'), { hp: 100, atk: 10, def: 10 }, { direction: 'right' });
	player.createSprite({
		framerate: 30,
		images: [player.image],
		frames: { regX: 0, height: 92, count: 24, regY: 0, width: 64 },
		animations: {
			stand: [4],
			run: [3, 7, 'run', 0.5],
			slash: [12, 16, 'stand', 0.5],
			dead: [15, 16, 'dead', 0.2]
		}
	}, 'slash', { x: 60, y: 60 });

	stage.addChild(player.sprite);
}

/* **************************** CREATE THE STAGE ***************************** */

function handleKeyDown(event) {
	player.handleAnimation(keyMap[event.keyCode], 'run');

	if (keyMap[event.keyCode] === 'left') {
		player.sprite.gotoAndPlay('run');
		player.sprite.scaleX = -1;
		player.sprite.x += 60;
	} else if (keyMap[event.keyCode] === 'right') {
		player.sprite.gotoAndPlay('run');
		player.sprite.scaleX = 1;
		player.sprite.x -= 60;
	}
}

function handleKeyUp(event) {}
/* ****************************** RENDER LOOP ******************************** */

createjs.Ticker.addEventListener('tick', handleTick);
function handleTick(event) {

	var deltaS = event.delta / 1000;

	stage.update();
}
//# sourceMappingURL=data:application/json;base64,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QXVCLENBQUMsQ0FBeEI7QUFDQSxTQUFPLE1BQVAsQ0FBYyxDQUFkLElBQW1CLEVBQW5CO0FBQ0EsRUFKRCxNQUlPLElBQUksT0FBTyxNQUFNLE9BQWIsTUFBMEIsT0FBOUIsRUFBdUM7QUFDN0MsU0FBTyxNQUFQLENBQWMsV0FBZCxDQUEwQixLQUExQjtBQUNBLFNBQU8sTUFBUCxDQUFjLE1BQWQsR0FBdUIsQ0FBdkI7QUFDQSxTQUFPLE1BQVAsQ0FBYyxDQUFkLElBQW1CLEVBQW5CO0FBQ0E7QUFDRDs7QUFFRCxTQUFTLFdBQVQsQ0FBcUIsS0FBckIsRUFBNEIsQ0FFM0I7OztBQUdELFNBQVMsTUFBVCxDQUFnQixnQkFBaEIsQ0FBaUMsTUFBakMsRUFBeUMsVUFBekM7QUFDQSxTQUFTLFVBQVQsQ0FBb0IsS0FBcEIsRUFBMkI7O0FBRTFCLEtBQUksU0FBUyxNQUFNLEtBQU4sR0FBYyxJQUEzQjs7QUFFQSxPQUFNLE1BQU47QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBBUFAgSU5JVElBVElPTiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbi8vIFVzaW5nIGNyZWF0ZS5qcyB0byBzZXQgdXAgYW5kIHJlbmRlciBiYWNrZ3JvdW5kOiBcblxudmFyIHN0YWdlLCBsb2FkZXIsIGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQ7XG52YXIgYmFja2dyb3VuZCwgcGxheWVyO1xuXG4vLyBUaGUgcHVycG9zZSBvZiBrZXlNYXAgaXMgdG8gaG9sZCB0aGUgcG9zc2libGUga2V5cHJlc3NlcyBmb3Iga2V5ZG93biBldmVudHMgdGhhdCBtYXkgaGFwcGVuIFxudmFyIGtleU1hcCA9IHtcblx0NjU6ICdsZWZ0Jyxcblx0Njg6ICdyaWdodCdcbn07XG52YXIgeFRlc3QgPSAwO1xuXG5mdW5jdGlvbiBpbml0KCkge1xuXG5cdHN0YWdlID0gbmV3IGNyZWF0ZWpzLlN0YWdlKCdmb3Jlc3QtZHVuZ2VvbicpO1xuXG5cdC8vIENhbnZhcyB3aWR0aCBhbmQgaGVpZ2h0IHN0b3JlZCBpbiB2YXIgdyBhbmQgaCBmb3IgZnV0dXJlIHVzZS4gXG5cdGNhbnZhc1dpZHRoID0gc3RhZ2UuY2FudmFzLndpZHRoO1xuXHRjYW52YXNIZWlnaHQgPSBzdGFnZS5jYW52YXMuaGVpZ2h0O1xuXG5cdC8vIE1hbmlmZXN0IHdpbGwgY3JlYXRlIGFuZCBzdG9yZSBiYWNrZ3JvdW5kIGltYWdlIGZvciBmdXR1cmUgdXNlLiBMb29rcyBsaWtlIFxuXHQvLyB0aGUgcmVuZGVyIHdpbGwgbmVlZCB0byBiZSBhZGp1c3RlZCB0byBhbGlnbiB0aGUgaW1hZ2UgcHJvcGVybHkuIFxuXHR2YXIgbWFuaWZlc3QgPSBbXG5cdFx0e3NyYzogJ2JhY2tncm91bmQucG5nJywgaWQ6ICdiYWNrZ3JvdW5kJ30sXG5cdFx0e3NyYzogJ2RlZmF1bHQtc3ByaXRlLnBuZycsIGlkOiAncGxheWVyU3ByaXRlJ31cblx0XTtcblx0Ly8gTG9hZGVyIHdpbGwgcmVuZGVyIHRoZSBuZWNlc3NhcnkgaXRlbXMgXG5cdGxvYWRlciA9IG5ldyBjcmVhdGVqcy5Mb2FkUXVldWUoZmFsc2UpO1xuXHRsb2FkZXIuYWRkRXZlbnRMaXN0ZW5lcignY29tcGxldGUnLCBoYW5kbGVDb21wbGV0ZSk7XG5cdGxvYWRlci5sb2FkTWFuaWZlc3QobWFuaWZlc3QsIHRydWUsICdhc3NldHMvaW1hZ2VzLycpO1xuXG5cdC8vIERldGVjdCBrZXlwcmVzczogXG5cblx0d2luZG93LmRvY3VtZW50Lm9ua2V5ZG93biA9IGhhbmRsZUtleURvd247XG5cdHdpbmRvdy5kb2N1bWVudC5vbmtleXVwID0gaGFuZGxlS2V5VXA7XG59XG5cbmluaXQoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBDUkVBVEUgVEhFIFNUQUdFICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmZ1bmN0aW9uIGhhbmRsZUNvbXBsZXRlKGV2ZW50KSB7XG5cdFxuXHQvLyBDcmVhdGVzIGJhY2tncm91bmQgaW1hZ2UuIFxuXHRiYWNrZ3JvdW5kID0gbmV3IGNyZWF0ZWpzLlNoYXBlKCk7XG5cdHZhciBiYWNrZ3JvdW5kSW1nID0gbG9hZGVyLmdldFJlc3VsdCgnYmFja2dyb3VuZCcpO1xuXHRiYWNrZ3JvdW5kLmdyYXBoaWNzLmJlZ2luQml0bWFwRmlsbChiYWNrZ3JvdW5kSW1nKS5kcmF3UmVjdCgwLCAwLCBjYW52YXNXaWR0aCArIGJhY2tncm91bmRJbWcud2lkdGgsIGNhbnZhc0hlaWdodCArIGJhY2tncm91bmRJbWcuaGVpZ2h0KTtcblx0c3RhZ2UuYWRkQ2hpbGQoYmFja2dyb3VuZCk7XG5cblx0Ly8gQWRqdXN0bWVudCB0byBsaW5lIHRoZSBpbWFnZSBtZW50aW9uZWQgYWJvdmUuIFxuXHRiYWNrZ3JvdW5kLnkgPSAtMTA1O1xuXG5cdC8vIENyZWF0aW9uIG9mIHRoZSBwbGF5ZXIgdG8gcmVuZGVyIG9uIHRoZSBzY3JlZW4uIFxuXHRwbGF5ZXIgPSBuZXcgUGxheWVyKGxvYWRlci5nZXRSZXN1bHQoJ3BsYXllclNwcml0ZScpLCB7aHA6IDEwMCwgYXRrOiAxMCwgZGVmOiAxMH0sIHtkaXJlY3Rpb246ICdyaWdodCd9KTtcblx0cGxheWVyLmNyZWF0ZVNwcml0ZSh7XG5cdFx0ZnJhbWVyYXRlOiAzMCxcblx0XHRpbWFnZXM6IFtwbGF5ZXIuaW1hZ2VdLFxuXHRcdGZyYW1lczoge3JlZ1g6IDAsIGhlaWdodDogOTIsIGNvdW50OiAyNCwgcmVnWTogMCwgd2lkdGg6IDY0fSxcblx0XHRhbmltYXRpb25zOiB7XG5cdFx0XHRzdGFuZDogWzRdLFxuXHRcdFx0cnVuOiBbMywgNywgJ3J1bicsIDAuNV0sXG5cdFx0XHRzbGFzaDogWzEyLCAxNiwgJ3N0YW5kJywgMC41XSxcblx0XHRcdGRlYWQ6IFsxNSwgMTYsICdkZWFkJywgMC4yXVxuXHRcdH1cblx0fSwgJ3NsYXNoJywge3g6IDYwLCB5OiA2MH0pO1xuXG5cdHN0YWdlLmFkZENoaWxkKHBsYXllci5zcHJpdGUpO1xuXG59XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogQ1JFQVRFIFRIRSBTVEFHRSAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5mdW5jdGlvbiBoYW5kbGVLZXlEb3duKGV2ZW50KSB7XG5cdHBsYXllci5oYW5kbGVBbmltYXRpb24oa2V5TWFwW2V2ZW50LmtleUNvZGVdLCAncnVuJyk7XG5cblx0aWYgKGtleU1hcFtldmVudC5rZXlDb2RlXSA9PT0gJ2xlZnQnKSB7XG5cdFx0cGxheWVyLnNwcml0ZS5nb3RvQW5kUGxheSgncnVuJyk7XG5cdFx0cGxheWVyLnNwcml0ZS5zY2FsZVggPSAtMTtcblx0XHRwbGF5ZXIuc3ByaXRlLnggKz0gNjA7XG5cdH0gZWxzZSBpZiAoa2V5TWFwW2V2ZW50LmtleUNvZGVdID09PSAncmlnaHQnKSB7XG5cdFx0cGxheWVyLnNwcml0ZS5nb3RvQW5kUGxheSgncnVuJyk7XG5cdFx0cGxheWVyLnNwcml0ZS5zY2FsZVggPSAxO1xuXHRcdHBsYXllci5zcHJpdGUueCAtPSA2MDtcblx0fVxufVxuXG5mdW5jdGlvbiBoYW5kbGVLZXlVcChldmVudCkge1xuXG59XG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogUkVOREVSIExPT1AgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuY3JlYXRlanMuVGlja2VyLmFkZEV2ZW50TGlzdGVuZXIoJ3RpY2snLCBoYW5kbGVUaWNrKTsgXG5mdW5jdGlvbiBoYW5kbGVUaWNrKGV2ZW50KSB7XG5cblx0dmFyIGRlbHRhUyA9IGV2ZW50LmRlbHRhIC8gMTAwMDtcblxuXHRzdGFnZS51cGRhdGUoKTtcbn1cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiJdfQ==