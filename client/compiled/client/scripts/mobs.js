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
		value: function handleKnockback(player, animation) {
			animation ? this.sprite.gotoAndPlay(animation) : null;
			this.hp -= player.atk - this.def;
			this.sprite.x += this.sprite.x > player.sprite.x ? 60 : -60;
		}
	}]);

	return Mob;
}(Character);

window.Mob = Mob;

var Boss = function (_Mob) {
	_inherits(Boss, _Mob);

	function Boss(image, stats, options) {
		_classCallCheck(this, Boss);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Boss).call(this, image, stats, options));
	}

	_createClass(Boss, [{
		key: 'handleKnockback',
		value: function handleKnockback(player, animation) {
			animation ? this.sprite.gotoAndPlay(animation) : null;
			this.hp -= player.atk - this.def;
			this.sprite.x += this.sprite.x > player.sprite.x ? 30 : -30;
		}
	}]);

	return Boss;
}(Mob);

window.Boss = Boss;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NjcmlwdHMvbW9icy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFFTSxTO0FBRUwsb0JBQVksS0FBWixFQUFtQixLQUFuQixFQUEwQixPQUExQixFQUFtQztBQUFBOztBQUNsQyxPQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsT0FBSyxLQUFMLEdBQWEsTUFBTSxFQUFuQjtBQUNBLE9BQUssRUFBTCxHQUFVLE1BQU0sRUFBaEI7QUFDQSxPQUFLLEdBQUwsR0FBVyxNQUFNLEdBQWpCO0FBQ0EsT0FBSyxHQUFMLEdBQVcsTUFBTSxHQUFqQjtBQUNBLE9BQUssU0FBTCxHQUFpQixVQUFVLFFBQVEsU0FBUixHQUMxQixRQUFRLFNBRGtCLEdBQ04sSUFESixHQUNXLElBRDVCO0FBRUE7Ozs7Ozs7OzsrQkFLWSxVLEVBQVksUyxFQUFXLFEsRUFBVTtBQUM3QyxPQUFJLGNBQWMsSUFBSSxTQUFTLFdBQWIsQ0FBeUIsVUFBekIsQ0FBbEI7QUFDQSxRQUFLLE1BQUwsR0FBYyxJQUFJLFNBQVMsTUFBYixDQUFvQixXQUFwQixFQUFpQyxTQUFqQyxDQUFkO0FBQ0EsUUFBSyxNQUFMLENBQVksQ0FBWixHQUFnQixZQUFZLFNBQVMsQ0FBckIsR0FBeUIsU0FBUyxDQUFsQyxHQUFzQyxDQUF0RDtBQUNBLFFBQUssTUFBTCxDQUFZLENBQVosR0FBZ0IsWUFBWSxTQUFTLENBQXJCLEdBQXlCLFNBQVMsQ0FBbEMsR0FBc0MsQ0FBdEQ7QUFDQTs7Ozs7OztrQ0FJZSxTLEVBQVcsUyxFQUFXLFEsRUFBVSxNLEVBQVE7QUFDdkQsT0FBSSxLQUFLLE1BQUwsQ0FBWSxnQkFBWixLQUFpQyxPQUFqQyxJQUE0QyxTQUFoRCxFQUEyRDtBQUMxRCxTQUFLLE1BQUwsQ0FBWSxXQUFaLENBQXdCLFNBQXhCO0FBQ0EsSUFGRCxNQUVPLElBQUksY0FBYyxNQUFsQixFQUEwQjtBQUNoQyxTQUFLLE1BQUwsQ0FBWSxXQUFaLENBQXdCLE9BQXhCO0FBQ0E7QUFDRCxPQUFJLGNBQWMsTUFBbEIsRUFBMEI7QUFDekIsUUFBSSxLQUFLLFNBQUwsS0FBbUIsT0FBdkIsRUFBZ0M7QUFDL0IsVUFBSyxNQUFMLENBQVksTUFBWixJQUFzQixDQUFDLENBQXZCO0FBQ0EsVUFBSyxNQUFMLENBQVksQ0FBWixJQUFpQixTQUFTLE1BQVQsR0FBa0IsQ0FBbkM7QUFDQSxVQUFLLFNBQUwsR0FBaUIsTUFBakI7QUFDQTtBQUNELFNBQUssTUFBTCxDQUFZLENBQVosSUFBaUIsUUFBakI7QUFDQSxJQVBELE1BT08sSUFBSSxjQUFjLE9BQWxCLEVBQTJCO0FBQ2pDLFFBQUksS0FBSyxTQUFMLEtBQW1CLE1BQXZCLEVBQStCO0FBQzlCLFVBQUssTUFBTCxDQUFZLE1BQVosSUFBc0IsQ0FBQyxDQUF2QjtBQUNBLFVBQUssTUFBTCxDQUFZLENBQVosSUFBaUIsU0FBUyxNQUFULEdBQWtCLENBQW5DO0FBQ0EsVUFBSyxTQUFMLEdBQWlCLE9BQWpCO0FBQ0E7QUFDRCxTQUFLLE1BQUwsQ0FBWSxDQUFaLElBQWlCLFFBQWpCO0FBQ0E7QUFDRCxPQUFJLEtBQUssTUFBTCxDQUFZLENBQVosR0FBZ0IsQ0FBQyxDQUFyQixFQUF3QjtBQUN2QixTQUFLLE1BQUwsQ0FBWSxDQUFaLEdBQWdCLENBQWhCO0FBQ0EsSUFGRCxNQUVPLElBQUksS0FBSyxNQUFMLENBQVksQ0FBWixHQUFnQixHQUFwQixFQUF5QjtBQUMvQixTQUFLLE1BQUwsQ0FBWSxDQUFaLEdBQWdCLEdBQWhCO0FBQ0E7QUFDRDs7Ozs7O0FBRUQ7O0FBRUQsT0FBTyxTQUFQLEdBQW1CLFNBQW5COztJQUVNLEc7OztBQUVMLGNBQVksS0FBWixFQUFtQixLQUFuQixFQUEwQixPQUExQixFQUFtQztBQUFBOztBQUFBLGdGQUM1QixLQUQ0QixFQUNyQixLQURxQixFQUNkLE9BRGM7QUFFbEM7Ozs7a0NBRWUsTSxFQUFRLFMsRUFBVztBQUNsQyxlQUFZLEtBQUssTUFBTCxDQUFZLFdBQVosQ0FBd0IsU0FBeEIsQ0FBWixHQUFpRCxJQUFqRDtBQUNBLFFBQUssRUFBTCxJQUFXLE9BQU8sR0FBUCxHQUFhLEtBQUssR0FBN0I7QUFDQSxRQUFLLE1BQUwsQ0FBWSxDQUFaLElBQWlCLEtBQUssTUFBTCxDQUFZLENBQVosR0FBZ0IsT0FBTyxNQUFQLENBQWMsQ0FBOUIsR0FBa0MsRUFBbEMsR0FBdUMsQ0FBQyxFQUF6RDtBQUNBOzs7O0VBVmdCLFM7O0FBY2xCLE9BQU8sR0FBUCxHQUFhLEdBQWI7O0lBRU0sSTs7O0FBQ0wsZUFBWSxLQUFaLEVBQW1CLEtBQW5CLEVBQTBCLE9BQTFCLEVBQW1DO0FBQUE7O0FBQUEsaUZBQzVCLEtBRDRCLEVBQ3JCLEtBRHFCLEVBQ2QsT0FEYztBQUVsQzs7OztrQ0FFZSxNLEVBQVEsUyxFQUFXO0FBQ2xDLGVBQVksS0FBSyxNQUFMLENBQVksV0FBWixDQUF3QixTQUF4QixDQUFaLEdBQWlELElBQWpEO0FBQ0EsUUFBSyxFQUFMLElBQVcsT0FBTyxHQUFQLEdBQWEsS0FBSyxHQUE3QjtBQUNBLFFBQUssTUFBTCxDQUFZLENBQVosSUFBaUIsS0FBSyxNQUFMLENBQVksQ0FBWixHQUFnQixPQUFPLE1BQVAsQ0FBYyxDQUE5QixHQUFrQyxFQUFsQyxHQUF1QyxDQUFDLEVBQXpEO0FBQ0E7Ozs7RUFUaUIsRzs7QUFZbkIsT0FBTyxJQUFQLEdBQWMsSUFBZCIsImZpbGUiOiJtb2JzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogKioqKioqKioqKioqKioqKioqKiogUEFSRU5UIENMQVNTIEZPUiBBTEwgQ0hBUlMgKioqKioqKioqKioqKioqKioqKioqICovXG5cbmNsYXNzIENoYXJhY3RlciB7XG5cdFxuXHRjb25zdHJ1Y3RvcihpbWFnZSwgc3RhdHMsIG9wdGlvbnMpIHtcblx0XHR0aGlzLmltYWdlID0gaW1hZ2U7XG5cdFx0dGhpcy5tYXhIUCA9IHN0YXRzLmhwO1xuXHRcdHRoaXMuaHAgPSBzdGF0cy5ocDtcblx0XHR0aGlzLmF0ayA9IHN0YXRzLmF0aztcblx0XHR0aGlzLmRlZiA9IHN0YXRzLmRlZjtcblx0XHR0aGlzLmRpcmVjdGlvbiA9IG9wdGlvbnMgPyBvcHRpb25zLmRpcmVjdGlvbiA/IFxuXHRcdFx0b3B0aW9ucy5kaXJlY3Rpb24gOiBudWxsIDogbnVsbDtcblx0fVxuXG5cdC8vIFBhcmFtZXRlcnMgYXJlIGFuIG9iamVjdCBzZXQgdXBvbiBpbnZva2luZyB0aGUgZnVuY3Rpb24gd2hpbGUgYW5pbWF0aW9uXG5cdC8vIGV4cGVjdHMgYSBzdHJpbmcgdG8gcG9pbnQgd2hpY2ggYW5pbWF0aW9uIGluIHRoZSBzcHJpdGUgc2hlZXQgdG8gdXNlLiBcblx0Ly8gUG9zaXRpb24gaXMgYW4gb3B0aW9uYWwgb2JqZWN0IHRvIHNwZWNpZnkgeCBhbmQgeSBwcm9wZXJ0aWVzLiBcblx0Y3JlYXRlU3ByaXRlKHBhcmFtZXRlcnMsIGFuaW1hdGlvbiwgcG9zaXRpb24pIHtcblx0XHR2YXIgc3ByaXRlU2hlZXQgPSBuZXcgY3JlYXRlanMuU3ByaXRlU2hlZXQocGFyYW1ldGVycyk7XG5cdFx0dGhpcy5zcHJpdGUgPSBuZXcgY3JlYXRlanMuU3ByaXRlKHNwcml0ZVNoZWV0LCBhbmltYXRpb24pO1xuXHRcdHRoaXMuc3ByaXRlLnggPSBwb3NpdGlvbiAmJiBwb3NpdGlvbi54ID8gcG9zaXRpb24ueCA6IDA7XG5cdFx0dGhpcy5zcHJpdGUueSA9IHBvc2l0aW9uICYmIHBvc2l0aW9uLnkgPyBwb3NpdGlvbi55IDogMDtcblx0fVxuXG5cdC8vIERpcmVjdGlvbiBhbmQgYW5pbWF0aW9uIGJvdGggdGFrZSBzdHJpbmdzLiBBbmltYXRpb24gaXMgb3B0aW9uYWwsIGNhbiBkZXNjcmliZSB3aGF0XG5cdC8vIGRpcmVjdGlvbiB0aGUgb2JqZWN0IHNob3VsZCBmYWNlIGFuZCB0aGUgc3ByaXRlIGFuaW1hdGlvbiB0byB1dGlsaXplLiBcblx0aGFuZGxlQW5pbWF0aW9uKGRpcmVjdGlvbiwgYW5pbWF0aW9uLCBkaXN0YW5jZSwgYWRqdXN0KSB7XG5cdFx0aWYgKHRoaXMuc3ByaXRlLmN1cnJlbnRBbmltYXRpb24gPT09ICdzdGFuZCcgJiYgZGlyZWN0aW9uKSB7XG5cdFx0XHR0aGlzLnNwcml0ZS5nb3RvQW5kUGxheShhbmltYXRpb24pO1xuXHRcdH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnc3RvcCcpIHtcblx0XHRcdHRoaXMuc3ByaXRlLmdvdG9BbmRQbGF5KCdzdGFuZCcpO1xuXHRcdH1cblx0XHRpZiAoZGlyZWN0aW9uID09PSAnbGVmdCcpIHtcblx0XHRcdGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xuXHRcdFx0XHR0aGlzLnNwcml0ZS5zY2FsZVggKj0gLTE7XG5cdFx0XHRcdHRoaXMuc3ByaXRlLnggKz0gYWRqdXN0ID8gYWRqdXN0IDogMDtcblx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnbGVmdCc7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLnNwcml0ZS54IC09IGRpc3RhbmNlO1xuXHRcdH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XG5cdFx0XHRpZiAodGhpcy5kaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xuXHRcdFx0XHR0aGlzLnNwcml0ZS5zY2FsZVggKj0gLTE7XG5cdFx0XHRcdHRoaXMuc3ByaXRlLnggLT0gYWRqdXN0ID8gYWRqdXN0IDogMDtcblx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAncmlnaHQnO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5zcHJpdGUueCArPSBkaXN0YW5jZTtcblx0XHR9XG5cdFx0aWYgKHRoaXMuc3ByaXRlLnggPCAtNSkge1xuXHRcdFx0dGhpcy5zcHJpdGUueCA9IDA7XG5cdFx0fSBlbHNlIGlmICh0aGlzLnNwcml0ZS54ID4gMzAwKSB7XG5cdFx0XHR0aGlzLnNwcml0ZS54ID0gMjk1O1xuXHRcdH1cblx0fVxuXG59O1xuXG53aW5kb3cuQ2hhcmFjdGVyID0gQ2hhcmFjdGVyO1xuXG5jbGFzcyBNb2IgZXh0ZW5kcyBDaGFyYWN0ZXIge1xuXG5cdGNvbnN0cnVjdG9yKGltYWdlLCBzdGF0cywgb3B0aW9ucykge1xuXHRcdHN1cGVyKGltYWdlLCBzdGF0cywgb3B0aW9ucyk7XG5cdH1cblxuXHRoYW5kbGVLbm9ja2JhY2socGxheWVyLCBhbmltYXRpb24pIHtcblx0XHRhbmltYXRpb24gPyB0aGlzLnNwcml0ZS5nb3RvQW5kUGxheShhbmltYXRpb24pIDogbnVsbDtcblx0XHR0aGlzLmhwIC09IHBsYXllci5hdGsgLSB0aGlzLmRlZjtcblx0XHR0aGlzLnNwcml0ZS54ICs9IHRoaXMuc3ByaXRlLnggPiBwbGF5ZXIuc3ByaXRlLnggPyA2MCA6IC02MDtcblx0fVxuXG59XG5cbndpbmRvdy5Nb2IgPSBNb2I7XG5cbmNsYXNzIEJvc3MgZXh0ZW5kcyBNb2Ige1xuXHRjb25zdHJ1Y3RvcihpbWFnZSwgc3RhdHMsIG9wdGlvbnMpIHtcblx0XHRzdXBlcihpbWFnZSwgc3RhdHMsIG9wdGlvbnMpO1xuXHR9XG5cblx0aGFuZGxlS25vY2tiYWNrKHBsYXllciwgYW5pbWF0aW9uKSB7XG5cdFx0YW5pbWF0aW9uID8gdGhpcy5zcHJpdGUuZ290b0FuZFBsYXkoYW5pbWF0aW9uKSA6IG51bGw7XG5cdFx0dGhpcy5ocCAtPSBwbGF5ZXIuYXRrIC0gdGhpcy5kZWY7XG5cdFx0dGhpcy5zcHJpdGUueCArPSB0aGlzLnNwcml0ZS54ID4gcGxheWVyLnNwcml0ZS54ID8gMzAgOiAtMzA7XG5cdH1cbn1cblxud2luZG93LkJvc3MgPSBCb3NzO1xuXG5cblxuXG5cblxuXG5cbiJdfQ==