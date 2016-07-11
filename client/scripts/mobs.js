/* ******************** PARENT CLASS FOR ALL CHARS ********************* */

class Character {
	
	constructor(image, stats) {
		this.image = image;
		this.hp = stats.hp;
		this.atk = stats.atk;
		this.def = stats.def;
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

};

window.Character = Character;

class Mob extends Character {

	constructor(image, stats) {
		super(image, stats);
	}

}

window.Mob = Mob;








