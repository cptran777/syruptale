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
	player = new Player(loader.getResult('playerSprite'), { hp: 100, atk: 10, def: 10 });
	player.createSprite({
		framerate: 30,
		images: [player.image],
		frames: { regX: 0, height: 92, count: 24, regY: 0, width: 64 },
		animations: {
			stand: [4],
			run: [3, 7, 'slash', 0.5],
			slash: [12, 16, 'run', 0.5],
			dead: [15, 16, 'dead', 0.2]
		}
	}, 'stand', { x: 60, y: 60 });

	stage.addChild(player.sprite);
}

/* **************************** CREATE THE STAGE ***************************** */

function handleKeyDown(event) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NjcmlwdHMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUlBLElBQUksS0FBSixFQUFXLE1BQVgsRUFBbUIsV0FBbkIsRUFBZ0MsWUFBaEM7QUFDQSxJQUFJLFVBQUosRUFBZ0IsTUFBaEI7OztBQUdBLElBQUksU0FBUztBQUNaLEtBQUksTUFEUTtBQUVaLEtBQUk7QUFGUSxDQUFiO0FBSUEsSUFBSSxRQUFRLENBQVo7O0FBRUEsU0FBUyxJQUFULEdBQWdCOztBQUVmLFNBQVEsSUFBSSxTQUFTLEtBQWIsQ0FBbUIsZ0JBQW5CLENBQVI7OztBQUdBLGVBQWMsTUFBTSxNQUFOLENBQWEsS0FBM0I7QUFDQSxnQkFBZSxNQUFNLE1BQU4sQ0FBYSxNQUE1Qjs7OztBQUlBLEtBQUksV0FBVyxDQUNkLEVBQUMsS0FBSyxnQkFBTixFQUF3QixJQUFJLFlBQTVCLEVBRGMsRUFFZCxFQUFDLEtBQUssb0JBQU4sRUFBNEIsSUFBSSxjQUFoQyxFQUZjLENBQWY7O0FBS0EsVUFBUyxJQUFJLFNBQVMsU0FBYixDQUF1QixLQUF2QixDQUFUO0FBQ0EsUUFBTyxnQkFBUCxDQUF3QixVQUF4QixFQUFvQyxjQUFwQztBQUNBLFFBQU8sWUFBUCxDQUFvQixRQUFwQixFQUE4QixJQUE5QixFQUFvQyxnQkFBcEM7Ozs7QUFJQSxRQUFPLFFBQVAsQ0FBZ0IsU0FBaEIsR0FBNEIsYUFBNUI7QUFDQSxRQUFPLFFBQVAsQ0FBZ0IsT0FBaEIsR0FBMEIsV0FBMUI7QUFDQTs7QUFFRDs7OztBQUlBLFNBQVMsY0FBVCxDQUF3QixLQUF4QixFQUErQjs7O0FBRzlCLGNBQWEsSUFBSSxTQUFTLEtBQWIsRUFBYjtBQUNBLEtBQUksZ0JBQWdCLE9BQU8sU0FBUCxDQUFpQixZQUFqQixDQUFwQjtBQUNBLFlBQVcsUUFBWCxDQUFvQixlQUFwQixDQUFvQyxhQUFwQyxFQUFtRCxRQUFuRCxDQUE0RCxDQUE1RCxFQUErRCxDQUEvRCxFQUFrRSxjQUFjLGNBQWMsS0FBOUYsRUFBcUcsZUFBZSxjQUFjLE1BQWxJO0FBQ0EsT0FBTSxRQUFOLENBQWUsVUFBZjs7O0FBR0EsWUFBVyxDQUFYLEdBQWUsQ0FBQyxHQUFoQjs7O0FBR0EsVUFBUyxJQUFJLE1BQUosQ0FBVyxPQUFPLFNBQVAsQ0FBaUIsY0FBakIsQ0FBWCxFQUE2QyxFQUFDLElBQUksR0FBTCxFQUFVLEtBQUssRUFBZixFQUFtQixLQUFLLEVBQXhCLEVBQTdDLENBQVQ7QUFDQSxRQUFPLFlBQVAsQ0FBb0I7QUFDbkIsYUFBVyxFQURRO0FBRW5CLFVBQVEsQ0FBQyxPQUFPLEtBQVIsQ0FGVztBQUduQixVQUFRLEVBQUMsTUFBTSxDQUFQLEVBQVUsUUFBUSxFQUFsQixFQUFzQixPQUFPLEVBQTdCLEVBQWlDLE1BQU0sQ0FBdkMsRUFBMEMsT0FBTyxFQUFqRCxFQUhXO0FBSW5CLGNBQVk7QUFDWCxVQUFPLENBQUMsQ0FBRCxDQURJO0FBRVgsUUFBSyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sT0FBUCxFQUFnQixHQUFoQixDQUZNO0FBR1gsVUFBTyxDQUFDLEVBQUQsRUFBSyxFQUFMLEVBQVMsS0FBVCxFQUFnQixHQUFoQixDQUhJO0FBSVgsU0FBTSxDQUFDLEVBQUQsRUFBSyxFQUFMLEVBQVMsTUFBVCxFQUFpQixHQUFqQjtBQUpLO0FBSk8sRUFBcEIsRUFVRyxPQVZILEVBVVksRUFBQyxHQUFHLEVBQUosRUFBUSxHQUFHLEVBQVgsRUFWWjs7QUFZQSxPQUFNLFFBQU4sQ0FBZSxPQUFPLE1BQXRCO0FBRUE7Ozs7QUFJRCxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsRUFBOEI7QUFDN0IsS0FBSSxPQUFPLE1BQU0sT0FBYixNQUEwQixNQUE5QixFQUFzQztBQUNyQyxTQUFPLE1BQVAsQ0FBYyxXQUFkLENBQTBCLEtBQTFCO0FBQ0EsU0FBTyxNQUFQLENBQWMsTUFBZCxHQUF1QixDQUFDLENBQXhCO0FBQ0EsU0FBTyxNQUFQLENBQWMsQ0FBZCxJQUFtQixFQUFuQjtBQUNBLEVBSkQsTUFJTyxJQUFJLE9BQU8sTUFBTSxPQUFiLE1BQTBCLE9BQTlCLEVBQXVDO0FBQzdDLFNBQU8sTUFBUCxDQUFjLFdBQWQsQ0FBMEIsS0FBMUI7QUFDQSxTQUFPLE1BQVAsQ0FBYyxNQUFkLEdBQXVCLENBQXZCO0FBQ0EsU0FBTyxNQUFQLENBQWMsQ0FBZCxJQUFtQixFQUFuQjtBQUNBO0FBQ0Q7O0FBRUQsU0FBUyxXQUFULENBQXFCLEtBQXJCLEVBQTRCLENBRTNCOzs7QUFHRCxTQUFTLE1BQVQsQ0FBZ0IsZ0JBQWhCLENBQWlDLE1BQWpDLEVBQXlDLFVBQXpDO0FBQ0EsU0FBUyxVQUFULENBQW9CLEtBQXBCLEVBQTJCOztBQUUxQixLQUFJLFNBQVMsTUFBTSxLQUFOLEdBQWMsSUFBM0I7O0FBRUEsT0FBTSxNQUFOO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogQVBQIElOSVRJQVRJT04gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG4vLyBVc2luZyBjcmVhdGUuanMgdG8gc2V0IHVwIGFuZCByZW5kZXIgYmFja2dyb3VuZDogXG5cbnZhciBzdGFnZSwgbG9hZGVyLCBjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0O1xudmFyIGJhY2tncm91bmQsIHBsYXllcjtcblxuLy8gVGhlIHB1cnBvc2Ugb2Yga2V5TWFwIGlzIHRvIGhvbGQgdGhlIHBvc3NpYmxlIGtleXByZXNzZXMgZm9yIGtleWRvd24gZXZlbnRzIHRoYXQgbWF5IGhhcHBlbiBcbnZhciBrZXlNYXAgPSB7XG5cdDY1OiAnbGVmdCcsXG5cdDY4OiAncmlnaHQnXG59O1xudmFyIHhUZXN0ID0gMDtcblxuZnVuY3Rpb24gaW5pdCgpIHtcblxuXHRzdGFnZSA9IG5ldyBjcmVhdGVqcy5TdGFnZSgnZm9yZXN0LWR1bmdlb24nKTtcblxuXHQvLyBDYW52YXMgd2lkdGggYW5kIGhlaWdodCBzdG9yZWQgaW4gdmFyIHcgYW5kIGggZm9yIGZ1dHVyZSB1c2UuIFxuXHRjYW52YXNXaWR0aCA9IHN0YWdlLmNhbnZhcy53aWR0aDtcblx0Y2FudmFzSGVpZ2h0ID0gc3RhZ2UuY2FudmFzLmhlaWdodDtcblxuXHQvLyBNYW5pZmVzdCB3aWxsIGNyZWF0ZSBhbmQgc3RvcmUgYmFja2dyb3VuZCBpbWFnZSBmb3IgZnV0dXJlIHVzZS4gTG9va3MgbGlrZSBcblx0Ly8gdGhlIHJlbmRlciB3aWxsIG5lZWQgdG8gYmUgYWRqdXN0ZWQgdG8gYWxpZ24gdGhlIGltYWdlIHByb3Blcmx5LiBcblx0dmFyIG1hbmlmZXN0ID0gW1xuXHRcdHtzcmM6ICdiYWNrZ3JvdW5kLnBuZycsIGlkOiAnYmFja2dyb3VuZCd9LFxuXHRcdHtzcmM6ICdkZWZhdWx0LXNwcml0ZS5wbmcnLCBpZDogJ3BsYXllclNwcml0ZSd9XG5cdF07XG5cdC8vIExvYWRlciB3aWxsIHJlbmRlciB0aGUgbmVjZXNzYXJ5IGl0ZW1zIFxuXHRsb2FkZXIgPSBuZXcgY3JlYXRlanMuTG9hZFF1ZXVlKGZhbHNlKTtcblx0bG9hZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbXBsZXRlJywgaGFuZGxlQ29tcGxldGUpO1xuXHRsb2FkZXIubG9hZE1hbmlmZXN0KG1hbmlmZXN0LCB0cnVlLCAnYXNzZXRzL2ltYWdlcy8nKTtcblxuXHQvLyBEZXRlY3Qga2V5cHJlc3M6IFxuXG5cdHdpbmRvdy5kb2N1bWVudC5vbmtleWRvd24gPSBoYW5kbGVLZXlEb3duO1xuXHR3aW5kb3cuZG9jdW1lbnQub25rZXl1cCA9IGhhbmRsZUtleVVwO1xufVxuXG5pbml0KCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogQ1JFQVRFIFRIRSBTVEFHRSAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5mdW5jdGlvbiBoYW5kbGVDb21wbGV0ZShldmVudCkge1xuXHRcblx0Ly8gQ3JlYXRlcyBiYWNrZ3JvdW5kIGltYWdlLiBcblx0YmFja2dyb3VuZCA9IG5ldyBjcmVhdGVqcy5TaGFwZSgpO1xuXHR2YXIgYmFja2dyb3VuZEltZyA9IGxvYWRlci5nZXRSZXN1bHQoJ2JhY2tncm91bmQnKTtcblx0YmFja2dyb3VuZC5ncmFwaGljcy5iZWdpbkJpdG1hcEZpbGwoYmFja2dyb3VuZEltZykuZHJhd1JlY3QoMCwgMCwgY2FudmFzV2lkdGggKyBiYWNrZ3JvdW5kSW1nLndpZHRoLCBjYW52YXNIZWlnaHQgKyBiYWNrZ3JvdW5kSW1nLmhlaWdodCk7XG5cdHN0YWdlLmFkZENoaWxkKGJhY2tncm91bmQpO1xuXG5cdC8vIEFkanVzdG1lbnQgdG8gbGluZSB0aGUgaW1hZ2UgbWVudGlvbmVkIGFib3ZlLiBcblx0YmFja2dyb3VuZC55ID0gLTEwNTtcblxuXHQvLyBDcmVhdGlvbiBvZiB0aGUgcGxheWVyIHRvIHJlbmRlciBvbiB0aGUgc2NyZWVuLiBcblx0cGxheWVyID0gbmV3IFBsYXllcihsb2FkZXIuZ2V0UmVzdWx0KCdwbGF5ZXJTcHJpdGUnKSwge2hwOiAxMDAsIGF0azogMTAsIGRlZjogMTB9KTtcblx0cGxheWVyLmNyZWF0ZVNwcml0ZSh7XG5cdFx0ZnJhbWVyYXRlOiAzMCxcblx0XHRpbWFnZXM6IFtwbGF5ZXIuaW1hZ2VdLFxuXHRcdGZyYW1lczoge3JlZ1g6IDAsIGhlaWdodDogOTIsIGNvdW50OiAyNCwgcmVnWTogMCwgd2lkdGg6IDY0fSxcblx0XHRhbmltYXRpb25zOiB7XG5cdFx0XHRzdGFuZDogWzRdLFxuXHRcdFx0cnVuOiBbMywgNywgJ3NsYXNoJywgMC41XSxcblx0XHRcdHNsYXNoOiBbMTIsIDE2LCAncnVuJywgMC41XSxcblx0XHRcdGRlYWQ6IFsxNSwgMTYsICdkZWFkJywgMC4yXVxuXHRcdH1cblx0fSwgJ3N0YW5kJywge3g6IDYwLCB5OiA2MH0pO1xuXG5cdHN0YWdlLmFkZENoaWxkKHBsYXllci5zcHJpdGUpO1xuXG59XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogQ1JFQVRFIFRIRSBTVEFHRSAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5mdW5jdGlvbiBoYW5kbGVLZXlEb3duKGV2ZW50KSB7XG5cdGlmIChrZXlNYXBbZXZlbnQua2V5Q29kZV0gPT09ICdsZWZ0Jykge1xuXHRcdHBsYXllci5zcHJpdGUuZ290b0FuZFBsYXkoJ3J1bicpO1xuXHRcdHBsYXllci5zcHJpdGUuc2NhbGVYID0gLTE7XG5cdFx0cGxheWVyLnNwcml0ZS54ICs9IDYwO1xuXHR9IGVsc2UgaWYgKGtleU1hcFtldmVudC5rZXlDb2RlXSA9PT0gJ3JpZ2h0Jykge1xuXHRcdHBsYXllci5zcHJpdGUuZ290b0FuZFBsYXkoJ3J1bicpO1xuXHRcdHBsYXllci5zcHJpdGUuc2NhbGVYID0gMTtcblx0XHRwbGF5ZXIuc3ByaXRlLnggLT0gNjA7XG5cdH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlS2V5VXAoZXZlbnQpIHtcblxufVxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFJFTkRFUiBMT09QICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmNyZWF0ZWpzLlRpY2tlci5hZGRFdmVudExpc3RlbmVyKCd0aWNrJywgaGFuZGxlVGljayk7IFxuZnVuY3Rpb24gaGFuZGxlVGljayhldmVudCkge1xuXG5cdHZhciBkZWx0YVMgPSBldmVudC5kZWx0YSAvIDEwMDA7XG5cblx0c3RhZ2UudXBkYXRlKCk7XG59XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4iXX0=