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
			console.log('callback to handle attack running');
			hud.renderDamage(damage, timeElapsed, {
				x: player.sprite.x + Math.floor(Math.random() * 80) - 40,
				y: player.sprite.y + Math.floor(Math.random() * 10) - 40
			}, function (text) {
				console.log('final function running');
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

	stage.update();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NjcmlwdHMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUlBLElBQUksS0FBSixFQUFXLE1BQVgsRUFBbUIsV0FBbkIsRUFBZ0MsWUFBaEM7QUFDQSxJQUFJLFVBQUosRUFBZ0IsTUFBaEIsRUFBd0IsR0FBeEI7QUFDQSxJQUFJLFVBQVUsRUFBZDtBQUNBLElBQUksY0FBYyxDQUFsQjs7O0FBR0EsSUFBSSxTQUFTO0FBQ1osS0FBSSxNQURRO0FBRVosS0FBSSxPQUZRO0FBR1osS0FBSTtBQUhRLENBQWI7O0FBTUEsU0FBUyxJQUFULEdBQWdCOztBQUVmLFNBQVEsSUFBSSxTQUFTLEtBQWIsQ0FBbUIsZ0JBQW5CLENBQVI7OztBQUdBLGVBQWMsTUFBTSxNQUFOLENBQWEsS0FBM0I7QUFDQSxnQkFBZSxNQUFNLE1BQU4sQ0FBYSxNQUE1Qjs7OztBQUlBLEtBQUksV0FBVyxDQUNkLEVBQUMsS0FBSyxnQkFBTixFQUF3QixJQUFJLFlBQTVCLEVBRGMsRUFFZCxFQUFDLEtBQUssb0JBQU4sRUFBNEIsSUFBSSxjQUFoQyxFQUZjLEVBR2QsRUFBQyxLQUFLLG1CQUFOLEVBQTJCLElBQUksT0FBL0IsRUFIYyxFQUlkLEVBQUMsS0FBSyxZQUFOLEVBQW9CLElBQUksVUFBeEIsRUFKYyxDQUFmOztBQU9BLFVBQVMsSUFBSSxTQUFTLFNBQWIsQ0FBdUIsS0FBdkIsQ0FBVDtBQUNBLFFBQU8sZ0JBQVAsQ0FBd0IsVUFBeEIsRUFBb0MsY0FBcEM7QUFDQSxRQUFPLFlBQVAsQ0FBb0IsUUFBcEIsRUFBOEIsSUFBOUIsRUFBb0MsZ0JBQXBDOzs7QUFHQSxRQUFPLFFBQVAsQ0FBZ0IsU0FBaEIsR0FBNEIsYUFBNUI7QUFDQSxRQUFPLFFBQVAsQ0FBZ0IsT0FBaEIsR0FBMEIsV0FBMUI7QUFDQSxRQUFPLFFBQVAsQ0FBZ0IsT0FBaEIsR0FBMEIsV0FBMUI7QUFDQTs7QUFFRDs7OztBQUlBLFNBQVMsY0FBVCxDQUF3QixLQUF4QixFQUEr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KioqKioqKioqKiogQVBQIElOSVRJQVRJT04gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG4vLyBVc2luZyBjcmVhdGUuanMgdG8gc2V0IHVwIGFuZCByZW5kZXIgYmFja2dyb3VuZDogXG5cbnZhciBzdGFnZSwgbG9hZGVyLCBjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0O1xudmFyIGJhY2tncm91bmQsIHBsYXllciwgaHVkO1xudmFyIGVuZW1pZXMgPSBbXTtcbnZhciB0aW1lRWxhcHNlZCA9IDA7XG5cbi8vIFRoZSBwdXJwb3NlIG9mIGtleU1hcCBpcyB0byBob2xkIHRoZSBwb3NzaWJsZSBrZXlwcmVzc2VzIGZvciBrZXlkb3duIGV2ZW50cyB0aGF0IG1heSBoYXBwZW4gXG52YXIga2V5TWFwID0ge1xuXHQ2NTogJ2xlZnQnLFxuXHQ2ODogJ3JpZ2h0Jyxcblx0MzI6ICdqdW1wJ1xufTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcblxuXHRzdGFnZSA9IG5ldyBjcmVhdGVqcy5TdGFnZSgnZm9yZXN0LWR1bmdlb24nKTtcblxuXHQvLyBDYW52YXMgd2lkdGggYW5kIGhlaWdodCBzdG9yZWQgaW4gdmFyIHcgYW5kIGggZm9yIGZ1dHVyZSB1c2UuIFxuXHRjYW52YXNXaWR0aCA9IHN0YWdlLmNhbnZhcy53aWR0aDtcblx0Y2FudmFzSGVpZ2h0ID0gc3RhZ2UuY2FudmFzLmhlaWdodDtcblxuXHQvLyBNYW5pZmVzdCB3aWxsIGNyZWF0ZSBhbmQgc3RvcmUgYmFja2dyb3VuZCBpbWFnZSBmb3IgZnV0dXJlIHVzZS4gTG9va3MgbGlrZSBcblx0Ly8gdGhlIHJlbmRlciB3aWxsIG5lZWQgdG8gYmUgYWRqdXN0ZWQgdG8gYWxpZ24gdGhlIGltYWdlIHByb3Blcmx5LiBcblx0dmFyIG1hbmlmZXN0ID0gW1xuXHRcdHtzcmM6ICdiYWNrZ3JvdW5kLnBuZycsIGlkOiAnYmFja2dyb3VuZCd9LFxuXHRcdHtzcmM6ICdkZWZhdWx0LXNwcml0ZS5wbmcnLCBpZDogJ3BsYXllclNwcml0ZSd9LFxuXHRcdHtzcmM6ICdTbGltZUFuaW1hdGVkLnBuZycsIGlkOiAnc2xpbWUnfSxcblx0XHR7c3JjOiAnY2hyb20yLmpwZycsIGlkOiAncG9ydHJhaXQnfVxuXHRdO1xuXHQvLyBMb2FkZXIgd2lsbCByZW5kZXIgdGhlIG5lY2Vzc2FyeSBpdGVtcyBcblx0bG9hZGVyID0gbmV3IGNyZWF0ZWpzLkxvYWRRdWV1ZShmYWxzZSk7XG5cdGxvYWRlci5hZGRFdmVudExpc3RlbmVyKCdjb21wbGV0ZScsIGhhbmRsZUNvbXBsZXRlKTtcblx0bG9hZGVyLmxvYWRNYW5pZmVzdChtYW5pZmVzdCwgdHJ1ZSwgJ2Fzc2V0cy9pbWFnZXMvJyk7XG5cblx0Ly8gRGV0ZWN0IGtleXByZXNzOiBcblx0d2luZG93LmRvY3VtZW50Lm9ua2V5ZG93biA9IGhhbmRsZUtleURvd247XG5cdHdpbmRvdy5kb2N1bWVudC5vbmtleXVwID0gaGFuZGxlS2V5VXA7XG5cdHdpbmRvdy5kb2N1bWVudC5vbmNsaWNrID0gaGFuZGxlQ2xpY2s7XG59XG5cbmluaXQoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBDUkVBVEUgVEhFIFNUQUdFICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmZ1bmN0aW9uIGhhbmRsZUNvbXBsZXRlKGV2ZW50KSB7XG5cdFxuXHQvLyBDcmVhdGVzIGJhY2tncm91bmQgaW1hZ2UuIFxuXHRiYWNrZ3JvdW5kID0gbmV3IGNyZWF0ZWpzLlNoYXBlKCk7XG5cdHZhciBiYWNrZ3JvdW5kSW1nID0gbG9hZGVyLmdldFJlc3VsdCgnYmFja2dyb3VuZCcpO1xuXHRiYWNrZ3JvdW5kLmdyYXBoaWNzLmJlZ2luQml0bWFwRmlsbChiYWNrZ3JvdW5kSW1nKS5kcmF3UmVjdCgwLCAwLCBjYW52YXNXaWR0aCArIGJhY2tncm91bmRJbWcud2lkdGgsIGNhbnZhc0hlaWdodCArIGJhY2tncm91bmRJbWcuaGVpZ2h0KTtcblx0c3RhZ2UuYWRkQ2hpbGQoYmFja2dyb3VuZCk7XG5cblx0Ly8gQWRqdXN0bWVudCB0byBsaW5lIHRoZSBpbWFnZSBtZW50aW9uZWQgYWJvdmUuIFxuXHRiYWNrZ3JvdW5kLnkgPSAtMTA1O1xuXG5cdC8vIENyZWF0aW9uIG9mIHRoZSBwbGF5ZXIgdG8gcmVuZGVyIG9uIHRoZSBzY3JlZW4uIFxuXHRwbGF5ZXIgPSBuZXcgUGxheWVyKGxvYWRlci5nZXRSZXN1bHQoJ3BsYXllclNwcml0ZScpLCB7aHA6IDEwMCwgYXRrOiAxMCwgZGVmOiAxMH0sIHtkaXJlY3Rpb246ICdyaWdodCd9KTtcblx0cGxheWVyLmNyZWF0ZVNwcml0ZSh7XG5cdFx0ZnJhbWVyYXRlOiAzMCxcblx0XHRpbWFnZXM6IFtwbGF5ZXIuaW1hZ2VdLFxuXHRcdGZyYW1lczogcGxheWVyLnNwcml0ZXNoZWV0ZGF0YSxcblx0XHQvLyB4LCB5LCB3aWR0aCwgaGVpZ2h0LCBpbWFnZUluZGV4KiwgcmVnWCosIHJlZ1kqXG5cdFx0Ly8ge3JlZ1g6IDAsIGhlaWdodDogOTIsIGNvdW50OiAyNCwgcmVnWTogMCwgd2lkdGg6IDY0fSxcblx0XHRhbmltYXRpb25zOiB7XG5cdFx0XHRzdGFuZDogWzBdLFxuXHRcdFx0cnVuOiBbMSwgNiwgJ3J1bicsIDAuMjVdLFxuXHRcdFx0c2xhc2g6IFs3LCAxMywgJ3N0YW5kJywgMC4yNV0sXG5cdFx0XHRkZWFkOiBbMTQsIDE2LCAnZGVhZCcsIDAuMDFdXG5cdFx0fVxuXHR9LCAnc3RhbmQnLCB7eDogNjAsIHk6IDYwfSk7XG5cblx0c3RhZ2UuYWRkQ2hpbGQocGxheWVyLnNwcml0ZSk7XG5cblx0aHVkID0gbmV3IEhVRChsb2FkZXIuZ2V0UmVzdWx0KCdwb3J0cmFpdCcpLCBwbGF5ZXIuaHApO1xuXHRodWQucmVuZGVySFVEKGZ1bmN0aW9uKHBvcnRyYWl0LCBmdWxsSGVhbHRoLCBjdXJyZW50SGVhbHRoKSB7XG5cdFx0c3RhZ2UuYWRkQ2hpbGQoZnVsbEhlYWx0aCk7XG5cdFx0c3RhZ2UuYWRkQ2hpbGQoY3VycmVudEhlYWx0aCk7XG5cdFx0c3RhZ2UuYWRkQ2hpbGQocG9ydHJhaXQpO1xuXHR9KTtcblxuXHRzdGFnZS51cGRhdGUoKTtcblxufVxuXG4vLyBNb3ZlcyB0aGUgc3RhZ2UgaWYgdGhlIHBsYXllciBoYXMgZ29uZSBiZXlvbmQgYSBjZXJ0YWluIGJvdW5kYXJ5IG9uIGVpdGhlciBzaWRlLCBidXRcbi8vIG9ubHkgd2hpbGUgdGhleSBhcmUgc3RpbGwgbW92aW5nIGluIHRoYXQgZGlyZWN0aW9uLiBcblxuZnVuY3Rpb24gbW92ZVN0YWdlKCkge1xuXG5cdGlmIChwbGF5ZXIuc3ByaXRlLnggPiAxNzUpIHtcblx0XHRiYWNrZ3JvdW5kLngtLTtcblx0XHRlbmVtaWVzLmZvckVhY2goZnVuY3Rpb24obW9iKSB7XG5cdFx0XHRtb2Iuc3ByaXRlLngtLTtcblx0XHR9KTtcblx0XHRpZiAoYmFja2dyb3VuZC54IDwgLTkwMCkge1xuXHRcdFx0YmFja2dyb3VuZC54ID0gMDsgXG5cdFx0fVxuXHRcdGlmIChwbGF5ZXIuc3ByaXRlLmN1cnJlbnRBbmltYXRpb24gPT09ICdzdGFuZCcgfHwgcGxheWVyLnNwcml0ZS5jdXJyZW50QW5pbWF0aW9uID09PSAnc2xhc2gnKSB7XG5cdFx0XHRwbGF5ZXIuc3ByaXRlLngtLTtcblx0XHR9XG5cdH0gZWxzZSBpZiAocGxheWVyLnNwcml0ZS54IDwgMjUpIHtcblx0XHRiYWNrZ3JvdW5kLngrKztcblx0XHRlbmVtaWVzLmZvckVhY2goZnVuY3Rpb24obW9iKSB7XG5cdFx0XHRtb2Iuc3ByaXRlLngrKztcblx0XHR9KTtcblx0XHRpZiAoYmFja2dyb3VuZC54ID4gMCkge1xuXHRcdFx0YmFja2dyb3VuZC54ID0gLTkwMDtcblx0XHR9XG5cdFx0aWYgKHBsYXllci5zcHJpdGUuY3VycmVudEFuaW1hdGlvbiA9PT0gJ3N0YW5kJykge1xuXHRcdFx0cGxheWVyLnNwcml0ZS54Kys7XG5cdFx0fVxuXHR9XG5cbn1cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBIQU5ETEUgS0VZQklORFMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuZnVuY3Rpb24gaGFuZGxlS2V5RG93bihldmVudCkge1xuXHRpZiAocGxheWVyLmhwID4gMCkge1xuXHRcdHBsYXllci5oYW5kbGVBbmltYXRpb24oa2V5TWFwW2V2ZW50LmtleUNvZGVdLCAncnVuJywgMTIsIDApO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUtleVVwKGV2ZW50KSB7XG5cdGlmIChwbGF5ZXIuaHAgPiAwKSB7XG5cdFx0cGxheWVyLmhhbmRsZUFuaW1hdGlvbignc3RvcCcsICdzdGFuZCcsIDApO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUNsaWNrKGV2ZW50KSB7XG5cdGlmIChwbGF5ZXIuaHAgPiAwKSB7XG5cdFx0Ly8gUHVycG9zZSBvZiB0aGUgY2FsbGJhY2sgaGVyZSBpcyB0byBiZSBwYXNzZWQgdGhyb3VnaCBoYW5kbGVBdHRhY2sgdG8gXG5cdFx0Ly8gdGhlIGNvbGxpc2lvbiBkZXRlY3RvciB0aGF0IHdpbGwgdGhlbiBjYWxsIHRoZSBjYWxsYmFjayBpcyB1c2VkIHRvXG5cdFx0Ly8gZGlzcGxheSB0ZXh0IG9uIHRoZSBzY3JlZW4uXG5cdFx0cGxheWVyLmhhbmRsZUF0dGFjayhlbmVtaWVzLCBmdW5jdGlvbihkYW1hZ2UpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdjYWxsYmFjayB0byBoYW5kbGUgYXR0YWNrIHJ1bm5pbmcnKTtcblx0XHRcdGh1ZC5yZW5kZXJEYW1hZ2UoZGFtYWdlLCB0aW1lRWxhcHNlZCwge1xuXHRcdFx0XHR4OiBwbGF5ZXIuc3ByaXRlLnggKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA4MCkgLSA0MCxcblx0XHRcdFx0eTogcGxheWVyLnNwcml0ZS55ICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApIC0gNDBcblx0XHRcdH0sIGZ1bmN0aW9uKHRleHQpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ2ZpbmFsIGZ1bmN0aW9uIHJ1bm5pbmcnKTtcblx0XHRcdFx0c3RhZ2UuYWRkQ2hpbGQodGV4dCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxufVxuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIEVORU1ZIFNQQVdOUyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG4vLyBGdW5jdGlvbiB3aWxsIHJ1biBldmVyeSB0aW1lIHRocm91Z2ggdGhlIHJlbmRlciBsb29wIGFuZCwgaWYgZW5lbXkgY291bnQgaXNcbi8vIGJlbG93IGEgc3BlY2lmaWVkIG1heCwgcmFuZG9tbHkgZ2VuZXJhdGUgYSBudW1iZXIgdG8gdHJ5IHRvIG1lZXQgY29uZGl0aW9uc1xuLy8gZm9yIGFuIGVuZW15IHNwYXduLiByYW5kQSBhbmQgcmFuZEIgaGVscCB0byBzZXQgdGhlIHBhcmFtZXRlcnMgZm9yXG4vLyBob3cgb2Z0ZW4gc29tZXRoaW5nIHNob3VsZCBoYXBwZW4uIFxudmFyIHJhbmRvbWl6ZWRTcGF3biA9IGZ1bmN0aW9uKG1heCwgcmFuZEEsIHJhbmRCKSB7XG5cdGlmIChlbmVtaWVzLmxlbmd0aCA8IG1heCkge1xuXHRcdGlmIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYW5kQSkgJSByYW5kQiA9PT0gMCkge1xuXHRcdFx0dmFyIG5ld0lkeCA9IGVuZW1pZXMubGVuZ3RoO1xuXHRcdFx0JC5nZXQoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9tb2JzJywge25hbWU6ICdzbGltZSd9LCBcblx0XHRcdFx0ZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdGVuZW1pZXNbbmV3SWR4XSA9IG5ldyBNb2IobG9hZGVyLmdldFJlc3VsdCgnc2xpbWUnKSxcblx0XHRcdFx0XHRcdHtocDogZGF0YS5yZXN1bHQuaHAsIGF0azogZGF0YS5yZXN1bHQuYXRrLCBkZWY6IGRhdGEucmVzdWx0LmRlZn0sXG5cdFx0XHRcdFx0XHR7ZGlyZWN0aW9uOiAnbGVmdCd9XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRlbmVtaWVzW25ld0lkeF0uY3JlYXRlU3ByaXRlKHtcblx0XHRcdFx0XHRcdGZyYW1lcmF0ZTogMzAsXG5cdFx0XHRcdFx0XHRpbWFnZXM6IFtlbmVtaWVzW25ld0lkeF0uaW1hZ2VdLFxuXHRcdFx0XHRcdFx0ZnJhbWVzOiBKU09OLnBhcnNlKGRhdGEucmVzdWx0LnNwcml0ZXNoZWV0KSxcblx0XHRcdFx0XHRcdGFuaW1hdGlvbnM6IHtcblx0XHRcdFx0XHRcdFx0c3RhbmQ6IFswLCAwLCAnaG9wJywgMC4yXSxcblx0XHRcdFx0XHRcdFx0aG9wOiBbMSwgNiwgJ3N0YW5kJywgMC4yXVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sICdob3AnLCB7eDogMjUwLCB5OiA4NH0pO1xuXHRcdFx0XHRcdGVuZW1pZXNbbmV3SWR4XS5zcHJpdGUuc2NhbGVYID0gMC41O1xuXHRcdFx0XHRcdGVuZW1pZXNbbmV3SWR4XS5zcHJpdGUuc2NhbGVZID0gMC41O1xuXHRcdFx0XHRcdHN0YWdlLmFkZENoaWxkKGVuZW1pZXNbbmV3SWR4XS5zcHJpdGUpO1xuXHRcdFx0XHR9KTtcblx0XHR9XG5cdH1cbn07XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBSRU5ERVIgTE9PUCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5jcmVhdGVqcy5UaWNrZXIuYWRkRXZlbnRMaXN0ZW5lcigndGljaycsIGhhbmRsZVRpY2spOyBcbmNyZWF0ZWpzLlRpY2tlci5zZXRGUFMoNDUpO1xuZnVuY3Rpb24gaGFuZGxlVGljayhldmVudCkge1xuXG5cdHZhciBkZWx0YVMgPSBldmVudC5kZWx0YSAvIDEwMDA7XG5cblx0dGltZUVsYXBzZWQrKztcblxuXHRyYW5kb21pemVkU3Bhd24oNCwgMzAwLCAyNjkpO1xuXHRlbmVtaWVzLmZvckVhY2goZnVuY3Rpb24gbW92ZU1vYnMobW9iKSB7XG5cdFx0aWYgKG1vYi5zcHJpdGUueCA+IHBsYXllci5zcHJpdGUueCkge1xuXHRcdFx0bW9iLmhhbmRsZUFuaW1hdGlvbignbGVmdCcsICdob3AnLCAwLjUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRtb2IuaGFuZGxlQW5pbWF0aW9uKCdyaWdodCcsICdob3AnLCAwLjUpO1xuXHRcdH1cblx0fSk7XG5cblx0Ly8gcGxheWVyLmhhbmRsZVkoKTtcblxuXHRtb3ZlU3RhZ2UoKTtcblxuXHRpZiAodGltZUVsYXBzZWQgJSA1ID09PSAwKSB7XG5cdFx0cGxheWVyLmNvbGxpc2lvbnMoZW5lbWllcywgbnVsbCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRwbGF5ZXIuaGFuZGxlRGVhdGgoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRzdGFnZS5yZW1vdmVDaGlsZChwbGF5ZXIuc3ByaXRlKTtcblx0XHRcdFx0c3RhZ2UudXBkYXRlKCk7XG5cdFx0XHRcdGNyZWF0ZWpzLlRpY2tlci5zZXRQYXVzZWQodHJ1ZSk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0XHRodWQuY3VycmVudEhlYWx0aEJhci5zY2FsZVggPSBwbGF5ZXIuaHAgLyBwbGF5ZXIubWF4SFA7XG5cdH1cblxuXHQvLyBSZW1vdmUgYW55IGRlZmVhdGVkIGVuZW1pZXM6IFxuXHRlbmVtaWVzID0gZW5lbWllcy5maWx0ZXIoZnVuY3Rpb24gaGVhbHRoWmVybyhtb2IpIHtcblx0XHRpZiAobW9iLmhwIDw9IDApIHtcblx0XHRcdHN0YWdlLnJlbW92ZUNoaWxkKG1vYi5zcHJpdGUpO1xuXHRcdH1cblx0XHRyZXR1cm4gbW9iLmhwID4gMDtcblx0fSk7XG5cblxuXHRzdGFnZS51cGRhdGUoKTtcbn1cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIl19