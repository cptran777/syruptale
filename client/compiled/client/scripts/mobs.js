"use strict";

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
		key: "createSprite",
		value: function createSprite(parameters, animation, position) {
			var spriteSheet = new createjs.SpriteSheet(parameters);
			this.sprite = new createjs.Sprite(spriteSheet, animation);
			this.sprite.x = position && position.x ? position.x : 0;
			this.sprite.y = position && position.y ? position.y : 0;
		}

		// Direction and animation both take strings. Optional, can describe what
		// direction the object should face and the sprite animation to utilize.

	}, {
		key: "handleAnimation",
		value: function handleAnimation(direction, animation) {}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NjcmlwdHMvbW9icy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFFTSxTO0FBRUwsb0JBQVksS0FBWixFQUFtQixLQUFuQixFQUEwQixPQUExQixFQUFtQztBQUFBOztBQUNsQyxPQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsT0FBSyxFQUFMLEdBQVUsTUFBTSxFQUFoQjtBQUNBLE9BQUssR0FBTCxHQUFXLE1BQU0sR0FBakI7QUFDQSxPQUFLLEdBQUwsR0FBVyxNQUFNLEdBQWpCO0FBQ0EsT0FBSyxTQUFMLEdBQWlCLFVBQVUsUUFBUSxTQUFSLEdBQzFCLFFBQVEsU0FEa0IsR0FDTixJQURKLEdBQ1csSUFENUI7QUFFQTs7Ozs7Ozs7OytCQUtZLFUsRUFBWSxTLEVBQVcsUSxFQUFVO0FBQzdDLE9BQUksY0FBYyxJQUFJLFNBQVMsV0FBYixDQUF5QixVQUF6QixDQUFsQjtBQUNBLFFBQUssTUFBTCxHQUFjLElBQUksU0FBUyxNQUFiLENBQW9CLFdBQXBCLEVBQWlDLFNBQWpDLENBQWQ7QUFDQSxRQUFLLE1BQUwsQ0FBWSxDQUFaLEdBQWdCLFlBQVksU0FBUyxDQUFyQixHQUF5QixTQUFTLENBQWxDLEdBQXNDLENBQXREO0FBQ0EsUUFBSyxNQUFMLENBQVksQ0FBWixHQUFnQixZQUFZLFNBQVMsQ0FBckIsR0FBeUIsU0FBUyxDQUFsQyxHQUFzQyxDQUF0RDtBQUNBOzs7Ozs7O2tDQUllLFMsRUFBVyxTLEVBQVcsQ0FFckM7Ozs7OztBQUVEOztBQUVELE9BQU8sU0FBUCxHQUFtQixTQUFuQjs7SUFFTSxHOzs7QUFFTCxjQUFZLEtBQVosRUFBbUIsS0FBbkIsRUFBMEIsT0FBMUIsRUFBbUM7QUFBQTs7QUFBQSxnRkFDNUIsS0FENEIsRUFDckIsS0FEcUI7QUFFbEM7OztFQUpnQixTOztBQVFsQixPQUFPLEdBQVAsR0FBYSxHQUFiIiwiZmlsZSI6Im1vYnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAqKioqKioqKioqKioqKioqKioqKiBQQVJFTlQgQ0xBU1MgRk9SIEFMTCBDSEFSUyAqKioqKioqKioqKioqKioqKioqKiogKi9cblxuY2xhc3MgQ2hhcmFjdGVyIHtcblx0XG5cdGNvbnN0cnVjdG9yKGltYWdlLCBzdGF0cywgb3B0aW9ucykge1xuXHRcdHRoaXMuaW1hZ2UgPSBpbWFnZTtcblx0XHR0aGlzLmhwID0gc3RhdHMuaHA7XG5cdFx0dGhpcy5hdGsgPSBzdGF0cy5hdGs7XG5cdFx0dGhpcy5kZWYgPSBzdGF0cy5kZWY7XG5cdFx0dGhpcy5kaXJlY3Rpb24gPSBvcHRpb25zID8gb3B0aW9ucy5kaXJlY3Rpb24gPyBcblx0XHRcdG9wdGlvbnMuZGlyZWN0aW9uIDogbnVsbCA6IG51bGw7XG5cdH1cblxuXHQvLyBQYXJhbWV0ZXJzIGFyZSBhbiBvYmplY3Qgc2V0IHVwb24gaW52b2tpbmcgdGhlIGZ1bmN0aW9uIHdoaWxlIGFuaW1hdGlvblxuXHQvLyBleHBlY3RzIGEgc3RyaW5nIHRvIHBvaW50IHdoaWNoIGFuaW1hdGlvbiBpbiB0aGUgc3ByaXRlIHNoZWV0IHRvIHVzZS4gXG5cdC8vIFBvc2l0aW9uIGlzIGFuIG9wdGlvbmFsIG9iamVjdCB0byBzcGVjaWZ5IHggYW5kIHkgcHJvcGVydGllcy4gXG5cdGNyZWF0ZVNwcml0ZShwYXJhbWV0ZXJzLCBhbmltYXRpb24sIHBvc2l0aW9uKSB7XG5cdFx0dmFyIHNwcml0ZVNoZWV0ID0gbmV3IGNyZWF0ZWpzLlNwcml0ZVNoZWV0KHBhcmFtZXRlcnMpO1xuXHRcdHRoaXMuc3ByaXRlID0gbmV3IGNyZWF0ZWpzLlNwcml0ZShzcHJpdGVTaGVldCwgYW5pbWF0aW9uKTtcblx0XHR0aGlzLnNwcml0ZS54ID0gcG9zaXRpb24gJiYgcG9zaXRpb24ueCA/IHBvc2l0aW9uLnggOiAwO1xuXHRcdHRoaXMuc3ByaXRlLnkgPSBwb3NpdGlvbiAmJiBwb3NpdGlvbi55ID8gcG9zaXRpb24ueSA6IDA7XG5cdH1cblxuXHQvLyBEaXJlY3Rpb24gYW5kIGFuaW1hdGlvbiBib3RoIHRha2Ugc3RyaW5ncy4gT3B0aW9uYWwsIGNhbiBkZXNjcmliZSB3aGF0XG5cdC8vIGRpcmVjdGlvbiB0aGUgb2JqZWN0IHNob3VsZCBmYWNlIGFuZCB0aGUgc3ByaXRlIGFuaW1hdGlvbiB0byB1dGlsaXplLiBcblx0aGFuZGxlQW5pbWF0aW9uKGRpcmVjdGlvbiwgYW5pbWF0aW9uKSB7XG5cdFx0XG5cdH1cblxufTtcblxud2luZG93LkNoYXJhY3RlciA9IENoYXJhY3RlcjtcblxuY2xhc3MgTW9iIGV4dGVuZHMgQ2hhcmFjdGVyIHtcblxuXHRjb25zdHJ1Y3RvcihpbWFnZSwgc3RhdHMsIG9wdGlvbnMpIHtcblx0XHRzdXBlcihpbWFnZSwgc3RhdHMpO1xuXHR9XG5cbn1cblxud2luZG93Lk1vYiA9IE1vYjtcblxuXG5cblxuXG5cblxuXG4iXX0=