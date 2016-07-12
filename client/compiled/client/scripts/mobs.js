'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* ******************** PARENT CLASS FOR ALL CHARS ********************* */

var Character = function () {
	function Character(image, stats, options) {
		_classCallCheck(this, Character);

		this.image = image;
		this.maxHP = stats.hp;
		this.hp = stats.hp;
		this.atk = stats.atk;
		this.def = stats.def;
		this.direction = options ? options.direction ? options.direction : null : null;
	}

	// Parameters are an object set upon invoking the function while animation
	// expects a string to point which animation in the sprite sheet to use.
	// Position is an optional object to specify x and y properties.


	_createClass(Character, [{
		key: 'createSprite',
		value: function createSprite(parameters, animation, position) {
			var spriteSheet = new createjs.SpriteSheet(parameters);
			this.sprite = new createjs.Sprite(spriteSheet, animation);
			this.sprite.x = position && position.x ? position.x : 0;
			this.sprite.y = position && position.y ? position.y : 0;
		}

		// Direction and animation both take strings. Animation is optional, can describe what
		// direction the object should face and the sprite animation to utilize.

	}, {
		key: 'handleAnimation',
		value: function handleAnimation(direction, animation, distance, adjust) {
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
	}]);

	return Character;
}();

;

window.Character = Character;

var Mob = function (_Character) {
	_inherits(Mob, _Character);

	function Mob(image, stats, options) {
		_classCallCheck(this, Mob);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Mob).call(this, image, stats, options));
	}

	_createClass(Mob, [{
		key: 'handleKnockback',
		value: function handleKnockback(player) {
			this.hp -= player.atk - this.def;
			this.sprite.x += this.sprite.x > player.sprite.x ? 60 : -60;
		}
	}]);

	return Mob;
}(Character);

