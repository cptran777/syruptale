class HUD {

	constructor(image, health) {
		this.image = image;
		this.health = health;
		this.portrait;
		this.healthbars;
	} 

	renderPortrait(callback) {
		this.portrait = new createjs.Shape();
		this.portrait.graphics.beginBitmapFill(this.image, 'no-repeat').drawCircle(75, 75, 75);

		this.portrait.scaleX = 0.40, this.portrait.scaleY = 0.40;
		callback();
	} 

}