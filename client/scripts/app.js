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
	var manifest = [
		{src: 'background.png', id: 'background'},
		{src: 'default-sprite.png', id: 'playerSprite'},
		{src: 'SlimeAnimated.png', id: 'slime'}
	];
	// Loader will render the necessary items 
	loader = new createjs.LoadQueue(false);
	loader.addEventListener('complete', handleComplete);
	loader.loadManifest(manifest, true, 'assets/images/');

	// Detect keypress: 
	window.document.onkeydown = handleKeyDown;
	window.document.onkeyup = handleKeyUp;
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
	player = new Player(loader.getResult('playerSprite'), {hp: 100, atk: 10, def: 10}, {direction: 'right'});
	player.createSprite({
		framerate: 30,
		images: [player.image],
		frames: {regX: 0, height: 92, count: 24, regY: 0, width: 64},
		animations: {
			stand: [4],
			run: [3, 7, 'run', 0.5],
			slash: [12, 16, 'stand', 0.5],
			dead: [15, 16, 'dead', 0.2]
		}
	}, 'slash', {x: 60, y: 60});

	stage.addChild(player.sprite);

	// enemies[0] = new Mob(loader.getResult('slime'), {hp: 20, atk: 12, def: 5}, {direction: 'left'});
	// enemies[0].createSprite({
	// 	framerate: 30,
	// 	images: [enemies[0].image],
	// 	frames: [[0, 0, 84, 96],
	// 		[84, 0, 84, 96],
	// 		[168, 0, 84, 96],
	// 		[252, 0, 84, 96],
	// 		[340, 0, 80, 96],
	// 		[424, 0, 80, 96],
	// 		[508, 0, 80, 96]
	// 	], 
	// 	animations: {
	// 		stand: [0, 0, 'hop', 0.2],
	// 		hop: [1, 6, 'stand', 0.2]
	// 	}
	// }, 'hop', {x: 250, y: 84});

	// enemies[0].sprite.scaleX = 0.5;
	// enemies[0].sprite.scaleY = 0.5;

	// stage.addChild(enemies[0].sprite);


}

/* **************************** HANDLE KEYBINDS ***************************** */

function handleKeyDown(event) {
	player.handleAnimation(keyMap[event.keyCode], 'run', 8, 60);
}

function handleKeyUp(event) {
	player.handleAnimation('stop', 'stand', 0);
}

/* **************************** ENEMY SPAWNS ***************************** */

// Function will run every time through the render loop and, if enemy count is
// below a specified max, randomly generate a number to try to meet conditions
// for an enemy spawn. randA and randB help to set the parameters for
// how often something should happen. 
var randomizedSpawn = function(max, randA, randB) {
	if (enemies.length < max) {
		if (Math.floor(Math.random() * randA) % randB === 0) {
			var newIdx = enemies.length;
			console.log('sending get request...');
			$.get('http://127.0.0.1:3000/mobs', {name: 'slime'}, 
				function(data) {
					console.log('get request successful');
					enemies[newIdx] = new Mob(loader.getResult('slime'),
						{hp: data.result.hp, atk: data.result.atk, def: data.result.def},
						{direction: 'left'}
					);
					enemies[newIdx].createSprite({
						framerate: 30,
						images: [enemies[newIdx].image],
						frames: JSON.parse(data.result.spritesheet),
						animations: {
							stand: [0, 0, 'hop', 0.2],
							hop: [1, 6, 'stand', 0.2]
						}
					}, 'hop', {x: 250, y: 84});
					console.log(enemies[newIdx].sprite);
					// enemies[newIdx].sprite.scaleX = 0.5;
					// enemies[newIdx].sprite.scaleY = 0.5;
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
			mob.handleAnimation('right', 'hop', -1);
		}
	});

	stage.update();
}






















