'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* ***************************** PLAYER CLASS ******************************* */

// Image refers to an expected sprite sheet file, and stats are the player's
// in-game parameters as an object that will eventually be expected to be received
// from a database query.

var Player = function (_Character) {
	_inherits(Player, _Character);

	function Player(image, stats, options) {
		_classCallCheck(this, Player);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Player).call(this, image, stats, options));

		_this.spritesheetdata = [
		// Stand
		[30, 0, 48, 82, 0, 32],
		// Run
		[86, 0, 48, 82, 0, 32], [142, 0, 48, 82, 0, 32], [198, 0, 48, 82, 0, 32], [262, 0, 48, 82, 0, 32], [318, 0, 48, 82, 0, 32], [384, 0, 48, 82, 0, 32],
		// Slash
		[0, 94, 48, 82, 0, 32], [48, 94, 48, 82, 0, 32], [96, 94, 60, 82, 0, 32], [158, 94, 50, 82, 0, 32], [218, 94, 48, 82, 0, 32], [272, 94, 50, 82, 0, 32], [326, 94, 50, 82, 0, 32],
		// Dead
		[316, 170, 48, 82, 0, 32], [380, 170, 60, 82, 0, 32], [380, 170, 60, 82, 0, 32]];
		// for (var x = 30; x <= 478; x += 54) {
		// 	this.spritesheetdata.push([x, 0, 48, 84, 0, 32]);
		// }
		return _this;
	}

	_createClass(Player, [{
		key: 'handleAttack',
		value: function handleAttack() {
			if (this.sprite.currentAnimation !== 'slash') {
				this.sprite.gotoAndPlay('slash');
			}
		}
	}]);

	return Player;
}(Character);

;

window.Player = Player;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NjcmlwdHMvcGxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7SUFNTSxNOzs7QUFFTCxpQkFBWSxLQUFaLEVBQW1CLEtBQW5CLEVBQTBCLE9BQTFCLEVBQW1DO0FBQUE7O0FBQUEsd0ZBQzVCLEtBRDRCLEVBQ3JCLEtBRHFCLEVBQ2QsT0FEYzs7QUFFbEMsUUFBSyxlQUFMLEdBQXVCOztBQUV0QixHQUFDLEVBQUQsRUFBSyxDQUFMLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsQ0FBaEIsRUFBbUIsRUFBbkIsQ0FGc0I7O0FBSXRCLEdBQUMsRUFBRCxFQUFLLENBQUwsRUFBUSxFQUFSLEVBQVksRUFBWixFQUFnQixDQUFoQixFQUFtQixFQUFuQixDQUpzQixFQUt0QixDQUFDLEdBQUQsRUFBTSxDQUFOLEVBQVMsRUFBVCxFQUFhLEVBQWIsRUFBaUIsQ0FBakIsRUFBb0IsRUFBcEIsQ0FMc0IsRUFNdEIsQ0FBQyxHQUFELEVBQU0sQ0FBTixFQUFTLEVBQVQsRUFBYSxFQUFiLEVBQWlCLENBQWpCLEVBQW9CLEVBQXBCLENBTnNCLEVBT3RCLENBQUMsR0FBRCxFQUFNLENBQU4sRUFBUyxFQUFULEVBQWEsRUFBYixFQUFpQixDQUFqQixFQUFvQixFQUFwQixDQVBzQixFQVF0QixDQUFDLEdBQUQsRUFBTSxDQUFOLEVBQVMsRUFBVCxFQUFhLEVBQWIsRUFBaUIsQ0FBakIsRUFBb0IsRUFBcEIsQ0FSc0IsRUFTdEIsQ0FBQyxHQUFELEVBQU0sQ0FBTixFQUFTLEVBQVQsRUFBYSxFQUFiLEVBQWlCLENBQWpCLEVBQW9CLEVBQXBCLENBVHNCOztBQVd0QixHQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsQ0FBaEIsRUFBbUIsRUFBbkIsQ0FYc0IsRUFZdEIsQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLEVBQVQsRUFBYSxFQUFiLEVBQWlCLENBQWpCLEVBQW9CLEVBQXBCLENBWnNCLEVBYXRCLENBQUMsRUFBRCxFQUFLLEVBQUwsRUFBUyxFQUFULEVBQWEsRUFBYixFQUFpQixDQUFqQixFQUFvQixFQUFwQixDQWJzQixFQWN0QixDQUFDLEdBQUQsRUFBTSxFQUFOLEVBQVUsRUFBVixFQUFjLEVBQWQsRUFBa0IsQ0FBbEIsRUFBcUIsRUFBckIsQ0Fkc0IsRUFldEIsQ0FBQyxHQUFELEVBQU0sRUFBTixFQUFVLEVBQVYsRUFBYyxFQUFkLEVBQWtCLENBQWxCLEVBQXFCLEVBQXJCLENBZnNCLEVBZ0J0QixDQUFDLEdBQUQsRUFBTSxFQUFOLEVBQVUsRUFBVixFQUFjLEVBQWQsRUFBa0IsQ0FBbEIsRUFBcUIsRUFBckIsQ0FoQnNCLEVBaUJ0QixDQUFDLEdBQUQsRUFBTSxFQUFOLEVBQVUsRUFBVixFQUFjLEVBQWQsRUFBa0IsQ0FBbEIsRUFBcUIsRUFBckIsQ0FqQnNCOztBQW1CdEIsR0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEVBQVgsRUFBZSxFQUFmLEVBQW1CLENBQW5CLEVBQXNCLEVBQXRCLENBbkJzQixFQW9CdEIsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEVBQVgsRUFBZSxFQUFmLEVBQW1CLENBQW5CLEVBQXNCLEVBQXRCLENBcEJzQixFQXFCdEIsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEVBQVgsRUFBZSxFQUFmLEVBQW1CLENBQW5CLEVBQXNCLEVBQXRCLENBckJzQixDQUF2Qjs7OztBQUZrQztBQTRCbEM7Ozs7aUNBRWM7QUFDZCxPQUFJLEtBQUssTUFBTCxDQUFZLGdCQUFaLEtBQWlDLE9BQXJDLEVBQThDO0FBQzdDLFNBQUssTUFBTCxDQUFZLFdBQVosQ0FBd0IsT0FBeEI7QUFDQTtBQUNEOzs7O0VBcENtQixTOztBQXNDcEI7O0FBRUQsT0FBTyxNQUFQLEdBQWdCLE1BQWhCIiwiZmlsZSI6InBsYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogUExBWUVSIENMQVNTICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuLy8gSW1hZ2UgcmVmZXJzIHRvIGFuIGV4cGVjdGVkIHNwcml0ZSBzaGVldCBmaWxlLCBhbmQgc3RhdHMgYXJlIHRoZSBwbGF5ZXInc1xuLy8gaW4tZ2FtZSBwYXJhbWV0ZXJzIGFzIGFuIG9iamVjdCB0aGF0IHdpbGwgZXZlbnR1YWxseSBiZSBleHBlY3RlZCB0byBiZSByZWNlaXZlZCBcbi8vIGZyb20gYSBkYXRhYmFzZSBxdWVyeS4gXG5jbGFzcyBQbGF5ZXIgZXh0ZW5kcyBDaGFyYWN0ZXIge1xuXG5cdGNvbnN0cnVjdG9yKGltYWdlLCBzdGF0cywgb3B0aW9ucykge1xuXHRcdHN1cGVyKGltYWdlLCBzdGF0cywgb3B0aW9ucyk7XG5cdFx0dGhpcy5zcHJpdGVzaGVldGRhdGEgPSBbXG5cdFx0Ly8gU3RhbmRcblx0XHRcdFszMCwgMCwgNDgsIDgyLCAwLCAzMl0sXG5cdFx0Ly8gUnVuXG5cdFx0XHRbODYsIDAsIDQ4LCA4MiwgMCwgMzJdLFxuXHRcdFx0WzE0MiwgMCwgNDgsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMTk4LCAwLCA0OCwgODIsIDAsIDMyXSxcblx0XHRcdFsyNjIsIDAsIDQ4LCA4MiwgMCwgMzJdLFxuXHRcdFx0WzMxOCwgMCwgNDgsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMzg0LCAwLCA0OCwgODIsIDAsIDMyXSxcblx0XHQvLyBTbGFzaFxuXHRcdFx0WzAsIDk0LCA0OCwgODIsIDAsIDMyXSxcblx0XHRcdFs0OCwgOTQsIDQ4LCA4MiwgMCwgMzJdLFxuXHRcdFx0Wzk2LCA5NCwgNjAsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMTU4LCA5NCwgNTAsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMjE4LCA5NCwgNDgsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMjcyLCA5NCwgNTAsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMzI2LCA5NCwgNTAsIDgyLCAwLCAzMl0sXG5cdFx0Ly8gRGVhZFxuXHRcdFx0WzMxNiwgMTcwLCA0OCwgODIsIDAsIDMyXSxcblx0XHRcdFszODAsIDE3MCwgNjAsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMzgwLCAxNzAsIDYwLCA4MiwgMCwgMzJdLFxuXHRcdF07XG5cdFx0Ly8gZm9yICh2YXIgeCA9IDMwOyB4IDw9IDQ3ODsgeCArPSA1NCkge1xuXHRcdC8vIFx0dGhpcy5zcHJpdGVzaGVldGRhdGEucHVzaChbeCwgMCwgNDgsIDg0LCAwLCAzMl0pO1xuXHRcdC8vIH1cblx0fVxuXG5cdGhhbmRsZUF0dGFjaygpIHtcblx0XHRpZiAodGhpcy5zcHJpdGUuY3VycmVudEFuaW1hdGlvbiAhPT0gJ3NsYXNoJykge1xuXHRcdFx0dGhpcy5zcHJpdGUuZ290b0FuZFBsYXkoJ3NsYXNoJyk7XG5cdFx0fSBcblx0fVxuXG59O1xuXG53aW5kb3cuUGxheWVyID0gUGxheWVyO1xuXG4iXX0=