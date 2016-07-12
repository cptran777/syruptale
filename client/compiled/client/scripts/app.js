'use strict';

/* ***************************** APP INITIATION ******************************* */

// Using create.js to set up and render background:

var stage, loader, canvasWidth, canvasHeight;
var background, player;
var enemies = [];
var timeElapsed = 0;

// The purpose of keyMap is to hold the possible keypresses for keydown events that may happen
var keyMap = {
	65: 'left',
	68: 'right'
};

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
	window.document.onclick = handleClick;
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
		frames: player.spritesheetdata,
		// x, y, width, height, imageIndex*, regX*, regY*
		// {regX: 0, height: 92, count: 24, regY: 0, width: 64},
		animations: {
			stand: [0],
			run: [1, 6, 'run', 0.5],
			slash: [7, 13, 'stand', 0.5],
			dead: [14, 16, 'dead', 0.1]
		}
	}, 'stand', { x: 60, y: 60 });

	stage.addChild(player.sprite);
}

/* **************************** HANDLE KEYBINDS ***************************** */

function handleKeyDown(event) {
	player.handleAnimation(keyMap[event.keyCode], 'run', 8, 0);
}

function handleKeyUp(event) {
	player.handleAnimation('stop', 'stand', 0);
}

function handleClick(event) {
	player.handleAttack(enemies);
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
			$.get('http://127.0.0.1:3000/mobs', { name: 'slime' }, function (data) {
				enemies[newIdx] = new Mob(loader.getResult('slime'), { hp: data.result.hp, atk: data.result.atk, def: data.result.def }, { direction: 'left' });
				enemies[newIdx].createSprite({
					framerate: 30,
					images: [enemies[newIdx].image],
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

	timeElapsed++;

	randomizedSpawn(4, 300, 269);
	enemies.forEach(function moveMobs(mob) {
		if (mob.sprite.x > player.sprite.x) {
			mob.handleAnimation('left', 'hop', 1);
		} else {
			mob.handleAnimation('right', 'hop', 1);
		}
	});

	if (timeElapsed % 5 === 0) {
		player.collisions(enemies, null);
	}

	// Remove any defeated enemies:
	enemies = enemies.filter(function healthZero(mob) {
		if (mob.hp <= 0) {
			stage.removeChild(mob.sprite);
			console.log('mob death detected');
		}
		return mob.hp > 0;
	});

	stage.update();
}
//# sourceMappingURL=data:application/json;base64,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QjtBQUNBLEVBTlMsQ0FBVjs7QUFRQSxPQUFNLE1BQU47QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBBUFAgSU5JVElBVElPTiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbi8vIFVzaW5nIGNyZWF0ZS5qcyB0byBzZXQgdXAgYW5kIHJlbmRlciBiYWNrZ3JvdW5kOiBcblxudmFyIHN0YWdlLCBsb2FkZXIsIGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQ7XG52YXIgYmFja2dyb3VuZCwgcGxheWVyO1xudmFyIGVuZW1pZXMgPSBbXTtcbnZhciB0aW1lRWxhcHNlZCA9IDA7IFxuXG4vLyBUaGUgcHVycG9zZSBvZiBrZXlNYXAgaXMgdG8gaG9sZCB0aGUgcG9zc2libGUga2V5cHJlc3NlcyBmb3Iga2V5ZG93biBldmVudHMgdGhhdCBtYXkgaGFwcGVuIFxudmFyIGtleU1hcCA9IHtcblx0NjU6ICdsZWZ0Jyxcblx0Njg6ICdyaWdodCdcbn07XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG5cblx0c3RhZ2UgPSBuZXcgY3JlYXRlanMuU3RhZ2UoJ2ZvcmVzdC1kdW5nZW9uJyk7XG5cblx0Ly8gQ2FudmFzIHdpZHRoIGFuZCBoZWlnaHQgc3RvcmVkIGluIHZhciB3IGFuZCBoIGZvciBmdXR1cmUgdXNlLiBcblx0Y2FudmFzV2lkdGggPSBzdGFnZS5jYW52YXMud2lkdGg7XG5cdGNhbnZhc0hlaWdodCA9IHN0YWdlLmNhbnZhcy5oZWlnaHQ7XG5cblx0Ly8gTWFuaWZlc3Qgd2lsbCBjcmVhdGUgYW5kIHN0b3JlIGJhY2tncm91bmQgaW1hZ2UgZm9yIGZ1dHVyZSB1c2UuIExvb2tzIGxpa2UgXG5cdC8vIHRoZSByZW5kZXIgd2lsbCBuZWVkIHRvIGJlIGFkanVzdGVkIHRvIGFsaWduIHRoZSBpbWFnZSBwcm9wZXJseS4gXG5cdHZhciBtYW5pZmVzdCA9IFtcblx0XHR7c3JjOiAnYmFja2dyb3VuZC5wbmcnLCBpZDogJ2JhY2tncm91bmQnfSxcblx0XHR7c3JjOiAnZGVmYXVsdC1zcHJpdGUucG5nJywgaWQ6ICdwbGF5ZXJTcHJpdGUnfSxcblx0XHR7c3JjOiAnU2xpbWVBbmltYXRlZC5wbmcnLCBpZDogJ3NsaW1lJ31cblx0XTtcblx0Ly8gTG9hZGVyIHdpbGwgcmVuZGVyIHRoZSBuZWNlc3NhcnkgaXRlbXMgXG5cdGxvYWRlciA9IG5ldyBjcmVhdGVqcy5Mb2FkUXVldWUoZmFsc2UpO1xuXHRsb2FkZXIuYWRkRXZlbnRMaXN0ZW5lcignY29tcGxldGUnLCBoYW5kbGVDb21wbGV0ZSk7XG5cdGxvYWRlci5sb2FkTWFuaWZlc3QobWFuaWZlc3QsIHRydWUsICdhc3NldHMvaW1hZ2VzLycpO1xuXG5cdC8vIERldGVjdCBrZXlwcmVzczogXG5cdHdpbmRvdy5kb2N1bWVudC5vbmtleWRvd24gPSBoYW5kbGVLZXlEb3duO1xuXHR3aW5kb3cuZG9jdW1lbnQub25rZXl1cCA9IGhhbmRsZUtleVVwO1xuXHR3aW5kb3cuZG9jdW1lbnQub25jbGljayA9IGhhbmRsZUNsaWNrO1xufVxuXG5pbml0KCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogQ1JFQVRFIFRIRSBTVEFHRSAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5mdW5jdGlvbiBoYW5kbGVDb21wbGV0ZShldmVudCkge1xuXHRcblx0Ly8gQ3JlYXRlcyBiYWNrZ3JvdW5kIGltYWdlLiBcblx0YmFja2dyb3VuZCA9IG5ldyBjcmVhdGVqcy5TaGFwZSgpO1xuXHR2YXIgYmFja2dyb3VuZEltZyA9IGxvYWRlci5nZXRSZXN1bHQoJ2JhY2tncm91bmQnKTtcblx0YmFja2dyb3VuZC5ncmFwaGljcy5iZWdpbkJpdG1hcEZpbGwoYmFja2dyb3VuZEltZykuZHJhd1JlY3QoMCwgMCwgY2FudmFzV2lkdGggKyBiYWNrZ3JvdW5kSW1nLndpZHRoLCBjYW52YXNIZWlnaHQgKyBiYWNrZ3JvdW5kSW1nLmhlaWdodCk7XG5cdHN0YWdlLmFkZENoaWxkKGJhY2tncm91bmQpO1xuXG5cdC8vIEFkanVzdG1lbnQgdG8gbGluZSB0aGUgaW1hZ2UgbWVudGlvbmVkIGFib3ZlLiBcblx0YmFja2dyb3VuZC55ID0gLTEwNTtcblxuXHQvLyBDcmVhdGlvbiBvZiB0aGUgcGxheWVyIHRvIHJlbmRlciBvbiB0aGUgc2NyZWVuLiBcblx0cGxheWVyID0gbmV3IFBsYXllcihsb2FkZXIuZ2V0UmVzdWx0KCdwbGF5ZXJTcHJpdGUnKSwge2hwOiAxMDAsIGF0azogMTAsIGRlZjogMTB9LCB7ZGlyZWN0aW9uOiAncmlnaHQnfSk7XG5cdHBsYXllci5jcmVhdGVTcHJpdGUoe1xuXHRcdGZyYW1lcmF0ZTogMzAsXG5cdFx0aW1hZ2VzOiBbcGxheWVyLmltYWdlXSxcblx0XHRmcmFtZXM6IHBsYXllci5zcHJpdGVzaGVldGRhdGEsXG5cdFx0Ly8geCwgeSwgd2lkdGgsIGhlaWdodCwgaW1hZ2VJbmRleCosIHJlZ1gqLCByZWdZKlxuXHRcdC8vIHtyZWdYOiAwLCBoZWlnaHQ6IDkyLCBjb3VudDogMjQsIHJlZ1k6IDAsIHdpZHRoOiA2NH0sXG5cdFx0YW5pbWF0aW9uczoge1xuXHRcdFx0c3RhbmQ6IFswXSxcblx0XHRcdHJ1bjogWzEsIDYsICdydW4nLCAwLjVdLFxuXHRcdFx0c2xhc2g6IFs3LCAxMywgJ3N0YW5kJywgMC41XSxcblx0XHRcdGRlYWQ6IFsxNCwgMTYsICdkZWFkJywgMC4xXVxuXHRcdH1cblx0fSwgJ3N0YW5kJywge3g6IDYwLCB5OiA2MH0pO1xuXG5cdHN0YWdlLmFkZENoaWxkKHBsYXllci5zcHJpdGUpO1xuXG59XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogSEFORExFIEtFWUJJTkRTICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmZ1bmN0aW9uIGhhbmRsZUtleURvd24oZXZlbnQpIHtcblx0cGxheWVyLmhhbmRsZUFuaW1hdGlvbihrZXlNYXBbZXZlbnQua2V5Q29kZV0sICdydW4nLCA4LCAwKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlS2V5VXAoZXZlbnQpIHtcblx0cGxheWVyLmhhbmRsZUFuaW1hdGlvbignc3RvcCcsICdzdGFuZCcsIDApO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVDbGljayhldmVudCkge1xuXHRwbGF5ZXIuaGFuZGxlQXR0YWNrKGVuZW1pZXMpO1xufVxuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIEVORU1ZIFNQQVdOUyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG4vLyBGdW5jdGlvbiB3aWxsIHJ1biBldmVyeSB0aW1lIHRocm91Z2ggdGhlIHJlbmRlciBsb29wIGFuZCwgaWYgZW5lbXkgY291bnQgaXNcbi8vIGJlbG93IGEgc3BlY2lmaWVkIG1heCwgcmFuZG9tbHkgZ2VuZXJhdGUgYSBudW1iZXIgdG8gdHJ5IHRvIG1lZXQgY29uZGl0aW9uc1xuLy8gZm9yIGFuIGVuZW15IHNwYXduLiByYW5kQSBhbmQgcmFuZEIgaGVscCB0byBzZXQgdGhlIHBhcmFtZXRlcnMgZm9yXG4vLyBob3cgb2Z0ZW4gc29tZXRoaW5nIHNob3VsZCBoYXBwZW4uIFxudmFyIHJhbmRvbWl6ZWRTcGF3biA9IGZ1bmN0aW9uKG1heCwgcmFuZEEsIHJhbmRCKSB7XG5cdGlmIChlbmVtaWVzLmxlbmd0aCA8IG1heCkge1xuXHRcdGlmIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYW5kQSkgJSByYW5kQiA9PT0gMCkge1xuXHRcdFx0dmFyIG5ld0lkeCA9IGVuZW1pZXMubGVuZ3RoO1xuXHRcdFx0JC5nZXQoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9tb2JzJywge25hbWU6ICdzbGltZSd9LCBcblx0XHRcdFx0ZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdGVuZW1pZXNbbmV3SWR4XSA9IG5ldyBNb2IobG9hZGVyLmdldFJlc3VsdCgnc2xpbWUnKSxcblx0XHRcdFx0XHRcdHtocDogZGF0YS5yZXN1bHQuaHAsIGF0azogZGF0YS5yZXN1bHQuYXRrLCBkZWY6IGRhdGEucmVzdWx0LmRlZn0sXG5cdFx0XHRcdFx0XHR7ZGlyZWN0aW9uOiAnbGVmdCd9XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRlbmVtaWVzW25ld0lkeF0uY3JlYXRlU3ByaXRlKHtcblx0XHRcdFx0XHRcdGZyYW1lcmF0ZTogMzAsXG5cdFx0XHRcdFx0XHRpbWFnZXM6IFtlbmVtaWVzW25ld0lkeF0uaW1hZ2VdLFxuXHRcdFx0XHRcdFx0ZnJhbWVzOiBKU09OLnBhcnNlKGRhdGEucmVzdWx0LnNwcml0ZXNoZWV0KSxcblx0XHRcdFx0XHRcdGFuaW1hdGlvbnM6IHtcblx0XHRcdFx0XHRcdFx0c3RhbmQ6IFswLCAwLCAnaG9wJywgMC4yXSxcblx0XHRcdFx0XHRcdFx0aG9wOiBbMSwgNiwgJ3N0YW5kJywgMC4yXVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sICdob3AnLCB7eDogMjUwLCB5OiA4NH0pO1xuXHRcdFx0XHRcdGVuZW1pZXNbbmV3SWR4XS5zcHJpdGUuc2NhbGVYID0gMC41O1xuXHRcdFx0XHRcdGVuZW1pZXNbbmV3SWR4XS5zcHJpdGUuc2NhbGVZID0gMC41O1xuXHRcdFx0XHRcdHN0YWdlLmFkZENoaWxkKGVuZW1pZXNbbmV3SWR4XS5zcHJpdGUpO1xuXHRcdFx0XHR9KTtcblx0XHR9XG5cdH1cbn07XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBSRU5ERVIgTE9PUCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5jcmVhdGVqcy5UaWNrZXIuYWRkRXZlbnRMaXN0ZW5lcigndGljaycsIGhhbmRsZVRpY2spOyBcbmZ1bmN0aW9uIGhhbmRsZVRpY2soZXZlbnQpIHtcblxuXHR2YXIgZGVsdGFTID0gZXZlbnQuZGVsdGEgLyAxMDAwO1xuXG5cdHRpbWVFbGFwc2VkKys7XG5cblx0cmFuZG9taXplZFNwYXduKDQsIDMwMCwgMjY5KTtcblx0ZW5lbWllcy5mb3JFYWNoKGZ1bmN0aW9uIG1vdmVNb2JzKG1vYikge1xuXHRcdGlmIChtb2Iuc3ByaXRlLnggPiBwbGF5ZXIuc3ByaXRlLngpIHtcblx0XHRcdG1vYi5oYW5kbGVBbmltYXRpb24oJ2xlZnQnLCAnaG9wJywgMSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG1vYi5oYW5kbGVBbmltYXRpb24oJ3JpZ2h0JywgJ2hvcCcsIDEpO1xuXHRcdH1cblx0fSk7XG5cblx0aWYgKHRpbWVFbGFwc2VkICUgNSA9PT0gMCkge1xuXHRcdHBsYXllci5jb2xsaXNpb25zKGVuZW1pZXMsIG51bGwpO1xuXHR9XG5cblx0Ly8gUmVtb3ZlIGFueSBkZWZlYXRlZCBlbmVtaWVzOiBcblx0ZW5lbWllcyA9IGVuZW1pZXMuZmlsdGVyKGZ1bmN0aW9uIGhlYWx0aFplcm8obW9iKSB7XG5cdFx0aWYgKG1vYi5ocCA8PSAwKSB7XG5cdFx0XHRzdGFnZS5yZW1vdmVDaGlsZChtb2Iuc3ByaXRlKTtcblx0XHRcdGNvbnNvbGUubG9nKCdtb2IgZGVhdGggZGV0ZWN0ZWQnKTtcblx0XHR9XG5cdFx0cmV0dXJuIG1vYi5ocCA+IDA7XG5cdH0pO1xuXG5cdHN0YWdlLnVwZGF0ZSgpO1xufVxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4iXX0=