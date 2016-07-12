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
		value: function handleAnimation(direction, animation, distance) {
			if (this.sprite.currentAnimation !== animation && direction) {
				this.sprite.gotoAndPlay(animation);
			}
			if (direction === 'left') {
				if (this.direction === 'right') {
					this.sprite.scaleX *= -1;
					this.sprite.x += 60;
					this.direction = 'left';
				}
				this.sprite.x -= distance;
			} else if (direction === 'right') {
				if (this.direction === 'left') {
					this.sprite.scaleX *= -1;
					this.sprite.x -= 60;
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

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Mob).call(this, image, stats));
	}

	return Mob;
}(Character);

window.Mob = Mob;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NjcmlwdHMvbW9icy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFFTSxTO0FBRUwsb0JBQVksS0FBWixFQUFtQixLQUFuQixFQUEwQixPQUExQixFQUFtQztBQUFBOztBQUNsQyxPQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsT0FBSyxFQUFMLEdBQVUsTUFBTSxFQUFoQjtBQUNBLE9BQUssR0FBTCxHQUFXLE1BQU0sR0FBakI7QUFDQSxPQUFLLEdBQUwsR0FBVyxNQUFNLEdBQWpCO0FBQ0EsT0FBSyxTQUFMLEdBQWlCLFVBQVUsUUFBUSxTQUFSLEdBQzFCLFFBQVEsU0FEa0IsR0FDTixJQURKLEdBQ1csSUFENUI7QUFFQTs7Ozs7Ozs7OytCQUtZLFUsRUFBWSxTLEVBQVcsUSxFQUFVO0FBQzdDLE9BQUksY0FBYyxJQUFJLFNBQVMsV0FBYixDQUF5QixVQUF6QixDQUFsQjtBQUNBLFFBQUssTUFBTCxHQUFjLElBQUksU0FBUyxNQUFiLENBQW9CLFdBQXBCLEVBQWlDLFNBQWpDLENBQWQ7QUFDQSxRQUFLLE1BQUwsQ0FBWSxDQUFaLEdBQWdCLFlBQVksU0FBUyxDQUFyQixHQUF5QixTQUFTLENBQWxDLEdBQXNDLENBQXREO0FBQ0EsUUFBSyxNQUFMLENBQVksQ0FBWixHQUFnQixZQUFZLFNBQVMsQ0FBckIsR0FBeUIsU0FBUyxDQUFsQyxHQUFzQyxDQUF0RDtBQUNBOzs7Ozs7O2tDQUllLFMsRUFBVyxTLEVBQVcsUSxFQUFVO0FBQy9DLE9BQUksS0FBSyxNQUFMLENBQVksZ0JBQVosS0FBaUMsU0FBakMsSUFBOEMsU0FBbEQsRUFBNkQ7QUFDNUQsU0FBSyxNQUFMLENBQVksV0FBWixDQUF3QixTQUF4QjtBQUNBO0FBQ0QsT0FBSSxjQUFjLE1BQWxCLEVBQTBCO0FBQ3pCLFFBQUksS0FBSyxTQUFMLEtBQW1CLE9BQXZCLEVBQWdDO0FBQy9CLFVBQUssTUFBTCxDQUFZLE1BQVosSUFBc0IsQ0FBQyxDQUF2QjtBQUNBLFVBQUssTUFBTCxDQUFZLENBQVosSUFBaUIsRUFBakI7QUFDQSxVQUFLLFNBQUwsR0FBaUIsTUFBakI7QUFDQTtBQUNELFNBQUssTUFBTCxDQUFZLENBQVosSUFBaUIsUUFBakI7QUFDQSxJQVBELE1BT08sSUFBSSxjQUFjLE9BQWxCLEVBQTJCO0FBQ2pDLFFBQUksS0FBSyxTQUFMLEtBQW1CLE1BQXZCLEVBQStCO0FBQzlCLFVBQUssTUFBTCxDQUFZLE1BQVosSUFBc0IsQ0FBQyxDQUF2QjtBQUNBLFVBQUssTUFBTCxDQUFZLENBQVosSUFBaUIsRUFBakI7QUFDQSxVQUFLLFNBQUwsR0FBaUIsT0FBakI7QUFDQTtBQUNELFNBQUssTUFBTCxDQUFZLENBQVosSUFBaUIsUUFBakI7QUFDQTtBQUNEOzs7Ozs7QUFFRDs7QUFFRCxPQUFPLFNBQVAsR0FBbUIsU0FBbkI7O0lBRU0sRzs7O0FBRUwsY0FBWSxLQUFaLEVBQW1CLEtBQW5CLEVBQTBCLE9BQTFCLEVBQW1DO0FBQUE7O0FBQUEsZ0ZBQzVCLEtBRDRCLEVBQ3JCLEtBRHFCO0FBRWxDOzs7RUFKZ0IsUzs7QUFRbEIsT0FBTyxHQUFQLEdBQWEsR0FBYiIsImZpbGUiOiJtb2JzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogKioqKioqKioqKioqKioqKioqKiogUEFSRU5UIENMQVNTIEZPUiBBTEwgQ0hBUlMgKioqKioqKioqKioqKioqKioqKioqICovXG5cbmNsYXNzIENoYXJhY3RlciB7XG5cdFxuXHRjb25zdHJ1Y3RvcihpbWFnZSwgc3RhdHMsIG9wdGlvbnMpIHtcblx0XHR0aGlzLmltYWdlID0gaW1hZ2U7XG5cdFx0dGhpcy5ocCA9IHN0YXRzLmhwO1xuXHRcdHRoaXMuYXRrID0gc3RhdHMuYXRrO1xuXHRcdHRoaXMuZGVmID0gc3RhdHMuZGVmO1xuXHRcdHRoaXMuZGlyZWN0aW9uID0gb3B0aW9ucyA/IG9wdGlvbnMuZGlyZWN0aW9uID8gXG5cdFx0XHRvcHRpb25zLmRpcmVjdGlvbiA6IG51bGwgOiBudWxsO1xuXHR9XG5cblx0Ly8gUGFyYW1ldGVycyBhcmUgYW4gb2JqZWN0IHNldCB1cG9uIGludm9raW5nIHRoZSBmdW5jdGlvbiB3aGlsZSBhbmltYXRpb25cblx0Ly8gZXhwZWN0cyBhIHN0cmluZyB0byBwb2ludCB3aGljaCBhbmltYXRpb24gaW4gdGhlIHNwcml0ZSBzaGVldCB0byB1c2UuIFxuXHQvLyBQb3NpdGlvbiBpcyBhbiBvcHRpb25hbCBvYmplY3QgdG8gc3BlY2lmeSB4IGFuZCB5IHByb3BlcnRpZXMuIFxuXHRjcmVhdGVTcHJpdGUocGFyYW1ldGVycywgYW5pbWF0aW9uLCBwb3NpdGlvbikge1xuXHRcdHZhciBzcHJpdGVTaGVldCA9IG5ldyBjcmVhdGVqcy5TcHJpdGVTaGVldChwYXJhbWV0ZXJzKTtcblx0XHR0aGlzLnNwcml0ZSA9IG5ldyBjcmVhdGVqcy5TcHJpdGUoc3ByaXRlU2hlZXQsIGFuaW1hdGlvbik7XG5cdFx0dGhpcy5zcHJpdGUueCA9IHBvc2l0aW9uICYmIHBvc2l0aW9uLnggPyBwb3NpdGlvbi54IDogMDtcblx0XHR0aGlzLnNwcml0ZS55ID0gcG9zaXRpb24gJiYgcG9zaXRpb24ueSA/IHBvc2l0aW9uLnkgOiAwO1xuXHR9XG5cblx0Ly8gRGlyZWN0aW9uIGFuZCBhbmltYXRpb24gYm90aCB0YWtlIHN0cmluZ3MuIEFuaW1hdGlvbiBpcyBvcHRpb25hbCwgY2FuIGRlc2NyaWJlIHdoYXRcblx0Ly8gZGlyZWN0aW9uIHRoZSBvYmplY3Qgc2hvdWxkIGZhY2UgYW5kIHRoZSBzcHJpdGUgYW5pbWF0aW9uIHRvIHV0aWxpemUuIFxuXHRoYW5kbGVBbmltYXRpb24oZGlyZWN0aW9uLCBhbmltYXRpb24sIGRpc3RhbmNlKSB7XG5cdFx0aWYgKHRoaXMuc3ByaXRlLmN1cnJlbnRBbmltYXRpb24gIT09IGFuaW1hdGlvbiAmJiBkaXJlY3Rpb24pIHtcblx0XHRcdHRoaXMuc3ByaXRlLmdvdG9BbmRQbGF5KGFuaW1hdGlvbik7XG5cdFx0fVxuXHRcdGlmIChkaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xuXHRcdFx0aWYgKHRoaXMuZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XG5cdFx0XHRcdHRoaXMuc3ByaXRlLnNjYWxlWCAqPSAtMTtcblx0XHRcdFx0dGhpcy5zcHJpdGUueCArPSA2MDtcblx0XHRcdFx0dGhpcy5kaXJlY3Rpb24gPSAnbGVmdCc7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLnNwcml0ZS54IC09IGRpc3RhbmNlO1xuXHRcdH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XG5cdFx0XHRpZiAodGhpcy5kaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xuXHRcdFx0XHR0aGlzLnNwcml0ZS5zY2FsZVggKj0gLTE7XG5cdFx0XHRcdHRoaXMuc3ByaXRlLnggLT0gNjA7XG5cdFx0XHRcdHRoaXMuZGlyZWN0aW9uID0gJ3JpZ2h0Jztcblx0XHRcdH1cblx0XHRcdHRoaXMuc3ByaXRlLnggKz0gZGlzdGFuY2U7XG5cdFx0fVxuXHR9XG5cbn07XG5cbndpbmRvdy5DaGFyYWN0ZXIgPSBDaGFyYWN0ZXI7XG5cbmNsYXNzIE1vYiBleHRlbmRzIENoYXJhY3RlciB7XG5cblx0Y29uc3RydWN0b3IoaW1hZ2UsIHN0YXRzLCBvcHRpb25zKSB7XG5cdFx0c3VwZXIoaW1hZ2UsIHN0YXRzKTtcblx0fVxuXG59XG5cbndpbmRvdy5Nb2IgPSBNb2I7XG5cblxuXG5cblxuXG5cblxuIl19