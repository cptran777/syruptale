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
		this.hp = stats.hp;
		this.atk = stats.atk;
		this.def = stats.def;
		console.log('options check ', options);
		this.direction = options ? options.direction ? options.direction : null : null;
		console.log('direction check ', this.direction);
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

	return Mob;
}(Character);

window.Mob = Mob;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NjcmlwdHMvbW9icy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFFTSxTO0FBRUwsb0JBQVksS0FBWixFQUFtQixLQUFuQixFQUEwQixPQUExQixFQUFtQztBQUFBOztBQUNsQyxPQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsT0FBSyxFQUFMLEdBQVUsTUFBTSxFQUFoQjtBQUNBLE9BQUssR0FBTCxHQUFXLE1BQU0sR0FBakI7QUFDQSxPQUFLLEdBQUwsR0FBVyxNQUFNLEdBQWpCO0FBQ0EsVUFBUSxHQUFSLENBQVksZ0JBQVosRUFBOEIsT0FBOUI7QUFDQSxPQUFLLFNBQUwsR0FBaUIsVUFBVSxRQUFRLFNBQVIsR0FDMUIsUUFBUSxTQURrQixHQUNOLElBREosR0FDVyxJQUQ1QjtBQUVBLFVBQVEsR0FBUixDQUFZLGtCQUFaLEVBQWdDLEtBQUssU0FBckM7QUFDQTs7Ozs7Ozs7OytCQUtZLFUsRUFBWSxTLEVBQVcsUSxFQUFVO0FBQzdDLE9BQUksY0FBYyxJQUFJLFNBQVMsV0FBYixDQUF5QixVQUF6QixDQUFsQjtBQUNBLFFBQUssTUFBTCxHQUFjLElBQUksU0FBUyxNQUFiLENBQW9CLFdBQXBCLEVBQWlDLFNBQWpDLENBQWQ7QUFDQSxRQUFLLE1BQUwsQ0FBWSxDQUFaLEdBQWdCLFlBQVksU0FBUyxDQUFyQixHQUF5QixTQUFTLENBQWxDLEdBQXNDLENBQXREO0FBQ0EsUUFBSyxNQUFMLENBQVksQ0FBWixHQUFnQixZQUFZLFNBQVMsQ0FBckIsR0FBeUIsU0FBUyxDQUFsQyxHQUFzQyxDQUF0RDtBQUNBOzs7Ozs7O2tDQUllLFMsRUFBVyxTLEVBQVcsUSxFQUFVLE0sRUFBUTtBQUN2RCxPQUFJLEtBQUssTUFBTCxDQUFZLGdCQUFaLEtBQWlDLE9BQWpDLElBQTRDLFNBQWhELEVBQTJEO0FBQzFELFNBQUssTUFBTCxDQUFZLFdBQVosQ0FBd0IsU0FBeEI7QUFDQTtBQUNELE9BQUksY0FBYyxNQUFsQixFQUEwQjtBQUN6QixRQUFJLEtBQUssU0FBTCxLQUFtQixPQUF2QixFQUFnQztBQUMvQixVQUFLLE1BQUwsQ0FBWSxNQUFaLElBQXNCLENBQUMsQ0FBdkI7QUFDQSxVQUFLLE1BQUwsQ0FBWSxDQUFaLElBQWlCLFNBQVMsTUFBVCxHQUFrQixDQUFuQztBQUNBLFVBQUssU0FBTCxHQUFpQixNQUFqQjtBQUNBO0FBQ0QsU0FBSyxNQUFMLENBQVksQ0FBWixJQUFpQixRQUFqQjtBQUNBLElBUEQsTUFPTyxJQUFJLGNBQWMsT0FBbEIsRUFBMkI7QUFDakMsUUFBSSxLQUFLLFNBQUwsS0FBbUIsTUFBdkIsRUFBK0I7QUFDOUIsVUFBSyxNQUFMLENBQVksTUFBWixJQUFzQixDQUFDLENBQXZCO0FBQ0EsVUFBSyxNQUFMLENBQVksQ0FBWixJQUFpQixTQUFTLE1BQVQsR0FBa0IsQ0FBbkM7QUFDQSxVQUFLLFNBQUwsR0FBaUIsT0FBakI7QUFDQTtBQUNELFNBQUssTUFBTCxDQUFZLENBQVosSUFBaUIsUUFBakI7QUFDQTtBQUNEOzs7Ozs7QUFFRDs7QUFFRCxPQUFPLFNBQVAsR0FBbUIsU0FBbkI7O0lBRU0sRzs7O0FBRUwsY0FBWSxLQUFaLEVBQW1CLEtBQW5CLEVBQTBCLE9BQTFCLEVBQW1DO0FBQUE7O0FBQUEsZ0ZBQzVCLEtBRDRCLEVBQ3JCLEtBRHFCLEVBQ2QsT0FEYztBQUVsQzs7O0VBSmdCLFM7O0FBUWxCLE9BQU8sR0FBUCxHQUFhLEdBQWIiLCJmaWxlIjoibW9icy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qICoqKioqKioqKioqKioqKioqKioqIFBBUkVOVCBDTEFTUyBGT1IgQUxMIENIQVJTICoqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5jbGFzcyBDaGFyYWN0ZXIge1xuXHRcblx0Y29uc3RydWN0b3IoaW1hZ2UsIHN0YXRzLCBvcHRpb25zKSB7XG5cdFx0dGhpcy5pbWFnZSA9IGltYWdlO1xuXHRcdHRoaXMuaHAgPSBzdGF0cy5ocDtcblx0XHR0aGlzLmF0ayA9IHN0YXRzLmF0aztcblx0XHR0aGlzLmRlZiA9IHN0YXRzLmRlZjtcblx0XHRjb25zb2xlLmxvZygnb3B0aW9ucyBjaGVjayAnLCBvcHRpb25zKTtcblx0XHR0aGlzLmRpcmVjdGlvbiA9IG9wdGlvbnMgPyBvcHRpb25zLmRpcmVjdGlvbiA/IFxuXHRcdFx0b3B0aW9ucy5kaXJlY3Rpb24gOiBudWxsIDogbnVsbDtcblx0XHRjb25zb2xlLmxvZygnZGlyZWN0aW9uIGNoZWNrICcsIHRoaXMuZGlyZWN0aW9uKTtcblx0fVxuXG5cdC8vIFBhcmFtZXRlcnMgYXJlIGFuIG9iamVjdCBzZXQgdXBvbiBpbnZva2luZyB0aGUgZnVuY3Rpb24gd2hpbGUgYW5pbWF0aW9uXG5cdC8vIGV4cGVjdHMgYSBzdHJpbmcgdG8gcG9pbnQgd2hpY2ggYW5pbWF0aW9uIGluIHRoZSBzcHJpdGUgc2hlZXQgdG8gdXNlLiBcblx0Ly8gUG9zaXRpb24gaXMgYW4gb3B0aW9uYWwgb2JqZWN0IHRvIHNwZWNpZnkgeCBhbmQgeSBwcm9wZXJ0aWVzLiBcblx0Y3JlYXRlU3ByaXRlKHBhcmFtZXRlcnMsIGFuaW1hdGlvbiwgcG9zaXRpb24pIHtcblx0XHR2YXIgc3ByaXRlU2hlZXQgPSBuZXcgY3JlYXRlanMuU3ByaXRlU2hlZXQocGFyYW1ldGVycyk7XG5cdFx0dGhpcy5zcHJpdGUgPSBuZXcgY3JlYXRlanMuU3ByaXRlKHNwcml0ZVNoZWV0LCBhbmltYXRpb24pO1xuXHRcdHRoaXMuc3ByaXRlLnggPSBwb3NpdGlvbiAmJiBwb3NpdGlvbi54ID8gcG9zaXRpb24ueCA6IDA7XG5cdFx0dGhpcy5zcHJpdGUueSA9IHBvc2l0aW9uICYmIHBvc2l0aW9uLnkgPyBwb3NpdGlvbi55IDogMDtcblx0fVxuXG5cdC8vIERpcmVjdGlvbiBhbmQgYW5pbWF0aW9uIGJvdGggdGFrZSBzdHJpbmdzLiBBbmltYXRpb24gaXMgb3B0aW9uYWwsIGNhbiBkZXNjcmliZSB3aGF0XG5cdC8vIGRpcmVjdGlvbiB0aGUgb2JqZWN0IHNob3VsZCBmYWNlIGFuZCB0aGUgc3ByaXRlIGFuaW1hdGlvbiB0byB1dGlsaXplLiBcblx0aGFuZGxlQW5pbWF0aW9uKGRpcmVjdGlvbiwgYW5pbWF0aW9uLCBkaXN0YW5jZSwgYWRqdXN0KSB7XG5cdFx0aWYgKHRoaXMuc3ByaXRlLmN1cnJlbnRBbmltYXRpb24gPT09ICdzdGFuZCcgJiYgZGlyZWN0aW9uKSB7XG5cdFx0XHR0aGlzLnNwcml0ZS5nb3RvQW5kUGxheShhbmltYXRpb24pO1xuXHRcdH1cblx0XHRpZiAoZGlyZWN0aW9uID09PSAnbGVmdCcpIHtcblx0XHRcdGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xuXHRcdFx0XHR0aGlzLnNwcml0ZS5zY2FsZVggKj0gLTE7XG5cdFx0XHRcdHRoaXMuc3ByaXRlLnggKz0gYWRqdXN0ID8gYWRqdXN0IDogMDtcblx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnbGVmdCc7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLnNwcml0ZS54IC09IGRpc3RhbmNlO1xuXHRcdH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XG5cdFx0XHRpZiAodGhpcy5kaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xuXHRcdFx0XHR0aGlzLnNwcml0ZS5zY2FsZVggKj0gLTE7XG5cdFx0XHRcdHRoaXMuc3ByaXRlLnggLT0gYWRqdXN0ID8gYWRqdXN0IDogMDtcblx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAncmlnaHQnO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5zcHJpdGUueCArPSBkaXN0YW5jZTtcblx0XHR9XG5cdH1cblxufTtcblxud2luZG93LkNoYXJhY3RlciA9IENoYXJhY3RlcjtcblxuY2xhc3MgTW9iIGV4dGVuZHMgQ2hhcmFjdGVyIHtcblxuXHRjb25zdHJ1Y3RvcihpbWFnZSwgc3RhdHMsIG9wdGlvbnMpIHtcblx0XHRzdXBlcihpbWFnZSwgc3RhdHMsIG9wdGlvbnMpO1xuXHR9XG5cbn1cblxud2luZG93Lk1vYiA9IE1vYjtcblxuXG5cblxuXG5cblxuXG4iXX0=