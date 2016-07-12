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
	player.handleAttack();
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
			$.get('http://127.0.0.1:3000/mobs', { name: 'slime' }, function (data) {
				console.log('get request successful');
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
				console.log(enemies[newIdx].sprite);
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
	enemies.forEach(function moveMobs(mob) {
		if (mob.sprite.x > player.sprite.x) {
			mob.handleAnimation('left', 'hop', 1);
		} else {
			mob.handleAnimation('right', 'hop', 1);
		}
	});

	stage.update();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NjcmlwdHMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUlBLElBQUksS0FBSixFQUFXLE1BQVgsRUFBbUIsV0FBbkIsRUFBZ0MsWUFBaEM7QUFDQSxJQUFJLFVBQUosRUFBZ0IsTUFBaEI7QUFDQSxJQUFJLFVBQVUsRUFBZDs7O0FBR0EsSUFBSSxTQUFTO0FBQ1osS0FBSSxNQURRO0FBRVosS0FBSTtBQUZRLENBQWI7QUFJQSxJQUFJLFFBQVEsQ0FBWjs7QUFFQSxTQUFTLElBQVQsR0FBZ0I7O0FBRWYsU0FBUSxJQUFJLFNBQVMsS0FBYixDQUFtQixnQkFBbkIsQ0FBUjs7O0FBR0EsZUFBYyxNQUFNLE1BQU4sQ0FBYSxLQUEzQjtBQUNBLGdCQUFlLE1BQU0sTUFBTixDQUFhLE1BQTVCOzs7O0FBSUEsS0FBSSxXQUFXLENBQ2QsRUFBQyxLQUFLLGdCQUFOLEVBQXdCLElBQUksWUFBNUIsRUFEYyxFQUVkLEVBQUMsS0FBSyxvQkFBTixFQUE0QixJQUFJLGNBQWhDLEVBRmMsRUFHZCxFQUFDLEtBQUssbUJBQU4sRUFBMkIsSUFBSSxPQUEvQixFQUhjLENBQWY7O0FBTUEsVUFBUyxJQUFJLFNBQVMsU0FBYixDQUF1QixLQUF2QixDQUFUO0FBQ0EsUUFBTyxnQkFBUCxDQUF3QixVQUF4QixFQUFvQyxjQUFwQztBQUNBLFFBQU8sWUFBUCxDQUFvQixRQUFwQixFQUE4QixJQUE5QixFQUFvQyxnQkFBcEM7OztBQUdBLFFBQU8sUUFBUCxDQUFnQixTQUFoQixHQUE0QixhQUE1QjtBQUNBLFFBQU8sUUFBUCxDQUFnQixPQUFoQixHQUEwQixXQUExQjtBQUNBLFFBQU8sUUFBUCxDQUFnQixPQUFoQixHQUEwQixXQUExQjtBQUNBOztBQUVEOzs7O0FBSUEsU0FBUyxjQUFULENBQXdCLEtBQXhCLEVBQStCOzs7QUFHOUIsY0FBYSxJQUFJLFNBQVMsS0FBYixFQUFiO0FBQ0EsS0FBSSxnQkFBZ0IsT0FBTyxTQUFQLENBQWlCLFlB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QUFoQjtBQUZNO0FBSmdCLEtBQTdCLEVBUUcsS0FSSCxFQVFVLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxFQUFaLEVBUlY7QUFTQSxZQUFRLEdBQVIsQ0FBWSxRQUFRLE1BQVIsRUFBZ0IsTUFBNUI7QUFDQSxZQUFRLE1BQVIsRUFBZ0IsTUFBaEIsQ0FBdUIsTUFBdkIsR0FBZ0MsR0FBaEM7QUFDQSxZQUFRLE1BQVIsRUFBZ0IsTUFBaEIsQ0FBdUIsTUFBdkIsR0FBZ0MsR0FBaEM7QUFDQSxVQUFNLFFBQU4sQ0FBZSxRQUFRLE1BQVIsRUFBZ0IsTUFBL0I7QUFDQSxJQXBCRjtBQXFCQTtBQUNEO0FBQ0QsQ0E1QkQ7Ozs7QUFnQ0EsU0FBUyxNQUFULENBQWdCLGdCQUFoQixDQUFpQyxNQUFqQyxFQUF5QyxVQUF6QztBQUNBLFNBQVMsVUFBVCxDQUFvQixLQUFwQixFQUEyQjs7QUFFMUIsS0FBSSxTQUFTLE1BQU0sS0FBTixHQUFjLElBQTNCOztBQUVBLGlCQUFnQixDQUFoQixFQUFtQixHQUFuQixFQUF3QixHQUF4QjtBQUNBLFNBQVEsT0FBUixDQUFnQixTQUFTLFFBQVQsQ0FBa0IsR0FBbEIsRUFBdUI7QUFDdEMsTUFBSSxJQUFJLE1BQUosQ0FBVyxDQUFYLEdBQWUsT0FBTyxNQUFQLENBQWMsQ0FBakMsRUFBb0M7QUFDbkMsT0FBSSxlQUFKLENBQW9CLE1BQXBCLEVBQTRCLEtBQTVCLEVBQW1DLENBQW5DO0FBQ0EsR0FGRCxNQUVPO0FBQ04sT0FBSSxlQUFKLENBQW9CLE9BQXBCLEVBQTZCLEtBQTdCLEVBQW9DLENBQXBDO0FBQ0E7QUFDRCxFQU5EOztBQVFBLE9BQU0sTUFBTjtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqIEFQUCBJTklUSUFUSU9OICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuLy8gVXNpbmcgY3JlYXRlLmpzIHRvIHNldCB1cCBhbmQgcmVuZGVyIGJhY2tncm91bmQ6IFxuXG52YXIgc3RhZ2UsIGxvYWRlciwgY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodDtcbnZhciBiYWNrZ3JvdW5kLCBwbGF5ZXI7XG52YXIgZW5lbWllcyA9IFtdO1xuXG4vLyBUaGUgcHVycG9zZSBvZiBrZXlNYXAgaXMgdG8gaG9sZCB0aGUgcG9zc2libGUga2V5cHJlc3NlcyBmb3Iga2V5ZG93biBldmVudHMgdGhhdCBtYXkgaGFwcGVuIFxudmFyIGtleU1hcCA9IHtcblx0NjU6ICdsZWZ0Jyxcblx0Njg6ICdyaWdodCdcbn07XG52YXIgeFRlc3QgPSAwO1xuXG5mdW5jdGlvbiBpbml0KCkge1xuXG5cdHN0YWdlID0gbmV3IGNyZWF0ZWpzLlN0YWdlKCdmb3Jlc3QtZHVuZ2VvbicpO1xuXG5cdC8vIENhbnZhcyB3aWR0aCBhbmQgaGVpZ2h0IHN0b3JlZCBpbiB2YXIgdyBhbmQgaCBmb3IgZnV0dXJlIHVzZS4gXG5cdGNhbnZhc1dpZHRoID0gc3RhZ2UuY2FudmFzLndpZHRoO1xuXHRjYW52YXNIZWlnaHQgPSBzdGFnZS5jYW52YXMuaGVpZ2h0O1xuXG5cdC8vIE1hbmlmZXN0IHdpbGwgY3JlYXRlIGFuZCBzdG9yZSBiYWNrZ3JvdW5kIGltYWdlIGZvciBmdXR1cmUgdXNlLiBMb29rcyBsaWtlIFxuXHQvLyB0aGUgcmVuZGVyIHdpbGwgbmVlZCB0byBiZSBhZGp1c3RlZCB0byBhbGlnbiB0aGUgaW1hZ2UgcHJvcGVybHkuIFxuXHR2YXIgbWFuaWZlc3QgPSBbXG5cdFx0e3NyYzogJ2JhY2tncm91bmQucG5nJywgaWQ6ICdiYWNrZ3JvdW5kJ30sXG5cdFx0e3NyYzogJ2RlZmF1bHQtc3ByaXRlLnBuZycsIGlkOiAncGxheWVyU3ByaXRlJ30sXG5cdFx0e3NyYzogJ1NsaW1lQW5pbWF0ZWQucG5nJywgaWQ6ICdzbGltZSd9XG5cdF07XG5cdC8vIExvYWRlciB3aWxsIHJlbmRlciB0aGUgbmVjZXNzYXJ5IGl0ZW1zIFxuXHRsb2FkZXIgPSBuZXcgY3JlYXRlanMuTG9hZFF1ZXVlKGZhbHNlKTtcblx0bG9hZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbXBsZXRlJywgaGFuZGxlQ29tcGxldGUpO1xuXHRsb2FkZXIubG9hZE1hbmlmZXN0KG1hbmlmZXN0LCB0cnVlLCAnYXNzZXRzL2ltYWdlcy8nKTtcblxuXHQvLyBEZXRlY3Qga2V5cHJlc3M6IFxuXHR3aW5kb3cuZG9jdW1lbnQub25rZXlkb3duID0gaGFuZGxlS2V5RG93bjtcblx0d2luZG93LmRvY3VtZW50Lm9ua2V5dXAgPSBoYW5kbGVLZXlVcDtcblx0d2luZG93LmRvY3VtZW50Lm9uY2xpY2sgPSBoYW5kbGVDbGljaztcbn1cblxuaW5pdCgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIENSRUFURSBUSEUgU1RBR0UgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuZnVuY3Rpb24gaGFuZGxlQ29tcGxldGUoZXZlbnQpIHtcblx0XG5cdC8vIENyZWF0ZXMgYmFja2dyb3VuZCBpbWFnZS4gXG5cdGJhY2tncm91bmQgPSBuZXcgY3JlYXRlanMuU2hhcGUoKTtcblx0dmFyIGJhY2tncm91bmRJbWcgPSBsb2FkZXIuZ2V0UmVzdWx0KCdiYWNrZ3JvdW5kJyk7XG5cdGJhY2tncm91bmQuZ3JhcGhpY3MuYmVnaW5CaXRtYXBGaWxsKGJhY2tncm91bmRJbWcpLmRyYXdSZWN0KDAsIDAsIGNhbnZhc1dpZHRoICsgYmFja2dyb3VuZEltZy53aWR0aCwgY2FudmFzSGVpZ2h0ICsgYmFja2dyb3VuZEltZy5oZWlnaHQpO1xuXHRzdGFnZS5hZGRDaGlsZChiYWNrZ3JvdW5kKTtcblxuXHQvLyBBZGp1c3RtZW50IHRvIGxpbmUgdGhlIGltYWdlIG1lbnRpb25lZCBhYm92ZS4gXG5cdGJhY2tncm91bmQueSA9IC0xMDU7XG5cblx0Ly8gQ3JlYXRpb24gb2YgdGhlIHBsYXllciB0byByZW5kZXIgb24gdGhlIHNjcmVlbi4gXG5cdHBsYXllciA9IG5ldyBQbGF5ZXIobG9hZGVyLmdldFJlc3VsdCgncGxheWVyU3ByaXRlJyksIHtocDogMTAwLCBhdGs6IDEwLCBkZWY6IDEwfSwge2RpcmVjdGlvbjogJ3JpZ2h0J30pO1xuXHRwbGF5ZXIuY3JlYXRlU3ByaXRlKHtcblx0XHRmcmFtZXJhdGU6IDMwLFxuXHRcdGltYWdlczogW3BsYXllci5pbWFnZV0sXG5cdFx0ZnJhbWVzOiBwbGF5ZXIuc3ByaXRlc2hlZXRkYXRhLFxuXHRcdC8vIHgsIHksIHdpZHRoLCBoZWlnaHQsIGltYWdlSW5kZXgqLCByZWdYKiwgcmVnWSpcblx0XHQvLyB7cmVnWDogMCwgaGVpZ2h0OiA5MiwgY291bnQ6IDI0LCByZWdZOiAwLCB3aWR0aDogNjR9LFxuXHRcdGFuaW1hdGlvbnM6IHtcblx0XHRcdHN0YW5kOiBbMF0sXG5cdFx0XHRydW46IFsxLCA2LCAncnVuJywgMC41XSxcblx0XHRcdHNsYXNoOiBbNywgMTMsICdzdGFuZCcsIDAuNV0sXG5cdFx0XHRkZWFkOiBbMTQsIDE2LCAnZGVhZCcsIDAuMV1cblx0XHR9XG5cdH0sICdzdGFuZCcsIHt4OiA2MCwgeTogNjB9KTtcblxuXHRzdGFnZS5hZGRDaGlsZChwbGF5ZXIuc3ByaXRlKTtcblxufVxuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIEhBTkRMRSBLRVlCSU5EUyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5mdW5jdGlvbiBoYW5kbGVLZXlEb3duKGV2ZW50KSB7XG5cdHBsYXllci5oYW5kbGVBbmltYXRpb24oa2V5TWFwW2V2ZW50LmtleUNvZGVdLCAncnVuJywgOCwgMCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUtleVVwKGV2ZW50KSB7XG5cdHBsYXllci5oYW5kbGVBbmltYXRpb24oJ3N0b3AnLCAnc3RhbmQnLCAwKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlQ2xpY2soZXZlbnQpIHtcblx0cGxheWVyLmhhbmRsZUF0dGFjaygpO1xufVxuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIEVORU1ZIFNQQVdOUyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG4vLyBGdW5jdGlvbiB3aWxsIHJ1biBldmVyeSB0aW1lIHRocm91Z2ggdGhlIHJlbmRlciBsb29wIGFuZCwgaWYgZW5lbXkgY291bnQgaXNcbi8vIGJlbG93IGEgc3BlY2lmaWVkIG1heCwgcmFuZG9tbHkgZ2VuZXJhdGUgYSBudW1iZXIgdG8gdHJ5IHRvIG1lZXQgY29uZGl0aW9uc1xuLy8gZm9yIGFuIGVuZW15IHNwYXduLiByYW5kQSBhbmQgcmFuZEIgaGVscCB0byBzZXQgdGhlIHBhcmFtZXRlcnMgZm9yXG4vLyBob3cgb2Z0ZW4gc29tZXRoaW5nIHNob3VsZCBoYXBwZW4uIFxudmFyIHJhbmRvbWl6ZWRTcGF3biA9IGZ1bmN0aW9uKG1heCwgcmFuZEEsIHJhbmRCKSB7XG5cdGlmIChlbmVtaWVzLmxlbmd0aCA8IG1heCkge1xuXHRcdGlmIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYW5kQSkgJSByYW5kQiA9PT0gMCkge1xuXHRcdFx0dmFyIG5ld0lkeCA9IGVuZW1pZXMubGVuZ3RoO1xuXHRcdFx0Y29uc29sZS5sb2coJ3NlbmRpbmcgZ2V0IHJlcXVlc3QuLi4nKTtcblx0XHRcdCQuZ2V0KCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvbW9icycsIHtuYW1lOiAnc2xpbWUnfSwgXG5cdFx0XHRcdGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnZ2V0IHJlcXVlc3Qgc3VjY2Vzc2Z1bCcpO1xuXHRcdFx0XHRcdGVuZW1pZXNbbmV3SWR4XSA9IG5ldyBNb2IobG9hZGVyLmdldFJlc3VsdCgnc2xpbWUnKSxcblx0XHRcdFx0XHRcdHtocDogZGF0YS5yZXN1bHQuaHAsIGF0azogZGF0YS5yZXN1bHQuYXRrLCBkZWY6IGRhdGEucmVzdWx0LmRlZn0sXG5cdFx0XHRcdFx0XHR7ZGlyZWN0aW9uOiAnbGVmdCd9XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRlbmVtaWVzW25ld0lkeF0uY3JlYXRlU3ByaXRlKHtcblx0XHRcdFx0XHRcdGZyYW1lcmF0ZTogMzAsXG5cdFx0XHRcdFx0XHRpbWFnZXM6IFtlbmVtaWVzW25ld0lkeF0uaW1hZ2VdLFxuXHRcdFx0XHRcdFx0ZnJhbWVzOiBKU09OLnBhcnNlKGRhdGEucmVzdWx0LnNwcml0ZXNoZWV0KSxcblx0XHRcdFx0XHRcdGFuaW1hdGlvbnM6IHtcblx0XHRcdFx0XHRcdFx0c3RhbmQ6IFswLCAwLCAnaG9wJywgMC4yXSxcblx0XHRcdFx0XHRcdFx0aG9wOiBbMSwgNiwgJ3N0YW5kJywgMC4yXVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sICdob3AnLCB7eDogMjUwLCB5OiA4NH0pO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVuZW1pZXNbbmV3SWR4XS5zcHJpdGUpO1xuXHRcdFx0XHRcdGVuZW1pZXNbbmV3SWR4XS5zcHJpdGUuc2NhbGVYID0gMC41O1xuXHRcdFx0XHRcdGVuZW1pZXNbbmV3SWR4XS5zcHJpdGUuc2NhbGVZID0gMC41O1xuXHRcdFx0XHRcdHN0YWdlLmFkZENoaWxkKGVuZW1pZXNbbmV3SWR4XS5zcHJpdGUpO1xuXHRcdFx0XHR9KTtcblx0XHR9XG5cdH1cbn07XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBSRU5ERVIgTE9PUCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5jcmVhdGVqcy5UaWNrZXIuYWRkRXZlbnRMaXN0ZW5lcigndGljaycsIGhhbmRsZVRpY2spOyBcbmZ1bmN0aW9uIGhhbmRsZVRpY2soZXZlbnQpIHtcblxuXHR2YXIgZGVsdGFTID0gZXZlbnQuZGVsdGEgLyAxMDAwO1xuXG5cdHJhbmRvbWl6ZWRTcGF3big0LCAzMDAsIDI2OSk7XG5cdGVuZW1pZXMuZm9yRWFjaChmdW5jdGlvbiBtb3ZlTW9icyhtb2IpIHtcblx0XHRpZiAobW9iLnNwcml0ZS54ID4gcGxheWVyLnNwcml0ZS54KSB7XG5cdFx0XHRtb2IuaGFuZGxlQW5pbWF0aW9uKCdsZWZ0JywgJ2hvcCcsIDEpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRtb2IuaGFuZGxlQW5pbWF0aW9uKCdyaWdodCcsICdob3AnLCAxKTtcblx0XHR9XG5cdH0pO1xuXG5cdHN0YWdlLnVwZGF0ZSgpO1xufVxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4iXX0=