window.Mob = Mob;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NjcmlwdHMvbW9icy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFFTSxTO0FBRUwsb0JBQVksS0FBWixFQUFtQixLQUFuQixFQUEwQixPQUExQixFQUFtQztBQUFBOztBQUNsQyxPQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsT0FBSyxLQUFMLEdBQWEsTUFBTSxFQUFuQjtBQUNBLE9BQUssRUFBTCxHQUFVLE1BQU0sRUFBaEI7QUFDQSxPQUFLLEdBQUwsR0FBVyxNQUFNLEdBQWpCO0FBQ0EsT0FBSyxHQUFMLEdBQVcsTUFBTSxHQUFqQjtBQUNBLE9BQUssU0FBTCxHQUFpQixVQUFVLFFBQVEsU0FBUixHQUMxQixRQUFRLFNBRGtCLEdBQ04sSUFESixHQUNXLElBRDVCO0FBRUE7Ozs7Ozs7OzsrQkFLWSxVLEVBQVksUyxFQUFXLFEsRUFBVTtBQUM3QyxPQUFJLGNBQWMsSUFBSSxTQUFTLFdBQWIsQ0FBeUIsVUFBekIsQ0FBbEI7QUFDQSxRQUFLLE1BQUwsR0FBYyxJQUFJLFNBQVMsTUFBYixDQUFvQixXQUFwQixFQUFpQyxTQUFqQyxDQUFkO0FBQ0EsUUFBSyxNQUFMLENBQVksQ0FBWixHQUFnQixZQUFZLFNBQVMsQ0FBckIsR0FBeUIsU0FBUyxDQUFsQyxHQUFzQyxDQUF0RDtBQUNBLFFBQUssTUFBTCxDQUFZLENBQVosR0FBZ0IsWUFBWSxTQUFTLENBQXJCLEdBQXlCLFNBQVMsQ0FBbEMsR0FBc0MsQ0FBdEQ7QUFDQTs7Ozs7OztrQ0FJZSxTLEVBQVcsUyxFQUFXLFEsRUFBVSxNLEVBQVE7QUFDdkQsT0FBSSxLQUFLLE1BQUwsQ0FBWSxnQkFBWixLQUFpQyxPQUFqQyxJQUE0QyxTQUFoRCxFQUEyRDtBQUMxRCxTQUFLLE1BQUwsQ0FBWSxXQUFaLENBQXdCLFNBQXhCO0FBQ0EsSUFGRCxNQUVPLElBQUksY0FBYyxNQUFsQixFQUEwQjtBQUNoQyxTQUFLLE1BQUwsQ0FBWSxXQUFaLENBQXdCLE9BQXhCO0FBQ0E7QUFDRCxPQUFJLGNBQWMsTUFBbEIsRUFBMEI7QUFDekIsUUFBSSxLQUFLLFNBQUwsS0FBbUIsT0FBdkIsRUFBZ0M7QUFDL0IsVUFBSyxNQUFMLENBQVksTUFBWixJQUFzQixDQUFDLENBQXZCO0FBQ0EsVUFBSyxNQUFMLENBQVksQ0FBWixJQUFpQixTQUFTLE1BQVQsR0FBa0IsQ0FBbkM7QUFDQSxVQUFLLFNBQUwsR0FBaUIsTUFBakI7QUFDQTtBQUNELFNBQUssTUFBTCxDQUFZLENBQVosSUFBaUIsUUFBakI7QUFDQSxJQVBELE1BT08sSUFBSSxjQUFjLE9BQWxCLEVBQTJCO0FBQ2pDLFFBQUksS0FBSyxTQUFMLEtBQW1CLE1BQXZCLEVBQStCO0FBQzlCLFVBQUssTUFBTCxDQUFZLE1BQVosSUFBc0IsQ0FBQyxDQUF2QjtBQUNBLFVBQUssTUFBTCxDQUFZLENBQVosSUFBaUIsU0FBUyxNQUFULEdBQWtCLENBQW5DO0FBQ0EsVUFBSyxTQUFMLEdBQWlCLE9BQWpCO0FBQ0E7QUFDRCxTQUFLLE1BQUwsQ0FBWSxDQUFaLElBQWlCLFFBQWpCO0FBQ0E7QUFDRCxPQUFJLEtBQUssTUFBTCxDQUFZLENBQVosR0FBZ0IsQ0FBQyxDQUFyQixFQUF3QjtBQUN2QixTQUFLLE1BQUwsQ0FBWSxDQUFaLEdBQWdCLENBQWhCO0FBQ0EsSUFGRCxNQUVPLElBQUksS0FBSyxNQUFMLENBQVksQ0FBWixHQUFnQixHQUFwQixFQUF5QjtBQUMvQixTQUFLLE1BQUwsQ0FBWSxDQUFaLEdBQWdCLEdBQWhCO0FBQ0E7QUFDRDs7Ozs7O0FBRUQ7O0FBRUQsT0FBTyxTQUFQLEdBQW1CLFNBQW5COztJQUVNLEc7OztBQUVMLGNBQVksS0FBWixFQUFtQixLQUFuQixFQUEwQixPQUExQixFQUFtQztBQUFBOztBQUFBLGdGQUM1QixLQUQ0QixFQUNyQixLQURxQixFQUNkLE9BRGM7QUFFbEM7Ozs7a0NBRWUsTSxFQUFRO0FBQ3ZCLFFBQUssRUFBTCxJQUFXLE9BQU8sR0FBUCxHQUFhLEtBQUssR0FBN0I7QUFDQSxRQUFLLE1BQUwsQ0FBWSxDQUFaLElBQWlCLEtBQUssTUFBTCxDQUFZLENBQVosR0FBZ0IsT0FBTyxNQUFQLENBQWMsQ0FBOUIsR0FBa0MsRUFBbEMsR0FBdUMsQ0FBQyxFQUF6RDtBQUNBOzs7O0VBVGdCLFM7O0FBYWxCLE9BQU8sR0FBUCxHQUFhLEdBQWIiLCJmaWxlIjoibW9icy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qICoqKioqKioqKioqKioqKioqKioqIFBBUkVOVCBDTEFTUyBGT1IgQUxMIENIQVJTICoqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5jbGFzcyBDaGFyYWN0ZXIge1xuXHRcblx0Y29uc3RydWN0b3IoaW1hZ2UsIHN0YXRzLCBvcHRpb25zKSB7XG5cdFx0dGhpcy5pbWFnZSA9IGltYWdlO1xuXHRcdHRoaXMubWF4SFAgPSBzdGF0cy5ocDtcblx0XHR0aGlzLmhwID0gc3RhdHMuaHA7XG5cdFx0dGhpcy5hdGsgPSBzdGF0cy5hdGs7XG5cdFx0dGhpcy5kZWYgPSBzdGF0cy5kZWY7XG5cdFx0dGhpcy5kaXJlY3Rpb24gPSBvcHRpb25zID8gb3B0aW9ucy5kaXJlY3Rpb24gPyBcblx0XHRcdG9wdGlvbnMuZGlyZWN0aW9uIDogbnVsbCA6IG51bGw7XG5cdH1cblxuXHQvLyBQYXJhbWV0ZXJzIGFyZSBhbiBvYmplY3Qgc2V0IHVwb24gaW52b2tpbmcgdGhlIGZ1bmN0aW9uIHdoaWxlIGFuaW1hdGlvblxuXHQvLyBleHBlY3RzIGEgc3RyaW5nIHRvIHBvaW50IHdoaWNoIGFuaW1hdGlvbiBpbiB0aGUgc3ByaXRlIHNoZWV0IHRvIHVzZS4gXG5cdC8vIFBvc2l0aW9uIGlzIGFuIG9wdGlvbmFsIG9iamVjdCB0byBzcGVjaWZ5IHggYW5kIHkgcHJvcGVydGllcy4gXG5cdGNyZWF0ZVNwcml0ZShwYXJhbWV0ZXJzLCBhbmltYXRpb24sIHBvc2l0aW9uKSB7XG5cdFx0dmFyIHNwcml0ZVNoZWV0ID0gbmV3IGNyZWF0ZWpzLlNwcml0ZVNoZWV0KHBhcmFtZXRlcnMpO1xuXHRcdHRoaXMuc3ByaXRlID0gbmV3IGNyZWF0ZWpzLlNwcml0ZShzcHJpdGVTaGVldCwgYW5pbWF0aW9uKTtcblx0XHR0aGlzLnNwcml0ZS54ID0gcG9zaXRpb24gJiYgcG9zaXRpb24ueCA/IHBvc2l0aW9uLnggOiAwO1xuXHRcdHRoaXMuc3ByaXRlLnkgPSBwb3NpdGlvbiAmJiBwb3NpdGlvbi55ID8gcG9zaXRpb24ueSA6IDA7XG5cdH1cblxuXHQvLyBEaXJlY3Rpb24gYW5kIGFuaW1hdGlvbiBib3RoIHRha2Ugc3RyaW5ncy4gQW5pbWF0aW9uIGlzIG9wdGlvbmFsLCBjYW4gZGVzY3JpYmUgd2hhdFxuXHQvLyBkaXJlY3Rpb24gdGhlIG9iamVjdCBzaG91bGQgZmFjZSBhbmQgdGhlIHNwcml0ZSBhbmltYXRpb24gdG8gdXRpbGl6ZS4gXG5cdGhhbmRsZUFuaW1hdGlvbihkaXJlY3Rpb24sIGFuaW1hdGlvbiwgZGlzdGFuY2UsIGFkanVzdCkge1xuXHRcdGlmICh0aGlzLnNwcml0ZS5jdXJyZW50QW5pbWF0aW9uID09PSAnc3RhbmQnICYmIGRpcmVjdGlvbikge1xuXHRcdFx0dGhpcy5zcHJpdGUuZ290b0FuZFBsYXkoYW5pbWF0aW9uKTtcblx0XHR9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3N0b3AnKSB7XG5cdFx0XHR0aGlzLnNwcml0ZS5nb3RvQW5kUGxheSgnc3RhbmQnKTtcblx0XHR9XG5cdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XG5cdFx0XHRpZiAodGhpcy5kaXJlY3Rpb24gPT09ICdyaWdodCcpIHtcblx0XHRcdFx0dGhpcy5zcHJpdGUuc2NhbGVYICo9IC0xO1xuXHRcdFx0XHR0aGlzLnNwcml0ZS54ICs9IGFkanVzdCA/IGFkanVzdCA6IDA7XG5cdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ2xlZnQnO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5zcHJpdGUueCAtPSBkaXN0YW5jZTtcblx0XHR9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xuXHRcdFx0aWYgKHRoaXMuZGlyZWN0aW9uID09PSAnbGVmdCcpIHtcblx0XHRcdFx0dGhpcy5zcHJpdGUuc2NhbGVYICo9IC0xO1xuXHRcdFx0XHR0aGlzLnNwcml0ZS54IC09IGFkanVzdCA/IGFkanVzdCA6IDA7XG5cdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ3JpZ2h0Jztcblx0XHRcdH1cblx0XHRcdHRoaXMuc3ByaXRlLnggKz0gZGlzdGFuY2U7XG5cdFx0fVxuXHRcdGlmICh0aGlzLnNwcml0ZS54IDwgLTUpIHtcblx0XHRcdHRoaXMuc3ByaXRlLnggPSAwO1xuXHRcdH0gZWxzZSBpZiAodGhpcy5zcHJpdGUueCA+IDMwMCkge1xuXHRcdFx0dGhpcy5zcHJpdGUueCA9IDI5NTtcblx0XHR9XG5cdH1cblxufTtcblxud2luZG93LkNoYXJhY3RlciA9IENoYXJhY3RlcjtcblxuY2xhc3MgTW9iIGV4dGVuZHMgQ2hhcmFjdGVyIHtcblxuXHRjb25zdHJ1Y3RvcihpbWFnZSwgc3RhdHMsIG9wdGlvbnMpIHtcblx0XHRzdXBlcihpbWFnZSwgc3RhdHMsIG9wdGlvbnMpO1xuXHR9XG5cblx0aGFuZGxlS25vY2tiYWNrKHBsYXllcikge1xuXHRcdHRoaXMuaHAgLT0gcGxheWVyLmF0ayAtIHRoaXMuZGVmO1xuXHRcdHRoaXMuc3ByaXRlLnggKz0gdGhpcy5zcHJpdGUueCA+IHBsYXllci5zcHJpdGUueCA/IDYwIDogLTYwO1xuXHR9XG5cbn1cblxud2luZG93Lk1vYiA9IE1vYjtcblxuXG5cblxuXG5cblxuXG4iXX0=