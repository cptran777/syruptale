/* ***************************** APP INITIATION ******************************* */

// Using create.js to set up and render background: 

var stage, loader, canvasWidth, canvasHeight;
var background, player;

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
		{src: 'default-sprite.png', id: 'playerSprite'}
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

}

/* **************************** CREATE THE STAGE ***************************** */

function handleKeyDown(event) {
	player.handleAnimation(keyMap[event.keyCode], 'run');

	if (keyMap[event.keyCode] === 'left') {
		player.sprite.gotoAndPlay('run');
		player.sprite.scaleX = -1;
		player.sprite.x += 60;
	} else if (keyMap[event.keyCode] === 'right') {
		player.sprite.gotoAndPlay('run');
		player.sprite.scaleX = 1;
		player.sprite.x -= 60;
	}
}

function handleKeyUp(event) {

}
/* ****************************** RENDER LOOP ******************************** */

createjs.Ticker.addEventListener('tick', handleTick); 
function handleTick(event) {

	var deltaS = event.delta / 1000;

	stage.update();
}





















