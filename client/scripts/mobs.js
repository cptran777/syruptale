/* ******************** PARENT CLASS FOR ALL CHARS ********************* */

class Character {
	
	constructor(image, stats, options) {
		this.image = image;
		this.hp = stats.hp;
		this.atk = stats.atk;
		this.def = stats.def;
		this.direction = options ? options.direction ? 
			options.direction : null : null;
	}

	// Parameters are an object set upon invoking the function while animation
	// expects a string to point which animation in the sprite sheet to use. 
	// Position is an optional object to specify x and y properties. 
	createSprite(parameters, animation, position) {
		var spriteSheet = new createjs.SpriteSheet(parameters);
		this.sprite = new createjs.Sprite(spriteSheet, animation);
		this.sprite.x = position && position.x ? position.x : 0;
		this.sprite.y = position && position.y ? position.y : 0;
	}

	// Direction and animation both take strings. Animation is optional, can describe what
	// direction the object should face and the sprite animation to utilize. 
	handleAnimation(direction, animation, distance, adjust) {
		if (this.sprite.currentAnimation === 'stand' && direction) {
			this.sprite.gotoAndPlay(animation);
		} else if (direction === 'stop') {
			this.sprite.gotoAndPlay('stand');
		}
		if (direction === 'left') {
			if (this.direction === 'right') {
				this.sprite.scaleX *= -1;
				this.sprite.x += adjust ? adjust : 0;
				this.direction = 'left';
			}
			this.sprite.x -= distance;
		} else if (direction === 'right') {
			if (this.direction === 'left') {
				this.sprite.scaleX *= -1;
				this.sprite.x -= adjust ? adjust : 0;
				this.direction = 'right';
			}
			this.sprite.x += distance;
		}
		if (this.sprite.x < -5) {
			this.sprite.x = 0;
		} else if (this.sprite.x > 300) {
			this.sprite.x = 295;
		}
	}

};

window.Character = Character;

class Mob extends Character {

	constructor(image, stats, options) {
		super(image, stats, options);
	}

	handleKnockback(player) {
		this.hp -= player.atk - this.def;
		this.sprite.x += this.sprite.x > player.sprite.x ? 60 : -60;
	}

}

window.Mob = Mob;








