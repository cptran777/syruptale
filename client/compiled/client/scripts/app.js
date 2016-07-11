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

	// if (keyMap[event.keyCode] === 'left') {
	// 	player.sprite.gotoAndPlay('run');
	// 	player.sprite.scaleX = -1;
	// 	player.sprite.x += 60;
	// } else if (keyMap[event.keyCode] === 'right') {
	// 	player.sprite.gotoAndPlay('run');
	// 	player.sprite.scaleX = 1;
	// 	player.sprite.x -= 60;
	// }
}

function handleKeyUp(event) {
	player.handleAnimation(player.direction, 'stand');
}
/* ****************************** RENDER LOOP ******************************** */

createjs.Ticker.addEventListener('tick', handleTick);
function handleTick(event) {

	var deltaS = event.delta / 1000;

	stage.update();
}
//# sourceMappingURL=data:application/json;base64,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UyxNQUFULENBQWdCLGdCQUFoQixDQUFpQyxNQUFqQyxFQUF5QyxVQUF6QztBQUNBLFNBQVMsVUFBVCxDQUFvQixLQUFwQixFQUEyQjs7QUFFMUIsS0FBSSxTQUFTLE1BQU0sS0FBTixHQUFjLElBQTNCOztBQUVBLE9BQU0sTUFBTjtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqIEFQUCBJTklUSUFUSU9OICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuLy8gVXNpbmcgY3JlYXRlLmpzIHRvIHNldCB1cCBhbmQgcmVuZGVyIGJhY2tncm91bmQ6IFxuXG52YXIgc3RhZ2UsIGxvYWRlciwgY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodDtcbnZhciBiYWNrZ3JvdW5kLCBwbGF5ZXI7XG5cbi8vIFRoZSBwdXJwb3NlIG9mIGtleU1hcCBpcyB0byBob2xkIHRoZSBwb3NzaWJsZSBrZXlwcmVzc2VzIGZvciBrZXlkb3duIGV2ZW50cyB0aGF0IG1heSBoYXBwZW4gXG52YXIga2V5TWFwID0ge1xuXHQ2NTogJ2xlZnQnLFxuXHQ2ODogJ3JpZ2h0J1xufTtcbnZhciB4VGVzdCA9IDA7XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG5cblx0c3RhZ2UgPSBuZXcgY3JlYXRlanMuU3RhZ2UoJ2ZvcmVzdC1kdW5nZW9uJyk7XG5cblx0Ly8gQ2FudmFzIHdpZHRoIGFuZCBoZWlnaHQgc3RvcmVkIGluIHZhciB3IGFuZCBoIGZvciBmdXR1cmUgdXNlLiBcblx0Y2FudmFzV2lkdGggPSBzdGFnZS5jYW52YXMud2lkdGg7XG5cdGNhbnZhc0hlaWdodCA9IHN0YWdlLmNhbnZhcy5oZWlnaHQ7XG5cblx0Ly8gTWFuaWZlc3Qgd2lsbCBjcmVhdGUgYW5kIHN0b3JlIGJhY2tncm91bmQgaW1hZ2UgZm9yIGZ1dHVyZSB1c2UuIExvb2tzIGxpa2UgXG5cdC8vIHRoZSByZW5kZXIgd2lsbCBuZWVkIHRvIGJlIGFkanVzdGVkIHRvIGFsaWduIHRoZSBpbWFnZSBwcm9wZXJseS4gXG5cdHZhciBtYW5pZmVzdCA9IFtcblx0XHR7c3JjOiAnYmFja2dyb3VuZC5wbmcnLCBpZDogJ2JhY2tncm91bmQnfSxcblx0XHR7c3JjOiAnZGVmYXVsdC1zcHJpdGUucG5nJywgaWQ6ICdwbGF5ZXJTcHJpdGUnfVxuXHRdO1xuXHQvLyBMb2FkZXIgd2lsbCByZW5kZXIgdGhlIG5lY2Vzc2FyeSBpdGVtcyBcblx0bG9hZGVyID0gbmV3IGNyZWF0ZWpzLkxvYWRRdWV1ZShmYWxzZSk7XG5cdGxvYWRlci5hZGRFdmVudExpc3RlbmVyKCdjb21wbGV0ZScsIGhhbmRsZUNvbXBsZXRlKTtcblx0bG9hZGVyLmxvYWRNYW5pZmVzdChtYW5pZmVzdCwgdHJ1ZSwgJ2Fzc2V0cy9pbWFnZXMvJyk7XG5cblx0Ly8gRGV0ZWN0IGtleXByZXNzOiBcblxuXHR3aW5kb3cuZG9jdW1lbnQub25rZXlkb3duID0gaGFuZGxlS2V5RG93bjtcblx0d2luZG93LmRvY3VtZW50Lm9ua2V5dXAgPSBoYW5kbGVLZXlVcDtcbn1cblxuaW5pdCgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIENSRUFURSBUSEUgU1RBR0UgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuZnVuY3Rpb24gaGFuZGxlQ29tcGxldGUoZXZlbnQpIHtcblx0XG5cdC8vIENyZWF0ZXMgYmFja2dyb3VuZCBpbWFnZS4gXG5cdGJhY2tncm91bmQgPSBuZXcgY3JlYXRlanMuU2hhcGUoKTtcblx0dmFyIGJhY2tncm91bmRJbWcgPSBsb2FkZXIuZ2V0UmVzdWx0KCdiYWNrZ3JvdW5kJyk7XG5cdGJhY2tncm91bmQuZ3JhcGhpY3MuYmVnaW5CaXRtYXBGaWxsKGJhY2tncm91bmRJbWcpLmRyYXdSZWN0KDAsIDAsIGNhbnZhc1dpZHRoICsgYmFja2dyb3VuZEltZy53aWR0aCwgY2FudmFzSGVpZ2h0ICsgYmFja2dyb3VuZEltZy5oZWlnaHQpO1xuXHRzdGFnZS5hZGRDaGlsZChiYWNrZ3JvdW5kKTtcblxuXHQvLyBBZGp1c3RtZW50IHRvIGxpbmUgdGhlIGltYWdlIG1lbnRpb25lZCBhYm92ZS4gXG5cdGJhY2tncm91bmQueSA9IC0xMDU7XG5cblx0Ly8gQ3JlYXRpb24gb2YgdGhlIHBsYXllciB0byByZW5kZXIgb24gdGhlIHNjcmVlbi4gXG5cdHBsYXllciA9IG5ldyBQbGF5ZXIobG9hZGVyLmdldFJlc3VsdCgncGxheWVyU3ByaXRlJyksIHtocDogMTAwLCBhdGs6IDEwLCBkZWY6IDEwfSwge2RpcmVjdGlvbjogJ3JpZ2h0J30pO1xuXHRwbGF5ZXIuY3JlYXRlU3ByaXRlKHtcblx0XHRmcmFtZXJhdGU6IDMwLFxuXHRcdGltYWdlczogW3BsYXllci5pbWFnZV0sXG5cdFx0ZnJhbWVzOiB7cmVnWDogMCwgaGVpZ2h0OiA5MiwgY291bnQ6IDI0LCByZWdZOiAwLCB3aWR0aDogNjR9LFxuXHRcdGFuaW1hdGlvbnM6IHtcblx0XHRcdHN0YW5kOiBbNF0sXG5cdFx0XHRydW46IFszLCA3LCAncnVuJywgMC41XSxcblx0XHRcdHNsYXNoOiBbMTIsIDE2LCAnc3RhbmQnLCAwLjVdLFxuXHRcdFx0ZGVhZDogWzE1LCAxNiwgJ2RlYWQnLCAwLjJdXG5cdFx0fVxuXHR9LCAnc2xhc2gnLCB7eDogNjAsIHk6IDYwfSk7XG5cblx0c3RhZ2UuYWRkQ2hpbGQocGxheWVyLnNwcml0ZSk7XG5cbn1cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBDUkVBVEUgVEhFIFNUQUdFICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmZ1bmN0aW9uIGhhbmRsZUtleURvd24oZXZlbnQpIHtcblx0cGxheWVyLmhhbmRsZUFuaW1hdGlvbihrZXlNYXBbZXZlbnQua2V5Q29kZV0sICdydW4nKTtcblxuXHQvLyBpZiAoa2V5TWFwW2V2ZW50LmtleUNvZGVdID09PSAnbGVmdCcpIHtcblx0Ly8gXHRwbGF5ZXIuc3ByaXRlLmdvdG9BbmRQbGF5KCdydW4nKTtcblx0Ly8gXHRwbGF5ZXIuc3ByaXRlLnNjYWxlWCA9IC0xO1xuXHQvLyBcdHBsYXllci5zcHJpdGUueCArPSA2MDtcblx0Ly8gfSBlbHNlIGlmIChrZXlNYXBbZXZlbnQua2V5Q29kZV0gPT09ICdyaWdodCcpIHtcblx0Ly8gXHRwbGF5ZXIuc3ByaXRlLmdvdG9BbmRQbGF5KCdydW4nKTtcblx0Ly8gXHRwbGF5ZXIuc3ByaXRlLnNjYWxlWCA9IDE7XG5cdC8vIFx0cGxheWVyLnNwcml0ZS54IC09IDYwO1xuXHQvLyB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUtleVVwKGV2ZW50KSB7XG5cdHBsYXllci5oYW5kbGVBbmltYXRpb24ocGxheWVyLmRpcmVjdGlvbiwgJ3N0YW5kJyk7XG59XG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogUkVOREVSIExPT1AgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuY3JlYXRlanMuVGlja2VyLmFkZEV2ZW50TGlzdGVuZXIoJ3RpY2snLCBoYW5kbGVUaWNrKTsgXG5mdW5jdGlvbiBoYW5kbGVUaWNrKGV2ZW50KSB7XG5cblx0dmFyIGRlbHRhUyA9IGV2ZW50LmRlbHRhIC8gMTAwMDtcblxuXHRzdGFnZS51cGRhdGUoKTtcbn1cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiJdfQ==