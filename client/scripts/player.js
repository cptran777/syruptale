
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
			[380, 170, 60, 82, 0, 32]
		];
		this.lastCollision = new Date().getTime();
	}

	handleAttack(targets) {
		if (this.sprite.currentAnimation !== 'slash') {
			this.sprite.gotoAndPlay('slash');
			this.collisions(targets, 'slash');
		} 
	}

	// scenario helps to increase the reusability of the collision detector
	// by allowing different function calls based on what's happening
	collisions(enemies, scenario, callback) {
		enemies.forEach((enemy) => {
			if (scenario !== 'slash' && Math.abs(this.sprite.x - enemy.sprite.x) < 3) {
				if (new Date().getTime() - this.lastCollision > 500) {
					console.log('collision detected! HP: ', this.hp);
					this.lastCollision = new Date().getTime();
					this.hp -= enemy.atk - this.def;
					if (this.hp < 1) {
						callback();
					}
				}
			} else if (scenario === 'slash' && Math.abs(this.sprite.x - enemy.sprite.x) < 25) {
				enemy.handleKnockback(this);
			}
		});
	}

	handleDeath(callback) {
		this.sprite.gotoAndPlay('dead');
		setTimeout(callback, 1200);
	}

};

window.Player = Player;

