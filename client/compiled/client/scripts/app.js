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
			run: [1, 6, 'run', 0.25],
			slash: [7, 13, 'stand', 0.25],
			dead: [14, 16, 'dead', 0.05]
		}
	}, 'stand', { x: 60, y: 60 });

	stage.addChild(player.sprite);
}

// Moves the stage if the player has gone beyond a certain boundary on either side, but
// only while they are still moving in that direction.

function moveStage() {

	if (player.sprite.x > 175) {
		background.x--;
		enemies.forEach(function (mob) {
			mob.sprite.x--;
		});
		if (background.x < -900) {
			background.x = 0;
		}
		if (player.sprite.currentAnimation === 'stand' || player.sprite.currentAnimation === 'slash') {
			player.sprite.x--;
		}
	} else if (player.sprite.x < 25) {
		background.x++;
		enemies.forEach(function (mob) {
			mob.sprite.x++;
		});
		if (background.x > 0) {
			background.x = -900;
		}
		if (player.sprite.currentAnimation === 'stand') {
			player.sprite.x++;
		}
	}
}

/* **************************** HANDLE KEYBINDS ***************************** */

function handleKeyDown(event) {
	player.handleAnimation(keyMap[event.keyCode], 'run', 12, 0);
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
createjs.Ticker.setFPS(45);
function handleTick(event) {

	var deltaS = event.delta / 1000;

	timeElapsed++;

	randomizedSpawn(4, 300, 269);
	enemies.forEach(function moveMobs(mob) {
		if (mob.sprite.x > player.sprite.x) {
			mob.handleAnimation('left', 'hop', 0.5);
		} else {
			mob.handleAnimation('right', 'hop', 0.5);
		}
	});

	moveStage();

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
//# sourceMappingURL=data:application/json;base64,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Z0JBQWhCLENBQWlDLE1BQWpDLEVBQXlDLFVBQXpDO0FBQ0EsU0FBUyxNQUFULENBQWdCLE1BQWhCLENBQXVCLEVBQXZCO0FBQ0EsU0FBUyxVQUFULENBQW9CLEtBQXBCLEVBQTJCOztBQUUxQixLQUFJLFNBQVMsTUFBTSxLQUFOLEdBQWMsSUFBM0I7O0FBRUE7O0FBRUEsaUJBQWdCLENBQWhCLEVBQW1CLEdBQW5CLEVBQXdCLEdBQXhCO0FBQ0EsU0FBUSxPQUFSLENBQWdCLFNBQVMsUUFBVCxDQUFrQixHQUFsQixFQUF1QjtBQUN0QyxNQUFJLElBQUksTUFBSixDQUFXLENBQVgsR0FBZSxPQUFPLE1BQVAsQ0FBYyxDQUFqQyxFQUFvQztBQUNuQyxPQUFJLGVBQUosQ0FBb0IsTUFBcEIsRUFBNEIsS0FBNUIsRUFBbUMsR0FBbkM7QUFDQSxHQUZELE1BRU87QUFDTixPQUFJLGVBQUosQ0FBb0IsT0FBcEIsRUFBNkIsS0FBN0IsRUFBb0MsR0FBcEM7QUFDQTtBQUNELEVBTkQ7O0FBUUE7O0FBRUEsS0FBSSxjQUFjLENBQWQsS0FBb0IsQ0FBeEIsRUFBMkI7QUFDMUIsU0FBTyxVQUFQLENBQWtCLE9BQWxCLEVBQTJCLElBQTNCO0FBQ0E7OztBQUdELFdBQVUsUUFBUSxNQUFSLENBQWUsU0FBUyxVQUFULENBQW9CLEdBQXBCLEVBQXlCO0FBQ2pELE1BQUksSUFBSSxFQUFKLElBQVUsQ0FBZCxFQUFpQjtBQUNoQixTQUFNLFdBQU4sQ0FBa0IsSUFBSSxNQUF0QjtBQUNBLFdBQVEsR0FBUixDQUFZLG9CQUFaO0FBQ0E7QUFDRCxTQUFPLElBQUksRUFBSixHQUFTLENBQWhCO0FBQ0EsRUFOUyxDQUFWOztBQVNBLE9BQU0sTUFBTjtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqIEFQUCBJTklUSUFUSU9OICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuLy8gVXNpbmcgY3JlYXRlLmpzIHRvIHNldCB1cCBhbmQgcmVuZGVyIGJhY2tncm91bmQ6IFxuXG52YXIgc3RhZ2UsIGxvYWRlciwgY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodDtcbnZhciBiYWNrZ3JvdW5kLCBwbGF5ZXI7XG52YXIgZW5lbWllcyA9IFtdO1xudmFyIHRpbWVFbGFwc2VkID0gMDtcblxuLy8gVGhlIHB1cnBvc2Ugb2Yga2V5TWFwIGlzIHRvIGhvbGQgdGhlIHBvc3NpYmxlIGtleXByZXNzZXMgZm9yIGtleWRvd24gZXZlbnRzIHRoYXQgbWF5IGhhcHBlbiBcbnZhciBrZXlNYXAgPSB7XG5cdDY1OiAnbGVmdCcsXG5cdDY4OiAncmlnaHQnXG59O1xuXG5mdW5jdGlvbiBpbml0KCkge1xuXG5cdHN0YWdlID0gbmV3IGNyZWF0ZWpzLlN0YWdlKCdmb3Jlc3QtZHVuZ2VvbicpO1xuXG5cdC8vIENhbnZhcyB3aWR0aCBhbmQgaGVpZ2h0IHN0b3JlZCBpbiB2YXIgdyBhbmQgaCBmb3IgZnV0dXJlIHVzZS4gXG5cdGNhbnZhc1dpZHRoID0gc3RhZ2UuY2FudmFzLndpZHRoO1xuXHRjYW52YXNIZWlnaHQgPSBzdGFnZS5jYW52YXMuaGVpZ2h0O1xuXG5cdC8vIE1hbmlmZXN0IHdpbGwgY3JlYXRlIGFuZCBzdG9yZSBiYWNrZ3JvdW5kIGltYWdlIGZvciBmdXR1cmUgdXNlLiBMb29rcyBsaWtlIFxuXHQvLyB0aGUgcmVuZGVyIHdpbGwgbmVlZCB0byBiZSBhZGp1c3RlZCB0byBhbGlnbiB0aGUgaW1hZ2UgcHJvcGVybHkuIFxuXHR2YXIgbWFuaWZlc3QgPSBbXG5cdFx0e3NyYzogJ2JhY2tncm91bmQucG5nJywgaWQ6ICdiYWNrZ3JvdW5kJ30sXG5cdFx0e3NyYzogJ2RlZmF1bHQtc3ByaXRlLnBuZycsIGlkOiAncGxheWVyU3ByaXRlJ30sXG5cdFx0e3NyYzogJ1NsaW1lQW5pbWF0ZWQucG5nJywgaWQ6ICdzbGltZSd9XG5cdF07XG5cdC8vIExvYWRlciB3aWxsIHJlbmRlciB0aGUgbmVjZXNzYXJ5IGl0ZW1zIFxuXHRsb2FkZXIgPSBuZXcgY3JlYXRlanMuTG9hZFF1ZXVlKGZhbHNlKTtcblx0bG9hZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbXBsZXRlJywgaGFuZGxlQ29tcGxldGUpO1xuXHRsb2FkZXIubG9hZE1hbmlmZXN0KG1hbmlmZXN0LCB0cnVlLCAnYXNzZXRzL2ltYWdlcy8nKTtcblxuXHQvLyBEZXRlY3Qga2V5cHJlc3M6IFxuXHR3aW5kb3cuZG9jdW1lbnQub25rZXlkb3duID0gaGFuZGxlS2V5RG93bjtcblx0d2luZG93LmRvY3VtZW50Lm9ua2V5dXAgPSBoYW5kbGVLZXlVcDtcblx0d2luZG93LmRvY3VtZW50Lm9uY2xpY2sgPSBoYW5kbGVDbGljaztcbn1cblxuaW5pdCgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIENSRUFURSBUSEUgU1RBR0UgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuZnVuY3Rpb24gaGFuZGxlQ29tcGxldGUoZXZlbnQpIHtcblx0XG5cdC8vIENyZWF0ZXMgYmFja2dyb3VuZCBpbWFnZS4gXG5cdGJhY2tncm91bmQgPSBuZXcgY3JlYXRlanMuU2hhcGUoKTtcblx0dmFyIGJhY2tncm91bmRJbWcgPSBsb2FkZXIuZ2V0UmVzdWx0KCdiYWNrZ3JvdW5kJyk7XG5cdGJhY2tncm91bmQuZ3JhcGhpY3MuYmVnaW5CaXRtYXBGaWxsKGJhY2tncm91bmRJbWcpLmRyYXdSZWN0KDAsIDAsIGNhbnZhc1dpZHRoICsgYmFja2dyb3VuZEltZy53aWR0aCwgY2FudmFzSGVpZ2h0ICsgYmFja2dyb3VuZEltZy5oZWlnaHQpO1xuXHRzdGFnZS5hZGRDaGlsZChiYWNrZ3JvdW5kKTtcblxuXHQvLyBBZGp1c3RtZW50IHRvIGxpbmUgdGhlIGltYWdlIG1lbnRpb25lZCBhYm92ZS4gXG5cdGJhY2tncm91bmQueSA9IC0xMDU7XG5cblx0Ly8gQ3JlYXRpb24gb2YgdGhlIHBsYXllciB0byByZW5kZXIgb24gdGhlIHNjcmVlbi4gXG5cdHBsYXllciA9IG5ldyBQbGF5ZXIobG9hZGVyLmdldFJlc3VsdCgncGxheWVyU3ByaXRlJyksIHtocDogMTAwLCBhdGs6IDEwLCBkZWY6IDEwfSwge2RpcmVjdGlvbjogJ3JpZ2h0J30pO1xuXHRwbGF5ZXIuY3JlYXRlU3ByaXRlKHtcblx0XHRmcmFtZXJhdGU6IDMwLFxuXHRcdGltYWdlczogW3BsYXllci5pbWFnZV0sXG5cdFx0ZnJhbWVzOiBwbGF5ZXIuc3ByaXRlc2hlZXRkYXRhLFxuXHRcdC8vIHgsIHksIHdpZHRoLCBoZWlnaHQsIGltYWdlSW5kZXgqLCByZWdYKiwgcmVnWSpcblx0XHQvLyB7cmVnWDogMCwgaGVpZ2h0OiA5MiwgY291bnQ6IDI0LCByZWdZOiAwLCB3aWR0aDogNjR9LFxuXHRcdGFuaW1hdGlvbnM6IHtcblx0XHRcdHN0YW5kOiBbMF0sXG5cdFx0XHRydW46IFsxLCA2LCAncnVuJywgMC4yNV0sXG5cdFx0XHRzbGFzaDogWzcsIDEzLCAnc3RhbmQnLCAwLjI1XSxcblx0XHRcdGRlYWQ6IFsxNCwgMTYsICdkZWFkJywgMC4wNV1cblx0XHR9XG5cdH0sICdzdGFuZCcsIHt4OiA2MCwgeTogNjB9KTtcblxuXHRzdGFnZS5hZGRDaGlsZChwbGF5ZXIuc3ByaXRlKTtcblxufVxuXG4vLyBNb3ZlcyB0aGUgc3RhZ2UgaWYgdGhlIHBsYXllciBoYXMgZ29uZSBiZXlvbmQgYSBjZXJ0YWluIGJvdW5kYXJ5IG9uIGVpdGhlciBzaWRlLCBidXRcbi8vIG9ubHkgd2hpbGUgdGhleSBhcmUgc3RpbGwgbW92aW5nIGluIHRoYXQgZGlyZWN0aW9uLiBcblxuZnVuY3Rpb24gbW92ZVN0YWdlKCkge1xuXG5cdGlmIChwbGF5ZXIuc3ByaXRlLnggPiAxNzUpIHtcblx0XHRiYWNrZ3JvdW5kLngtLTtcblx0XHRlbmVtaWVzLmZvckVhY2goZnVuY3Rpb24obW9iKSB7XG5cdFx0XHRtb2Iuc3ByaXRlLngtLTtcblx0XHR9KTtcblx0XHRpZiAoYmFja2dyb3VuZC54IDwgLTkwMCkge1xuXHRcdFx0YmFja2dyb3VuZC54ID0gMDsgXG5cdFx0fVxuXHRcdGlmIChwbGF5ZXIuc3ByaXRlLmN1cnJlbnRBbmltYXRpb24gPT09ICdzdGFuZCcgfHwgcGxheWVyLnNwcml0ZS5jdXJyZW50QW5pbWF0aW9uID09PSAnc2xhc2gnKSB7XG5cdFx0XHRwbGF5ZXIuc3ByaXRlLngtLTtcblx0XHR9XG5cdH0gZWxzZSBpZiAocGxheWVyLnNwcml0ZS54IDwgMjUpIHtcblx0XHRiYWNrZ3JvdW5kLngrKztcblx0XHRlbmVtaWVzLmZvckVhY2goZnVuY3Rpb24obW9iKSB7XG5cdFx0XHRtb2Iuc3ByaXRlLngrKztcblx0XHR9KTtcblx0XHRpZiAoYmFja2dyb3VuZC54ID4gMCkge1xuXHRcdFx0YmFja2dyb3VuZC54ID0gLTkwMDtcblx0XHR9XG5cdFx0aWYgKHBsYXllci5zcHJpdGUuY3VycmVudEFuaW1hdGlvbiA9PT0gJ3N0YW5kJykge1xuXHRcdFx0cGxheWVyLnNwcml0ZS54Kys7XG5cdFx0fVxuXHR9XG5cbn1cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBIQU5ETEUgS0VZQklORFMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuZnVuY3Rpb24gaGFuZGxlS2V5RG93bihldmVudCkge1xuXHRwbGF5ZXIuaGFuZGxlQW5pbWF0aW9uKGtleU1hcFtldmVudC5rZXlDb2RlXSwgJ3J1bicsIDEyLCAwKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlS2V5VXAoZXZlbnQpIHtcblx0cGxheWVyLmhhbmRsZUFuaW1hdGlvbignc3RvcCcsICdzdGFuZCcsIDApO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVDbGljayhldmVudCkge1xuXHRwbGF5ZXIuaGFuZGxlQXR0YWNrKGVuZW1pZXMpO1xufVxuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIEVORU1ZIFNQQVdOUyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG4vLyBGdW5jdGlvbiB3aWxsIHJ1biBldmVyeSB0aW1lIHRocm91Z2ggdGhlIHJlbmRlciBsb29wIGFuZCwgaWYgZW5lbXkgY291bnQgaXNcbi8vIGJlbG93IGEgc3BlY2lmaWVkIG1heCwgcmFuZG9tbHkgZ2VuZXJhdGUgYSBudW1iZXIgdG8gdHJ5IHRvIG1lZXQgY29uZGl0aW9uc1xuLy8gZm9yIGFuIGVuZW15IHNwYXduLiByYW5kQSBhbmQgcmFuZEIgaGVscCB0byBzZXQgdGhlIHBhcmFtZXRlcnMgZm9yXG4vLyBob3cgb2Z0ZW4gc29tZXRoaW5nIHNob3VsZCBoYXBwZW4uIFxudmFyIHJhbmRvbWl6ZWRTcGF3biA9IGZ1bmN0aW9uKG1heCwgcmFuZEEsIHJhbmRCKSB7XG5cdGlmIChlbmVtaWVzLmxlbmd0aCA8IG1heCkge1xuXHRcdGlmIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYW5kQSkgJSByYW5kQiA9PT0gMCkge1xuXHRcdFx0dmFyIG5ld0lkeCA9IGVuZW1pZXMubGVuZ3RoO1xuXHRcdFx0JC5nZXQoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9tb2JzJywge25hbWU6ICdzbGltZSd9LCBcblx0XHRcdFx0ZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdGVuZW1pZXNbbmV3SWR4XSA9IG5ldyBNb2IobG9hZGVyLmdldFJlc3VsdCgnc2xpbWUnKSxcblx0XHRcdFx0XHRcdHtocDogZGF0YS5yZXN1bHQuaHAsIGF0azogZGF0YS5yZXN1bHQuYXRrLCBkZWY6IGRhdGEucmVzdWx0LmRlZn0sXG5cdFx0XHRcdFx0XHR7ZGlyZWN0aW9uOiAnbGVmdCd9XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRlbmVtaWVzW25ld0lkeF0uY3JlYXRlU3ByaXRlKHtcblx0XHRcdFx0XHRcdGZyYW1lcmF0ZTogMzAsXG5cdFx0XHRcdFx0XHRpbWFnZXM6IFtlbmVtaWVzW25ld0lkeF0uaW1hZ2VdLFxuXHRcdFx0XHRcdFx0ZnJhbWVzOiBKU09OLnBhcnNlKGRhdGEucmVzdWx0LnNwcml0ZXNoZWV0KSxcblx0XHRcdFx0XHRcdGFuaW1hdGlvbnM6IHtcblx0XHRcdFx0XHRcdFx0c3RhbmQ6IFswLCAwLCAnaG9wJywgMC4yXSxcblx0XHRcdFx0XHRcdFx0aG9wOiBbMSwgNiwgJ3N0YW5kJywgMC4yXVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sICdob3AnLCB7eDogMjUwLCB5OiA4NH0pO1xuXHRcdFx0XHRcdGVuZW1pZXNbbmV3SWR4XS5zcHJpdGUuc2NhbGVYID0gMC41O1xuXHRcdFx0XHRcdGVuZW1pZXNbbmV3SWR4XS5zcHJpdGUuc2NhbGVZID0gMC41O1xuXHRcdFx0XHRcdHN0YWdlLmFkZENoaWxkKGVuZW1pZXNbbmV3SWR4XS5zcHJpdGUpO1xuXHRcdFx0XHR9KTtcblx0XHR9XG5cdH1cbn07XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBSRU5ERVIgTE9PUCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5jcmVhdGVqcy5UaWNrZXIuYWRkRXZlbnRMaXN0ZW5lcigndGljaycsIGhhbmRsZVRpY2spOyBcbmNyZWF0ZWpzLlRpY2tlci5zZXRGUFMoNDUpO1xuZnVuY3Rpb24gaGFuZGxlVGljayhldmVudCkge1xuXG5cdHZhciBkZWx0YVMgPSBldmVudC5kZWx0YSAvIDEwMDA7XG5cblx0dGltZUVsYXBzZWQrKztcblxuXHRyYW5kb21pemVkU3Bhd24oNCwgMzAwLCAyNjkpO1xuXHRlbmVtaWVzLmZvckVhY2goZnVuY3Rpb24gbW92ZU1vYnMobW9iKSB7XG5cdFx0aWYgKG1vYi5zcHJpdGUueCA+IHBsYXllci5zcHJpdGUueCkge1xuXHRcdFx0bW9iLmhhbmRsZUFuaW1hdGlvbignbGVmdCcsICdob3AnLCAwLjUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRtb2IuaGFuZGxlQW5pbWF0aW9uKCdyaWdodCcsICdob3AnLCAwLjUpO1xuXHRcdH1cblx0fSk7XG5cblx0bW92ZVN0YWdlKCk7XG5cblx0aWYgKHRpbWVFbGFwc2VkICUgNSA9PT0gMCkge1xuXHRcdHBsYXllci5jb2xsaXNpb25zKGVuZW1pZXMsIG51bGwpO1xuXHR9XG5cblx0Ly8gUmVtb3ZlIGFueSBkZWZlYXRlZCBlbmVtaWVzOiBcblx0ZW5lbWllcyA9IGVuZW1pZXMuZmlsdGVyKGZ1bmN0aW9uIGhlYWx0aFplcm8obW9iKSB7XG5cdFx0aWYgKG1vYi5ocCA8PSAwKSB7XG5cdFx0XHRzdGFnZS5yZW1vdmVDaGlsZChtb2Iuc3ByaXRlKTtcblx0XHRcdGNvbnNvbGUubG9nKCdtb2IgZGVhdGggZGV0ZWN0ZWQnKTtcblx0XHR9XG5cdFx0cmV0dXJuIG1vYi5ocCA+IDA7XG5cdH0pO1xuXG5cblx0c3RhZ2UudXBkYXRlKCk7XG59XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiJdfQ==