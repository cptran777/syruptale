class HUD {

	constructor(image, health) {
		this.image = image;
		this.health = health;
		this.portrait;

		// The full health bar is supposed to remain static while the current health bar acts as
		// an overlay of sorts and decreases in size when the player is hit, therefore giving
		// the appearance that a single bar is losing health. 
		this.fullHealthBar;
		this.currentHealthBar;

		// Damage display appears when an enemy is hit. This is an array made up of objects that
		// have the format: {text: <text object in create js>, createAt: <integer number> }
		// This way, the damage display can be checked with every render iteration to remove those
		// that have remained on the screen for too long. 
		this.damageDisplay = [];
	} 

	renderPortrait() {
		this.portrait = new createjs.Shape();
		this.portrait.graphics.beginBitmapFill(this.image, 'no-repeat').drawCircle(75, 75, 75);

		this.portrait.scaleX = 0.40, this.portrait.scaleY = 0.40;
	} 

	renderHealthBars() {
		this.fullHealthBar = new createjs.Shape();
		this.fullHealthBar.graphics.beginFill('#ffe95b').drawRoundRect(0, 0, 100, 15, 5);
		this.currentHealthBar = new createjs.Shape();
		this.currentHealthBar.graphics.beginFill('#c51d1d').drawRoundRect(0, 0, 100, 15, 5);
		this.fullHealthBar.x = 50, this.fullHealthBar.y = 10;
		this.currentHealthBar.x = 50, this.currentHealthBar.y = 10;
	}

	renderHUD(callback) {
		this.renderPortrait();
		this.renderHealthBars();

		callback(this.portrait, this.fullHealthBar, this.currentHealthBar);
	}

	// Damage and time are passed in from the app.js call to this function. The callback will be
	// passed the text object and used to call the render on the object. 
	renderDamage(damage, time, position, callback) { 
		var newText = {
			text: new createjs.Text('' + damage, '25px Impact', '#ffbf00'),
			createdAt: time
		};
		newText.text.x = position.x, newText.text.y = position.y;
		this.damageDisplay.push(newText);
		callback(newText.text);
	}

}