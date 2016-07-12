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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NjcmlwdHMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUlBLElBQUksS0FBSixFQUFXLE1BQVgsRUFBbUIsV0FBbkIsRUFBZ0MsWUFBaEM7QUFDQSxJQUFJLFVBQUosRUFBZ0IsTUFBaEIsRUFBd0IsR0FBeEI7QUFDQSxJQUFJLFVBQVUsRUFBZDtBQUNBLElBQUksY0FBYyxDQUFsQjs7O0FBR0EsSUFBSSxTQUFTO0FBQ1osS0FBSSxNQURRO0FBRVosS0FBSSxPQUZRO0FBR1osS0FBSTtBQUhRLENBQWI7O0FBTUEsU0FBUyxJQUFULEdBQWdCOztBQUVmLFNBQVEsSUFBSSxTQUFTLEtBQWIsQ0FBbUIsZ0JBQW5CLENBQVI7OztBQUdBLGVBQWMsTUFBTSxNQUFOLENBQWEsS0FBM0I7QUFDQSxnQkFBZSxNQUFNLE1BQU4sQ0FBYSxNQUE1Qjs7OztBQUlBLEtBQUksV0FBVyxDQUNkLEVBQUMsS0FBSyxnQkFBTixFQUF3QixJQUFJLFlBQTVCLEVBRGMsRUFFZCxFQUFDLEtBQUssb0JBQU4sRUFBNEIsSUFBSSxjQUFoQyxFQUZjLEVBR2QsRUFBQyxLQUFLLG1CQUFOLEVBQTJCLElBQUksT0FBL0IsRUFIYyxFQUlkLEVBQUMsS0FBSyxZQUFOLEVBQW9CLElBQUksVUFBeEIsRUFKYyxDQUFmOztBQU9BLFVBQVMsSUFBSSxTQUFTLFNBQWIsQ0FBdUIsS0FBdkIsQ0FBVDtBQUNBLFFBQU8sZ0JBQVAsQ0FBd0IsVUFBeEIsRUFBb0MsY0FBcEM7QUFDQSxRQUFPLFlBQVAsQ0FBb0IsUUFBcEIsRUFBOEIsSUFBOUIsRUFBb0MsZ0JBQXBDOzs7QUFHQSxRQUFPLFFBQVAsQ0FBZ0IsU0FBaEIsR0FBNEIsYUFBNUI7QUFDQSxRQUFPLFFBQVAsQ0FBZ0IsT0FBaEIsR0FBMEIsV0FBMUI7QUFDQSxRQUFPLFFBQVAsQ0FBZ0IsT0FBaEIsR0FBMEIsV0FBMUI7QUFDQTs7QUFFRDs7OztBQUlBLFNBQVMsY0FBVCxDQUF3QixLQUF4QixFQUErQjs7O0FBRzlCLGNBQWEsSUFBSSxTQUFTLEtBQWIsRUFBYjtBQUNBLEtBQUksZ0JBQWdCLE9BQU8sU0FBUCxDQUFpQixZQUFqQixDQUFwQjtBQUNBLFlBQVcsUUFBWCxDQUFvQixlQUFwQixDQUFvQyxhQUFwQyxFQUFtRCxRQUFuRCxDQUE0RCxDQUE1RCxFQUErRCxDQUEvRCxFQUFrRSxjQUFjLGNBQWMsS0FBOUYsRUFBcUcsZUFBZSxjQUFjLE1BQWxJO0FBQ0EsT0FBTSxRQUFOLENBQWUsVUFBZjs7O0FBR0EsWUFBVyxDQUFYLEdBQWUsQ0FBQyxHQUFoQjs7O0FBR0EsVUFBUyxJQUFJLE1BQUosQ0FBVyxPQUFPLFNBQVAsQ0FBaUIsY0FBakIsQ0FBWCxFQUE2QyxFQUFDLElBQUksR0FBTCxFQUFVLEtBQUssRUFBZixFQUFtQixLQUFLLEVBQXhCLEVBQTdDLEVBQTBFLEVBQUMsV0FBVyxPQUFaLEVBQTFFLENBQVQ7QUFDQSxRQUFPLFlBQVAsQ0FBb0I7QUFDbkIsYUFBVyxFQURRO0FBRW5CLFVBQVEsQ0FBQyxPQUFPLEtBQVIsQ0FGVztBQUduQixVQUFRLE9BQU8sZUFISTs7O0FBTW5CLGNBQVk7QUFDWCxVQUFPLENBQUMsQ0FBRCxDQURJO0FBRVgsUUFBSyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sS0FBUCxFQUFjLElBQWQsQ0FGTTtBQUdYLFVBQU8sQ0FBQyxDQUFELEVBQUksRUFBSixFQUFRLE9BQVIsRUFBaUIsSUFBakIsQ0FISTtBQUlYLFNBQU0sQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLE1BQVQsRUFBaUIsSUFBakI7QUFKSztBQU5PLEVBQXBCLEVBWUcsT0FaSCxFQVlZLEVBQUMsR0FBRyxFQUFKLEVBQVEsR0FBRyxFQUFYLEVBWlo7O0FBY0EsT0FBTSxRQUFOLENBQWUsT0FBTyxNQUF0Qjs7QUFFQSxPQUFNLElBQUksR0FBSixDQUFRLE9BQU8sU0FBUCxDQUFpQixVQUFqQixDQUFSLEVBQXNDLE9BQU8sRUFBN0MsQ0FBTjtBQUNBLEtBQUksU0FBSixDQUFjLFVBQVMsUUFBVCxFQUFtQixVQUFuQixFQUErQixhQUEvQixFQUE4QztBQUMzRCxRQUFNLFFBQU4sQ0FBZSxVQUFmO0FBQ0EsUUFBTSxRQUFOLENBQWUsYUFBZjtBQUNBLFFBQU0sUUFBTixDQUFlLFFBQWY7QUFDQSxFQUpEOztBQU1BLE9BQU0sTUFBTjtBQUVBOzs7OztBQUtELFNBQVMsU0FBVCxHQUFxQjs7QUFFcEIsS0FBSSxPQUFPLE1BQVAsQ0FBYyxDQUFkLEdBQWtCLEdBQXRCLEVBQTJCO0FBQzFCLGFBQVcsQ0FBWDtBQUNBLFVBQVEsT0FBUixDQUFnQixVQUFTLEdBQVQsRUFBYztBQUM3QixPQUFJLE1BQUosQ0FBVyxDQUFYO0FBQ0EsR0FGRDtBQUdBLE1BQUksV0FBVyxDQUFYLEdBQWUsQ0FBQyxHQUFwQixFQUF5QjtBQUN4QixjQUFXLENBQVgsR0FBZSxDQUFmO0FBQ0E7QUFDRCxNQUFJLE9BQU8sTUFBUCxDQUFjLGdCQUFkLEtBQW1DLE9BQW5DLElBQThDLE9BQU8sTUFBUCxDQUFjLGdCQUFkLEtBQW1DLE9BQXJGLEVBQThGO0FBQzdGLFVBQU8sTUFBUCxDQUFjLENBQWQ7QUFDQTtBQUNELEVBWEQsTUFXTyxJQUFJLE9BQU8sTUFBUCxDQUFjLENBQWQsR0FBa0IsRUFBdEIsRUFBMEI7QUFDaEMsYUFBVyxDQUFYO0FBQ0EsVUFBUSxPQUFSLENBQWdCLFVBQVMsR0FBVCxFQUFjO0FBQzdCLE9BQUksTUFBSixDQUFXLENBQVg7QUFDQSxHQUZEO0FBR0EsTUFBSSxXQUFXLENBQVgsR0FBZSxDQUFuQixFQUFzQjtBQUNyQixjQUFXLENBQVgsR0FBZSxDQUFDLEdBQWhCO0FBQ0E7QUFDRCxNQUFJLE9BQU8sTUFBUCxDQUFjLGdCQUFkLEtBQW1DLE9BQXZDLEVBQWdEO0FBQy9DLFVBQU8sTUFBUCxDQUFjLENBQWQ7QUFDQTtBQUNEO0FBRUQ7Ozs7QUFJRCxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsRUFBOEI7QUFDN0IsS0FBSSxPQUFPLEVBQVAsR0FBWSxDQUFoQixFQUFtQjtBQUNsQixTQUFPLGVBQVAsQ0FBdUIsT0FBTyxNQUFNLE9BQWIsQ0FBdkIsRUFBOEMsS0FBOUMsRUFBcUQsRUFBckQsRUFBeUQsQ0FBekQ7QUFDQTtBQUNEOztBQUVELFNBQVMsV0FBVCxDQUFxQixLQUFyQixFQUE0QjtBQUMzQixLQUFJLE9BQU8sRUFBUCxHQUFZLENBQWhCLEVBQW1CO0FBQ2xCLFNBQU8sZUFBUCxDQUF1QixNQUF2QixFQUErQixPQUEvQixFQUF3QyxDQUF4QztBQUNBO0FBQ0Q7O0FBRUQsU0FBUyxXQUFULENBQXFCLEtBQXJCLEVBQTRCO0FBQzNCLEtBQUksT0FBTyxFQUFQLEdBQVksQ0FBaEIsRUFBbUI7QUFDbEIsU0FBTyxZQUFQLENBQW9CLE9BQXBCO0FBQ0E7QUFDRDs7Ozs7Ozs7QUFRRCxJQUFJLGtCQUFrQixTQUFsQixlQUFrQixDQUFTLEdBQVQsRUFBYyxLQUFkLEVBQXFCLEtBQXJCLEVBQTRCO0FBQ2pELEtBQUksUUFBUSxNQUFSLEdBQWlCLEdBQXJCLEVBQTBCO0FBQ3pCLE1BQUksS0FBSyxLQUFMLENBQVcsS0FBSyxNQUFMLEtBQWdCLEtBQTNCLElBQW9DLEtBQXBDLEtBQThDLENBQWxELEVBQXFEO0FBQ3BELE9BQUksU0FBUyxRQUFRLE1BQXJCO0FBQ0EsS0FBRSxHQUFGLENBQU0sNEJBQU4sRUFBb0MsRUFBQyxNQUFNLE9BQVAsRUFBcEMsRUFDQyxVQUFTLElBQVQsRUFBZTtBQUNkLFlBQVEsTUFBUixJQUFrQixJQUFJLEdBQUosQ0FBUSxPQUFPLFNBQVAsQ0FBaUIsT0FBakIsQ0FBUixFQUNqQixFQUFDLElBQUksS0FBSyxNQUFMLENBQVksRUFBakIsRUFBcUIsS0FBSyxLQUFLLE1BQUwsQ0FBWSxHQUF0QyxFQUEyQyxLQUFLLEtBQUssTUFBTCxDQUFZLEdBQTVELEVBRGlCLEVBRWpCLEVBQUMsV0FBVyxNQUFaLEVBRmlCLENBQWxCO0FBSUEsWUFBUSxNQUFSLEVBQWdCLFlBQWhCLENBQTZCO0FBQzVCLGdCQUFXLEVBRGlCO0FBRTVCLGFBQVEsQ0FBQyxRQUFRLE1BQVIsRUFBZ0IsS0FBakIsQ0FGb0I7QUFHNUIsYUFBUSxLQUFLLEtBQUwsQ0FBVyxLQUFLLE1BQUwsQ0FBWSxXQUF2QixDQUhvQjtBQUk1QixpQkFBWTtBQUNYLGFBQU8sQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLEtBQVAsRUFBYyxHQUFkLENBREk7QUFFWCxXQUFLLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxPQUFQLEVBQWdCLEdBQWhCO0FBRk07QUFKZ0IsS0FBN0IsRUFRRyxLQVJILEVBUVUsRUFBQyxHQUFHLEdBQUosRUFBUyxHQUFHLEVBQVosRUFSVjtBQVNBLFlBQVEsTUFBUixFQUFnQixNQUFoQixDQUF1QixNQUF2QixHQUFnQyxHQUFoQztBQUNBLFlBQVEsTUFBUixFQUFnQixNQUFoQixDQUF1QixNQUF2QixHQUFnQyxHQUFoQztBQUNBLFVBQU0sUUFBTixDQUFlLFFBQVEsTUFBUixFQUFnQixNQUEvQjtBQUNBLElBbEJGO0FBbUJBO0FBQ0Q7QUFDRCxDQXpCRDs7OztBQTZCQSxTQUFTLE1BQVQsQ0FBZ0IsZ0JBQWhCLENBQWlDLE1BQWpDLEVBQXlDLFVBQXpDO0FBQ0EsU0FBUyxNQUFULENBQWdCLE1BQWhCLENBQXVCLEVBQXZCO0FBQ0EsU0FBUyxVQUFULENBQW9CLEtBQXBCLEVBQTJCOztBQUUxQixLQUFJLFNBQVMsTUFBTSxLQUFOLEdBQWMsSUFBM0I7O0FBRUE7O0FBRUEsaUJBQWdCLENBQWhCLEVBQW1CLEdBQW5CLEVBQXdCLEdBQXhCO0FBQ0EsU0FBUSxPQUFSLENBQWdCLFNBQVMsUUFBVCxDQUFrQixHQUFsQixFQUF1QjtBQUN0QyxNQUFJLElBQUksTUFBSixDQUFXLENBQVgsR0FBZSxPQUFPLE1BQVAsQ0FBYyxDQUFqQyxFQUFvQztBQUNuQyxPQUFJLGVBQUosQ0FBb0IsTUFBcEIsRUFBNEIsS0FBNUIsRUFBbUMsR0FBbkM7QUFDQSxHQUZELE1BRU87QUFDTixPQUFJLGVBQUosQ0FBb0IsT0FBcEIsRUFBNkIsS0FBN0IsRUFBb0MsR0FBcEM7QUFDQTtBQUNELEVBTkQ7Ozs7QUFVQTs7QUFFQSxLQUFJLGNBQWMsQ0FBZCxLQUFvQixDQUF4QixFQUEyQjtBQUMxQixTQUFPLFVBQVAsQ0FBa0IsT0FBbEIsRUFBMkIsSUFBM0IsRUFBaUMsWUFBVztBQUMzQyxVQUFPLFdBQVAsQ0FBbUIsWUFBWTtBQUM5QixVQUFNLFdBQU4sQ0FBa0IsT0FBTyxNQUF6QjtBQUNBLFVBQU0sTUFBTjtBQUNBLGFBQVMsTUFBVCxDQUFnQixTQUFoQixDQUEwQixJQUExQjtBQUNBLElBSkQ7QUFLQSxHQU5EO0FBT0EsTUFBSSxnQkFBSixDQUFxQixNQUFyQixHQUE4QixPQUFPLEVBQVAsR0FBWSxPQUFPLEtBQWpEO0FBQ0E7OztBQUdELFdBQVUsUUFBUSxNQUFSLENBQWUsU0FBUyxVQUFULENBQW9CLEdBQXBCLEVBQXlCO0FBQ2pELE1BQUksSUFBSSxFQUFKLElBQVUsQ0FBZCxFQUFpQjtBQUNoQixTQUFNLFdBQU4sQ0FBa0IsSUFBSSxNQUF0QjtBQUNBO0FBQ0QsU0FBTyxJQUFJLEVBQUosR0FBUyxDQUFoQjtBQUNBLEVBTFMsQ0FBVjs7QUFRQSxPQUFNLE1BQU47QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBBUFAgSU5JVElBVElPTiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbi8vIFVzaW5nIGNyZWF0ZS5qcyB0byBzZXQgdXAgYW5kIHJlbmRlciBiYWNrZ3JvdW5kOiBcblxudmFyIHN0YWdlLCBsb2FkZXIsIGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQ7XG52YXIgYmFja2dyb3VuZCwgcGxheWVyLCBodWQ7XG52YXIgZW5lbWllcyA9IFtdO1xudmFyIHRpbWVFbGFwc2VkID0gMDtcblxuLy8gVGhlIHB1cnBvc2Ugb2Yga2V5TWFwIGlzIHRvIGhvbGQgdGhlIHBvc3NpYmxlIGtleXByZXNzZXMgZm9yIGtleWRvd24gZXZlbnRzIHRoYXQgbWF5IGhhcHBlbiBcbnZhciBrZXlNYXAgPSB7XG5cdDY1OiAnbGVmdCcsXG5cdDY4OiAncmlnaHQnLFxuXHQzMjogJ2p1bXAnXG59O1xuXG5mdW5jdGlvbiBpbml0KCkge1xuXG5cdHN0YWdlID0gbmV3IGNyZWF0ZWpzLlN0YWdlKCdmb3Jlc3QtZHVuZ2VvbicpO1xuXG5cdC8vIENhbnZhcyB3aWR0aCBhbmQgaGVpZ2h0IHN0b3JlZCBpbiB2YXIgdyBhbmQgaCBmb3IgZnV0dXJlIHVzZS4gXG5cdGNhbnZhc1dpZHRoID0gc3RhZ2UuY2FudmFzLndpZHRoO1xuXHRjYW52YXNIZWlnaHQgPSBzdGFnZS5jYW52YXMuaGVpZ2h0O1xuXG5cdC8vIE1hbmlmZXN0IHdpbGwgY3JlYXRlIGFuZCBzdG9yZSBiYWNrZ3JvdW5kIGltYWdlIGZvciBmdXR1cmUgdXNlLiBMb29rcyBsaWtlIFxuXHQvLyB0aGUgcmVuZGVyIHdpbGwgbmVlZCB0byBiZSBhZGp1c3RlZCB0byBhbGlnbiB0aGUgaW1hZ2UgcHJvcGVybHkuIFxuXHR2YXIgbWFuaWZlc3QgPSBbXG5cdFx0e3NyYzogJ2JhY2tncm91bmQucG5nJywgaWQ6ICdiYWNrZ3JvdW5kJ30sXG5cdFx0e3NyYzogJ2RlZmF1bHQtc3ByaXRlLnBuZycsIGlkOiAncGxheWVyU3ByaXRlJ30sXG5cdFx0e3NyYzogJ1NsaW1lQW5pbWF0ZWQucG5nJywgaWQ6ICdzbGltZSd9LFxuXHRcdHtzcmM6ICdjaHJvbTIuanBnJywgaWQ6ICdwb3J0cmFpdCd9XG5cdF07XG5cdC8vIExvYWRlciB3aWxsIHJlbmRlciB0aGUgbmVjZXNzYXJ5IGl0ZW1zIFxuXHRsb2FkZXIgPSBuZXcgY3JlYXRlanMuTG9hZFF1ZXVlKGZhbHNlKTtcblx0bG9hZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbXBsZXRlJywgaGFuZGxlQ29tcGxldGUpO1xuXHRsb2FkZXIubG9hZE1hbmlmZXN0KG1hbmlmZXN0LCB0cnVlLCAnYXNzZXRzL2ltYWdlcy8nKTtcblxuXHQvLyBEZXRlY3Qga2V5cHJlc3M6IFxuXHR3aW5kb3cuZG9jdW1lbnQub25rZXlkb3duID0gaGFuZGxlS2V5RG93bjtcblx0d2luZG93LmRvY3VtZW50Lm9ua2V5dXAgPSBoYW5kbGVLZXlVcDtcblx0d2luZG93LmRvY3VtZW50Lm9uY2xpY2sgPSBoYW5kbGVDbGljaztcbn1cblxuaW5pdCgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIENSRUFURSBUSEUgU1RBR0UgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuZnVuY3Rpb24gaGFuZGxlQ29tcGxldGUoZXZlbnQpIHtcblx0XG5cdC8vIENyZWF0ZXMgYmFja2dyb3VuZCBpbWFnZS4gXG5cdGJhY2tncm91bmQgPSBuZXcgY3JlYXRlanMuU2hhcGUoKTtcblx0dmFyIGJhY2tncm91bmRJbWcgPSBsb2FkZXIuZ2V0UmVzdWx0KCdiYWNrZ3JvdW5kJyk7XG5cdGJhY2tncm91bmQuZ3JhcGhpY3MuYmVnaW5CaXRtYXBGaWxsKGJhY2tncm91bmRJbWcpLmRyYXdSZWN0KDAsIDAsIGNhbnZhc1dpZHRoICsgYmFja2dyb3VuZEltZy53aWR0aCwgY2FudmFzSGVpZ2h0ICsgYmFja2dyb3VuZEltZy5oZWlnaHQpO1xuXHRzdGFnZS5hZGRDaGlsZChiYWNrZ3JvdW5kKTtcblxuXHQvLyBBZGp1c3RtZW50IHRvIGxpbmUgdGhlIGltYWdlIG1lbnRpb25lZCBhYm92ZS4gXG5cdGJhY2tncm91bmQueSA9IC0xMDU7XG5cblx0Ly8gQ3JlYXRpb24gb2YgdGhlIHBsYXllciB0byByZW5kZXIgb24gdGhlIHNjcmVlbi4gXG5cdHBsYXllciA9IG5ldyBQbGF5ZXIobG9hZGVyLmdldFJlc3VsdCgncGxheWVyU3ByaXRlJyksIHtocDogMTAwLCBhdGs6IDEwLCBkZWY6IDEwfSwge2RpcmVjdGlvbjogJ3JpZ2h0J30pO1xuXHRwbGF5ZXIuY3JlYXRlU3ByaXRlKHtcblx0XHRmcmFtZXJhdGU6IDMwLFxuXHRcdGltYWdlczogW3BsYXllci5pbWFnZV0sXG5cdFx0ZnJhbWVzOiBwbGF5ZXIuc3ByaXRlc2hlZXRkYXRhLFxuXHRcdC8vIHgsIHksIHdpZHRoLCBoZWlnaHQsIGltYWdlSW5kZXgqLCByZWdYKiwgcmVnWSpcblx0XHQvLyB7cmVnWDogMCwgaGVpZ2h0OiA5MiwgY291bnQ6IDI0LCByZWdZOiAwLCB3aWR0aDogNjR9LFxuXHRcdGFuaW1hdGlvbnM6IHtcblx0XHRcdHN0YW5kOiBbMF0sXG5cdFx0XHRydW46IFsxLCA2LCAncnVuJywgMC4yNV0sXG5cdFx0XHRzbGFzaDogWzcsIDEzLCAnc3RhbmQnLCAwLjI1XSxcblx0XHRcdGRlYWQ6IFsxNCwgMTYsICdkZWFkJywgMC4wMV1cblx0XHR9XG5cdH0sICdzdGFuZCcsIHt4OiA2MCwgeTogNjB9KTtcblxuXHRzdGFnZS5hZGRDaGlsZChwbGF5ZXIuc3ByaXRlKTtcblxuXHRodWQgPSBuZXcgSFVEKGxvYWRlci5nZXRSZXN1bHQoJ3BvcnRyYWl0JyksIHBsYXllci5ocCk7XG5cdGh1ZC5yZW5kZXJIVUQoZnVuY3Rpb24ocG9ydHJhaXQsIGZ1bGxIZWFsdGgsIGN1cnJlbnRIZWFsdGgpIHtcblx0XHRzdGFnZS5hZGRDaGlsZChmdWxsSGVhbHRoKTtcblx0XHRzdGFnZS5hZGRDaGlsZChjdXJyZW50SGVhbHRoKTtcblx0XHRzdGFnZS5hZGRDaGlsZChwb3J0cmFpdCk7XG5cdH0pO1xuXG5cdHN0YWdlLnVwZGF0ZSgpO1xuXG59XG5cbi8vIE1vdmVzIHRoZSBzdGFnZSBpZiB0aGUgcGxheWVyIGhhcyBnb25lIGJleW9uZCBhIGNlcnRhaW4gYm91bmRhcnkgb24gZWl0aGVyIHNpZGUsIGJ1dFxuLy8gb25seSB3aGlsZSB0aGV5IGFyZSBzdGlsbCBtb3ZpbmcgaW4gdGhhdCBkaXJlY3Rpb24uIFxuXG5mdW5jdGlvbiBtb3ZlU3RhZ2UoKSB7XG5cblx0aWYgKHBsYXllci5zcHJpdGUueCA+IDE3NSkge1xuXHRcdGJhY2tncm91bmQueC0tO1xuXHRcdGVuZW1pZXMuZm9yRWFjaChmdW5jdGlvbihtb2IpIHtcblx0XHRcdG1vYi5zcHJpdGUueC0tO1xuXHRcdH0pO1xuXHRcdGlmIChiYWNrZ3JvdW5kLnggPCAtOTAwKSB7XG5cdFx0XHRiYWNrZ3JvdW5kLnggPSAwOyBcblx0XHR9XG5cdFx0aWYgKHBsYXllci5zcHJpdGUuY3VycmVudEFuaW1hdGlvbiA9PT0gJ3N0YW5kJyB8fCBwbGF5ZXIuc3ByaXRlLmN1cnJlbnRBbmltYXRpb24gPT09ICdzbGFzaCcpIHtcblx0XHRcdHBsYXllci5zcHJpdGUueC0tO1xuXHRcdH1cblx0fSBlbHNlIGlmIChwbGF5ZXIuc3ByaXRlLnggPCAyNSkge1xuXHRcdGJhY2tncm91bmQueCsrO1xuXHRcdGVuZW1pZXMuZm9yRWFjaChmdW5jdGlvbihtb2IpIHtcblx0XHRcdG1vYi5zcHJpdGUueCsrO1xuXHRcdH0pO1xuXHRcdGlmIChiYWNrZ3JvdW5kLnggPiAwKSB7XG5cdFx0XHRiYWNrZ3JvdW5kLnggPSAtOTAwO1xuXHRcdH1cblx0XHRpZiAocGxheWVyLnNwcml0ZS5jdXJyZW50QW5pbWF0aW9uID09PSAnc3RhbmQnKSB7XG5cdFx0XHRwbGF5ZXIuc3ByaXRlLngrKztcblx0XHR9XG5cdH1cblxufVxuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIEhBTkRMRSBLRVlCSU5EUyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5mdW5jdGlvbiBoYW5kbGVLZXlEb3duKGV2ZW50KSB7XG5cdGlmIChwbGF5ZXIuaHAgPiAwKSB7XG5cdFx0cGxheWVyLmhhbmRsZUFuaW1hdGlvbihrZXlNYXBbZXZlbnQua2V5Q29kZV0sICdydW4nLCAxMiwgMCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlS2V5VXAoZXZlbnQpIHtcblx0aWYgKHBsYXllci5ocCA+IDApIHtcblx0XHRwbGF5ZXIuaGFuZGxlQW5pbWF0aW9uKCdzdG9wJywgJ3N0YW5kJywgMCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlQ2xpY2soZXZlbnQpIHtcblx0aWYgKHBsYXllci5ocCA+IDApIHtcblx0XHRwbGF5ZXIuaGFuZGxlQXR0YWNrKGVuZW1pZXMpO1xuXHR9XG59XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogRU5FTVkgU1BBV05TICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbi8vIEZ1bmN0aW9uIHdpbGwgcnVuIGV2ZXJ5IHRpbWUgdGhyb3VnaCB0aGUgcmVuZGVyIGxvb3AgYW5kLCBpZiBlbmVteSBjb3VudCBpc1xuLy8gYmVsb3cgYSBzcGVjaWZpZWQgbWF4LCByYW5kb21seSBnZW5lcmF0ZSBhIG51bWJlciB0byB0cnkgdG8gbWVldCBjb25kaXRpb25zXG4vLyBmb3IgYW4gZW5lbXkgc3Bhd24uIHJhbmRBIGFuZCByYW5kQiBoZWxwIHRvIHNldCB0aGUgcGFyYW1ldGVycyBmb3Jcbi8vIGhvdyBvZnRlbiBzb21ldGhpbmcgc2hvdWxkIGhhcHBlbi4gXG52YXIgcmFuZG9taXplZFNwYXduID0gZnVuY3Rpb24obWF4LCByYW5kQSwgcmFuZEIpIHtcblx0aWYgKGVuZW1pZXMubGVuZ3RoIDwgbWF4KSB7XG5cdFx0aWYgKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhbmRBKSAlIHJhbmRCID09PSAwKSB7XG5cdFx0XHR2YXIgbmV3SWR4ID0gZW5lbWllcy5sZW5ndGg7XG5cdFx0XHQkLmdldCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL21vYnMnLCB7bmFtZTogJ3NsaW1lJ30sIFxuXHRcdFx0XHRmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0ZW5lbWllc1tuZXdJZHhdID0gbmV3IE1vYihsb2FkZXIuZ2V0UmVzdWx0KCdzbGltZScpLFxuXHRcdFx0XHRcdFx0e2hwOiBkYXRhLnJlc3VsdC5ocCwgYXRrOiBkYXRhLnJlc3VsdC5hdGssIGRlZjogZGF0YS5yZXN1bHQuZGVmfSxcblx0XHRcdFx0XHRcdHtkaXJlY3Rpb246ICdsZWZ0J31cblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGVuZW1pZXNbbmV3SWR4XS5jcmVhdGVTcHJpdGUoe1xuXHRcdFx0XHRcdFx0ZnJhbWVyYXRlOiAzMCxcblx0XHRcdFx0XHRcdGltYWdlczogW2VuZW1pZXNbbmV3SWR4XS5pbWFnZV0sXG5cdFx0XHRcdFx0XHRmcmFtZXM6IEpTT04ucGFyc2UoZGF0YS5yZXN1bHQuc3ByaXRlc2hlZXQpLFxuXHRcdFx0XHRcdFx0YW5pbWF0aW9uczoge1xuXHRcdFx0XHRcdFx0XHRzdGFuZDogWzAsIDAsICdob3AnLCAwLjJdLFxuXHRcdFx0XHRcdFx0XHRob3A6IFsxLCA2LCAnc3RhbmQnLCAwLjJdXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSwgJ2hvcCcsIHt4OiAyNTAsIHk6IDg0fSk7XG5cdFx0XHRcdFx0ZW5lbWllc1tuZXdJZHhdLnNwcml0ZS5zY2FsZVggPSAwLjU7XG5cdFx0XHRcdFx0ZW5lbWllc1tuZXdJZHhdLnNwcml0ZS5zY2FsZVkgPSAwLjU7XG5cdFx0XHRcdFx0c3RhZ2UuYWRkQ2hpbGQoZW5lbWllc1tuZXdJZHhdLnNwcml0ZSk7XG5cdFx0XHRcdH0pO1xuXHRcdH1cblx0fVxufTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFJFTkRFUiBMT09QICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmNyZWF0ZWpzLlRpY2tlci5hZGRFdmVudExpc3RlbmVyKCd0aWNrJywgaGFuZGxlVGljayk7IFxuY3JlYXRlanMuVGlja2VyLnNldEZQUyg0NSk7XG5mdW5jdGlvbiBoYW5kbGVUaWNrKGV2ZW50KSB7XG5cblx0dmFyIGRlbHRhUyA9IGV2ZW50LmRlbHRhIC8gMTAwMDtcblxuXHR0aW1lRWxhcHNlZCsrO1xuXG5cdHJhbmRvbWl6ZWRTcGF3big0LCAzMDAsIDI2OSk7XG5cdGVuZW1pZXMuZm9yRWFjaChmdW5jdGlvbiBtb3ZlTW9icyhtb2IpIHtcblx0XHRpZiAobW9iLnNwcml0ZS54ID4gcGxheWVyLnNwcml0ZS54KSB7XG5cdFx0XHRtb2IuaGFuZGxlQW5pbWF0aW9uKCdsZWZ0JywgJ2hvcCcsIDAuNSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG1vYi5oYW5kbGVBbmltYXRpb24oJ3JpZ2h0JywgJ2hvcCcsIDAuNSk7XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBwbGF5ZXIuaGFuZGxlWSgpO1xuXG5cdG1vdmVTdGFnZSgpO1xuXG5cdGlmICh0aW1lRWxhcHNlZCAlIDUgPT09IDApIHtcblx0XHRwbGF5ZXIuY29sbGlzaW9ucyhlbmVtaWVzLCBudWxsLCBmdW5jdGlvbigpIHtcblx0XHRcdHBsYXllci5oYW5kbGVEZWF0aChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHN0YWdlLnJlbW92ZUNoaWxkKHBsYXllci5zcHJpdGUpO1xuXHRcdFx0XHRzdGFnZS51cGRhdGUoKTtcblx0XHRcdFx0Y3JlYXRlanMuVGlja2VyLnNldFBhdXNlZCh0cnVlKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHRcdGh1ZC5jdXJyZW50SGVhbHRoQmFyLnNjYWxlWCA9IHBsYXllci5ocCAvIHBsYXllci5tYXhIUDtcblx0fVxuXG5cdC8vIFJlbW92ZSBhbnkgZGVmZWF0ZWQgZW5lbWllczogXG5cdGVuZW1pZXMgPSBlbmVtaWVzLmZpbHRlcihmdW5jdGlvbiBoZWFsdGhaZXJvKG1vYikge1xuXHRcdGlmIChtb2IuaHAgPD0gMCkge1xuXHRcdFx0c3RhZ2UucmVtb3ZlQ2hpbGQobW9iLnNwcml0ZSk7XG5cdFx0fVxuXHRcdHJldHVybiBtb2IuaHAgPiAwO1xuXHR9KTtcblxuXG5cdHN0YWdlLnVwZGF0ZSgpO1xufVxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4iXX0=