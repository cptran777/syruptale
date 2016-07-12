'use strict';

/* ***************************** APP INITIATION ******************************* */

// Using create.js to set up and render background:

var stage, loader, canvasWidth, canvasHeight;
var background, player;
var enemies = [];

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
	var manifest = [{ src: 'background.png', id: 'background' }, { src: 'default-sprite.png', id: 'playerSprite' }, { src: 'SlimeAnimated.png', id: 'slime' }];
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

	// enemies[0] = new Mob(loader.getResult('slime'), {hp: 20, atk: 12, def: 5}, {direction: 'left'});
	// enemies[0].createSprite({
	// 	framerate: 30,
	// 	images: [enemies[0].image],
	// 	frames: [[0, 0, 84, 96],
	// 		[84, 0, 84, 96],
	// 		[168, 0, 84, 96],
	// 		[252, 0, 84, 96],
	// 		[340, 0, 80, 96],
	// 		[424, 0, 80, 96],
	// 		[508, 0, 80, 96]
	// 	],
	// 	animations: {
	// 		stand: [0, 0, 'hop', 0.2],
	// 		hop: [1, 6, 'stand', 0.2]
	// 	}
	// }, 'hop', {x: 250, y: 84});

	// enemies[0].sprite.scaleX = 0.5;
	// enemies[0].sprite.scaleY = 0.5;

	// stage.addChild(enemies[0].sprite);
}

/* **************************** HANDLE KEYBINDS ***************************** */

function handleKeyDown(event) {
	player.handleAnimation(keyMap[event.keyCode], 'run', 8);
}

function handleKeyUp(event) {
	player.handleAnimation('stop', 'stand', 0);
}

/* **************************** ENEMY SPAWNS ***************************** */

// Function will run every time through the render loop and, if enemy count is
// below a specified max, randomly generate a number to try to meet conditions
// for an enemy spawn. randA and randB help to set the parameters for
// how often something should happen.
var randomizedSpawn = function randomizedSpawn(max, randA, randB) {
	if (enemies.length < max) {
		if (Math.floor(Math.random() * randA) % randB === 0) {
			var newIdx = enemies.length;
			console.log('sending get request...');
			$.get('http://127.0.0.1:3000', { name: 'slime' }, function (data) {
				console.log('get request successful');
				enemies[newIdx] = new Mob(loader.getResult('slime'), { hp: data.result.hp, atk: data.result.atk, def: data.result.def }, { direction: 'left' });
				enemies[newIdx].createSprite({
					framerate: 30,
					images: [enemies[newIdx]],
					frames: JSON.parse(data.result.spritesheet),
					animations: {
						stand: [0, 0, 'hop', 0.2],
						hop: [1, 6, 'stand', 0.2]
					}
				}, 'hop', { x: 250, y: 84 });
				enemies[newIdx].sprite.scaleX = 0.5;
				enemies[newIdx].sprite.scaleY = 0.5;
				stage.addChild(enemies[newIdx].sprite);
			});
		}
	}
};

/* ****************************** RENDER LOOP ******************************** */

