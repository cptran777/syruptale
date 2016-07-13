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
					knockback: [12, 12, 'fly', 0.02]
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
		hud.damageDisplay = hud.damageDisplay.filter(function removeOldNum(num) {
			if (timeElapsed - num.createdAt > 45) {
				stage.removeChild(num.text);
			}
			return timeElapsed - num.createdAt <= 45;
		});
	}

	stage.update();
}
//# sourceMappingURL=data:application/json;base64,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QVMsQ0FBaEI7QUFDQSxFQUxTLENBQVY7Ozs7QUFTQSxLQUFJLGNBQWMsQ0FBZCxLQUFvQixDQUF4QixFQUEyQjtBQUMxQixNQUFJLGFBQUosR0FBb0IsSUFBSSxhQUFKLENBQWtCLE1BQWxCLENBQXlCLFNBQVMsWUFBVCxDQUFzQixHQUF0QixFQUEyQjtBQUN2RSxPQUFJLGNBQWMsSUFBSSxTQUFsQixHQUE4QixFQUFsQyxFQUFzQztBQUNyQyxVQUFNLFdBQU4sQ0FBa0IsSUFBSSxJQUF0QjtBQUNBO0FBQ0QsVUFBTyxjQUFjLElBQUksU0FBbEIsSUFBK0IsRUFBdEM7QUFDQSxHQUxtQixDQUFwQjtBQU1BOztBQUVELE9BQU0sTUFBTjtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqIEFQUCBJTklUSUFUSU9OICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuLy8gVXNpbmcgY3JlYXRlLmpzIHRvIHNldCB1cCBhbmQgcmVuZGVyIGJhY2tncm91bmQ6IFxuXG52YXIgc3RhZ2UsIGxvYWRlciwgY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodDtcbnZhciBiYWNrZ3JvdW5kLCBwbGF5ZXIsIGh1ZDtcbnZhciBlbmVtaWVzID0gW107XG52YXIgYm9zc2VzID0gW107XG52YXIgdGltZUVsYXBzZWQgPSAwO1xuXG4vLyBUaGUgcHVycG9zZSBvZiBrZXlNYXAgaXMgdG8gaG9sZCB0aGUgcG9zc2libGUga2V5cHJlc3NlcyBmb3Iga2V5ZG93biBldmVudHMgdGhhdCBtYXkgaGFwcGVuIFxudmFyIGtleU1hcCA9IHtcblx0NjU6ICdsZWZ0Jyxcblx0Njg6ICdyaWdodCcsXG5cdDMyOiAnanVtcCdcbn07XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG5cblx0c3RhZ2UgPSBuZXcgY3JlYXRlanMuU3RhZ2UoJ2ZvcmVzdC1kdW5nZW9uJyk7XG5cblx0Ly8gQ2FudmFzIHdpZHRoIGFuZCBoZWlnaHQgc3RvcmVkIGluIHZhciB3IGFuZCBoIGZvciBmdXR1cmUgdXNlLiBcblx0Y2FudmFzV2lkdGggPSBzdGFnZS5jYW52YXMud2lkdGg7XG5cdGNhbnZhc0hlaWdodCA9IHN0YWdlLmNhbnZhcy5oZWlnaHQ7XG5cblx0Ly8gTWFuaWZlc3Qgd2lsbCBjcmVhdGUgYW5kIHN0b3JlIGJhY2tncm91bmQgaW1hZ2UgZm9yIGZ1dHVyZSB1c2UuIExvb2tzIGxpa2UgXG5cdC8vIHRoZSByZW5kZXIgd2lsbCBuZWVkIHRvIGJlIGFkanVzdGVkIHRvIGFsaWduIHRoZSBpbWFnZSBwcm9wZXJseS4gXG5cdHZhciBtYW5pZmVzdCA9IFtcblx0XHR7c3JjOiAnYmFja2dyb3VuZC5wbmcnLCBpZDogJ2JhY2tncm91bmQnfSxcblx0XHR7c3JjOiAnZGVmYXVsdC1zcHJpdGUucG5nJywgaWQ6ICdwbGF5ZXJTcHJpdGUnfSxcblx0XHR7c3JjOiAnU2xpbWVBbmltYXRlZC5wbmcnLCBpZDogJ3NsaW1lJ30sXG5cdFx0e3NyYzogJ2Nocm9tMi5qcGcnLCBpZDogJ3BvcnRyYWl0J30sXG5cdFx0e3NyYzogJ3d5dmVybi5wbmcnLCBpZDogJ3d5dmVybid9XG5cdF07XG5cdC8vIExvYWRlciB3aWxsIHJlbmRlciB0aGUgbmVjZXNzYXJ5IGl0ZW1zIFxuXHRsb2FkZXIgPSBuZXcgY3JlYXRlanMuTG9hZFF1ZXVlKGZhbHNlKTtcblx0bG9hZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbXBsZXRlJywgaGFuZGxlQ29tcGxldGUpO1xuXHRsb2FkZXIubG9hZE1hbmlmZXN0KG1hbmlmZXN0LCB0cnVlLCAnYXNzZXRzL2ltYWdlcy8nKTtcblxuXHQvLyBEZXRlY3Qga2V5cHJlc3M6IFxuXHR3aW5kb3cuZG9jdW1lbnQub25rZXlkb3duID0gaGFuZGxlS2V5RG93bjtcblx0d2luZG93LmRvY3VtZW50Lm9ua2V5dXAgPSBoYW5kbGVLZXlVcDtcblx0d2luZG93LmRvY3VtZW50Lm9uY2xpY2sgPSBoYW5kbGVDbGljaztcbn1cblxuaW5pdCgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIENSRUFURSBUSEUgU1RBR0UgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuZnVuY3Rpb24gaGFuZGxlQ29tcGxldGUoZXZlbnQpIHtcblx0XG5cdC8vIENyZWF0ZXMgYmFja2dyb3VuZCBpbWFnZS4gXG5cdGJhY2tncm91bmQgPSBuZXcgY3JlYXRlanMuU2hhcGUoKTtcblx0dmFyIGJhY2tncm91bmRJbWcgPSBsb2FkZXIuZ2V0UmVzdWx0KCdiYWNrZ3JvdW5kJyk7XG5cdGJhY2tncm91bmQuZ3JhcGhpY3MuYmVnaW5CaXRtYXBGaWxsKGJhY2tncm91bmRJbWcpLmRyYXdSZWN0KDAsIDAsIGNhbnZhc1dpZHRoICsgYmFja2dyb3VuZEltZy53aWR0aCwgY2FudmFzSGVpZ2h0ICsgYmFja2dyb3VuZEltZy5oZWlnaHQpO1xuXHRzdGFnZS5hZGRDaGlsZChiYWNrZ3JvdW5kKTtcblxuXHQvLyBBZGp1c3RtZW50IHRvIGxpbmUgdGhlIGltYWdlIG1lbnRpb25lZCBhYm92ZS4gXG5cdGJhY2tncm91bmQueSA9IC0xMDU7XG5cblx0Ly8gQ3JlYXRpb24gb2YgdGhlIHBsYXllciB0byByZW5kZXIgb24gdGhlIHNjcmVlbi4gXG5cdHBsYXllciA9IG5ldyBQbGF5ZXIobG9hZGVyLmdldFJlc3VsdCgncGxheWVyU3ByaXRlJyksIHtocDogMTAwLCBhdGs6IDEwLCBkZWY6IDEwfSwge2RpcmVjdGlvbjogJ3JpZ2h0J30pO1xuXHRwbGF5ZXIuY3JlYXRlU3ByaXRlKHtcblx0XHRmcmFtZXJhdGU6IDMwLFxuXHRcdGltYWdlczogW3BsYXllci5pbWFnZV0sXG5cdFx0ZnJhbWVzOiBwbGF5ZXIuc3ByaXRlc2hlZXRkYXRhLFxuXHRcdC8vIHgsIHksIHdpZHRoLCBoZWlnaHQsIGltYWdlSW5kZXgqLCByZWdYKiwgcmVnWSpcblx0XHQvLyB7cmVnWDogMCwgaGVpZ2h0OiA5MiwgY291bnQ6IDI0LCByZWdZOiAwLCB3aWR0aDogNjR9LFxuXHRcdGFuaW1hdGlvbnM6IHtcblx0XHRcdHN0YW5kOiBbMF0sXG5cdFx0XHRydW46IFsxLCA2LCAncnVuJywgMC4yNV0sXG5cdFx0XHRzbGFzaDogWzcsIDEzLCAnc3RhbmQnLCAwLjI1XSxcblx0XHRcdGRlYWQ6IFsxNCwgMTYsICdkZWFkJywgMC4wNV1cblx0XHR9XG5cdH0sICdzdGFuZCcsIHt4OiA2MCwgeTogNjB9KTtcblxuXHRzdGFnZS5hZGRDaGlsZChwbGF5ZXIuc3ByaXRlKTtcblxuXHRodWQgPSBuZXcgSFVEKGxvYWRlci5nZXRSZXN1bHQoJ3BvcnRyYWl0JyksIHBsYXllci5ocCk7XG5cdGh1ZC5yZW5kZXJIVUQoZnVuY3Rpb24ocG9ydHJhaXQsIGZ1bGxIZWFsdGgsIGN1cnJlbnRIZWFsdGgpIHtcblx0XHRzdGFnZS5hZGRDaGlsZChmdWxsSGVhbHRoKTtcblx0XHRzdGFnZS5hZGRDaGlsZChjdXJyZW50SGVhbHRoKTtcblx0XHRzdGFnZS5hZGRDaGlsZChwb3J0cmFpdCk7XG5cdH0pO1xuXG5cdC8vIHZhciB3eXZlcm4gPSBuZXcgTW9iKGxvYWRlci5nZXRSZXN1bHQoJ3d5dmVybicpLCB7XG5cdC8vIFx0aHA6IDEwMCxcblx0Ly8gXHRhdGs6IDUwLFxuXHQvLyBcdGRlZjogNTBcblx0Ly8gfSk7XG5cblx0Ly8gd3l2ZXJuLmNyZWF0ZVNwcml0ZSh7XG5cdC8vIFx0ZnJhbWVyYXRlOiAzMCxcblx0Ly8gXHRpbWFnZXM6IFt3eXZlcm4uaW1hZ2VdLFxuXHQvLyBcdGZyYW1lczoge3g6MCwgeTogLTEwLCByZWdYOiA4NiwgY291bnQ6IDI0LCB3aWR0aDogMTcwLCBoZWlnaHQ6IDE3NX0sXG5cdC8vIFx0YW5pbWF0aW9uczoge1xuXHQvLyBcdFx0Zmx5OiBbMCwgNSwgJ2ZseScsIDAuMl0sXG5cdC8vIFx0XHRrbm9ja2JhY2s6IFsxMiwgMTIsICdmbHknLCAwLjAyXVxuXHQvLyBcdH1cblx0Ly8gfSwgJ2ZseScsIHt4OiAyNTAsIHk6IDR9KTtcblxuXHQvLyB3eXZlcm4uc3ByaXRlLnNjYWxlWCA9IDAuNzU7XG5cdC8vIHd5dmVybi5zcHJpdGUuc2NhbGVZID0gMC43NTtcblx0Ly8gc3RhZ2UuYWRkQ2hpbGQod3l2ZXJuLnNwcml0ZSk7XG5cblx0c3RhZ2UudXBkYXRlKCk7XG5cbn1cblxuLy8gTW92ZXMgdGhlIHN0YWdlIGlmIHRoZSBwbGF5ZXIgaGFzIGdvbmUgYmV5b25kIGEgY2VydGFpbiBib3VuZGFyeSBvbiBlaXRoZXIgc2lkZSwgYnV0XG4vLyBvbmx5IHdoaWxlIHRoZXkgYXJlIHN0aWxsIG1vdmluZyBpbiB0aGF0IGRpcmVjdGlvbi4gXG5cbmZ1bmN0aW9uIG1vdmVTdGFnZSgpIHtcblxuXHRpZiAocGxheWVyLnNwcml0ZS54ID4gMTc1KSB7XG5cdFx0YmFja2dyb3VuZC54LS07XG5cdFx0ZW5lbWllcy5mb3JFYWNoKGZ1bmN0aW9uKG1vYikge1xuXHRcdFx0bW9iLnNwcml0ZS54LS07XG5cdFx0fSk7XG5cdFx0aWYgKGJhY2tncm91bmQueCA8IC05MDApIHtcblx0XHRcdGJhY2tncm91bmQueCA9IDA7IFxuXHRcdH1cblx0XHRpZiAocGxheWVyLnNwcml0ZS5jdXJyZW50QW5pbWF0aW9uID09PSAnc3RhbmQnIHx8IHBsYXllci5zcHJpdGUuY3VycmVudEFuaW1hdGlvbiA9PT0gJ3NsYXNoJykge1xuXHRcdFx0cGxheWVyLnNwcml0ZS54LS07XG5cdFx0fVxuXHR9IGVsc2UgaWYgKHBsYXllci5zcHJpdGUueCA8IDI1KSB7XG5cdFx0YmFja2dyb3VuZC54Kys7XG5cdFx0ZW5lbWllcy5mb3JFYWNoKGZ1bmN0aW9uKG1vYikge1xuXHRcdFx0bW9iLnNwcml0ZS54Kys7XG5cdFx0fSk7XG5cdFx0aWYgKGJhY2tncm91bmQueCA+IDApIHtcblx0XHRcdGJhY2tncm91bmQueCA9IC05MDA7XG5cdFx0fVxuXHRcdGlmIChwbGF5ZXIuc3ByaXRlLmN1cnJlbnRBbmltYXRpb24gPT09ICdzdGFuZCcpIHtcblx0XHRcdHBsYXllci5zcHJpdGUueCsrO1xuXHRcdH1cblx0fVxuXG59XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogSEFORExFIEtFWUJJTkRTICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmZ1bmN0aW9uIGhhbmRsZUtleURvd24oZXZlbnQpIHtcblx0aWYgKHBsYXllci5ocCA+IDApIHtcblx0XHRwbGF5ZXIuaGFuZGxlQW5pbWF0aW9uKGtleU1hcFtldmVudC5rZXlDb2RlXSwgJ3J1bicsIDEyLCAwKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoYW5kbGVLZXlVcChldmVudCkge1xuXHRpZiAocGxheWVyLmhwID4gMCkge1xuXHRcdHBsYXllci5oYW5kbGVBbmltYXRpb24oJ3N0b3AnLCAnc3RhbmQnLCAwKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoYW5kbGVDbGljayhldmVudCkge1xuXHRpZiAocGxheWVyLmhwID4gMCkge1xuXHRcdC8vIFB1cnBvc2Ugb2YgdGhlIGNhbGxiYWNrIGhlcmUgaXMgdG8gYmUgcGFzc2VkIHRocm91Z2ggaGFuZGxlQXR0YWNrIHRvIFxuXHRcdC8vIHRoZSBjb2xsaXNpb24gZGV0ZWN0b3IgdGhhdCB3aWxsIHRoZW4gY2FsbCB0aGUgY2FsbGJhY2sgaXMgdXNlZCB0b1xuXHRcdC8vIGRpc3BsYXkgdGV4dCBvbiB0aGUgc2NyZWVuLlxuXHRcdHBsYXllci5oYW5kbGVBdHRhY2soZW5lbWllcywgZnVuY3Rpb24oZGFtYWdlKSB7XG5cdFx0XHRodWQucmVuZGVyRGFtYWdlKGRhbWFnZSwgdGltZUVsYXBzZWQsIHtcblx0XHRcdFx0eDogcGxheWVyLnNwcml0ZS54ICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNTApIC0gMjUsXG5cdFx0XHRcdHk6IHBsYXllci5zcHJpdGUueSArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSAtIDI1XG5cdFx0XHR9LCBmdW5jdGlvbih0ZXh0KSB7XG5cdFx0XHRcdHN0YWdlLmFkZENoaWxkKHRleHQpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cbn1cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBFTkVNWSBTUEFXTlMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuLy8gRnVuY3Rpb24gd2lsbCBydW4gZXZlcnkgdGltZSB0aHJvdWdoIHRoZSByZW5kZXIgbG9vcCBhbmQsIGlmIGVuZW15IGNvdW50IGlzXG4vLyBiZWxvdyBhIHNwZWNpZmllZCBtYXgsIHJhbmRvbWx5IGdlbmVyYXRlIGEgbnVtYmVyIHRvIHRyeSB0byBtZWV0IGNvbmRpdGlvbnNcbi8vIGZvciBhbiBlbmVteSBzcGF3bi4gcmFuZEEgYW5kIHJhbmRCIGhlbHAgdG8gc2V0IHRoZSBwYXJhbWV0ZXJzIGZvclxuLy8gaG93IG9mdGVuIHNvbWV0aGluZyBzaG91bGQgaGFwcGVuLiBcbnZhciByYW5kb21pemVkU3Bhd24gPSBmdW5jdGlvbihtYXgsIHJhbmRBLCByYW5kQikge1xuXHRpZiAoZW5lbWllcy5sZW5ndGggPCBtYXgpIHtcblx0XHRpZiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmFuZEEpICUgcmFuZEIgPT09IDApIHtcblx0XHRcdHZhciBuZXdJZHggPSBlbmVtaWVzLmxlbmd0aDtcblx0XHRcdCQuZ2V0KCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvbW9icycsIHtuYW1lOiAnc2xpbWUnfSwgXG5cdFx0XHRcdGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHRlbmVtaWVzW25ld0lkeF0gPSBuZXcgTW9iKGxvYWRlci5nZXRSZXN1bHQoJ3NsaW1lJyksXG5cdFx0XHRcdFx0XHR7aHA6IGRhdGEucmVzdWx0LmhwLCBhdGs6IGRhdGEucmVzdWx0LmF0aywgZGVmOiBkYXRhLnJlc3VsdC5kZWZ9LFxuXHRcdFx0XHRcdFx0e2RpcmVjdGlvbjogJ2xlZnQnfVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0ZW5lbWllc1tuZXdJZHhdLmNyZWF0ZVNwcml0ZSh7XG5cdFx0XHRcdFx0XHRmcmFtZXJhdGU6IDMwLFxuXHRcdFx0XHRcdFx0aW1hZ2VzOiBbZW5lbWllc1tuZXdJZHhdLmltYWdlXSxcblx0XHRcdFx0XHRcdGZyYW1lczogSlNPTi5wYXJzZShkYXRhLnJlc3VsdC5zcHJpdGVzaGVldCksXG5cdFx0XHRcdFx0XHRhbmltYXRpb25zOiB7XG5cdFx0XHRcdFx0XHRcdHN0YW5kOiBbMCwgMCwgJ2hvcCcsIDAuMl0sXG5cdFx0XHRcdFx0XHRcdGhvcDogWzEsIDYsICdzdGFuZCcsIDAuMl1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCAnaG9wJywge3g6IDI1MCwgeTogODR9KTtcblx0XHRcdFx0XHRlbmVtaWVzW25ld0lkeF0uc3ByaXRlLnNjYWxlWCA9IDAuNTtcblx0XHRcdFx0XHRlbmVtaWVzW25ld0lkeF0uc3ByaXRlLnNjYWxlWSA9IDAuNTtcblx0XHRcdFx0XHRzdGFnZS5hZGRDaGlsZChlbmVtaWVzW25ld0lkeF0uc3ByaXRlKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxufTtcblxudmFyIHNldEJvc3NTcGF3biA9IGZ1bmN0aW9uKGludGVydmFsLCBtYXgpIHtcblx0aWYgKHRpbWVFbGFwc2VkICUgaW50ZXJ2YWwgPT09IDAgJiYgKG1heCA/IGJvc3Nlcy5sZW5ndGggPCBtYXggOiB0cnVlKSkge1xuXHRcdHZhciBuZXdJZHggPSBib3NzZXMubGVuZ3RoO1xuXHRcdCQuZ2V0KCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvbW9icycsIHtuYW1lOiAnd3l2ZXJuJ30sIFxuXHRcdFx0ZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRib3NzZXNbbmV3SWR4XSA9IG5ldyBCb3NzKGxvYWRlci5nZXRSZXN1bHQoJ3d5dmVybicpLFxuXHRcdFx0XHRcdHtocDogZGF0YS5yZXN1bHQuaHAsIGF0azogZGF0YS5yZXN1bHQuYXRrLCBkZWY6IGRhdGEucmVzdWx0LmRlZn0sXG5cdFx0XHRcdFx0e2RpcmVjdGlvbjogJ2xlZnQnfVxuXHRcdFx0XHQpO1xuXHRcdFx0XHRib3NzZXNbbmV3SWR4XS5jcmVhdGVTcHJpdGUoe1xuXHRcdFx0XHRcdGZyYW1lcmF0ZTogMzAsXG5cdFx0XHRcdFx0aW1hZ2VzOiBbYm9zc2VzW25ld0lkeF0uaW1hZ2VdLFxuXHRcdFx0XHRcdGZyYW1lczogSlNPTi5wYXJzZShkYXRhLnJlc3VsdC5zcHJpdGVzaGVldCksXG5cdFx0XHRcdFx0YW5pbWF0aW9uczoge1xuXHRcdFx0XHRcdFx0Zmx5OiBbMCwgNSwgJ2ZseScsIDAuMl0sXG5cdFx0XHRcdFx0XHRrbm9ja2JhY2s6IFsxMiwgMTIsICdmbHknLCAwLjAyXVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgJ2ZseScsIHt4OiAyNTAsIHk6IDR9KTtcblx0XHRcdFx0Ym9zc2VzW25ld0lkeF0uc3ByaXRlLnNjYWxlWCA9IDAuNzU7XG5cdFx0XHRcdGJvc3Nlc1tuZXdJZHhdLnNwcml0ZS5zY2FsZVkgPSAwLjc1O1xuXHRcdFx0XHRzdGFnZS5hZGRDaGlsZChib3NzZXNbbmV3SWR4XS5zcHJpdGUpO1xuXHRcdFx0fSk7XG5cdH1cbn1cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFJFTkRFUiBMT09QICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmNyZWF0ZWpzLlRpY2tlci5hZGRFdmVudExpc3RlbmVyKCd0aWNrJywgaGFuZGxlVGljayk7IFxuY3JlYXRlanMuVGlja2VyLnNldEZQUyg0NSk7XG5mdW5jdGlvbiBoYW5kbGVUaWNrKGV2ZW50KSB7XG5cblx0dmFyIGRlbHRhUyA9IGV2ZW50LmRlbHRhIC8gMTAwMDtcblxuXHR0aW1lRWxhcHNlZCsrO1xuXG5cdHJhbmRvbWl6ZWRTcGF3bigxMiwgMzAwLCAyNjkpO1xuXHRzZXRCb3NzU3Bhd24oMjAwLCAxKTtcblx0ZW5lbWllcy5mb3JFYWNoKGZ1bmN0aW9uIG1vdmVNb2JzKG1vYikge1xuXHRcdGlmIChtb2Iuc3ByaXRlLnggPiBwbGF5ZXIuc3ByaXRlLngpIHtcblx0XHRcdG1vYi5oYW5kbGVBbmltYXRpb24oJ2xlZnQnLCAnaG9wJywgMC41KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bW9iLmhhbmRsZUFuaW1hdGlvbigncmlnaHQnLCAnaG9wJywgMC41KTtcblx0XHR9XG5cdH0pO1xuXG5cdC8vIHBsYXllci5oYW5kbGVZKCk7XG5cblx0bW92ZVN0YWdlKCk7XG5cblx0aWYgKHRpbWVFbGFwc2VkICUgNSA9PT0gMCkge1xuXHRcdHBsYXllci5jb2xsaXNpb25zKGVuZW1pZXMsIG51bGwsIGZ1bmN0aW9uKCkge1xuXHRcdFx0cGxheWVyLmhhbmRsZURlYXRoKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0c3RhZ2UucmVtb3ZlQ2hpbGQocGxheWVyLnNwcml0ZSk7XG5cdFx0XHRcdHN0YWdlLnVwZGF0ZSgpO1xuXHRcdFx0XHRjcmVhdGVqcy5UaWNrZXIuc2V0UGF1c2VkKHRydWUpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdFx0aHVkLmN1cnJlbnRIZWFsdGhCYXIuc2NhbGVYID0gcGxheWVyLmhwIC8gcGxheWVyLm1heEhQO1xuXHR9XG5cblx0Ly8gUmVtb3ZlIGFueSBkZWZlYXRlZCBlbmVtaWVzOiBcblx0ZW5lbWllcyA9IGVuZW1pZXMuZmlsdGVyKGZ1bmN0aW9uIGhlYWx0aFplcm8obW9iKSB7XG5cdFx0aWYgKG1vYi5ocCA8PSAwKSB7XG5cdFx0XHRzdGFnZS5yZW1vdmVDaGlsZChtb2Iuc3ByaXRlKTtcblx0XHR9XG5cdFx0cmV0dXJuIG1vYi5ocCA+IDA7XG5cdH0pO1xuXG5cdC8vIEdvIHRocm91Z2ggdGhlIGRhbWFnZSBudW1iZXJzIGFuZCByZW1vdmUgdGhlIG9uZXMgdGhhdCBoYXZlIHN0YXllZCBvbiBzY3JlZW4gXG5cdC8vIGZvciB0b28gbG9uZy4gXG5cdGlmICh0aW1lRWxhcHNlZCAlIDUgPT09IDApIHtcblx0XHRodWQuZGFtYWdlRGlzcGxheSA9IGh1ZC5kYW1hZ2VEaXNwbGF5LmZpbHRlcihmdW5jdGlvbiByZW1vdmVPbGROdW0obnVtKSB7XG5cdFx0XHRpZiAodGltZUVsYXBzZWQgLSBudW0uY3JlYXRlZEF0ID4gNDUpIHtcblx0XHRcdFx0c3RhZ2UucmVtb3ZlQ2hpbGQobnVtLnRleHQpOyBcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aW1lRWxhcHNlZCAtIG51bS5jcmVhdGVkQXQgPD0gNDU7XG5cdFx0fSk7XG5cdH1cblxuXHRzdGFnZS51cGRhdGUoKTtcbn1cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIl19