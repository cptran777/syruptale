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

	var wyvern = new Mob(loader.getResult('wyvern'), {
		hp: 100,
		atk: 50,
		def: 50
	});

	wyvern.createSprite({
		framerate: 30,
		images: [wyvern.image],
		frames: { x: 0, y: -10, regX: 86, width: 170, height: 190 },
		animations: {
			stand: [0, 0, 'hop', 0.1],
			fly: [0, 5, 'fly', 0.2]
		}
	}, 'fly', { x: 250, y: 84 });

	wyvern.sprite.x = 155;
	wyvern.sprite.y = 5;
	stage.addChild(wyvern.sprite);

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

var setBossSpawn = function setBossSpawn(interval) {
	if (timeElapsed % interval === 0) {
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
};

/* ****************************** RENDER LOOP ******************************** */

createjs.Ticker.addEventListener('tick', handleTick);
createjs.Ticker.setFPS(45);
function handleTick(event) {

	var deltaS = event.delta / 1000;

	timeElapsed++;

	randomizedSpawn(12, 300, 269);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NjcmlwdHMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUlBLElBQUksS0FBSixFQUFXLE1BQVgsRUFBbUIsV0FBbkIsRUFBZ0MsWUFBaEM7QUFDQSxJQUFJLFVBQUosRUFBZ0IsTUFBaEIsRUFBd0IsR0FBeEI7QUFDQSxJQUFJLFVBQVUsRUFBZDtBQUNBLElBQUksY0FBYyxDQUFsQjs7O0FBR0EsSUFBSSxTQUFTO0FBQ1osS0FBSSxNQURRO0FBRVosS0FBSSxPQUZRO0FBR1osS0FBSTtBQUhRLENBQWI7O0FBTUEsU0FBUyxJQUFULEdBQWdCOztBQUVmLFNBQVEsSUFBSSxTQUFTLEtBQWIsQ0FBbUIsZ0JBQW5CLENBQVI7OztBQUdBLGVBQWMsTUFBTSxNQUFOLENBQWEsS0FBM0I7QUFDQSxnQkFBZSxNQUFNLE1BQU4sQ0FBYSxNQUE1Qjs7OztBQUlBLEtBQUksV0FBVyxDQUNkLEVBQUMsS0FBSyxnQkFBTixFQUF3QixJQUFJLFlBQTVCLEVBRGMsRUFFZCxFQUFDLEtBQUssb0JBQU4sRUFBNEIsSUFBSSxjQUFoQyxFQUZjLEVBR2QsRUFBQyxLQUFLLG1CQUFOLEVBQTJCLElBQUksT0FBL0IsRUFIYyxFQUlkLEVBQUMsS0FBSyxZQUFOLEVBQW9CLElBQUksVUFBeEIsRUFKYyxFQUtkLEVBQUMsS0FBSyxZQUFOLEVBQW9CLElBQUksUUFBeEIsRUFMYyxDQUFmOztBQVFBLFVBQVMsSUFBSSxTQUFTLFNBQWIsQ0FBdUIsS0FBdkIsQ0FBVDtBQUNBLFFBQU8sZ0JBQVAsQ0FBd0IsVUFBeEIsRUFBb0MsY0FBcEM7QUFDQSxRQUFPLFlBQVAsQ0FBb0IsUUFBcEIsRUFBOEIsSUFBOUIsRUFBb0MsZ0JBQXBDOzs7QUFHQSxRQUFPLFFBQVAsQ0FBZ0IsU0FBaEIsR0FBNEIsYUFBNUI7QUFDQSxRQUFPLFFBQVAsQ0FBZ0IsT0FBaEIsR0FBMEIsV0FBMUI7QUFDQSxRQUFPLFFBQVAsQ0FBZ0IsT0FBaEIsR0FBMEIsV0FBMUI7QUFD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Q0E7QUFDRCxFQU5EOzs7O0FBVUE7O0FBRUEsS0FBSSxjQUFjLENBQWQsS0FBb0IsQ0FBeEIsRUFBMkI7QUFDMUIsU0FBTyxVQUFQLENBQWtCLE9BQWxCLEVBQTJCLElBQTNCLEVBQWlDLFlBQVc7QUFDM0MsVUFBTyxXQUFQLENBQW1CLFlBQVk7QUFDOUIsVUFBTSxXQUFOLENBQWtCLE9BQU8sTUFBekI7QUFDQSxVQUFNLE1BQU47QUFDQSxhQUFTLE1BQVQsQ0FBZ0IsU0FBaEIsQ0FBMEIsSUFBMUI7QUFDQSxJQUpEO0FBS0EsR0FORDtBQU9BLE1BQUksZ0JBQUosQ0FBcUIsTUFBckIsR0FBOEIsT0FBTyxFQUFQLEdBQVksT0FBTyxLQUFqRDtBQUNBOzs7QUFHRCxXQUFVLFFBQVEsTUFBUixDQUFlLFNBQVMsVUFBVCxDQUFvQixHQUFwQixFQUF5QjtBQUNqRCxNQUFJLElBQUksRUFBSixJQUFVLENBQWQsRUFBaUI7QUFDaEIsU0FBTSxXQUFOLENBQWtCLElBQUksTUFBdEI7QUFDQTtBQUNELFNBQU8sSUFBSSxFQUFKLEdBQVMsQ0FBaEI7QUFDQSxFQUxTLENBQVY7Ozs7QUFTQSxLQUFJLGNBQWMsQ0FBZCxLQUFvQixDQUF4QixFQUEyQjtBQUMxQixVQUFRLEdBQVIsQ0FBWSxJQUFJLGFBQWhCO0FBQ0EsTUFBSSxhQUFKLEdBQW9CLElBQUksYUFBSixDQUFrQixNQUFsQixDQUF5QixTQUFTLFlBQVQsQ0FBc0IsR0FBdEIsRUFBMkI7QUFDdkUsT0FBSSxjQUFjLElBQUksU0FBbEIsR0FBOEIsRUFBbEMsRUFBc0M7QUFDckMsVUFBTSxXQUFOLENBQWtCLElBQUksSUFBdEI7QUFDQTtBQUNELFVBQU8sY0FBYyxJQUFJLFNBQWxCLElBQStCLEVBQXRDO0FBQ0EsR0FMbUIsQ0FBcEI7QUFNQTs7QUFFRCxPQUFNLE1BQU47QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBBUFAgSU5JVElBVElPTiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbi8vIFVzaW5nIGNyZWF0ZS5qcyB0byBzZXQgdXAgYW5kIHJlbmRlciBiYWNrZ3JvdW5kOiBcblxudmFyIHN0YWdlLCBsb2FkZXIsIGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQ7XG52YXIgYmFja2dyb3VuZCwgcGxheWVyLCBodWQ7XG52YXIgZW5lbWllcyA9IFtdO1xudmFyIHRpbWVFbGFwc2VkID0gMDtcblxuLy8gVGhlIHB1cnBvc2Ugb2Yga2V5TWFwIGlzIHRvIGhvbGQgdGhlIHBvc3NpYmxlIGtleXByZXNzZXMgZm9yIGtleWRvd24gZXZlbnRzIHRoYXQgbWF5IGhhcHBlbiBcbnZhciBrZXlNYXAgPSB7XG5cdDY1OiAnbGVmdCcsXG5cdDY4OiAncmlnaHQnLFxuXHQzMjogJ2p1bXAnXG59O1xuXG5mdW5jdGlvbiBpbml0KCkge1xuXG5cdHN0YWdlID0gbmV3IGNyZWF0ZWpzLlN0YWdlKCdmb3Jlc3QtZHVuZ2VvbicpO1xuXG5cdC8vIENhbnZhcyB3aWR0aCBhbmQgaGVpZ2h0IHN0b3JlZCBpbiB2YXIgdyBhbmQgaCBmb3IgZnV0dXJlIHVzZS4gXG5cdGNhbnZhc1dpZHRoID0gc3RhZ2UuY2FudmFzLndpZHRoO1xuXHRjYW52YXNIZWlnaHQgPSBzdGFnZS5jYW52YXMuaGVpZ2h0O1xuXG5cdC8vIE1hbmlmZXN0IHdpbGwgY3JlYXRlIGFuZCBzdG9yZSBiYWNrZ3JvdW5kIGltYWdlIGZvciBmdXR1cmUgdXNlLiBMb29rcyBsaWtlIFxuXHQvLyB0aGUgcmVuZGVyIHdpbGwgbmVlZCB0byBiZSBhZGp1c3RlZCB0byBhbGlnbiB0aGUgaW1hZ2UgcHJvcGVybHkuIFxuXHR2YXIgbWFuaWZlc3QgPSBbXG5cdFx0e3NyYzogJ2JhY2tncm91bmQucG5nJywgaWQ6ICdiYWNrZ3JvdW5kJ30sXG5cdFx0e3NyYzogJ2RlZmF1bHQtc3ByaXRlLnBuZycsIGlkOiAncGxheWVyU3ByaXRlJ30sXG5cdFx0e3NyYzogJ1NsaW1lQW5pbWF0ZWQucG5nJywgaWQ6ICdzbGltZSd9LFxuXHRcdHtzcmM6ICdjaHJvbTIuanBnJywgaWQ6ICdwb3J0cmFpdCd9LFxuXHRcdHtzcmM6ICd3eXZlcm4ucG5nJywgaWQ6ICd3eXZlcm4nfVxuXHRdO1xuXHQvLyBMb2FkZXIgd2lsbCByZW5kZXIgdGhlIG5lY2Vzc2FyeSBpdGVtcyBcblx0bG9hZGVyID0gbmV3IGNyZWF0ZWpzLkxvYWRRdWV1ZShmYWxzZSk7XG5cdGxvYWRlci5hZGRFdmVudExpc3RlbmVyKCdjb21wbGV0ZScsIGhhbmRsZUNvbXBsZXRlKTtcblx0bG9hZGVyLmxvYWRNYW5pZmVzdChtYW5pZmVzdCwgdHJ1ZSwgJ2Fzc2V0cy9pbWFnZXMvJyk7XG5cblx0Ly8gRGV0ZWN0IGtleXByZXNzOiBcblx0d2luZG93LmRvY3VtZW50Lm9ua2V5ZG93biA9IGhhbmRsZUtleURvd247XG5cdHdpbmRvdy5kb2N1bWVudC5vbmtleXVwID0gaGFuZGxlS2V5VXA7XG5cdHdpbmRvdy5kb2N1bWVudC5vbmNsaWNrID0gaGFuZGxlQ2xpY2s7XG59XG5cbmluaXQoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBDUkVBVEUgVEhFIFNUQUdFICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmZ1bmN0aW9uIGhhbmRsZUNvbXBsZXRlKGV2ZW50KSB7XG5cdFxuXHQvLyBDcmVhdGVzIGJhY2tncm91bmQgaW1hZ2UuIFxuXHRiYWNrZ3JvdW5kID0gbmV3IGNyZWF0ZWpzLlNoYXBlKCk7XG5cdHZhciBiYWNrZ3JvdW5kSW1nID0gbG9hZGVyLmdldFJlc3VsdCgnYmFja2dyb3VuZCcpO1xuXHRiYWNrZ3JvdW5kLmdyYXBoaWNzLmJlZ2luQml0bWFwRmlsbChiYWNrZ3JvdW5kSW1nKS5kcmF3UmVjdCgwLCAwLCBjYW52YXNXaWR0aCArIGJhY2tncm91bmRJbWcud2lkdGgsIGNhbnZhc0hlaWdodCArIGJhY2tncm91bmRJbWcuaGVpZ2h0KTtcblx0c3RhZ2UuYWRkQ2hpbGQoYmFja2dyb3VuZCk7XG5cblx0Ly8gQWRqdXN0bWVudCB0byBsaW5lIHRoZSBpbWFnZSBtZW50aW9uZWQgYWJvdmUuIFxuXHRiYWNrZ3JvdW5kLnkgPSAtMTA1O1xuXG5cdC8vIENyZWF0aW9uIG9mIHRoZSBwbGF5ZXIgdG8gcmVuZGVyIG9uIHRoZSBzY3JlZW4uIFxuXHRwbGF5ZXIgPSBuZXcgUGxheWVyKGxvYWRlci5nZXRSZXN1bHQoJ3BsYXllclNwcml0ZScpLCB7aHA6IDEwMCwgYXRrOiAxMCwgZGVmOiAxMH0sIHtkaXJlY3Rpb246ICdyaWdodCd9KTtcblx0cGxheWVyLmNyZWF0ZVNwcml0ZSh7XG5cdFx0ZnJhbWVyYXRlOiAzMCxcblx0XHRpbWFnZXM6IFtwbGF5ZXIuaW1hZ2VdLFxuXHRcdGZyYW1lczogcGxheWVyLnNwcml0ZXNoZWV0ZGF0YSxcblx0XHQvLyB4LCB5LCB3aWR0aCwgaGVpZ2h0LCBpbWFnZUluZGV4KiwgcmVnWCosIHJlZ1kqXG5cdFx0Ly8ge3JlZ1g6IDAsIGhlaWdodDogOTIsIGNvdW50OiAyNCwgcmVnWTogMCwgd2lkdGg6IDY0fSxcblx0XHRhbmltYXRpb25zOiB7XG5cdFx0XHRzdGFuZDogWzBdLFxuXHRcdFx0cnVuOiBbMSwgNiwgJ3J1bicsIDAuMjVdLFxuXHRcdFx0c2xhc2g6IFs3LCAxMywgJ3N0YW5kJywgMC4yNV0sXG5cdFx0XHRkZWFkOiBbMTQsIDE2LCAnZGVhZCcsIDAuMDFdXG5cdFx0fVxuXHR9LCAnc3RhbmQnLCB7eDogNjAsIHk6IDYwfSk7XG5cblx0c3RhZ2UuYWRkQ2hpbGQocGxheWVyLnNwcml0ZSk7XG5cblx0aHVkID0gbmV3IEhVRChsb2FkZXIuZ2V0UmVzdWx0KCdwb3J0cmFpdCcpLCBwbGF5ZXIuaHApO1xuXHRodWQucmVuZGVySFVEKGZ1bmN0aW9uKHBvcnRyYWl0LCBmdWxsSGVhbHRoLCBjdXJyZW50SGVhbHRoKSB7XG5cdFx0c3RhZ2UuYWRkQ2hpbGQoZnVsbEhlYWx0aCk7XG5cdFx0c3RhZ2UuYWRkQ2hpbGQoY3VycmVudEhlYWx0aCk7XG5cdFx0c3RhZ2UuYWRkQ2hpbGQocG9ydHJhaXQpO1xuXHR9KTtcblxuXHR2YXIgd3l2ZXJuID0gbmV3IE1vYihsb2FkZXIuZ2V0UmVzdWx0KCd3eXZlcm4nKSwge1xuXHRcdGhwOiAxMDAsXG5cdFx0YXRrOiA1MCxcblx0XHRkZWY6IDUwXG5cdH0pO1xuXG5cdHd5dmVybi5jcmVhdGVTcHJpdGUoe1xuXHRcdGZyYW1lcmF0ZTogMzAsXG5cdFx0aW1hZ2VzOiBbd3l2ZXJuLmltYWdlXSxcblx0XHRmcmFtZXM6IHt4OjAsIHk6IC0xMCwgcmVnWDogODYsIHdpZHRoOiAxNzAsIGhlaWdodDogMTkwfSxcblx0XHRhbmltYXRpb25zOiB7XG5cdFx0XHRzdGFuZDogWzAsIDAsICdob3AnLCAwLjFdLFxuXHRcdFx0Zmx5OiBbMCwgNSwgJ2ZseScsIDAuMl1cblx0XHR9XG5cdH0sICdmbHknLCB7eDogMjUwLCB5OiA4NH0pO1xuXG5cdHd5dmVybi5zcHJpdGUueCA9IDE1NTtcblx0d3l2ZXJuLnNwcml0ZS55ID0gNTtcblx0c3RhZ2UuYWRkQ2hpbGQod3l2ZXJuLnNwcml0ZSk7XG5cblx0c3RhZ2UudXBkYXRlKCk7XG5cbn1cblxuLy8gTW92ZXMgdGhlIHN0YWdlIGlmIHRoZSBwbGF5ZXIgaGFzIGdvbmUgYmV5b25kIGEgY2VydGFpbiBib3VuZGFyeSBvbiBlaXRoZXIgc2lkZSwgYnV0XG4vLyBvbmx5IHdoaWxlIHRoZXkgYXJlIHN0aWxsIG1vdmluZyBpbiB0aGF0IGRpcmVjdGlvbi4gXG5cbmZ1bmN0aW9uIG1vdmVTdGFnZSgpIHtcblxuXHRpZiAocGxheWVyLnNwcml0ZS54ID4gMTc1KSB7XG5cdFx0YmFja2dyb3VuZC54LS07XG5cdFx0ZW5lbWllcy5mb3JFYWNoKGZ1bmN0aW9uKG1vYikge1xuXHRcdFx0bW9iLnNwcml0ZS54LS07XG5cdFx0fSk7XG5cdFx0aWYgKGJhY2tncm91bmQueCA8IC05MDApIHtcblx0XHRcdGJhY2tncm91bmQueCA9IDA7IFxuXHRcdH1cblx0XHRpZiAocGxheWVyLnNwcml0ZS5jdXJyZW50QW5pbWF0aW9uID09PSAnc3RhbmQnIHx8IHBsYXllci5zcHJpdGUuY3VycmVudEFuaW1hdGlvbiA9PT0gJ3NsYXNoJykge1xuXHRcdFx0cGxheWVyLnNwcml0ZS54LS07XG5cdFx0fVxuXHR9IGVsc2UgaWYgKHBsYXllci5zcHJpdGUueCA8IDI1KSB7XG5cdFx0YmFja2dyb3VuZC54Kys7XG5cdFx0ZW5lbWllcy5mb3JFYWNoKGZ1bmN0aW9uKG1vYikge1xuXHRcdFx0bW9iLnNwcml0ZS54Kys7XG5cdFx0fSk7XG5cdFx0aWYgKGJhY2tncm91bmQueCA+IDApIHtcblx0XHRcdGJhY2tncm91bmQueCA9IC05MDA7XG5cdFx0fVxuXHRcdGlmIChwbGF5ZXIuc3ByaXRlLmN1cnJlbnRBbmltYXRpb24gPT09ICdzdGFuZCcpIHtcblx0XHRcdHBsYXllci5zcHJpdGUueCsrO1xuXHRcdH1cblx0fVxuXG59XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogSEFORExFIEtFWUJJTkRTICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmZ1bmN0aW9uIGhhbmRsZUtleURvd24oZXZlbnQpIHtcblx0aWYgKHBsYXllci5ocCA+IDApIHtcblx0XHRwbGF5ZXIuaGFuZGxlQW5pbWF0aW9uKGtleU1hcFtldmVudC5rZXlDb2RlXSwgJ3J1bicsIDEyLCAwKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoYW5kbGVLZXlVcChldmVudCkge1xuXHRpZiAocGxheWVyLmhwID4gMCkge1xuXHRcdHBsYXllci5oYW5kbGVBbmltYXRpb24oJ3N0b3AnLCAnc3RhbmQnLCAwKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoYW5kbGVDbGljayhldmVudCkge1xuXHRpZiAocGxheWVyLmhwID4gMCkge1xuXHRcdC8vIFB1cnBvc2Ugb2YgdGhlIGNhbGxiYWNrIGhlcmUgaXMgdG8gYmUgcGFzc2VkIHRocm91Z2ggaGFuZGxlQXR0YWNrIHRvIFxuXHRcdC8vIHRoZSBjb2xsaXNpb24gZGV0ZWN0b3IgdGhhdCB3aWxsIHRoZW4gY2FsbCB0aGUgY2FsbGJhY2sgaXMgdXNlZCB0b1xuXHRcdC8vIGRpc3BsYXkgdGV4dCBvbiB0aGUgc2NyZWVuLlxuXHRcdHBsYXllci5oYW5kbGVBdHRhY2soZW5lbWllcywgZnVuY3Rpb24oZGFtYWdlKSB7XG5cdFx0XHRodWQucmVuZGVyRGFtYWdlKGRhbWFnZSwgdGltZUVsYXBzZWQsIHtcblx0XHRcdFx0eDogcGxheWVyLnNwcml0ZS54ICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNTApIC0gMjUsXG5cdFx0XHRcdHk6IHBsYXllci5zcHJpdGUueSArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSAtIDI1XG5cdFx0XHR9LCBmdW5jdGlvbih0ZXh0KSB7XG5cdFx0XHRcdHN0YWdlLmFkZENoaWxkKHRleHQpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cbn1cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBFTkVNWSBTUEFXTlMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuLy8gRnVuY3Rpb24gd2lsbCBydW4gZXZlcnkgdGltZSB0aHJvdWdoIHRoZSByZW5kZXIgbG9vcCBhbmQsIGlmIGVuZW15IGNvdW50IGlzXG4vLyBiZWxvdyBhIHNwZWNpZmllZCBtYXgsIHJhbmRvbWx5IGdlbmVyYXRlIGEgbnVtYmVyIHRvIHRyeSB0byBtZWV0IGNvbmRpdGlvbnNcbi8vIGZvciBhbiBlbmVteSBzcGF3bi4gcmFuZEEgYW5kIHJhbmRCIGhlbHAgdG8gc2V0IHRoZSBwYXJhbWV0ZXJzIGZvclxuLy8gaG93IG9mdGVuIHNvbWV0aGluZyBzaG91bGQgaGFwcGVuLiBcbnZhciByYW5kb21pemVkU3Bhd24gPSBmdW5jdGlvbihtYXgsIHJhbmRBLCByYW5kQikge1xuXHRpZiAoZW5lbWllcy5sZW5ndGggPCBtYXgpIHtcblx0XHRpZiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmFuZEEpICUgcmFuZEIgPT09IDApIHtcblx0XHRcdHZhciBuZXdJZHggPSBlbmVtaWVzLmxlbmd0aDtcblx0XHRcdCQuZ2V0KCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvbW9icycsIHtuYW1lOiAnc2xpbWUnfSwgXG5cdFx0XHRcdGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHRlbmVtaWVzW25ld0lkeF0gPSBuZXcgTW9iKGxvYWRlci5nZXRSZXN1bHQoJ3NsaW1lJyksXG5cdFx0XHRcdFx0XHR7aHA6IGRhdGEucmVzdWx0LmhwLCBhdGs6IGRhdGEucmVzdWx0LmF0aywgZGVmOiBkYXRhLnJlc3VsdC5kZWZ9LFxuXHRcdFx0XHRcdFx0e2RpcmVjdGlvbjogJ2xlZnQnfVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0ZW5lbWllc1tuZXdJZHhdLmNyZWF0ZVNwcml0ZSh7XG5cdFx0XHRcdFx0XHRmcmFtZXJhdGU6IDMwLFxuXHRcdFx0XHRcdFx0aW1hZ2VzOiBbZW5lbWllc1tuZXdJZHhdLmltYWdlXSxcblx0XHRcdFx0XHRcdGZyYW1lczogSlNPTi5wYXJzZShkYXRhLnJlc3VsdC5zcHJpdGVzaGVldCksXG5cdFx0XHRcdFx0XHRhbmltYXRpb25zOiB7XG5cdFx0XHRcdFx0XHRcdHN0YW5kOiBbMCwgMCwgJ2hvcCcsIDAuMl0sXG5cdFx0XHRcdFx0XHRcdGhvcDogWzEsIDYsICdzdGFuZCcsIDAuMl1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCAnaG9wJywge3g6IDI1MCwgeTogODR9KTtcblx0XHRcdFx0XHRlbmVtaWVzW25ld0lkeF0uc3ByaXRlLnNjYWxlWCA9IDAuNTtcblx0XHRcdFx0XHRlbmVtaWVzW25ld0lkeF0uc3ByaXRlLnNjYWxlWSA9IDAuNTtcblx0XHRcdFx0XHRzdGFnZS5hZGRDaGlsZChlbmVtaWVzW25ld0lkeF0uc3ByaXRlKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxufTtcblxudmFyIHNldEJvc3NTcGF3biA9IGZ1bmN0aW9uKGludGVydmFsKSB7XG5cdGlmICh0aW1lRWxhcHNlZCAlIGludGVydmFsID09PSAwKSB7XG5cdFx0dmFyIG5ld0lkeCA9IGVuZW1pZXMubGVuZ3RoO1xuXHRcdCQuZ2V0KCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvbW9icycsIHtuYW1lOiAnc2xpbWUnfSwgXG5cdFx0XHRmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdGVuZW1pZXNbbmV3SWR4XSA9IG5ldyBNb2IobG9hZGVyLmdldFJlc3VsdCgnc2xpbWUnKSxcblx0XHRcdFx0XHR7aHA6IGRhdGEucmVzdWx0LmhwLCBhdGs6IGRhdGEucmVzdWx0LmF0aywgZGVmOiBkYXRhLnJlc3VsdC5kZWZ9LFxuXHRcdFx0XHRcdHtkaXJlY3Rpb246ICdsZWZ0J31cblx0XHRcdFx0KTtcblx0XHRcdFx0ZW5lbWllc1tuZXdJZHhdLmNyZWF0ZVNwcml0ZSh7XG5cdFx0XHRcdFx0ZnJhbWVyYXRlOiAzMCxcblx0XHRcdFx0XHRpbWFnZXM6IFtlbmVtaWVzW25ld0lkeF0uaW1hZ2VdLFxuXHRcdFx0XHRcdGZyYW1lczogSlNPTi5wYXJzZShkYXRhLnJlc3VsdC5zcHJpdGVzaGVldCksXG5cdFx0XHRcdFx0YW5pbWF0aW9uczoge1xuXHRcdFx0XHRcdFx0c3RhbmQ6IFswLCAwLCAnaG9wJywgMC4yXSxcblx0XHRcdFx0XHRcdGhvcDogWzEsIDYsICdzdGFuZCcsIDAuMl1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sICdob3AnLCB7eDogMjUwLCB5OiA4NH0pO1xuXHRcdFx0XHRlbmVtaWVzW25ld0lkeF0uc3ByaXRlLnNjYWxlWCA9IDAuNTtcblx0XHRcdFx0ZW5lbWllc1tuZXdJZHhdLnNwcml0ZS5zY2FsZVkgPSAwLjU7XG5cdFx0XHRcdHN0YWdlLmFkZENoaWxkKGVuZW1pZXNbbmV3SWR4XS5zcHJpdGUpO1xuXHRcdFx0fSk7XG5cdH1cbn1cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFJFTkRFUiBMT09QICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmNyZWF0ZWpzLlRpY2tlci5hZGRFdmVudExpc3RlbmVyKCd0aWNrJywgaGFuZGxlVGljayk7IFxuY3JlYXRlanMuVGlja2VyLnNldEZQUyg0NSk7XG5mdW5jdGlvbiBoYW5kbGVUaWNrKGV2ZW50KSB7XG5cblx0dmFyIGRlbHRhUyA9IGV2ZW50LmRlbHRhIC8gMTAwMDtcblxuXHR0aW1lRWxhcHNlZCsrO1xuXG5cdHJhbmRvbWl6ZWRTcGF3bigxMiwgMzAwLCAyNjkpO1xuXHRlbmVtaWVzLmZvckVhY2goZnVuY3Rpb24gbW92ZU1vYnMobW9iKSB7XG5cdFx0aWYgKG1vYi5zcHJpdGUueCA+IHBsYXllci5zcHJpdGUueCkge1xuXHRcdFx0bW9iLmhhbmRsZUFuaW1hdGlvbignbGVmdCcsICdob3AnLCAwLjUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRtb2IuaGFuZGxlQW5pbWF0aW9uKCdyaWdodCcsICdob3AnLCAwLjUpO1xuXHRcdH1cblx0fSk7XG5cblx0Ly8gcGxheWVyLmhhbmRsZVkoKTtcblxuXHRtb3ZlU3RhZ2UoKTtcblxuXHRpZiAodGltZUVsYXBzZWQgJSA1ID09PSAwKSB7XG5cdFx0cGxheWVyLmNvbGxpc2lvbnMoZW5lbWllcywgbnVsbCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRwbGF5ZXIuaGFuZGxlRGVhdGgoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRzdGFnZS5yZW1vdmVDaGlsZChwbGF5ZXIuc3ByaXRlKTtcblx0XHRcdFx0c3RhZ2UudXBkYXRlKCk7XG5cdFx0XHRcdGNyZWF0ZWpzLlRpY2tlci5zZXRQYXVzZWQodHJ1ZSk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0XHRodWQuY3VycmVudEhlYWx0aEJhci5zY2FsZVggPSBwbGF5ZXIuaHAgLyBwbGF5ZXIubWF4SFA7XG5cdH1cblxuXHQvLyBSZW1vdmUgYW55IGRlZmVhdGVkIGVuZW1pZXM6IFxuXHRlbmVtaWVzID0gZW5lbWllcy5maWx0ZXIoZnVuY3Rpb24gaGVhbHRoWmVybyhtb2IpIHtcblx0XHRpZiAobW9iLmhwIDw9IDApIHtcblx0XHRcdHN0YWdlLnJlbW92ZUNoaWxkKG1vYi5zcHJpdGUpO1xuXHRcdH1cblx0XHRyZXR1cm4gbW9iLmhwID4gMDtcblx0fSk7XG5cblx0Ly8gR28gdGhyb3VnaCB0aGUgZGFtYWdlIG51bWJlcnMgYW5kIHJlbW92ZSB0aGUgb25lcyB0aGF0IGhhdmUgc3RheWVkIG9uIHNjcmVlbiBcblx0Ly8gZm9yIHRvbyBsb25nLiBcblx0aWYgKHRpbWVFbGFwc2VkICUgNSA9PT0gMCkge1xuXHRcdGNvbnNvbGUubG9nKGh1ZC5kYW1hZ2VEaXNwbGF5KTtcblx0XHRodWQuZGFtYWdlRGlzcGxheSA9IGh1ZC5kYW1hZ2VEaXNwbGF5LmZpbHRlcihmdW5jdGlvbiByZW1vdmVPbGROdW0obnVtKSB7XG5cdFx0XHRpZiAodGltZUVsYXBzZWQgLSBudW0uY3JlYXRlZEF0ID4gNDUpIHtcblx0XHRcdFx0c3RhZ2UucmVtb3ZlQ2hpbGQobnVtLnRleHQpOyBcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aW1lRWxhcHNlZCAtIG51bS5jcmVhdGVkQXQgPD0gNDU7XG5cdFx0fSk7XG5cdH1cblxuXHRzdGFnZS51cGRhdGUoKTtcbn1cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIl19