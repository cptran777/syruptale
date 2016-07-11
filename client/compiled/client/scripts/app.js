'use strict';

/* ***************************** APP INITIATION ******************************* */

// Using create.js to set up and render background:

var stage, loader, canvasWidth, canvasHeight;
var background, player;

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
		images: [loader.getResult('playerSprite')],
		frames: { regX: 16, height: 92, count: 24, regY: 0, width: 64 },
		animations: {
			stand: [3],
			run: [3, 7, 'slash', 0.5],
			slash: [12, 16, 'run', 0.5],
			dead: [15, 16, 'dead', 0.2]
		}
	}, 'slash', { x: 20, y: 60 });

	stage.addChild(player.sprite);
}

/* ****************************** RENDER LOOP ******************************** */

createjs.Ticker.addEventListener('tick', handleTick);
function handleTick(event) {

	var deltaS = event.delta / 1000;

	stage.update();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NjcmlwdHMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUlBLElBQUksS0FBSixFQUFXLE1BQVgsRUFBbUIsV0FBbkIsRUFBZ0MsWUFBaEM7QUFDQSxJQUFJLFVBQUosRUFBZ0IsTUFBaEI7O0FBRUEsU0FBUyxJQUFULEdBQWdCOztBQUVmLFNBQVEsSUFBSSxTQUFTLEtBQWIsQ0FBbUIsZ0JBQW5CLENBQVI7OztBQUdBLGVBQWMsTUFBTSxNQUFOLENBQWEsS0FBM0I7QUFDQSxnQkFBZSxNQUFNLE1BQU4sQ0FBYSxNQUE1Qjs7OztBQUlBLEtBQUksV0FBVyxDQUNkLEVBQUMsS0FBSyxnQkFBTixFQUF3QixJQUFJLFlBQTVCLEVBRGMsRUFFZCxFQUFDLEtBQUssb0JBQU4sRUFBNEIsSUFBSSxjQUFoQyxFQUZjLENBQWY7O0FBS0EsVUFBUyxJQUFJLFNBQVMsU0FBYixDQUF1QixLQUF2QixDQUFUO0FBQ0EsUUFBTyxnQkFBUCxDQUF3QixVQUF4QixFQUFvQyxjQUFwQztBQUNBLFFBQU8sWUFBUCxDQUFvQixRQUFwQixFQUE4QixJQUE5QixFQUFvQyxnQkFBcEM7QUFDQTs7QUFFRDs7OztBQUlBLFNBQVMsY0FBVCxDQUF3QixLQUF4QixFQUErQjs7O0FBRzlCLGNBQWEsSUFBSSxTQUFTLEtBQWIsRUFBYjtBQUNBLEtBQUksZ0JBQWdCLE9BQU8sU0FBUCxDQUFpQixZQUFqQixDQUFwQjtBQUNBLFlBQVcsUUFBWCxDQUFvQixlQUFwQixDQUFvQyxhQUFwQyxFQUFtRCxRQUFuRCxDQUE0RCxDQUE1RCxFQUErRCxDQUEvRCxFQUFrRSxjQUFjLGNBQWMsS0FBOUYsRUFBcUcsZUFBZSxjQUFjLE1BQWxJO0FBQ0EsT0FBTSxRQUFOLENBQWUsVUFBZjs7O0FBR0EsWUFBVyxDQUFYLEdBQWUsQ0FBQyxHQUFoQjs7O0FBR0EsVUFBUyxJQUFJLE1BQUosQ0FBVyxPQUFPLFNBQVAsQ0FBaUIsY0FBakIsQ0FBWCxFQUE2QyxFQUFDLElBQUksR0FBTCxFQUFVLEtBQUssRUFBZixFQUFtQixLQUFLLEVBQXhCLEVBQTdDLENBQVQ7QUFDQSxRQUFPLFlBQVAsQ0FBb0I7QUFDbkIsYUFBVyxFQURRO0FBRW5CLFVBQVEsQ0FBQyxPQUFPLFNBQVAsQ0FBaUIsY0FBakIsQ0FBRCxDQUZXO0FBR25CLFVBQVEsRUFBQyxNQUFNLEVBQVAsRUFBVyxRQUFRLEVBQW5CLEVBQXVCLE9BQU8sRUFBOUIsRUFBa0MsTUFBTSxDQUF4QyxFQUEyQyxPQUFPLEVBQWxELEVBSFc7QUFJbkIsY0FBWTtBQUNYLFVBQU8sQ0FBQyxDQUFELENBREk7QUFFWCxRQUFLLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxPQUFQLEVBQWdCLEdBQWhCLENBRk07QUFHWCxVQUFPLENBQUMsRUFBRCxFQUFLLEVBQUwsRUFBUyxLQUFULEVBQWdCLEdBQWhCLENBSEk7QUFJWCxTQUFNLENBQUMsRUFBRCxFQUFLLEVBQUwsRUFBUyxNQUFULEVBQWlCLEdBQWpCO0FBSks7QUFKTyxFQUFwQixFQVVHLE9BVkgsRUFVWSxFQUFDLEdBQUcsRUFBSixFQUFRLEdBQUcsRUFBWCxFQVZaOztBQVlBLE9BQU0sUUFBTixDQUFlLE9BQU8sTUFBdEI7QUFFQTs7OztBQUlELFNBQVMsTUFBVCxDQUFnQixnQkFBaEIsQ0FBaUMsTUFBakMsRUFBeUMsVUFBekM7QUFDQSxTQUFTLFVBQVQsQ0FBb0IsS0FBcEIsRUFBMkI7O0FBRTFCLEtBQUksU0FBUyxNQUFNLEtBQU4sR0FBYyxJQUEzQjs7QUFFQSxPQUFNLE1BQU47QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBBUFAgSU5JVElBVElPTiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbi8vIFVzaW5nIGNyZWF0ZS5qcyB0byBzZXQgdXAgYW5kIHJlbmRlciBiYWNrZ3JvdW5kOiBcblxudmFyIHN0YWdlLCBsb2FkZXIsIGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQ7XG52YXIgYmFja2dyb3VuZCwgcGxheWVyO1xuXG5mdW5jdGlvbiBpbml0KCkge1xuXG5cdHN0YWdlID0gbmV3IGNyZWF0ZWpzLlN0YWdlKCdmb3Jlc3QtZHVuZ2VvbicpO1xuXG5cdC8vIENhbnZhcyB3aWR0aCBhbmQgaGVpZ2h0IHN0b3JlZCBpbiB2YXIgdyBhbmQgaCBmb3IgZnV0dXJlIHVzZS4gXG5cdGNhbnZhc1dpZHRoID0gc3RhZ2UuY2FudmFzLndpZHRoO1xuXHRjYW52YXNIZWlnaHQgPSBzdGFnZS5jYW52YXMuaGVpZ2h0O1xuXG5cdC8vIE1hbmlmZXN0IHdpbGwgY3JlYXRlIGFuZCBzdG9yZSBiYWNrZ3JvdW5kIGltYWdlIGZvciBmdXR1cmUgdXNlLiBMb29rcyBsaWtlIFxuXHQvLyB0aGUgcmVuZGVyIHdpbGwgbmVlZCB0byBiZSBhZGp1c3RlZCB0byBhbGlnbiB0aGUgaW1hZ2UgcHJvcGVybHkuIFxuXHR2YXIgbWFuaWZlc3QgPSBbXG5cdFx0e3NyYzogJ2JhY2tncm91bmQucG5nJywgaWQ6ICdiYWNrZ3JvdW5kJ30sXG5cdFx0e3NyYzogJ2RlZmF1bHQtc3ByaXRlLnBuZycsIGlkOiAncGxheWVyU3ByaXRlJ31cblx0XTtcblx0Ly8gTG9hZGVyIHdpbGwgcmVuZGVyIHRoZSBuZWNlc3NhcnkgaXRlbXMgXG5cdGxvYWRlciA9IG5ldyBjcmVhdGVqcy5Mb2FkUXVldWUoZmFsc2UpO1xuXHRsb2FkZXIuYWRkRXZlbnRMaXN0ZW5lcignY29tcGxldGUnLCBoYW5kbGVDb21wbGV0ZSk7XG5cdGxvYWRlci5sb2FkTWFuaWZlc3QobWFuaWZlc3QsIHRydWUsICdhc3NldHMvaW1hZ2VzLycpO1xufVxuXG5pbml0KCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogQ1JFQVRFIFRIRSBTVEFHRSAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5mdW5jdGlvbiBoYW5kbGVDb21wbGV0ZShldmVudCkge1xuXHRcblx0Ly8gQ3JlYXRlcyBiYWNrZ3JvdW5kIGltYWdlLiBcblx0YmFja2dyb3VuZCA9IG5ldyBjcmVhdGVqcy5TaGFwZSgpO1xuXHR2YXIgYmFja2dyb3VuZEltZyA9IGxvYWRlci5nZXRSZXN1bHQoJ2JhY2tncm91bmQnKTtcblx0YmFja2dyb3VuZC5ncmFwaGljcy5iZWdpbkJpdG1hcEZpbGwoYmFja2dyb3VuZEltZykuZHJhd1JlY3QoMCwgMCwgY2FudmFzV2lkdGggKyBiYWNrZ3JvdW5kSW1nLndpZHRoLCBjYW52YXNIZWlnaHQgKyBiYWNrZ3JvdW5kSW1nLmhlaWdodCk7XG5cdHN0YWdlLmFkZENoaWxkKGJhY2tncm91bmQpO1xuXG5cdC8vIEFkanVzdG1lbnQgdG8gbGluZSB0aGUgaW1hZ2UgbWVudGlvbmVkIGFib3ZlLiBcblx0YmFja2dyb3VuZC55ID0gLTEwNTtcblxuXHQvLyBDcmVhdGlvbiBvZiB0aGUgcGxheWVyIHRvIHJlbmRlciBvbiB0aGUgc2NyZWVuLiBcblx0cGxheWVyID0gbmV3IFBsYXllcihsb2FkZXIuZ2V0UmVzdWx0KCdwbGF5ZXJTcHJpdGUnKSwge2hwOiAxMDAsIGF0azogMTAsIGRlZjogMTB9KTtcblx0cGxheWVyLmNyZWF0ZVNwcml0ZSh7XG5cdFx0ZnJhbWVyYXRlOiAzMCxcblx0XHRpbWFnZXM6IFtsb2FkZXIuZ2V0UmVzdWx0KCdwbGF5ZXJTcHJpdGUnKV0sXG5cdFx0ZnJhbWVzOiB7cmVnWDogMTYsIGhlaWdodDogOTIsIGNvdW50OiAyNCwgcmVnWTogMCwgd2lkdGg6IDY0fSxcblx0XHRhbmltYXRpb25zOiB7XG5cdFx0XHRzdGFuZDogWzNdLFxuXHRcdFx0cnVuOiBbMywgNywgJ3NsYXNoJywgMC41XSxcblx0XHRcdHNsYXNoOiBbMTIsIDE2LCAncnVuJywgMC41XSxcblx0XHRcdGRlYWQ6IFsxNSwgMTYsICdkZWFkJywgMC4yXVxuXHRcdH1cblx0fSwgJ3NsYXNoJywge3g6IDIwLCB5OiA2MH0pO1xuXG5cdHN0YWdlLmFkZENoaWxkKHBsYXllci5zcHJpdGUpO1xuXG59XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBSRU5ERVIgTE9PUCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5jcmVhdGVqcy5UaWNrZXIuYWRkRXZlbnRMaXN0ZW5lcigndGljaycsIGhhbmRsZVRpY2spOyBcbmZ1bmN0aW9uIGhhbmRsZVRpY2soZXZlbnQpIHtcblxuXHR2YXIgZGVsdGFTID0gZXZlbnQuZGVsdGEgLyAxMDAwO1xuXG5cdHN0YWdlLnVwZGF0ZSgpO1xufVxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIl19