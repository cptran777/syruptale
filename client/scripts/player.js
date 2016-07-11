
/* ***************************** PLAYER CLASS ******************************* */

// Image refers to an expected sprite sheet file, and stats are the player's
// in-game parameters as an object that will eventually be expected to be received 
// from a database query. 
class Player extends Character {

	constructor(image, stats) {
		super(image, stats);
	}

};

window.Player = Player;