createjs.Ticker.addEventListener('tick', handleTick);
function handleTick(event) {

	var deltaS = event.delta / 1000;

	randomizedSpawn(4, 300, 269);

	stage.update();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NjcmlwdHMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUlBLElBQUksS0FBSixFQUFXLE1BQVgsRUFBbUIsV0FBbkIsRUFBZ0MsWUFBaEM7QUFDQSxJQUFJLFVBQUosRUFBZ0IsTUFBaEI7QUFDQSxJQUFJLFVBQVUsRUFBZDs7O0FBR0EsSUFBSSxTQUFTO0FBQ1osS0FBSSxNQURRO0FBRVosS0FBSTtBQUZRLENBQWI7QUFJQSxJQUFJLFFBQVEsQ0FBWjs7QUFFQSxTQUFTLElBQVQsR0FBZ0I7O0FBRWYsU0FBUSxJQUFJLFNBQVMsS0FBYixDQUFtQixnQkFBbkIsQ0FBUjs7O0FBR0EsZUFBYyxNQUFNLE1BQU4sQ0FBYSxLQUEzQjtBQUNBLGdCQUFlLE1BQU0sTUFBTixDQUFhLE1BQTVCOzs7O0FBSUEsS0FBSSxXQUFXLENBQ2QsRUFBQyxLQUFLLGdCQUFOLEVBQXdCLElBQUksWUFBNUIsRUFEYyxFQUVkLEVBQUMsS0FBSyxvQkFBTixFQUE0QixJQUFJLGNBQWhDLEVBRmMsRUFHZCxFQUFDLEtBQUssbUJBQU4sRUFBMkIsSUFBSSxPQUEvQixFQUhjLENBQWY7O0FBTUEsVUFBUyxJQUFJLFNBQVMsU0FBYixDQUF1QixLQUF2QixDQUFUO0FBQ0EsUUFBTyxnQkFBUCxDQUF3QixVQUF4QixFQUFvQyxjQUFwQztBQUNBLFFBQU8sWUFBUCxDQUFvQixRQUFwQixFQUE4QixJQUE5QixFQUFvQyxnQkFBcEM7OztBQUdBLFFBQU8sUUFBUCxDQUFnQixTQUFoQixHQUE0QixhQUE1QjtBQUNBLFFBQU8sUUFBUCxDQUFnQixPQUFoQixHQUEwQixXQUExQjtBQUNBOztBQUVEOzs7O0FBSUEsU0FBUyxjQUFULENBQXdCLEtBQXhCLEVBQStCOzs7QUFHOUIsY0FBYSxJQUFJLFNBQVMsS0FBYixFQUFiO0FBQ0EsS0FBSSxnQkFBZ0IsT0FBTyxTQUFQLENBQWlCLFlBQWpCLENBQXBCO0FBQ0EsWUFBVyxRQUFYLENBQW9CLGVBQXBCLENB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QixLQUE3QixFQVFHLEtBUkgsRUFRVSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsRUFBWixFQVJWO0FBU0EsWUFBUSxNQUFSLEVBQWdCLE1BQWhCLENBQXVCLE1BQXZCLEdBQWdDLEdBQWhDO0FBQ0EsWUFBUSxNQUFSLEVBQWdCLE1BQWhCLENBQXVCLE1BQXZCLEdBQWdDLEdBQWhDO0FBQ0EsVUFBTSxRQUFOLENBQWUsUUFBUSxNQUFSLEVBQWdCLE1BQS9CO0FBQ0EsSUFuQkY7QUFvQkE7QUFDRDtBQUNELENBM0JEOzs7O0FBK0JBLFNBQVMsTUFBVCxDQUFnQixnQkFBaEIsQ0FBaUMsTUFBakMsRUFBeUMsVUFBekM7QUFDQSxTQUFTLFVBQVQsQ0FBb0IsS0FBcEIsRUFBMkI7O0FBRTFCLEtBQUksU0FBUyxNQUFNLEtBQU4sR0FBYyxJQUEzQjs7QUFFQSxpQkFBZ0IsQ0FBaEIsRUFBbUIsR0FBbkIsRUFBd0IsR0FBeEI7O0FBRUEsT0FBTSxNQUFOO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogQVBQIElOSVRJQVRJT04gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG4vLyBVc2luZyBjcmVhdGUuanMgdG8gc2V0IHVwIGFuZCByZW5kZXIgYmFja2dyb3VuZDogXG5cbnZhciBzdGFnZSwgbG9hZGVyLCBjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0O1xudmFyIGJhY2tncm91bmQsIHBsYXllcjtcbnZhciBlbmVtaWVzID0gW107XG5cbi8vIFRoZSBwdXJwb3NlIG9mIGtleU1hcCBpcyB0byBob2xkIHRoZSBwb3NzaWJsZSBrZXlwcmVzc2VzIGZvciBrZXlkb3duIGV2ZW50cyB0aGF0IG1heSBoYXBwZW4gXG52YXIga2V5TWFwID0ge1xuXHQ2NTogJ2xlZnQnLFxuXHQ2ODogJ3JpZ2h0J1xufTtcbnZhciB4VGVzdCA9IDA7XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG5cblx0c3RhZ2UgPSBuZXcgY3JlYXRlanMuU3RhZ2UoJ2ZvcmVzdC1kdW5nZW9uJyk7XG5cblx0Ly8gQ2FudmFzIHdpZHRoIGFuZCBoZWlnaHQgc3RvcmVkIGluIHZhciB3IGFuZCBoIGZvciBmdXR1cmUgdXNlLiBcblx0Y2FudmFzV2lkdGggPSBzdGFnZS5jYW52YXMud2lkdGg7XG5cdGNhbnZhc0hlaWdodCA9IHN0YWdlLmNhbnZhcy5oZWlnaHQ7XG5cblx0Ly8gTWFuaWZlc3Qgd2lsbCBjcmVhdGUgYW5kIHN0b3JlIGJhY2tncm91bmQgaW1hZ2UgZm9yIGZ1dHVyZSB1c2UuIExvb2tzIGxpa2UgXG5cdC8vIHRoZSByZW5kZXIgd2lsbCBuZWVkIHRvIGJlIGFkanVzdGVkIHRvIGFsaWduIHRoZSBpbWFnZSBwcm9wZXJseS4gXG5cdHZhciBtYW5pZmVzdCA9IFtcblx0XHR7c3JjOiAnYmFja2dyb3VuZC5wbmcnLCBpZDogJ2JhY2tncm91bmQnfSxcblx0XHR7c3JjOiAnZGVmYXVsdC1zcHJpdGUucG5nJywgaWQ6ICdwbGF5ZXJTcHJpdGUnfSxcblx0XHR7c3JjOiAnU2xpbWVBbmltYXRlZC5wbmcnLCBpZDogJ3NsaW1lJ31cblx0XTtcblx0Ly8gTG9hZGVyIHdpbGwgcmVuZGVyIHRoZSBuZWNlc3NhcnkgaXRlbXMgXG5cdGxvYWRlciA9IG5ldyBjcmVhdGVqcy5Mb2FkUXVldWUoZmFsc2UpO1xuXHRsb2FkZXIuYWRkRXZlbnRMaXN0ZW5lcignY29tcGxldGUnLCBoYW5kbGVDb21wbGV0ZSk7XG5cdGxvYWRlci5sb2FkTWFuaWZlc3QobWFuaWZlc3QsIHRydWUsICdhc3NldHMvaW1hZ2VzLycpO1xuXG5cdC8vIERldGVjdCBrZXlwcmVzczogXG5cdHdpbmRvdy5kb2N1bWVudC5vbmtleWRvd24gPSBoYW5kbGVLZXlEb3duO1xuXHR3aW5kb3cuZG9jdW1lbnQub25rZXl1cCA9IGhhbmRsZUtleVVwO1xufVxuXG5pbml0KCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogQ1JFQVRFIFRIRSBTVEFHRSAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5mdW5jdGlvbiBoYW5kbGVDb21wbGV0ZShldmVudCkge1xuXHRcblx0Ly8gQ3JlYXRlcyBiYWNrZ3JvdW5kIGltYWdlLiBcblx0YmFja2dyb3VuZCA9IG5ldyBjcmVhdGVqcy5TaGFwZSgpO1xuXHR2YXIgYmFja2dyb3VuZEltZyA9IGxvYWRlci5nZXRSZXN1bHQoJ2JhY2tncm91bmQnKTtcblx0YmFja2dyb3VuZC5ncmFwaGljcy5iZWdpbkJpdG1hcEZpbGwoYmFja2dyb3VuZEltZykuZHJhd1JlY3QoMCwgMCwgY2FudmFzV2lkdGggKyBiYWNrZ3JvdW5kSW1nLndpZHRoLCBjYW52YXNIZWlnaHQgKyBiYWNrZ3JvdW5kSW1nLmhlaWdodCk7XG5cdHN0YWdlLmFkZENoaWxkKGJhY2tncm91bmQpO1xuXG5cdC8vIEFkanVzdG1lbnQgdG8gbGluZSB0aGUgaW1hZ2UgbWVudGlvbmVkIGFib3ZlLiBcblx0YmFja2dyb3VuZC55ID0gLTEwNTtcblxuXHQvLyBDcmVhdGlvbiBvZiB0aGUgcGxheWVyIHRvIHJlbmRlciBvbiB0aGUgc2NyZWVuLiBcblx0cGxheWVyID0gbmV3IFBsYXllcihsb2FkZXIuZ2V0UmVzdWx0KCdwbGF5ZXJTcHJpdGUnKSwge2hwOiAxMDAsIGF0azogMTAsIGRlZjogMTB9LCB7ZGlyZWN0aW9uOiAncmlnaHQnfSk7XG5cdHBsYXllci5jcmVhdGVTcHJpdGUoe1xuXHRcdGZyYW1lcmF0ZTogMzAsXG5cdFx0aW1hZ2VzOiBbcGxheWVyLmltYWdlXSxcblx0XHRmcmFtZXM6IHtyZWdYOiAwLCBoZWlnaHQ6IDkyLCBjb3VudDogMjQsIHJlZ1k6IDAsIHdpZHRoOiA2NH0sXG5cdFx0YW5pbWF0aW9uczoge1xuXHRcdFx0c3RhbmQ6IFs0XSxcblx0XHRcdHJ1bjogWzMsIDcsICdydW4nLCAwLjVdLFxuXHRcdFx0c2xhc2g6IFsxMiwgMTYsICdzdGFuZCcsIDAuNV0sXG5cdFx0XHRkZWFkOiBbMTUsIDE2LCAnZGVhZCcsIDAuMl1cblx0XHR9XG5cdH0sICdzbGFzaCcsIHt4OiA2MCwgeTogNjB9KTtcblxuXHRzdGFnZS5hZGRDaGlsZChwbGF5ZXIuc3ByaXRlKTtcblxuXHQvLyBlbmVtaWVzWzBdID0gbmV3IE1vYihsb2FkZXIuZ2V0UmVzdWx0KCdzbGltZScpLCB7aHA6IDIwLCBhdGs6IDEyLCBkZWY6IDV9LCB7ZGlyZWN0aW9uOiAnbGVmdCd9KTtcblx0Ly8gZW5lbWllc1swXS5jcmVhdGVTcHJpdGUoe1xuXHQvLyBcdGZyYW1lcmF0ZTogMzAsXG5cdC8vIFx0aW1hZ2VzOiBbZW5lbWllc1swXS5pbWFnZV0sXG5cdC8vIFx0ZnJhbWVzOiBbWzAsIDAsIDg0LCA5Nl0sXG5cdC8vIFx0XHRbODQsIDAsIDg0LCA5Nl0sXG5cdC8vIFx0XHRbMTY4LCAwLCA4NCwgOTZdLFxuXHQvLyBcdFx0WzI1MiwgMCwgODQsIDk2XSxcblx0Ly8gXHRcdFszNDAsIDAsIDgwLCA5Nl0sXG5cdC8vIFx0XHRbNDI0LCAwLCA4MCwgOTZdLFxuXHQvLyBcdFx0WzUwOCwgMCwgODAsIDk2XVxuXHQvLyBcdF0sIFxuXHQvLyBcdGFuaW1hdGlvbnM6IHtcblx0Ly8gXHRcdHN0YW5kOiBbMCwgMCwgJ2hvcCcsIDAuMl0sXG5cdC8vIFx0XHRob3A6IFsxLCA2LCAnc3RhbmQnLCAwLjJdXG5cdC8vIFx0fVxuXHQvLyB9LCAnaG9wJywge3g6IDI1MCwgeTogODR9KTtcblxuXHQvLyBlbmVtaWVzWzBdLnNwcml0ZS5zY2FsZVggPSAwLjU7XG5cdC8vIGVuZW1pZXNbMF0uc3ByaXRlLnNjYWxlWSA9IDAuNTtcblxuXHQvLyBzdGFnZS5hZGRDaGlsZChlbmVtaWVzWzBdLnNwcml0ZSk7XG5cblxufVxuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIEhBTkRMRSBLRVlCSU5EUyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5mdW5jdGlvbiBoYW5kbGVLZXlEb3duKGV2ZW50KSB7XG5cdHBsYXllci5oYW5kbGVBbmltYXRpb24oa2V5TWFwW2V2ZW50LmtleUNvZGVdLCAncnVuJywgOCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUtleVVwKGV2ZW50KSB7XG5cdHBsYXllci5oYW5kbGVBbmltYXRpb24oJ3N0b3AnLCAnc3RhbmQnLCAwKTtcbn1cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBFTkVNWSBTUEFXTlMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuLy8gRnVuY3Rpb24gd2lsbCBydW4gZXZlcnkgdGltZSB0aHJvdWdoIHRoZSByZW5kZXIgbG9vcCBhbmQsIGlmIGVuZW15IGNvdW50IGlzXG4vLyBiZWxvdyBhIHNwZWNpZmllZCBtYXgsIHJhbmRvbWx5IGdlbmVyYXRlIGEgbnVtYmVyIHRvIHRyeSB0byBtZWV0IGNvbmRpdGlvbnNcbi8vIGZvciBhbiBlbmVteSBzcGF3bi4gcmFuZEEgYW5kIHJhbmRCIGhlbHAgdG8gc2V0IHRoZSBwYXJhbWV0ZXJzIGZvclxuLy8gaG93IG9mdGVuIHNvbWV0aGluZyBzaG91bGQgaGFwcGVuLiBcbnZhciByYW5kb21pemVkU3Bhd24gPSBmdW5jdGlvbihtYXgsIHJhbmRBLCByYW5kQikge1xuXHRpZiAoZW5lbWllcy5sZW5ndGggPCBtYXgpIHtcblx0XHRpZiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmFuZEEpICUgcmFuZEIgPT09IDApIHtcblx0XHRcdHZhciBuZXdJZHggPSBlbmVtaWVzLmxlbmd0aDtcblx0XHRcdGNvbnNvbGUubG9nKCdzZW5kaW5nIGdldCByZXF1ZXN0Li4uJyk7XG5cdFx0XHQkLmdldCgnaHR0cDovLzEyNy4wLjAuMTozMDAwJywge25hbWU6ICdzbGltZSd9LCBcblx0XHRcdFx0ZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdnZXQgcmVxdWVzdCBzdWNjZXNzZnVsJyk7XG5cdFx0XHRcdFx0ZW5lbWllc1tuZXdJZHhdID0gbmV3IE1vYihsb2FkZXIuZ2V0UmVzdWx0KCdzbGltZScpLFxuXHRcdFx0XHRcdFx0e2hwOiBkYXRhLnJlc3VsdC5ocCwgYXRrOiBkYXRhLnJlc3VsdC5hdGssIGRlZjogZGF0YS5yZXN1bHQuZGVmfSxcblx0XHRcdFx0XHRcdHtkaXJlY3Rpb246ICdsZWZ0J31cblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGVuZW1pZXNbbmV3SWR4XS5jcmVhdGVTcHJpdGUoe1xuXHRcdFx0XHRcdFx0ZnJhbWVyYXRlOiAzMCxcblx0XHRcdFx0XHRcdGltYWdlczogW2VuZW1pZXNbbmV3SWR4XV0sXG5cdFx0XHRcdFx0XHRmcmFtZXM6IEpTT04ucGFyc2UoZGF0YS5yZXN1bHQuc3ByaXRlc2hlZXQpLFxuXHRcdFx0XHRcdFx0YW5pbWF0aW9uczoge1xuXHRcdFx0XHRcdFx0XHRzdGFuZDogWzAsIDAsICdob3AnLCAwLjJdLFxuXHRcdFx0XHRcdFx0XHRob3A6IFsxLCA2LCAnc3RhbmQnLCAwLjJdXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSwgJ2hvcCcsIHt4OiAyNTAsIHk6IDg0fSk7XG5cdFx0XHRcdFx0ZW5lbWllc1tuZXdJZHhdLnNwcml0ZS5zY2FsZVggPSAwLjU7XG5cdFx0XHRcdFx0ZW5lbWllc1tuZXdJZHhdLnNwcml0ZS5zY2FsZVkgPSAwLjU7XG5cdFx0XHRcdFx0c3RhZ2UuYWRkQ2hpbGQoZW5lbWllc1tuZXdJZHhdLnNwcml0ZSk7XG5cdFx0XHRcdH0pO1xuXHRcdH1cblx0fVxufTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFJFTkRFUiBMT09QICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmNyZWF0ZWpzLlRpY2tlci5hZGRFdmVudExpc3RlbmVyKCd0aWNrJywgaGFuZGxlVGljayk7IFxuZnVuY3Rpb24gaGFuZGxlVGljayhldmVudCkge1xuXG5cdHZhciBkZWx0YVMgPSBldmVudC5kZWx0YSAvIDEwMDA7XG5cblx0cmFuZG9taXplZFNwYXduKDQsIDMwMCwgMjY5KTtcblxuXHRzdGFnZS51cGRhdGUoKTtcbn1cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIl19