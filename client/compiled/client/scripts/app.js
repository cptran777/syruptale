'use strict';

/* ***************************** APP INITIATION ******************************* */

// Using create.js to set up and render background:

var stage, loader, canvasWidth, canvasHeight;
var background, player, hud;
var enemies = [];
var bosses = [];
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
	var manifest = [{ src: 'background.png', id: 'background' }, { src: 'default-sprite.png', id: 'playerSprite' }, { src: 'SlimeAnimated.png', id: 'slime' }, { src: 'chrom2.jpg', id: 'portrait' }, { src: 'wyvern.png', id: 'wyvern' }];
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

	hud = new HUD(loader.getResult('portrait'), player.hp);
	hud.renderHUD(function (portrait, fullHealth, currentHealth) {
		stage.addChild(fullHealth);
		stage.addChild(currentHealth);
		stage.addChild(portrait);
	});

	// var wyvern = new Mob(loader.getResult('wyvern'), {
	// 	hp: 100,
	// 	atk: 50,
	// 	def: 50
	// });

	// wyvern.createSprite({
	// 	framerate: 30,
	// 	images: [wyvern.image],
	// 	frames: {x:0, y: -10, regX: 86, count: 24, width: 170, height: 175},
	// 	animations: {
	// 		fly: [0, 5, 'fly', 0.2],
	// 		knockback: [12, 12, 'fly', 0.02]
	// 	}
	// }, 'fly', {x: 250, y: 4});

	// wyvern.sprite.scaleX = 0.75;
	// wyvern.sprite.scaleY = 0.75;
	// stage.addChild(wyvern.sprite);

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
		player.handleAttack([].concat(enemies, bosses), function (damage) {
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

var setBossSpawn = function setBossSpawn(interval, max) {
	if (timeElapsed % interval === 0 && (max ? bosses.length < max : true)) {
		var newIdx = bosses.length;
		$.get('http://127.0.0.1:3000/mobs', { name: 'wyvern' }, function (data) {
			bosses[newIdx] = new Boss(loader.getResult('wyvern'), { hp: data.result.hp, atk: data.result.atk, def: data.result.def }, { direction: 'left' });
			bosses[newIdx].createSprite({
				framerate: 30,
				images: [bosses[newIdx].image],
				frames: JSON.parse(data.result.spritesheet),
				animations: {
					fly: [0, 5, 'fly', 0.2],
					knockback: [12, 12, 'fly', 0.1]
				}
			}, 'fly', { x: 250, y: 4 });
			bosses[newIdx].sprite.scaleX = 0.75;
			bosses[newIdx].sprite.scaleY = 0.75;
			stage.addChild(bosses[newIdx].sprite);
		});
	}
};

/* ****************************** RENDER LOOP ******************************** */

createjs.Ticker.addEventListener('tick', handleTick);
createjs.Ticker.setFPS(45);
function handleTick(event) {

	var deltaS = event.delta / 1000;

	timeElapsed++;

	randomizedSpawn(12, 300, 269);
	setBossSpawn(200, 1);
	enemies.forEach(function moveMobs(mob) {
		if (mob.sprite.x > player.sprite.x) {
			mob.handleAnimation('left', 'hop', 0.5);
		} else {
			mob.handleAnimation('right', 'hop', 0.5);
		}
	});
	bosses.forEach(function moveBosses(boss) {
		if (boss.sprite.x > player.sprite.x) {
			boss.handleAnimation('left', 'fly', 0.5);
		} else {
			boss.handleAnimation('right', 'fly', 0.5);
		}
	});

	// player.handleY();

	moveStage();

	// Use of time elapsed conditional in order to slow down some
	// processes that don't need to happen on every frame.
	if (timeElapsed % 5 === 0) {
		player.collisions([].concat(enemies, bosses), null, function () {
			player.handleDeath(function () {
				stage.removeChild(player.sprite);
				stage.update();
				createjs.Ticker.setPaused(true);
			});
		});
		hud.currentHealthBar.scaleX = player.hp / player.maxHP;
		// Remove any defeated enemies:
		enemies = enemies.filter(function healthZero(mob) {
			if (mob.hp <= 0) {
				stage.removeChild(mob.sprite);
			}
			return mob.hp > 0;
		});
		bosses = bosses.filter(function healthZero(boss) {
			if (boss.hp <= 0) {
				stage.removeChild(mob.sprite);
			}
			return mob.hp > 0;
		});
	}

	// Go through the damage numbers and remove the ones that have stayed on screen
	// for too long.
	if (timeElapsed % 5 === 0) {
		hud.damageDisplay = hud.damageDisplay.filter(function removeOldNum(num) {
			if (timeElapsed - num.createdAt > 45) {
				stage.removeChild(num.text);
			}
			return timeElapsed - num.createdAt <= 45;
		});
	}

	stage.update();
}
//# sourceMappingURL=data:application/json;base64,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QU4sQ0FBa0IsT0FBTyxNQUF6QjtBQUNBLFVBQU0sTUFBTjtBQUNBLGFBQVMsTUFBVCxDQUFnQixTQUFoQixDQUEwQixJQUExQjtBQUNBLElBSkQ7QUFLQSxHQU5EO0FBT0EsTUFBSSxnQkFBSixDQUFxQixNQUFyQixHQUE4QixPQUFPLEVBQVAsR0FBWSxPQUFPLEtBQWpEOztBQUVBLFlBQVUsUUFBUSxNQUFSLENBQWUsU0FBUyxVQUFULENBQW9CLEdBQXBCLEVBQXlCO0FBQ2pELE9BQUksSUFBSSxFQUFKLElBQVUsQ0FBZCxFQUFpQjtBQUNoQixVQUFNLFdBQU4sQ0FBa0IsSUFBSSxNQUF0QjtBQUNBO0FBQ0QsVUFBTyxJQUFJLEVBQUosR0FBUyxDQUFoQjtBQUNBLEdBTFMsQ0FBVjtBQU1BLFdBQVMsT0FBTyxNQUFQLENBQWMsU0FBUyxVQUFULENBQW9CLElBQXBCLEVBQTBCO0FBQ2hELE9BQUksS0FBSyxFQUFMLElBQVcsQ0FBZixFQUFrQjtBQUNqQixVQUFNLFdBQU4sQ0FBa0IsSUFBSSxNQUF0QjtBQUNBO0FBQ0QsVUFBTyxJQUFJLEVBQUosR0FBUyxDQUFoQjtBQUNBLEdBTFEsQ0FBVDtBQU1BOzs7O0FBT0QsS0FBSSxjQUFjLENBQWQsS0FBb0IsQ0FBeEIsRUFBMkI7QUFDMUIsTUFBSSxhQUFKLEdBQW9CLElBQUksYUFBSixDQUFrQixNQUFsQixDQUF5QixTQUFTLFlBQVQsQ0FBc0IsR0FBdEIsRUFBMkI7QUFDdkUsT0FBSSxjQUFjLElBQUksU0FBbEIsR0FBOEIsRUFBbEMsRUFBc0M7QUFDckMsVUFBTSxXQUFOLENBQWtCLElBQUksSUFBdEI7QUFDQTtBQUNELFVBQU8sY0FBYyxJQUFJLFNBQWxCLElBQStCLEVBQXRDO0FBQ0EsR0FMbUIsQ0FBcEI7QUFNQTs7QUFFRCxPQUFNLE1BQU47QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBBUFAgSU5JVElBVElPTiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbi8vIFVzaW5nIGNyZWF0ZS5qcyB0byBzZXQgdXAgYW5kIHJlbmRlciBiYWNrZ3JvdW5kOiBcblxudmFyIHN0YWdlLCBsb2FkZXIsIGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQ7XG52YXIgYmFja2dyb3VuZCwgcGxheWVyLCBodWQ7XG52YXIgZW5lbWllcyA9IFtdO1xudmFyIGJvc3NlcyA9IFtdO1xudmFyIHRpbWVFbGFwc2VkID0gMDtcblxuLy8gVGhlIHB1cnBvc2Ugb2Yga2V5TWFwIGlzIHRvIGhvbGQgdGhlIHBvc3NpYmxlIGtleXByZXNzZXMgZm9yIGtleWRvd24gZXZlbnRzIHRoYXQgbWF5IGhhcHBlbiBcbnZhciBrZXlNYXAgPSB7XG5cdDY1OiAnbGVmdCcsXG5cdDY4OiAncmlnaHQnLFxuXHQzMjogJ2p1bXAnXG59O1xuXG5mdW5jdGlvbiBpbml0KCkge1xuXG5cdHN0YWdlID0gbmV3IGNyZWF0ZWpzLlN0YWdlKCdmb3Jlc3QtZHVuZ2VvbicpO1xuXG5cdC8vIENhbnZhcyB3aWR0aCBhbmQgaGVpZ2h0IHN0b3JlZCBpbiB2YXIgdyBhbmQgaCBmb3IgZnV0dXJlIHVzZS4gXG5cdGNhbnZhc1dpZHRoID0gc3RhZ2UuY2FudmFzLndpZHRoO1xuXHRjYW52YXNIZWlnaHQgPSBzdGFnZS5jYW52YXMuaGVpZ2h0O1xuXG5cdC8vIE1hbmlmZXN0IHdpbGwgY3JlYXRlIGFuZCBzdG9yZSBiYWNrZ3JvdW5kIGltYWdlIGZvciBmdXR1cmUgdXNlLiBMb29rcyBsaWtlIFxuXHQvLyB0aGUgcmVuZGVyIHdpbGwgbmVlZCB0byBiZSBhZGp1c3RlZCB0byBhbGlnbiB0aGUgaW1hZ2UgcHJvcGVybHkuIFxuXHR2YXIgbWFuaWZlc3QgPSBbXG5cdFx0e3NyYzogJ2JhY2tncm91bmQucG5nJywgaWQ6ICdiYWNrZ3JvdW5kJ30sXG5cdFx0e3NyYzogJ2RlZmF1bHQtc3ByaXRlLnBuZycsIGlkOiAncGxheWVyU3ByaXRlJ30sXG5cdFx0e3NyYzogJ1NsaW1lQW5pbWF0ZWQucG5nJywgaWQ6ICdzbGltZSd9LFxuXHRcdHtzcmM6ICdjaHJvbTIuanBnJywgaWQ6ICdwb3J0cmFpdCd9LFxuXHRcdHtzcmM6ICd3eXZlcm4ucG5nJywgaWQ6ICd3eXZlcm4nfVxuXHRdO1xuXHQvLyBMb2FkZXIgd2lsbCByZW5kZXIgdGhlIG5lY2Vzc2FyeSBpdGVtcyBcblx0bG9hZGVyID0gbmV3IGNyZWF0ZWpzLkxvYWRRdWV1ZShmYWxzZSk7XG5cdGxvYWRlci5hZGRFdmVudExpc3RlbmVyKCdjb21wbGV0ZScsIGhhbmRsZUNvbXBsZXRlKTtcblx0bG9hZGVyLmxvYWRNYW5pZmVzdChtYW5pZmVzdCwgdHJ1ZSwgJ2Fzc2V0cy9pbWFnZXMvJyk7XG5cblx0Ly8gRGV0ZWN0IGtleXByZXNzOiBcblx0d2luZG93LmRvY3VtZW50Lm9ua2V5ZG93biA9IGhhbmRsZUtleURvd247XG5cdHdpbmRvdy5kb2N1bWVudC5vbmtleXVwID0gaGFuZGxlS2V5VXA7XG5cdHdpbmRvdy5kb2N1bWVudC5vbmNsaWNrID0gaGFuZGxlQ2xpY2s7XG59XG5cbmluaXQoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBDUkVBVEUgVEhFIFNUQUdFICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmZ1bmN0aW9uIGhhbmRsZUNvbXBsZXRlKGV2ZW50KSB7XG5cdFxuXHQvLyBDcmVhdGVzIGJhY2tncm91bmQgaW1hZ2UuIFxuXHRiYWNrZ3JvdW5kID0gbmV3IGNyZWF0ZWpzLlNoYXBlKCk7XG5cdHZhciBiYWNrZ3JvdW5kSW1nID0gbG9hZGVyLmdldFJlc3VsdCgnYmFja2dyb3VuZCcpO1xuXHRiYWNrZ3JvdW5kLmdyYXBoaWNzLmJlZ2luQml0bWFwRmlsbChiYWNrZ3JvdW5kSW1nKS5kcmF3UmVjdCgwLCAwLCBjYW52YXNXaWR0aCArIGJhY2tncm91bmRJbWcud2lkdGgsIGNhbnZhc0hlaWdodCArIGJhY2tncm91bmRJbWcuaGVpZ2h0KTtcblx0c3RhZ2UuYWRkQ2hpbGQoYmFja2dyb3VuZCk7XG5cblx0Ly8gQWRqdXN0bWVudCB0byBsaW5lIHRoZSBpbWFnZSBtZW50aW9uZWQgYWJvdmUuIFxuXHRiYWNrZ3JvdW5kLnkgPSAtMTA1O1xuXG5cdC8vIENyZWF0aW9uIG9mIHRoZSBwbGF5ZXIgdG8gcmVuZGVyIG9uIHRoZSBzY3JlZW4uIFxuXHRwbGF5ZXIgPSBuZXcgUGxheWVyKGxvYWRlci5nZXRSZXN1bHQoJ3BsYXllclNwcml0ZScpLCB7aHA6IDEwMCwgYXRrOiAxMCwgZGVmOiAxMH0sIHtkaXJlY3Rpb246ICdyaWdodCd9KTtcblx0cGxheWVyLmNyZWF0ZVNwcml0ZSh7XG5cdFx0ZnJhbWVyYXRlOiAzMCxcblx0XHRpbWFnZXM6IFtwbGF5ZXIuaW1hZ2VdLFxuXHRcdGZyYW1lczogcGxheWVyLnNwcml0ZXNoZWV0ZGF0YSxcblx0XHQvLyB4LCB5LCB3aWR0aCwgaGVpZ2h0LCBpbWFnZUluZGV4KiwgcmVnWCosIHJlZ1kqXG5cdFx0Ly8ge3JlZ1g6IDAsIGhlaWdodDogOTIsIGNvdW50OiAyNCwgcmVnWTogMCwgd2lkdGg6IDY0fSxcblx0XHRhbmltYXRpb25zOiB7XG5cdFx0XHRzdGFuZDogWzBdLFxuXHRcdFx0cnVuOiBbMSwgNiwgJ3J1bicsIDAuMjVdLFxuXHRcdFx0c2xhc2g6IFs3LCAxMywgJ3N0YW5kJywgMC4yNV0sXG5cdFx0XHRkZWFkOiBbMTQsIDE2LCAnZGVhZCcsIDAuMDVdXG5cdFx0fVxuXHR9LCAnc3RhbmQnLCB7eDogNjAsIHk6IDYwfSk7XG5cblx0c3RhZ2UuYWRkQ2hpbGQocGxheWVyLnNwcml0ZSk7XG5cblx0aHVkID0gbmV3IEhVRChsb2FkZXIuZ2V0UmVzdWx0KCdwb3J0cmFpdCcpLCBwbGF5ZXIuaHApO1xuXHRodWQucmVuZGVySFVEKGZ1bmN0aW9uKHBvcnRyYWl0LCBmdWxsSGVhbHRoLCBjdXJyZW50SGVhbHRoKSB7XG5cdFx0c3RhZ2UuYWRkQ2hpbGQoZnVsbEhlYWx0aCk7XG5cdFx0c3RhZ2UuYWRkQ2hpbGQoY3VycmVudEhlYWx0aCk7XG5cdFx0c3RhZ2UuYWRkQ2hpbGQocG9ydHJhaXQpO1xuXHR9KTtcblxuXHQvLyB2YXIgd3l2ZXJuID0gbmV3IE1vYihsb2FkZXIuZ2V0UmVzdWx0KCd3eXZlcm4nKSwge1xuXHQvLyBcdGhwOiAxMDAsXG5cdC8vIFx0YXRrOiA1MCxcblx0Ly8gXHRkZWY6IDUwXG5cdC8vIH0pO1xuXG5cdC8vIHd5dmVybi5jcmVhdGVTcHJpdGUoe1xuXHQvLyBcdGZyYW1lcmF0ZTogMzAsXG5cdC8vIFx0aW1hZ2VzOiBbd3l2ZXJuLmltYWdlXSxcblx0Ly8gXHRmcmFtZXM6IHt4OjAsIHk6IC0xMCwgcmVnWDogODYsIGNvdW50OiAyNCwgd2lkdGg6IDE3MCwgaGVpZ2h0OiAxNzV9LFxuXHQvLyBcdGFuaW1hdGlvbnM6IHtcblx0Ly8gXHRcdGZseTogWzAsIDUsICdmbHknLCAwLjJdLFxuXHQvLyBcdFx0a25vY2tiYWNrOiBbMTIsIDEyLCAnZmx5JywgMC4wMl1cblx0Ly8gXHR9XG5cdC8vIH0sICdmbHknLCB7eDogMjUwLCB5OiA0fSk7XG5cblx0Ly8gd3l2ZXJuLnNwcml0ZS5zY2FsZVggPSAwLjc1O1xuXHQvLyB3eXZlcm4uc3ByaXRlLnNjYWxlWSA9IDAuNzU7XG5cdC8vIHN0YWdlLmFkZENoaWxkKHd5dmVybi5zcHJpdGUpO1xuXG5cdHN0YWdlLnVwZGF0ZSgpO1xuXG59XG5cbi8vIE1vdmVzIHRoZSBzdGFnZSBpZiB0aGUgcGxheWVyIGhhcyBnb25lIGJleW9uZCBhIGNlcnRhaW4gYm91bmRhcnkgb24gZWl0aGVyIHNpZGUsIGJ1dFxuLy8gb25seSB3aGlsZSB0aGV5IGFyZSBzdGlsbCBtb3ZpbmcgaW4gdGhhdCBkaXJlY3Rpb24uIFxuXG5mdW5jdGlvbiBtb3ZlU3RhZ2UoKSB7XG5cblx0aWYgKHBsYXllci5zcHJpdGUueCA+IDE3NSkge1xuXHRcdGJhY2tncm91bmQueC0tO1xuXHRcdGVuZW1pZXMuZm9yRWFjaChmdW5jdGlvbihtb2IpIHtcblx0XHRcdG1vYi5zcHJpdGUueC0tO1xuXHRcdH0pO1xuXHRcdGlmIChiYWNrZ3JvdW5kLnggPCAtOTAwKSB7XG5cdFx0XHRiYWNrZ3JvdW5kLnggPSAwOyBcblx0XHR9XG5cdFx0aWYgKHBsYXllci5zcHJpdGUuY3VycmVudEFuaW1hdGlvbiA9PT0gJ3N0YW5kJyB8fCBwbGF5ZXIuc3ByaXRlLmN1cnJlbnRBbmltYXRpb24gPT09ICdzbGFzaCcpIHtcblx0XHRcdHBsYXllci5zcHJpdGUueC0tO1xuXHRcdH1cblx0fSBlbHNlIGlmIChwbGF5ZXIuc3ByaXRlLnggPCAyNSkge1xuXHRcdGJhY2tncm91bmQueCsrO1xuXHRcdGVuZW1pZXMuZm9yRWFjaChmdW5jdGlvbihtb2IpIHtcblx0XHRcdG1vYi5zcHJpdGUueCsrO1xuXHRcdH0pO1xuXHRcdGlmIChiYWNrZ3JvdW5kLnggPiAwKSB7XG5cdFx0XHRiYWNrZ3JvdW5kLnggPSAtOTAwO1xuXHRcdH1cblx0XHRpZiAocGxheWVyLnNwcml0ZS5jdXJyZW50QW5pbWF0aW9uID09PSAnc3RhbmQnKSB7XG5cdFx0XHRwbGF5ZXIuc3ByaXRlLngrKztcblx0XHR9XG5cdH1cblxufVxuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIEhBTkRMRSBLRVlCSU5EUyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5mdW5jdGlvbiBoYW5kbGVLZXlEb3duKGV2ZW50KSB7XG5cdGlmIChwbGF5ZXIuaHAgPiAwKSB7XG5cdFx0cGxheWVyLmhhbmRsZUFuaW1hdGlvbihrZXlNYXBbZXZlbnQua2V5Q29kZV0sICdydW4nLCAxMiwgMCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlS2V5VXAoZXZlbnQpIHtcblx0aWYgKHBsYXllci5ocCA+IDApIHtcblx0XHRwbGF5ZXIuaGFuZGxlQW5pbWF0aW9uKCdzdG9wJywgJ3N0YW5kJywgMCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlQ2xpY2soZXZlbnQpIHtcblx0aWYgKHBsYXllci5ocCA+IDApIHtcblx0XHQvLyBQdXJwb3NlIG9mIHRoZSBjYWxsYmFjayBoZXJlIGlzIHRvIGJlIHBhc3NlZCB0aHJvdWdoIGhhbmRsZUF0dGFjayB0byBcblx0XHQvLyB0aGUgY29sbGlzaW9uIGRldGVjdG9yIHRoYXQgd2lsbCB0aGVuIGNhbGwgdGhlIGNhbGxiYWNrIGlzIHVzZWQgdG9cblx0XHQvLyBkaXNwbGF5IHRleHQgb24gdGhlIHNjcmVlbi5cblx0XHRwbGF5ZXIuaGFuZGxlQXR0YWNrKFtdLmNvbmNhdChlbmVtaWVzLCBib3NzZXMpLCBmdW5jdGlvbihkYW1hZ2UpIHtcblx0XHRcdGh1ZC5yZW5kZXJEYW1hZ2UoZGFtYWdlLCB0aW1lRWxhcHNlZCwge1xuXHRcdFx0XHR4OiBwbGF5ZXIuc3ByaXRlLnggKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1MCkgLSAyNSxcblx0XHRcdFx0eTogcGxheWVyLnNwcml0ZS55ICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApIC0gMjVcblx0XHRcdH0sIGZ1bmN0aW9uKHRleHQpIHtcblx0XHRcdFx0c3RhZ2UuYWRkQ2hpbGQodGV4dCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxufVxuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIEVORU1ZIFNQQVdOUyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG4vLyBGdW5jdGlvbiB3aWxsIHJ1biBldmVyeSB0aW1lIHRocm91Z2ggdGhlIHJlbmRlciBsb29wIGFuZCwgaWYgZW5lbXkgY291bnQgaXNcbi8vIGJlbG93IGEgc3BlY2lmaWVkIG1heCwgcmFuZG9tbHkgZ2VuZXJhdGUgYSBudW1iZXIgdG8gdHJ5IHRvIG1lZXQgY29uZGl0aW9uc1xuLy8gZm9yIGFuIGVuZW15IHNwYXduLiByYW5kQSBhbmQgcmFuZEIgaGVscCB0byBzZXQgdGhlIHBhcmFtZXRlcnMgZm9yXG4vLyBob3cgb2Z0ZW4gc29tZXRoaW5nIHNob3VsZCBoYXBwZW4uIFxudmFyIHJhbmRvbWl6ZWRTcGF3biA9IGZ1bmN0aW9uKG1heCwgcmFuZEEsIHJhbmRCKSB7XG5cdGlmIChlbmVtaWVzLmxlbmd0aCA8IG1heCkge1xuXHRcdGlmIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYW5kQSkgJSByYW5kQiA9PT0gMCkge1xuXHRcdFx0dmFyIG5ld0lkeCA9IGVuZW1pZXMubGVuZ3RoO1xuXHRcdFx0JC5nZXQoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9tb2JzJywge25hbWU6ICdzbGltZSd9LCBcblx0XHRcdFx0ZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdGVuZW1pZXNbbmV3SWR4XSA9IG5ldyBNb2IobG9hZGVyLmdldFJlc3VsdCgnc2xpbWUnKSxcblx0XHRcdFx0XHRcdHtocDogZGF0YS5yZXN1bHQuaHAsIGF0azogZGF0YS5yZXN1bHQuYXRrLCBkZWY6IGRhdGEucmVzdWx0LmRlZn0sXG5cdFx0XHRcdFx0XHR7ZGlyZWN0aW9uOiAnbGVmdCd9XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRlbmVtaWVzW25ld0lkeF0uY3JlYXRlU3ByaXRlKHtcblx0XHRcdFx0XHRcdGZyYW1lcmF0ZTogMzAsXG5cdFx0XHRcdFx0XHRpbWFnZXM6IFtlbmVtaWVzW25ld0lkeF0uaW1hZ2VdLFxuXHRcdFx0XHRcdFx0ZnJhbWVzOiBKU09OLnBhcnNlKGRhdGEucmVzdWx0LnNwcml0ZXNoZWV0KSxcblx0XHRcdFx0XHRcdGFuaW1hdGlvbnM6IHtcblx0XHRcdFx0XHRcdFx0c3RhbmQ6IFswLCAwLCAnaG9wJywgMC4yXSxcblx0XHRcdFx0XHRcdFx0aG9wOiBbMSwgNiwgJ3N0YW5kJywgMC4yXVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sICdob3AnLCB7eDogMjUwLCB5OiA4NH0pO1xuXHRcdFx0XHRcdGVuZW1pZXNbbmV3SWR4XS5zcHJpdGUuc2NhbGVYID0gMC41O1xuXHRcdFx0XHRcdGVuZW1pZXNbbmV3SWR4XS5zcHJpdGUuc2NhbGVZID0gMC41O1xuXHRcdFx0XHRcdHN0YWdlLmFkZENoaWxkKGVuZW1pZXNbbmV3SWR4XS5zcHJpdGUpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG59O1xuXG52YXIgc2V0Qm9zc1NwYXduID0gZnVuY3Rpb24oaW50ZXJ2YWwsIG1heCkge1xuXHRpZiAodGltZUVsYXBzZWQgJSBpbnRlcnZhbCA9PT0gMCAmJiAobWF4ID8gYm9zc2VzLmxlbmd0aCA8IG1heCA6IHRydWUpKSB7XG5cdFx0dmFyIG5ld0lkeCA9IGJvc3Nlcy5sZW5ndGg7XG5cdFx0JC5nZXQoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9tb2JzJywge25hbWU6ICd3eXZlcm4nfSwgXG5cdFx0XHRmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdGJvc3Nlc1tuZXdJZHhdID0gbmV3IEJvc3MobG9hZGVyLmdldFJlc3VsdCgnd3l2ZXJuJyksXG5cdFx0XHRcdFx0e2hwOiBkYXRhLnJlc3VsdC5ocCwgYXRrOiBkYXRhLnJlc3VsdC5hdGssIGRlZjogZGF0YS5yZXN1bHQuZGVmfSxcblx0XHRcdFx0XHR7ZGlyZWN0aW9uOiAnbGVmdCd9XG5cdFx0XHRcdCk7XG5cdFx0XHRcdGJvc3Nlc1tuZXdJZHhdLmNyZWF0ZVNwcml0ZSh7XG5cdFx0XHRcdFx0ZnJhbWVyYXRlOiAzMCxcblx0XHRcdFx0XHRpbWFnZXM6IFtib3NzZXNbbmV3SWR4XS5pbWFnZV0sXG5cdFx0XHRcdFx0ZnJhbWVzOiBKU09OLnBhcnNlKGRhdGEucmVzdWx0LnNwcml0ZXNoZWV0KSxcblx0XHRcdFx0XHRhbmltYXRpb25zOiB7XG5cdFx0XHRcdFx0XHRmbHk6IFswLCA1LCAnZmx5JywgMC4yXSxcblx0XHRcdFx0XHRcdGtub2NrYmFjazogWzEyLCAxMiwgJ2ZseScsIDAuMV1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sICdmbHknLCB7eDogMjUwLCB5OiA0fSk7XG5cdFx0XHRcdGJvc3Nlc1tuZXdJZHhdLnNwcml0ZS5zY2FsZVggPSAwLjc1O1xuXHRcdFx0XHRib3NzZXNbbmV3SWR4XS5zcHJpdGUuc2NhbGVZID0gMC43NTtcblx0XHRcdFx0c3RhZ2UuYWRkQ2hpbGQoYm9zc2VzW25ld0lkeF0uc3ByaXRlKTtcblx0XHRcdH0pO1xuXHR9XG59XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBSRU5ERVIgTE9PUCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5jcmVhdGVqcy5UaWNrZXIuYWRkRXZlbnRMaXN0ZW5lcigndGljaycsIGhhbmRsZVRpY2spOyBcbmNyZWF0ZWpzLlRpY2tlci5zZXRGUFMoNDUpO1xuZnVuY3Rpb24gaGFuZGxlVGljayhldmVudCkge1xuXG5cdHZhciBkZWx0YVMgPSBldmVudC5kZWx0YSAvIDEwMDA7XG5cblx0dGltZUVsYXBzZWQrKztcblxuXHRyYW5kb21pemVkU3Bhd24oMTIsIDMwMCwgMjY5KTtcblx0c2V0Qm9zc1NwYXduKDIwMCwgMSk7XG5cdGVuZW1pZXMuZm9yRWFjaChmdW5jdGlvbiBtb3ZlTW9icyhtb2IpIHtcblx0XHRpZiAobW9iLnNwcml0ZS54ID4gcGxheWVyLnNwcml0ZS54KSB7XG5cdFx0XHRtb2IuaGFuZGxlQW5pbWF0aW9uKCdsZWZ0JywgJ2hvcCcsIDAuNSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG1vYi5oYW5kbGVBbmltYXRpb24oJ3JpZ2h0JywgJ2hvcCcsIDAuNSk7XG5cdFx0fVxuXHR9KTtcblx0Ym9zc2VzLmZvckVhY2goZnVuY3Rpb24gbW92ZUJvc3Nlcyhib3NzKSB7XG5cdFx0aWYgKGJvc3Muc3ByaXRlLnggPiBwbGF5ZXIuc3ByaXRlLngpIHtcblx0XHRcdGJvc3MuaGFuZGxlQW5pbWF0aW9uKCdsZWZ0JywgJ2ZseScsIDAuNSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGJvc3MuaGFuZGxlQW5pbWF0aW9uKCdyaWdodCcsICdmbHknLCAwLjUpO1xuXHRcdH1cblx0fSlcblxuXHQvLyBwbGF5ZXIuaGFuZGxlWSgpO1xuXG5cdG1vdmVTdGFnZSgpO1xuXG5cdC8vIFVzZSBvZiB0aW1lIGVsYXBzZWQgY29uZGl0aW9uYWwgaW4gb3JkZXIgdG8gc2xvdyBkb3duIHNvbWUgXG5cdC8vIHByb2Nlc3NlcyB0aGF0IGRvbid0IG5lZWQgdG8gaGFwcGVuIG9uIGV2ZXJ5IGZyYW1lLiBcblx0aWYgKHRpbWVFbGFwc2VkICUgNSA9PT0gMCkge1xuXHRcdHBsYXllci5jb2xsaXNpb25zKFtdLmNvbmNhdChlbmVtaWVzLCBib3NzZXMpLCBudWxsLCBmdW5jdGlvbigpIHtcblx0XHRcdHBsYXllci5oYW5kbGVEZWF0aChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHN0YWdlLnJlbW92ZUNoaWxkKHBsYXllci5zcHJpdGUpO1xuXHRcdFx0XHRzdGFnZS51cGRhdGUoKTtcblx0XHRcdFx0Y3JlYXRlanMuVGlja2VyLnNldFBhdXNlZCh0cnVlKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHRcdGh1ZC5jdXJyZW50SGVhbHRoQmFyLnNjYWxlWCA9IHBsYXllci5ocCAvIHBsYXllci5tYXhIUDtcblx0XHQvLyBSZW1vdmUgYW55IGRlZmVhdGVkIGVuZW1pZXM6IFxuXHRcdGVuZW1pZXMgPSBlbmVtaWVzLmZpbHRlcihmdW5jdGlvbiBoZWFsdGhaZXJvKG1vYikge1xuXHRcdFx0aWYgKG1vYi5ocCA8PSAwKSB7XG5cdFx0XHRcdHN0YWdlLnJlbW92ZUNoaWxkKG1vYi5zcHJpdGUpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG1vYi5ocCA+IDA7XG5cdFx0fSk7XG5cdFx0Ym9zc2VzID0gYm9zc2VzLmZpbHRlcihmdW5jdGlvbiBoZWFsdGhaZXJvKGJvc3MpIHtcblx0XHRcdGlmIChib3NzLmhwIDw9IDApIHtcblx0XHRcdFx0c3RhZ2UucmVtb3ZlQ2hpbGQobW9iLnNwcml0ZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbW9iLmhwID4gMDtcblx0XHR9KTtcblx0fVxuXG5cblxuXG5cdC8vIEdvIHRocm91Z2ggdGhlIGRhbWFnZSBudW1iZXJzIGFuZCByZW1vdmUgdGhlIG9uZXMgdGhhdCBoYXZlIHN0YXllZCBvbiBzY3JlZW4gXG5cdC8vIGZvciB0b28gbG9uZy4gXG5cdGlmICh0aW1lRWxhcHNlZCAlIDUgPT09IDApIHtcblx0XHRodWQuZGFtYWdlRGlzcGxheSA9IGh1ZC5kYW1hZ2VEaXNwbGF5LmZpbHRlcihmdW5jdGlvbiByZW1vdmVPbGROdW0obnVtKSB7XG5cdFx0XHRpZiAodGltZUVsYXBzZWQgLSBudW0uY3JlYXRlZEF0ID4gNDUpIHtcblx0XHRcdFx0c3RhZ2UucmVtb3ZlQ2hpbGQobnVtLnRleHQpOyBcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aW1lRWxhcHNlZCAtIG51bS5jcmVhdGVkQXQgPD0gNDU7XG5cdFx0fSk7XG5cdH1cblxuXHRzdGFnZS51cGRhdGUoKTtcbn1cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIl19