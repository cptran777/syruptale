
/* ***************************** PLAYER CLASS ******************************* */

// Image refers to an expected sprite sheet file, and stats are the player's
// in-game parameters as an object that will eventually be expected to be received 
// from a database query. 
class Player extends Character {

	constructor(image, stats, options) {
		super(image, stats, options);
		this.spritesheetdata = [
		// Stand
			[30, 0, 48, 82, 0, 32],
		// Run
			[86, 0, 48, 82, 0, 32],
			[142, 0, 48, 82, 0, 32],
			[198, 0, 48, 82, 0, 32],
			[262, 0, 48, 82, 0, 32],
			[318, 0, 48, 82, 0, 32],
			[384, 0, 48, 82, 0, 32],
		// Slash
			[0, 94, 48, 82, 0, 32],
			[48, 94, 48, 82, 0, 32],
			[96, 94, 60, 82, 0, 32],
			[158, 94, 50, 82, 0, 32],
			[218, 94, 48, 82, 0, 32],
			[272, 94, 50, 82, 0, 32],
			[326, 94, 50, 82, 0, 32],
		// Dead
			[316, 170, 48, 82, 0, 32],
			[380, 170, 60, 82, 0, 32],
			[380, 170, 60, 82, 0, 32],
		];
		// for (var x = 30; x <= 478; x += 54) {
		// 	this.spritesheetdata.push([x, 0, 48, 84, 0, 32]);
		// }
	}

	handleAttack() {
		if (this.sprite.currentAnimation !== 'slash') {
			this.sprite.gotoAndPlay('slash');
		} 
	}

};

window.Player = Player;

