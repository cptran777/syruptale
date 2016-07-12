'use strict';

/* ***************************** APP INITIATION ******************************* */

// Using create.js to set up and render background:

var stage, loader, canvasWidth, canvasHeight;
var background, player, hud;
var enemies = [];
var timeElapsed = 0;

// The purpose of keyMap is to hold the possible keypresses for keydown events that may happen
var keyMap = {
	65: 'left',
	68: 'right',
	32: 'jump'
};

function init() {

	stage = new createjs.Stage('forest-dungeon');

	// Canvas width and height stored in var w and h for future use.
	canvasWidth = stage.canvas.width;
	canvasHeight = stage.canvas.height;

	// Manifest will create and store background image for future use. Looks like
	// the render will need to be adjusted to align the image properly.
	var manifest = [{ src: 'background.png', id: 'background' }, { src: 'default-sprite.png', id: 'playerSprite' }, { src: 'SlimeAnimated.png', id: 'slime' }, { src: 'chrom2.jpg', id: 'portrait' }];
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
			dead: [14, 16, 'dead', 0.01]
		}
	}, 'stand', { x: 60, y: 60 });

	stage.addChild(player.sprite);

	hud = new HUD(loader.getResult('portrait'), player.hp);
	hud.renderHUD(function (portrait, fullHealth, currentHealth) {
		stage.addChild(fullHealth);
		stage.addChild(currentHealth);
		stage.addChild(portrait);
	});

	stage.update();
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
	if (player.hp > 0) {
		player.handleAnimation(keyMap[event.keyCode], 'run', 12, 0);
	}
}

function handleKeyUp(event) {
	if (player.hp > 0) {
		player.handleAnimation('stop', 'stand', 0);
	}
}

function handleClick(event) {
	if (player.hp > 0) {
		// Purpose of the callback here is to be passed through handleAttack to
		// the collision detector that will then call the callback is used to
		// display text on the screen.
		player.handleAttack(enemies, function (damage) {
			hud.renderDamage(damage, timeElapsed, {
				x: player.sprite.x + Math.floor(Math.random() * 50) - 25,
				y: player.sprite.y + Math.floor(Math.random() * 10) - 25
			}, function (text) {
				stage.addChild(text);
			});
		});
	}
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

	// player.handleY();

	moveStage();

	if (timeElapsed % 5 === 0) {
		player.collisions(enemies, null, function () {
			player.handleDeath(function () {
				stage.removeChild(player.sprite);
				stage.update();
				createjs.Ticker.setPaused(true);
			});
		});
		hud.currentHealthBar.scaleX = player.hp / player.maxHP;
	}

	// Remove any defeated enemies:
	enemies = enemies.filter(function healthZero(mob) {
		if (mob.hp <= 0) {
			stage.removeChild(mob.sprite);
		}
		return mob.hp > 0;
	});

	// Go through the damage numbers and remove the ones that have stayed on screen
	// for too long.
	if (timeElapsed % 5 === 0) {
		console.log(hud.damageDisplay);
		hud.damageDisplay = hud.damageDisplay.filter(function removeOldNum(num) {
			if (timeElapsed - num.createdAt > 45) {
				stage.removeChild(num.text);
			}
			return timeElapsed - num.createdAt <= 45;
		});
	}

	stage.update();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NjcmlwdHMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUlBLElBQUksS0FBSixFQUFXLE1BQVgsRUFBbUIsV0FBbkIsRUFBZ0MsWUFBaEM7QUFDQSxJQUFJLFVBQUosRUFBZ0IsTUFBaEIsRUFBd0IsR0FBeEI7QUFDQSxJQUFJLFVBQVUsRUFBZDtBQUNBLElBQUksY0FBYyxDQUFsQjs7O0FBR0EsSUFBSSxTQUFTO0FBQ1osS0FBSSxNQURRO0FBRVosS0FBSSxPQUZRO0FBR1osS0FBSTtBQUhRLENBQWI7O0FBTUEsU0FBUyxJQUFULEdBQWdCOztBQUVmLFNBQVEsSUFBSSxTQUFTLEtBQWIsQ0FBbUIsZ0JBQW5CLENBQVI7OztBQUdBLGVBQWMsTUFBTSxNQUFOLENBQWEsS0FBM0I7QUFDQSxnQkFBZSxNQUFNLE1BQU4sQ0FBYSxNQUE1Qjs7OztBQUlBLEtBQUksV0FBVyxDQUNkLEVBQUMsS0FBSyxnQkFBTixFQUF3QixJQUFJLFlBQTVCLEVBRGMsRUFFZCxFQUFDLEtBQUssb0JBQU4sRUFBNEIsSUFBSSxjQUFoQyxFQUZjLEVBR2QsRUFBQyxLQUFLLG1CQUFOLEVBQTJCLElBQUksT0FBL0IsRUFIYyxFQUlkLEVBQUMsS0FBSyxZQUFOLEVBQW9CLElBQUksVUFBeEIsRUFKYyxDQUFmOztBQU9BLFVBQVMsSUFBSSxTQUFTLFNBQWIsQ0FBdUIsS0FBdkIsQ0FBVDtBQUNBLFFBQU8sZ0JBQVAsQ0FBd0IsVUFBeEIsRUFBb0MsY0FBcEM7QUFDQSxRQUFPLFlBQVAsQ0FBb0IsUUFBcEIsRUFBOEIsSUFBOUIsRUFBb0MsZ0JBQXBDOzs7QUFHQSxRQUFPLFFBQVAsQ0FBZ0IsU0FBaEIsR0FBNEIsYUFBNUI7QUFDQSxRQUFPLFFBQVAsQ0FBZ0IsT0FBaEIsR0FBMEIsV0FBMUI7QUFDQSxRQUFPLFFBQVAsQ0FBZ0IsT0FBaEIsR0FBMEIsV0FBMUI7QUFDQTs7QUFFRDs7OztBQUlBLFNBQVMsY0FBVCxDQUF3QixLQUF4QixFQUEr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VCxDQUFzQixHQUF0QixFQUEyQjtBQUN2RSxPQUFJLGNBQWMsSUFBSSxTQUFsQixHQUE4QixFQUFsQyxFQUFzQztBQUNyQyxVQUFNLFdBQU4sQ0FBa0IsSUFBSSxJQUF0QjtBQUNBO0FBQ0QsVUFBTyxjQUFjLElBQUksU0FBbEIsSUFBK0IsRUFBdEM7QUFDQSxHQUxtQixDQUFwQjtBQU1BOztBQUVELE9BQU0sTUFBTjtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqIEFQUCBJTklUSUFUSU9OICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuLy8gVXNpbmcgY3JlYXRlLmpzIHRvIHNldCB1cCBhbmQgcmVuZGVyIGJhY2tncm91bmQ6IFxuXG52YXIgc3RhZ2UsIGxvYWRlciwgY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodDtcbnZhciBiYWNrZ3JvdW5kLCBwbGF5ZXIsIGh1ZDtcbnZhciBlbmVtaWVzID0gW107XG52YXIgdGltZUVsYXBzZWQgPSAwO1xuXG4vLyBUaGUgcHVycG9zZSBvZiBrZXlNYXAgaXMgdG8gaG9sZCB0aGUgcG9zc2libGUga2V5cHJlc3NlcyBmb3Iga2V5ZG93biBldmVudHMgdGhhdCBtYXkgaGFwcGVuIFxudmFyIGtleU1hcCA9IHtcblx0NjU6ICdsZWZ0Jyxcblx0Njg6ICdyaWdodCcsXG5cdDMyOiAnanVtcCdcbn07XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG5cblx0c3RhZ2UgPSBuZXcgY3JlYXRlanMuU3RhZ2UoJ2ZvcmVzdC1kdW5nZW9uJyk7XG5cblx0Ly8gQ2FudmFzIHdpZHRoIGFuZCBoZWlnaHQgc3RvcmVkIGluIHZhciB3IGFuZCBoIGZvciBmdXR1cmUgdXNlLiBcblx0Y2FudmFzV2lkdGggPSBzdGFnZS5jYW52YXMud2lkdGg7XG5cdGNhbnZhc0hlaWdodCA9IHN0YWdlLmNhbnZhcy5oZWlnaHQ7XG5cblx0Ly8gTWFuaWZlc3Qgd2lsbCBjcmVhdGUgYW5kIHN0b3JlIGJhY2tncm91bmQgaW1hZ2UgZm9yIGZ1dHVyZSB1c2UuIExvb2tzIGxpa2UgXG5cdC8vIHRoZSByZW5kZXIgd2lsbCBuZWVkIHRvIGJlIGFkanVzdGVkIHRvIGFsaWduIHRoZSBpbWFnZSBwcm9wZXJseS4gXG5cdHZhciBtYW5pZmVzdCA9IFtcblx0XHR7c3JjOiAnYmFja2dyb3VuZC5wbmcnLCBpZDogJ2JhY2tncm91bmQnfSxcblx0XHR7c3JjOiAnZGVmYXVsdC1zcHJpdGUucG5nJywgaWQ6ICdwbGF5ZXJTcHJpdGUnfSxcblx0XHR7c3JjOiAnU2xpbWVBbmltYXRlZC5wbmcnLCBpZDogJ3NsaW1lJ30sXG5cdFx0e3NyYzogJ2Nocm9tMi5qcGcnLCBpZDogJ3BvcnRyYWl0J31cblx0XTtcblx0Ly8gTG9hZGVyIHdpbGwgcmVuZGVyIHRoZSBuZWNlc3NhcnkgaXRlbXMgXG5cdGxvYWRlciA9IG5ldyBjcmVhdGVqcy5Mb2FkUXVldWUoZmFsc2UpO1xuXHRsb2FkZXIuYWRkRXZlbnRMaXN0ZW5lcignY29tcGxldGUnLCBoYW5kbGVDb21wbGV0ZSk7XG5cdGxvYWRlci5sb2FkTWFuaWZlc3QobWFuaWZlc3QsIHRydWUsICdhc3NldHMvaW1hZ2VzLycpO1xuXG5cdC8vIERldGVjdCBrZXlwcmVzczogXG5cdHdpbmRvdy5kb2N1bWVudC5vbmtleWRvd24gPSBoYW5kbGVLZXlEb3duO1xuXHR3aW5kb3cuZG9jdW1lbnQub25rZXl1cCA9IGhhbmRsZUtleVVwO1xuXHR3aW5kb3cuZG9jdW1lbnQub25jbGljayA9IGhhbmRsZUNsaWNrO1xufVxuXG5pbml0KCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogQ1JFQVRFIFRIRSBTVEFHRSAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5mdW5jdGlvbiBoYW5kbGVDb21wbGV0ZShldmVudCkge1xuXHRcblx0Ly8gQ3JlYXRlcyBiYWNrZ3JvdW5kIGltYWdlLiBcblx0YmFja2dyb3VuZCA9IG5ldyBjcmVhdGVqcy5TaGFwZSgpO1xuXHR2YXIgYmFja2dyb3VuZEltZyA9IGxvYWRlci5nZXRSZXN1bHQoJ2JhY2tncm91bmQnKTtcblx0YmFja2dyb3VuZC5ncmFwaGljcy5iZWdpbkJpdG1hcEZpbGwoYmFja2dyb3VuZEltZykuZHJhd1JlY3QoMCwgMCwgY2FudmFzV2lkdGggKyBiYWNrZ3JvdW5kSW1nLndpZHRoLCBjYW52YXNIZWlnaHQgKyBiYWNrZ3JvdW5kSW1nLmhlaWdodCk7XG5cdHN0YWdlLmFkZENoaWxkKGJhY2tncm91bmQpO1xuXG5cdC8vIEFkanVzdG1lbnQgdG8gbGluZSB0aGUgaW1hZ2UgbWVudGlvbmVkIGFib3ZlLiBcblx0YmFja2dyb3VuZC55ID0gLTEwNTtcblxuXHQvLyBDcmVhdGlvbiBvZiB0aGUgcGxheWVyIHRvIHJlbmRlciBvbiB0aGUgc2NyZWVuLiBcblx0cGxheWVyID0gbmV3IFBsYXllcihsb2FkZXIuZ2V0UmVzdWx0KCdwbGF5ZXJTcHJpdGUnKSwge2hwOiAxMDAsIGF0azogMTAsIGRlZjogMTB9LCB7ZGlyZWN0aW9uOiAncmlnaHQnfSk7XG5cdHBsYXllci5jcmVhdGVTcHJpdGUoe1xuXHRcdGZyYW1lcmF0ZTogMzAsXG5cdFx0aW1hZ2VzOiBbcGxheWVyLmltYWdlXSxcblx0XHRmcmFtZXM6IHBsYXllci5zcHJpdGVzaGVldGRhdGEsXG5cdFx0Ly8geCwgeSwgd2lkdGgsIGhlaWdodCwgaW1hZ2VJbmRleCosIHJlZ1gqLCByZWdZKlxuXHRcdC8vIHtyZWdYOiAwLCBoZWlnaHQ6IDkyLCBjb3VudDogMjQsIHJlZ1k6IDAsIHdpZHRoOiA2NH0sXG5cdFx0YW5pbWF0aW9uczoge1xuXHRcdFx0c3RhbmQ6IFswXSxcblx0XHRcdHJ1bjogWzEsIDYsICdydW4nLCAwLjI1XSxcblx0XHRcdHNsYXNoOiBbNywgMTMsICdzdGFuZCcsIDAuMjVdLFxuXHRcdFx0ZGVhZDogWzE0LCAxNiwgJ2RlYWQnLCAwLjAxXVxuXHRcdH1cblx0fSwgJ3N0YW5kJywge3g6IDYwLCB5OiA2MH0pO1xuXG5cdHN0YWdlLmFkZENoaWxkKHBsYXllci5zcHJpdGUpO1xuXG5cdGh1ZCA9IG5ldyBIVUQobG9hZGVyLmdldFJlc3VsdCgncG9ydHJhaXQnKSwgcGxheWVyLmhwKTtcblx0aHVkLnJlbmRlckhVRChmdW5jdGlvbihwb3J0cmFpdCwgZnVsbEhlYWx0aCwgY3VycmVudEhlYWx0aCkge1xuXHRcdHN0YWdlLmFkZENoaWxkKGZ1bGxIZWFsdGgpO1xuXHRcdHN0YWdlLmFkZENoaWxkKGN1cnJlbnRIZWFsdGgpO1xuXHRcdHN0YWdlLmFkZENoaWxkKHBvcnRyYWl0KTtcblx0fSk7XG5cblx0c3RhZ2UudXBkYXRlKCk7XG5cbn1cblxuLy8gTW92ZXMgdGhlIHN0YWdlIGlmIHRoZSBwbGF5ZXIgaGFzIGdvbmUgYmV5b25kIGEgY2VydGFpbiBib3VuZGFyeSBvbiBlaXRoZXIgc2lkZSwgYnV0XG4vLyBvbmx5IHdoaWxlIHRoZXkgYXJlIHN0aWxsIG1vdmluZyBpbiB0aGF0IGRpcmVjdGlvbi4gXG5cbmZ1bmN0aW9uIG1vdmVTdGFnZSgpIHtcblxuXHRpZiAocGxheWVyLnNwcml0ZS54ID4gMTc1KSB7XG5cdFx0YmFja2dyb3VuZC54LS07XG5cdFx0ZW5lbWllcy5mb3JFYWNoKGZ1bmN0aW9uKG1vYikge1xuXHRcdFx0bW9iLnNwcml0ZS54LS07XG5cdFx0fSk7XG5cdFx0aWYgKGJhY2tncm91bmQueCA8IC05MDApIHtcblx0XHRcdGJhY2tncm91bmQueCA9IDA7IFxuXHRcdH1cblx0XHRpZiAocGxheWVyLnNwcml0ZS5jdXJyZW50QW5pbWF0aW9uID09PSAnc3RhbmQnIHx8IHBsYXllci5zcHJpdGUuY3VycmVudEFuaW1hdGlvbiA9PT0gJ3NsYXNoJykge1xuXHRcdFx0cGxheWVyLnNwcml0ZS54LS07XG5cdFx0fVxuXHR9IGVsc2UgaWYgKHBsYXllci5zcHJpdGUueCA8IDI1KSB7XG5cdFx0YmFja2dyb3VuZC54Kys7XG5cdFx0ZW5lbWllcy5mb3JFYWNoKGZ1bmN0aW9uKG1vYikge1xuXHRcdFx0bW9iLnNwcml0ZS54Kys7XG5cdFx0fSk7XG5cdFx0aWYgKGJhY2tncm91bmQueCA+IDApIHtcblx0XHRcdGJhY2tncm91bmQueCA9IC05MDA7XG5cdFx0fVxuXHRcdGlmIChwbGF5ZXIuc3ByaXRlLmN1cnJlbnRBbmltYXRpb24gPT09ICdzdGFuZCcpIHtcblx0XHRcdHBsYXllci5zcHJpdGUueCsrO1xuXHRcdH1cblx0fVxuXG59XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogSEFORExFIEtFWUJJTkRTICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmZ1bmN0aW9uIGhhbmRsZUtleURvd24oZXZlbnQpIHtcblx0aWYgKHBsYXllci5ocCA+IDApIHtcblx0XHRwbGF5ZXIuaGFuZGxlQW5pbWF0aW9uKGtleU1hcFtldmVudC5rZXlDb2RlXSwgJ3J1bicsIDEyLCAwKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoYW5kbGVLZXlVcChldmVudCkge1xuXHRpZiAocGxheWVyLmhwID4gMCkge1xuXHRcdHBsYXllci5oYW5kbGVBbmltYXRpb24oJ3N0b3AnLCAnc3RhbmQnLCAwKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoYW5kbGVDbGljayhldmVudCkge1xuXHRpZiAocGxheWVyLmhwID4gMCkge1xuXHRcdC8vIFB1cnBvc2Ugb2YgdGhlIGNhbGxiYWNrIGhlcmUgaXMgdG8gYmUgcGFzc2VkIHRocm91Z2ggaGFuZGxlQXR0YWNrIHRvIFxuXHRcdC8vIHRoZSBjb2xsaXNpb24gZGV0ZWN0b3IgdGhhdCB3aWxsIHRoZW4gY2FsbCB0aGUgY2FsbGJhY2sgaXMgdXNlZCB0b1xuXHRcdC8vIGRpc3BsYXkgdGV4dCBvbiB0aGUgc2NyZWVuLlxuXHRcdHBsYXllci5oYW5kbGVBdHRhY2soZW5lbWllcywgZnVuY3Rpb24oZGFtYWdlKSB7XG5cdFx0XHRodWQucmVuZGVyRGFtYWdlKGRhbWFnZSwgdGltZUVsYXBzZWQsIHtcblx0XHRcdFx0eDogcGxheWVyLnNwcml0ZS54ICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNTApIC0gMjUsXG5cdFx0XHRcdHk6IHBsYXllci5zcHJpdGUueSArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSAtIDI1XG5cdFx0XHR9LCBmdW5jdGlvbih0ZXh0KSB7XG5cdFx0XHRcdHN0YWdlLmFkZENoaWxkKHRleHQpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cbn1cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBFTkVNWSBTUEFXTlMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuLy8gRnVuY3Rpb24gd2lsbCBydW4gZXZlcnkgdGltZSB0aHJvdWdoIHRoZSByZW5kZXIgbG9vcCBhbmQsIGlmIGVuZW15IGNvdW50IGlzXG4vLyBiZWxvdyBhIHNwZWNpZmllZCBtYXgsIHJhbmRvbWx5IGdlbmVyYXRlIGEgbnVtYmVyIHRvIHRyeSB0byBtZWV0IGNvbmRpdGlvbnNcbi8vIGZvciBhbiBlbmVteSBzcGF3bi4gcmFuZEEgYW5kIHJhbmRCIGhlbHAgdG8gc2V0IHRoZSBwYXJhbWV0ZXJzIGZvclxuLy8gaG93IG9mdGVuIHNvbWV0aGluZyBzaG91bGQgaGFwcGVuLiBcbnZhciByYW5kb21pemVkU3Bhd24gPSBmdW5jdGlvbihtYXgsIHJhbmRBLCByYW5kQikge1xuXHRpZiAoZW5lbWllcy5sZW5ndGggPCBtYXgpIHtcblx0XHRpZiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmFuZEEpICUgcmFuZEIgPT09IDApIHtcblx0XHRcdHZhciBuZXdJZHggPSBlbmVtaWVzLmxlbmd0aDtcblx0XHRcdCQuZ2V0KCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvbW9icycsIHtuYW1lOiAnc2xpbWUnfSwgXG5cdFx0XHRcdGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHRlbmVtaWVzW25ld0lkeF0gPSBuZXcgTW9iKGxvYWRlci5nZXRSZXN1bHQoJ3NsaW1lJyksXG5cdFx0XHRcdFx0XHR7aHA6IGRhdGEucmVzdWx0LmhwLCBhdGs6IGRhdGEucmVzdWx0LmF0aywgZGVmOiBkYXRhLnJlc3VsdC5kZWZ9LFxuXHRcdFx0XHRcdFx0e2RpcmVjdGlvbjogJ2xlZnQnfVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0ZW5lbWllc1tuZXdJZHhdLmNyZWF0ZVNwcml0ZSh7XG5cdFx0XHRcdFx0XHRmcmFtZXJhdGU6IDMwLFxuXHRcdFx0XHRcdFx0aW1hZ2VzOiBbZW5lbWllc1tuZXdJZHhdLmltYWdlXSxcblx0XHRcdFx0XHRcdGZyYW1lczogSlNPTi5wYXJzZShkYXRhLnJlc3VsdC5zcHJpdGVzaGVldCksXG5cdFx0XHRcdFx0XHRhbmltYXRpb25zOiB7XG5cdFx0XHRcdFx0XHRcdHN0YW5kOiBbMCwgMCwgJ2hvcCcsIDAuMl0sXG5cdFx0XHRcdFx0XHRcdGhvcDogWzEsIDYsICdzdGFuZCcsIDAuMl1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCAnaG9wJywge3g6IDI1MCwgeTogODR9KTtcblx0XHRcdFx0XHRlbmVtaWVzW25ld0lkeF0uc3ByaXRlLnNjYWxlWCA9IDAuNTtcblx0XHRcdFx0XHRlbmVtaWVzW25ld0lkeF0uc3ByaXRlLnNjYWxlWSA9IDAuNTtcblx0XHRcdFx0XHRzdGFnZS5hZGRDaGlsZChlbmVtaWVzW25ld0lkeF0uc3ByaXRlKTtcblx0XHRcdFx0fSk7XG5cdFx0fVxuXHR9XG59O1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogUkVOREVSIExPT1AgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuY3JlYXRlanMuVGlja2VyLmFkZEV2ZW50TGlzdGVuZXIoJ3RpY2snLCBoYW5kbGVUaWNrKTsgXG5jcmVhdGVqcy5UaWNrZXIuc2V0RlBTKDQ1KTtcbmZ1bmN0aW9uIGhhbmRsZVRpY2soZXZlbnQpIHtcblxuXHR2YXIgZGVsdGFTID0gZXZlbnQuZGVsdGEgLyAxMDAwO1xuXG5cdHRpbWVFbGFwc2VkKys7XG5cblx0cmFuZG9taXplZFNwYXduKDQsIDMwMCwgMjY5KTtcblx0ZW5lbWllcy5mb3JFYWNoKGZ1bmN0aW9uIG1vdmVNb2JzKG1vYikge1xuXHRcdGlmIChtb2Iuc3ByaXRlLnggPiBwbGF5ZXIuc3ByaXRlLngpIHtcblx0XHRcdG1vYi5oYW5kbGVBbmltYXRpb24oJ2xlZnQnLCAnaG9wJywgMC41KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bW9iLmhhbmRsZUFuaW1hdGlvbigncmlnaHQnLCAnaG9wJywgMC41KTtcblx0XHR9XG5cdH0pO1xuXG5cdC8vIHBsYXllci5oYW5kbGVZKCk7XG5cblx0bW92ZVN0YWdlKCk7XG5cblx0aWYgKHRpbWVFbGFwc2VkICUgNSA9PT0gMCkge1xuXHRcdHBsYXllci5jb2xsaXNpb25zKGVuZW1pZXMsIG51bGwsIGZ1bmN0aW9uKCkge1xuXHRcdFx0cGxheWVyLmhhbmRsZURlYXRoKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0c3RhZ2UucmVtb3ZlQ2hpbGQocGxheWVyLnNwcml0ZSk7XG5cdFx0XHRcdHN0YWdlLnVwZGF0ZSgpO1xuXHRcdFx0XHRjcmVhdGVqcy5UaWNrZXIuc2V0UGF1c2VkKHRydWUpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdFx0aHVkLmN1cnJlbnRIZWFsdGhCYXIuc2NhbGVYID0gcGxheWVyLmhwIC8gcGxheWVyLm1heEhQO1xuXHR9XG5cblx0Ly8gUmVtb3ZlIGFueSBkZWZlYXRlZCBlbmVtaWVzOiBcblx0ZW5lbWllcyA9IGVuZW1pZXMuZmlsdGVyKGZ1bmN0aW9uIGhlYWx0aFplcm8obW9iKSB7XG5cdFx0aWYgKG1vYi5ocCA8PSAwKSB7XG5cdFx0XHRzdGFnZS5yZW1vdmVDaGlsZChtb2Iuc3ByaXRlKTtcblx0XHR9XG5cdFx0cmV0dXJuIG1vYi5ocCA+IDA7XG5cdH0pO1xuXG5cdC8vIEdvIHRocm91Z2ggdGhlIGRhbWFnZSBudW1iZXJzIGFuZCByZW1vdmUgdGhlIG9uZXMgdGhhdCBoYXZlIHN0YXllZCBvbiBzY3JlZW4gXG5cdC8vIGZvciB0b28gbG9uZy4gXG5cdGlmICh0aW1lRWxhcHNlZCAlIDUgPT09IDApIHtcblx0XHRjb25zb2xlLmxvZyhodWQuZGFtYWdlRGlzcGxheSk7XG5cdFx0aHVkLmRhbWFnZURpc3BsYXkgPSBodWQuZGFtYWdlRGlzcGxheS5maWx0ZXIoZnVuY3Rpb24gcmVtb3ZlT2xkTnVtKG51bSkge1xuXHRcdFx0aWYgKHRpbWVFbGFwc2VkIC0gbnVtLmNyZWF0ZWRBdCA+IDQ1KSB7XG5cdFx0XHRcdHN0YWdlLnJlbW92ZUNoaWxkKG51bS50ZXh0KTsgXG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGltZUVsYXBzZWQgLSBudW0uY3JlYXRlZEF0IDw9IDQ1O1xuXHRcdH0pO1xuXHR9XG5cblx0c3RhZ2UudXBkYXRlKCk7XG59XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiJdfQ==