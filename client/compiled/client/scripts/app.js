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
			dead: [14, 16, 'dead', 0.01]
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
		player.handleAttack(enemies);
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

	moveStage();

	if (timeElapsed % 5 === 0) {
		player.collisions(enemies, null, function () {
			player.handleDeath(function () {
				stage.removeChild(player.sprite);
				stage.update();
				createjs.Ticker.setPaused(true);
			});
		});
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
//# sourceMappingURL=data:application/json;base64,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TSxXQUFOLENBQWtCLElBQUksTUFBdEI7QUFDQSxXQUFRLEdBQVIsQ0FBWSxvQkFBWjtBQUNBO0FBQ0QsU0FBTyxJQUFJLEVBQUosR0FBUyxDQUFoQjtBQUNBLEVBTlMsQ0FBVjs7QUFTQSxPQUFNLE1BQU47QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBBUFAgSU5JVElBVElPTiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbi8vIFVzaW5nIGNyZWF0ZS5qcyB0byBzZXQgdXAgYW5kIHJlbmRlciBiYWNrZ3JvdW5kOiBcblxudmFyIHN0YWdlLCBsb2FkZXIsIGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQ7XG52YXIgYmFja2dyb3VuZCwgcGxheWVyO1xudmFyIGVuZW1pZXMgPSBbXTtcbnZhciB0aW1lRWxhcHNlZCA9IDA7XG5cbi8vIFRoZSBwdXJwb3NlIG9mIGtleU1hcCBpcyB0byBob2xkIHRoZSBwb3NzaWJsZSBrZXlwcmVzc2VzIGZvciBrZXlkb3duIGV2ZW50cyB0aGF0IG1heSBoYXBwZW4gXG52YXIga2V5TWFwID0ge1xuXHQ2NTogJ2xlZnQnLFxuXHQ2ODogJ3JpZ2h0J1xufTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcblxuXHRzdGFnZSA9IG5ldyBjcmVhdGVqcy5TdGFnZSgnZm9yZXN0LWR1bmdlb24nKTtcblxuXHQvLyBDYW52YXMgd2lkdGggYW5kIGhlaWdodCBzdG9yZWQgaW4gdmFyIHcgYW5kIGggZm9yIGZ1dHVyZSB1c2UuIFxuXHRjYW52YXNXaWR0aCA9IHN0YWdlLmNhbnZhcy53aWR0aDtcblx0Y2FudmFzSGVpZ2h0ID0gc3RhZ2UuY2FudmFzLmhlaWdodDtcblxuXHQvLyBNYW5pZmVzdCB3aWxsIGNyZWF0ZSBhbmQgc3RvcmUgYmFja2dyb3VuZCBpbWFnZSBmb3IgZnV0dXJlIHVzZS4gTG9va3MgbGlrZSBcblx0Ly8gdGhlIHJlbmRlciB3aWxsIG5lZWQgdG8gYmUgYWRqdXN0ZWQgdG8gYWxpZ24gdGhlIGltYWdlIHByb3Blcmx5LiBcblx0dmFyIG1hbmlmZXN0ID0gW1xuXHRcdHtzcmM6ICdiYWNrZ3JvdW5kLnBuZycsIGlkOiAnYmFja2dyb3VuZCd9LFxuXHRcdHtzcmM6ICdkZWZhdWx0LXNwcml0ZS5wbmcnLCBpZDogJ3BsYXllclNwcml0ZSd9LFxuXHRcdHtzcmM6ICdTbGltZUFuaW1hdGVkLnBuZycsIGlkOiAnc2xpbWUnfVxuXHRdO1xuXHQvLyBMb2FkZXIgd2lsbCByZW5kZXIgdGhlIG5lY2Vzc2FyeSBpdGVtcyBcblx0bG9hZGVyID0gbmV3IGNyZWF0ZWpzLkxvYWRRdWV1ZShmYWxzZSk7XG5cdGxvYWRlci5hZGRFdmVudExpc3RlbmVyKCdjb21wbGV0ZScsIGhhbmRsZUNvbXBsZXRlKTtcblx0bG9hZGVyLmxvYWRNYW5pZmVzdChtYW5pZmVzdCwgdHJ1ZSwgJ2Fzc2V0cy9pbWFnZXMvJyk7XG5cblx0Ly8gRGV0ZWN0IGtleXByZXNzOiBcblx0d2luZG93LmRvY3VtZW50Lm9ua2V5ZG93biA9IGhhbmRsZUtleURvd247XG5cdHdpbmRvdy5kb2N1bWVudC5vbmtleXVwID0gaGFuZGxlS2V5VXA7XG5cdHdpbmRvdy5kb2N1bWVudC5vbmNsaWNrID0gaGFuZGxlQ2xpY2s7XG59XG5cbmluaXQoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBDUkVBVEUgVEhFIFNUQUdFICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmZ1bmN0aW9uIGhhbmRsZUNvbXBsZXRlKGV2ZW50KSB7XG5cdFxuXHQvLyBDcmVhdGVzIGJhY2tncm91bmQgaW1hZ2UuIFxuXHRiYWNrZ3JvdW5kID0gbmV3IGNyZWF0ZWpzLlNoYXBlKCk7XG5cdHZhciBiYWNrZ3JvdW5kSW1nID0gbG9hZGVyLmdldFJlc3VsdCgnYmFja2dyb3VuZCcpO1xuXHRiYWNrZ3JvdW5kLmdyYXBoaWNzLmJlZ2luQml0bWFwRmlsbChiYWNrZ3JvdW5kSW1nKS5kcmF3UmVjdCgwLCAwLCBjYW52YXNXaWR0aCArIGJhY2tncm91bmRJbWcud2lkdGgsIGNhbnZhc0hlaWdodCArIGJhY2tncm91bmRJbWcuaGVpZ2h0KTtcblx0c3RhZ2UuYWRkQ2hpbGQoYmFja2dyb3VuZCk7XG5cblx0Ly8gQWRqdXN0bWVudCB0byBsaW5lIHRoZSBpbWFnZSBtZW50aW9uZWQgYWJvdmUuIFxuXHRiYWNrZ3JvdW5kLnkgPSAtMTA1O1xuXG5cdC8vIENyZWF0aW9uIG9mIHRoZSBwbGF5ZXIgdG8gcmVuZGVyIG9uIHRoZSBzY3JlZW4uIFxuXHRwbGF5ZXIgPSBuZXcgUGxheWVyKGxvYWRlci5nZXRSZXN1bHQoJ3BsYXllclNwcml0ZScpLCB7aHA6IDEwMCwgYXRrOiAxMCwgZGVmOiAxMH0sIHtkaXJlY3Rpb246ICdyaWdodCd9KTtcblx0cGxheWVyLmNyZWF0ZVNwcml0ZSh7XG5cdFx0ZnJhbWVyYXRlOiAzMCxcblx0XHRpbWFnZXM6IFtwbGF5ZXIuaW1hZ2VdLFxuXHRcdGZyYW1lczogcGxheWVyLnNwcml0ZXNoZWV0ZGF0YSxcblx0XHQvLyB4LCB5LCB3aWR0aCwgaGVpZ2h0LCBpbWFnZUluZGV4KiwgcmVnWCosIHJlZ1kqXG5cdFx0Ly8ge3JlZ1g6IDAsIGhlaWdodDogOTIsIGNvdW50OiAyNCwgcmVnWTogMCwgd2lkdGg6IDY0fSxcblx0XHRhbmltYXRpb25zOiB7XG5cdFx0XHRzdGFuZDogWzBdLFxuXHRcdFx0cnVuOiBbMSwgNiwgJ3J1bicsIDAuMjVdLFxuXHRcdFx0c2xhc2g6IFs3LCAxMywgJ3N0YW5kJywgMC4yNV0sXG5cdFx0XHRkZWFkOiBbMTQsIDE2LCAnZGVhZCcsIDAuMDFdXG5cdFx0fVxuXHR9LCAnc3RhbmQnLCB7eDogNjAsIHk6IDYwfSk7XG5cblx0c3RhZ2UuYWRkQ2hpbGQocGxheWVyLnNwcml0ZSk7XG5cbn1cblxuLy8gTW92ZXMgdGhlIHN0YWdlIGlmIHRoZSBwbGF5ZXIgaGFzIGdvbmUgYmV5b25kIGEgY2VydGFpbiBib3VuZGFyeSBvbiBlaXRoZXIgc2lkZSwgYnV0XG4vLyBvbmx5IHdoaWxlIHRoZXkgYXJlIHN0aWxsIG1vdmluZyBpbiB0aGF0IGRpcmVjdGlvbi4gXG5cbmZ1bmN0aW9uIG1vdmVTdGFnZSgpIHtcblxuXHRpZiAocGxheWVyLnNwcml0ZS54ID4gMTc1KSB7XG5cdFx0YmFja2dyb3VuZC54LS07XG5cdFx0ZW5lbWllcy5mb3JFYWNoKGZ1bmN0aW9uKG1vYikge1xuXHRcdFx0bW9iLnNwcml0ZS54LS07XG5cdFx0fSk7XG5cdFx0aWYgKGJhY2tncm91bmQueCA8IC05MDApIHtcblx0XHRcdGJhY2tncm91bmQueCA9IDA7IFxuXHRcdH1cblx0XHRpZiAocGxheWVyLnNwcml0ZS5jdXJyZW50QW5pbWF0aW9uID09PSAnc3RhbmQnIHx8IHBsYXllci5zcHJpdGUuY3VycmVudEFuaW1hdGlvbiA9PT0gJ3NsYXNoJykge1xuXHRcdFx0cGxheWVyLnNwcml0ZS54LS07XG5cdFx0fVxuXHR9IGVsc2UgaWYgKHBsYXllci5zcHJpdGUueCA8IDI1KSB7XG5cdFx0YmFja2dyb3VuZC54Kys7XG5cdFx0ZW5lbWllcy5mb3JFYWNoKGZ1bmN0aW9uKG1vYikge1xuXHRcdFx0bW9iLnNwcml0ZS54Kys7XG5cdFx0fSk7XG5cdFx0aWYgKGJhY2tncm91bmQueCA+IDApIHtcblx0XHRcdGJhY2tncm91bmQueCA9IC05MDA7XG5cdFx0fVxuXHRcdGlmIChwbGF5ZXIuc3ByaXRlLmN1cnJlbnRBbmltYXRpb24gPT09ICdzdGFuZCcpIHtcblx0XHRcdHBsYXllci5zcHJpdGUueCsrO1xuXHRcdH1cblx0fVxuXG59XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogSEFORExFIEtFWUJJTkRTICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmZ1bmN0aW9uIGhhbmRsZUtleURvd24oZXZlbnQpIHtcblx0aWYgKHBsYXllci5ocCA+IDApIHtcblx0XHRwbGF5ZXIuaGFuZGxlQW5pbWF0aW9uKGtleU1hcFtldmVudC5rZXlDb2RlXSwgJ3J1bicsIDEyLCAwKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoYW5kbGVLZXlVcChldmVudCkge1xuXHRpZiAocGxheWVyLmhwID4gMCkge1xuXHRcdHBsYXllci5oYW5kbGVBbmltYXRpb24oJ3N0b3AnLCAnc3RhbmQnLCAwKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoYW5kbGVDbGljayhldmVudCkge1xuXHRpZiAocGxheWVyLmhwID4gMCkge1xuXHRcdHBsYXllci5oYW5kbGVBdHRhY2soZW5lbWllcyk7XG5cdH1cbn1cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBFTkVNWSBTUEFXTlMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuLy8gRnVuY3Rpb24gd2lsbCBydW4gZXZlcnkgdGltZSB0aHJvdWdoIHRoZSByZW5kZXIgbG9vcCBhbmQsIGlmIGVuZW15IGNvdW50IGlzXG4vLyBiZWxvdyBhIHNwZWNpZmllZCBtYXgsIHJhbmRvbWx5IGdlbmVyYXRlIGEgbnVtYmVyIHRvIHRyeSB0byBtZWV0IGNvbmRpdGlvbnNcbi8vIGZvciBhbiBlbmVteSBzcGF3bi4gcmFuZEEgYW5kIHJhbmRCIGhlbHAgdG8gc2V0IHRoZSBwYXJhbWV0ZXJzIGZvclxuLy8gaG93IG9mdGVuIHNvbWV0aGluZyBzaG91bGQgaGFwcGVuLiBcbnZhciByYW5kb21pemVkU3Bhd24gPSBmdW5jdGlvbihtYXgsIHJhbmRBLCByYW5kQikge1xuXHRpZiAoZW5lbWllcy5sZW5ndGggPCBtYXgpIHtcblx0XHRpZiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmFuZEEpICUgcmFuZEIgPT09IDApIHtcblx0XHRcdHZhciBuZXdJZHggPSBlbmVtaWVzLmxlbmd0aDtcblx0XHRcdCQuZ2V0KCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvbW9icycsIHtuYW1lOiAnc2xpbWUnfSwgXG5cdFx0XHRcdGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHRlbmVtaWVzW25ld0lkeF0gPSBuZXcgTW9iKGxvYWRlci5nZXRSZXN1bHQoJ3NsaW1lJyksXG5cdFx0XHRcdFx0XHR7aHA6IGRhdGEucmVzdWx0LmhwLCBhdGs6IGRhdGEucmVzdWx0LmF0aywgZGVmOiBkYXRhLnJlc3VsdC5kZWZ9LFxuXHRcdFx0XHRcdFx0e2RpcmVjdGlvbjogJ2xlZnQnfVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0ZW5lbWllc1tuZXdJZHhdLmNyZWF0ZVNwcml0ZSh7XG5cdFx0XHRcdFx0XHRmcmFtZXJhdGU6IDMwLFxuXHRcdFx0XHRcdFx0aW1hZ2VzOiBbZW5lbWllc1tuZXdJZHhdLmltYWdlXSxcblx0XHRcdFx0XHRcdGZyYW1lczogSlNPTi5wYXJzZShkYXRhLnJlc3VsdC5zcHJpdGVzaGVldCksXG5cdFx0XHRcdFx0XHRhbmltYXRpb25zOiB7XG5cdFx0XHRcdFx0XHRcdHN0YW5kOiBbMCwgMCwgJ2hvcCcsIDAuMl0sXG5cdFx0XHRcdFx0XHRcdGhvcDogWzEsIDYsICdzdGFuZCcsIDAuMl1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCAnaG9wJywge3g6IDI1MCwgeTogODR9KTtcblx0XHRcdFx0XHRlbmVtaWVzW25ld0lkeF0uc3ByaXRlLnNjYWxlWCA9IDAuNTtcblx0XHRcdFx0XHRlbmVtaWVzW25ld0lkeF0uc3ByaXRlLnNjYWxlWSA9IDAuNTtcblx0XHRcdFx0XHRzdGFnZS5hZGRDaGlsZChlbmVtaWVzW25ld0lkeF0uc3ByaXRlKTtcblx0XHRcdFx0fSk7XG5cdFx0fVxuXHR9XG59O1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogUkVOREVSIExPT1AgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuY3JlYXRlanMuVGlja2VyLmFkZEV2ZW50TGlzdGVuZXIoJ3RpY2snLCBoYW5kbGVUaWNrKTsgXG5jcmVhdGVqcy5UaWNrZXIuc2V0RlBTKDQ1KTtcbmZ1bmN0aW9uIGhhbmRsZVRpY2soZXZlbnQpIHtcblxuXHR2YXIgZGVsdGFTID0gZXZlbnQuZGVsdGEgLyAxMDAwO1xuXG5cdHRpbWVFbGFwc2VkKys7XG5cblx0cmFuZG9taXplZFNwYXduKDQsIDMwMCwgMjY5KTtcblx0ZW5lbWllcy5mb3JFYWNoKGZ1bmN0aW9uIG1vdmVNb2JzKG1vYikge1xuXHRcdGlmIChtb2Iuc3ByaXRlLnggPiBwbGF5ZXIuc3ByaXRlLngpIHtcblx0XHRcdG1vYi5oYW5kbGVBbmltYXRpb24oJ2xlZnQnLCAnaG9wJywgMC41KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bW9iLmhhbmRsZUFuaW1hdGlvbigncmlnaHQnLCAnaG9wJywgMC41KTtcblx0XHR9XG5cdH0pO1xuXG5cdG1vdmVTdGFnZSgpO1xuXG5cdGlmICh0aW1lRWxhcHNlZCAlIDUgPT09IDApIHtcblx0XHRwbGF5ZXIuY29sbGlzaW9ucyhlbmVtaWVzLCBudWxsLCBmdW5jdGlvbigpIHtcblx0XHRcdHBsYXllci5oYW5kbGVEZWF0aChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHN0YWdlLnJlbW92ZUNoaWxkKHBsYXllci5zcHJpdGUpO1xuXHRcdFx0XHRzdGFnZS51cGRhdGUoKTtcblx0XHRcdFx0Y3JlYXRlanMuVGlja2VyLnNldFBhdXNlZCh0cnVlKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0Ly8gUmVtb3ZlIGFueSBkZWZlYXRlZCBlbmVtaWVzOiBcblx0ZW5lbWllcyA9IGVuZW1pZXMuZmlsdGVyKGZ1bmN0aW9uIGhlYWx0aFplcm8obW9iKSB7XG5cdFx0aWYgKG1vYi5ocCA8PSAwKSB7XG5cdFx0XHRzdGFnZS5yZW1vdmVDaGlsZChtb2Iuc3ByaXRlKTtcblx0XHRcdGNvbnNvbGUubG9nKCdtb2IgZGVhdGggZGV0ZWN0ZWQnKTtcblx0XHR9XG5cdFx0cmV0dXJuIG1vYi5ocCA+IDA7XG5cdH0pO1xuXG5cblx0c3RhZ2UudXBkYXRlKCk7XG59XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiJdfQ==