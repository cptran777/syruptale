
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

		// Helps to not overload collision detection: 
		this.lastCollision = new Date().getTime();

		// Two states to handle jumping animation. 
		this.maxJumpY = 40;
		this.jumpState = 'ground';
	}

	handleAttack(targets, callback) {
		if (this.sprite.currentAnimation !== 'slash') {
			this.sprite.gotoAndPlay('slash');
			this.collisions(targets, 'slash', callback);
		} 
	}

	// handleJump(animation) {
	// 	if (this.sprite.y === 60 && animation === 'jump') {
	// 		this.jumpState = 'up'
	// 		this.sprite.setTransform(this.sprite.x, 30);
	// 	} else if (this.sprite.y === 30 && animation === 'jump') {
	// 		this.jumpState = 'up'
	// 		this.sprite.setTransform(this.sprite.x, 60);
	// 	}
	// }

	// Can take care of jumping and landing the player within the render loop
	// handleJump function takes care of the initiation. 
	// handleY() {
	// 	if (this.sprite.y < 60 && this.sprite.y >= 38) {
	// 		console.log('this.jumpstate =', this.jumpState);
	// 		if (this.jumpState === 'up') {
	// 			if (this.sprite.y >= 40) {
	// 				this.sprite.y -= 2;
	// 				if (this.sprite.currentAnimation === 'run') {
	// 					this.sprite.x += this.sprite.direction === 'left' ? -1 : 1;
	// 				}
	// 				if (this.sprite.y <= 40) {
	// 					this.jumpState = 'down';
	// 				}
	// 			}
	// 		} else if (this.jumpState === 'down') {
	// 			console.log('second if getting called');
	// 			this.sprite.y += 2;
	// 			if (this.sprite.currentAnimation === 'run') {
	// 				this.sprite.x += this.sprite.direction === 'left' ? -1 : 1;
	// 			}
	// 			if (this.sprite.y >= 60) {
	// 				this.jumpState = 'ground';
	// 			}
	// 		}
	// 	}
	// }

	// scenario helps to increase the reusability of the collision detector
	// by allowing different function calls based on what's happening
	collisions(enemies, scenario, callback) {
		enemies.forEach((enemy) => {
			if (scenario !== 'slash' && Math.abs(this.sprite.x - enemy.sprite.x) < 3) {
				if (new Date().getTime() - this.lastCollision > 500) {
					console.log('collision detected! me: ', this.sprite.y, ' enemy: ', enemy.sprite.y);
					this.lastCollision = new Date().getTime();
					this.hp -= enemy.atk - this.def;
					if (this.hp < 1) {
						this.hp = 0;
						callback();
					}
				}
			} else if (scenario === 'slash' && Math.abs(this.sprite.x - enemy.sprite.x) < 25) {
				enemy.handleKnockback(this);
				callback ? callback(this.atk - enemy.def) : null;
			}
		});
	}

	// Player death goes through the frames, and the expected callback defined within app will
	// remove the player from the stage after elapsed time (to give room for the dead animation)
	handleDeath(callback) {
		this.sprite.gotoAndPlay('dead');
		setTimeout(callback, 1200);
	}

};

window.Player = Player;

