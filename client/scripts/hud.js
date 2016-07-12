class HUD {

	constructor(image, health) {
		this.image = image;
		this.health = health;
		this.portrait;
		this.fullHealthBar;
		this.currentHealthBar;
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

}