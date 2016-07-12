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
		_this.lastCollision = new Date().getTime();
		return _this;
	}

	_createClass(Player, [{
		key: 'handleAttack',
		value: function handleAttack(targets) {
			if (this.sprite.currentAnimation !== 'slash') {
				this.sprite.gotoAndPlay('slash');
				this.collisions(targets, 'slash');
			}
		}

		// scenario helps to increase the reusability of the collision detector
		// by allowing different function calls based on what's happening

	}, {
		key: 'collisions',
		value: function collisions(enemies, scenario) {
			var _this2 = this;

			enemies.forEach(function (enemy) {
				if (scenario !== 'slash' && Math.abs(_this2.sprite.x - enemy.sprite.x) < 3) {
					if (new Date().getTime() - _this2.lastCollision > 500) {
						console.log('collision detected!');
						_this2.hp -= enemy.atk - _this2.def;
						_this2.lastCollision = new Date().getTime();
					}
				} else if (scenario === 'slash' && Math.abs(_this2.sprite.x - enemy.sprite.x) < 25) {
					enemy.handleKnockback(_this2);
				}
			});
		}
	}]);

	return Player;
}(Character);

;

window.Player = Player;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NjcmlwdHMvcGxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7SUFNTSxNOzs7QUFFTCxpQkFBWSxLQUFaLEVBQW1CLEtBQW5CLEVBQTBCLE9BQTFCLEVBQW1DO0FBQUE7O0FBQUEsd0ZBQzVCLEtBRDRCLEVBQ3JCLEtBRHFCLEVBQ2QsT0FEYzs7QUFFbEMsUUFBSyxlQUFMLEdBQXVCOztBQUV0QixHQUFDLEVBQUQsRUFBSyxDQUFMLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsQ0FBaEIsRUFBbUIsRUFBbkIsQ0FGc0I7O0FBSXRCLEdBQUMsRUFBRCxFQUFLLENBQUwsRUFBUSxFQUFSLEVBQVksRUFBWixFQUFnQixDQUFoQixFQUFtQixFQUFuQixDQUpzQixFQUt0QixDQUFDLEdBQUQsRUFBTSxDQUFOLEVBQVMsRUFBVCxFQUFhLEVBQWIsRUFBaUIsQ0FBakIsRUFBb0IsRUFBcEIsQ0FMc0IsRUFNdEIsQ0FBQyxHQUFELEVBQU0sQ0FBTixFQUFTLEVBQVQsRUFBYSxFQUFiLEVBQWlCLENBQWpCLEVBQW9CLEVBQXBCLENBTnNCLEVBT3RCLENBQUMsR0FBRCxFQUFNLENBQU4sRUFBUyxFQUFULEVBQWEsRUFBYixFQUFpQixDQUFqQixFQUFvQixFQUFwQixDQVBzQixFQVF0QixDQUFDLEdBQUQsRUFBTSxDQUFOLEVBQVMsRUFBVCxFQUFhLEVBQWIsRUFBaUIsQ0FBakIsRUFBb0IsRUFBcEIsQ0FSc0IsRUFTdEIsQ0FBQyxHQUFELEVBQU0sQ0FBTixFQUFTLEVBQVQsRUFBYSxFQUFiLEVBQWlCLENBQWpCLEVBQW9CLEVBQXBCLENBVHNCOztBQVd0QixHQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsQ0FBaEIsRUFBbUIsRUFBbkIsQ0FYc0IsRUFZdEIsQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLEVBQVQsRUFBYSxFQUFiLEVBQWlCLENBQWpCLEVBQW9CLEVBQXBCLENBWnNCLEVBYXRCLENBQUMsRUFBRCxFQUFLLEVBQUwsRUFBUyxFQUFULEVBQWEsRUFBYixFQUFpQixDQUFqQixFQUFvQixFQUFwQixDQWJzQixFQWN0QixDQUFDLEdBQUQsRUFBTSxFQUFOLEVBQVUsRUFBVixFQUFjLEVBQWQsRUFBa0IsQ0FBbEIsRUFBcUIsRUFBckIsQ0Fkc0IsRUFldEIsQ0FBQyxHQUFELEVBQU0sRUFBTixFQUFVLEVBQVYsRUFBYyxFQUFkLEVBQWtCLENBQWxCLEVBQXFCLEVBQXJCLENBZnNCLEVBZ0J0QixDQUFDLEdBQUQsRUFBTSxFQUFOLEVBQVUsRUFBVixFQUFjLEVBQWQsRUFBa0IsQ0FBbEIsRUFBcUIsRUFBckIsQ0FoQnNCLEVBaUJ0QixDQUFDLEdBQUQsRUFBTSxFQUFOLEVBQVUsRUFBVixFQUFjLEVBQWQsRUFBa0IsQ0FBbEIsRUFBcUIsRUFBckIsQ0FqQnNCOztBQW1CdEIsR0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEVBQVgsRUFBZSxFQUFmLEVBQW1CLENBQW5CLEVBQXNCLEVBQXRCLENBbkJzQixFQW9CdEIsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEVBQVgsRUFBZSxFQUFmLEVBQW1CLENBQW5CLEVBQXNCLEVBQXRCLENBcEJzQixFQXFCdEIsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEVBQVgsRUFBZSxFQUFmLEVBQW1CLENBQW5CLEVBQXNCLEVBQXRCLENBckJzQixDQUF2QjtBQXVCQSxRQUFLLGFBQUwsR0FBcUIsSUFBSSxJQUFKLEdBQVcsT0FBWCxFQUFyQjtBQXpCa0M7QUEwQmxDOzs7OytCQUVZLE8sRUFBUztBQUNyQixPQUFJLEtBQUssTUFBTCxDQUFZLGdCQUFaLEtBQWlDLE9BQXJDLEVBQThDO0FBQzdDLFNBQUssTUFBTCxDQUFZLFdBQVosQ0FBd0IsT0FBeEI7QUFDQSxTQUFLLFVBQUwsQ0FBZ0IsT0FBaEIsRUFBeUIsT0FBekI7QUFDQTtBQUNEOzs7Ozs7OzZCQUlVLE8sRUFBUyxRLEVBQVU7QUFBQTs7QUFDN0IsV0FBUSxPQUFSLENBQWdCLFVBQUMsS0FBRCxFQUFXO0FBQzFCLFFBQUksYUFBYSxPQUFiLElBQXdCLEtBQUssR0FBTCxDQUFTLE9BQUssTUFBTCxDQUFZLENBQVosR0FBZ0IsTUFBTSxNQUFOLENBQWEsQ0FBdEMsSUFBMkMsQ0FBdkUsRUFBMEU7QUFDekUsU0FBSSxJQUFJLElBQUosR0FBVyxPQUFYLEtBQXVCLE9BQUssYUFBNUIsR0FBNEMsR0FBaEQsRUFBcUQ7QUFDcEQsY0FBUSxHQUFSLENBQVkscUJBQVo7QUFDQSxhQUFLLEVBQUwsSUFBVyxNQUFNLEdBQU4sR0FBWSxPQUFLLEdBQTVCO0FBQ0EsYUFBSyxhQUFMLEdBQXFCLElBQUksSUFBSixHQUFXLE9BQVgsRUFBckI7QUFDQTtBQUNELEtBTkQsTUFNTyxJQUFJLGFBQWEsT0FBYixJQUF3QixLQUFLLEdBQUwsQ0FBUyxPQUFLLE1BQUwsQ0FBWSxDQUFaLEdBQWdCLE1BQU0sTUFBTixDQUFhLENBQXRDLElBQTJDLEVBQXZFLEVBQTJFO0FBQ2pGLFdBQU0sZUFBTjtBQUNBO0FBQ0QsSUFWRDtBQVdBOzs7O0VBbkRtQixTOztBQXFEcEI7O0FBRUQsT0FBTyxNQUFQLEdBQWdCLE1BQWhCIiwiZmlsZSI6InBsYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogUExBWUVSIENMQVNTICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuLy8gSW1hZ2UgcmVmZXJzIHRvIGFuIGV4cGVjdGVkIHNwcml0ZSBzaGVldCBmaWxlLCBhbmQgc3RhdHMgYXJlIHRoZSBwbGF5ZXInc1xuLy8gaW4tZ2FtZSBwYXJhbWV0ZXJzIGFzIGFuIG9iamVjdCB0aGF0IHdpbGwgZXZlbnR1YWxseSBiZSBleHBlY3RlZCB0byBiZSByZWNlaXZlZCBcbi8vIGZyb20gYSBkYXRhYmFzZSBxdWVyeS4gXG5jbGFzcyBQbGF5ZXIgZXh0ZW5kcyBDaGFyYWN0ZXIge1xuXG5cdGNvbnN0cnVjdG9yKGltYWdlLCBzdGF0cywgb3B0aW9ucykge1xuXHRcdHN1cGVyKGltYWdlLCBzdGF0cywgb3B0aW9ucyk7XG5cdFx0dGhpcy5zcHJpdGVzaGVldGRhdGEgPSBbXG5cdFx0Ly8gU3RhbmRcblx0XHRcdFszMCwgMCwgNDgsIDgyLCAwLCAzMl0sXG5cdFx0Ly8gUnVuXG5cdFx0XHRbODYsIDAsIDQ4LCA4MiwgMCwgMzJdLFxuXHRcdFx0WzE0MiwgMCwgNDgsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMTk4LCAwLCA0OCwgODIsIDAsIDMyXSxcblx0XHRcdFsyNjIsIDAsIDQ4LCA4MiwgMCwgMzJdLFxuXHRcdFx0WzMxOCwgMCwgNDgsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMzg0LCAwLCA0OCwgODIsIDAsIDMyXSxcblx0XHQvLyBTbGFzaFxuXHRcdFx0WzAsIDk0LCA0OCwgODIsIDAsIDMyXSxcblx0XHRcdFs0OCwgOTQsIDQ4LCA4MiwgMCwgMzJdLFxuXHRcdFx0Wzk2LCA5NCwgNjAsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMTU4LCA5NCwgNTAsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMjE4LCA5NCwgNDgsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMjcyLCA5NCwgNTAsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMzI2LCA5NCwgNTAsIDgyLCAwLCAzMl0sXG5cdFx0Ly8gRGVhZFxuXHRcdFx0WzMxNiwgMTcwLCA0OCwgODIsIDAsIDMyXSxcblx0XHRcdFszODAsIDE3MCwgNjAsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMzgwLCAxNzAsIDYwLCA4MiwgMCwgMzJdLFxuXHRcdF07XG5cdFx0dGhpcy5sYXN0Q29sbGlzaW9uID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdH1cblxuXHRoYW5kbGVBdHRhY2sodGFyZ2V0cykge1xuXHRcdGlmICh0aGlzLnNwcml0ZS5jdXJyZW50QW5pbWF0aW9uICE9PSAnc2xhc2gnKSB7XG5cdFx0XHR0aGlzLnNwcml0ZS5nb3RvQW5kUGxheSgnc2xhc2gnKTtcblx0XHRcdHRoaXMuY29sbGlzaW9ucyh0YXJnZXRzLCAnc2xhc2gnKTtcblx0XHR9IFxuXHR9XG5cblx0Ly8gc2NlbmFyaW8gaGVscHMgdG8gaW5jcmVhc2UgdGhlIHJldXNhYmlsaXR5IG9mIHRoZSBjb2xsaXNpb24gZGV0ZWN0b3Jcblx0Ly8gYnkgYWxsb3dpbmcgZGlmZmVyZW50IGZ1bmN0aW9uIGNhbGxzIGJhc2VkIG9uIHdoYXQncyBoYXBwZW5pbmdcblx0Y29sbGlzaW9ucyhlbmVtaWVzLCBzY2VuYXJpbykge1xuXHRcdGVuZW1pZXMuZm9yRWFjaCgoZW5lbXkpID0+IHtcblx0XHRcdGlmIChzY2VuYXJpbyAhPT0gJ3NsYXNoJyAmJiBNYXRoLmFicyh0aGlzLnNwcml0ZS54IC0gZW5lbXkuc3ByaXRlLngpIDwgMykge1xuXHRcdFx0XHRpZiAobmV3IERhdGUoKS5nZXRUaW1lKCkgLSB0aGlzLmxhc3RDb2xsaXNpb24gPiA1MDApIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnY29sbGlzaW9uIGRldGVjdGVkIScpO1xuXHRcdFx0XHRcdHRoaXMuaHAgLT0gZW5lbXkuYXRrIC0gdGhpcy5kZWY7XG5cdFx0XHRcdFx0dGhpcy5sYXN0Q29sbGlzaW9uID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoc2NlbmFyaW8gPT09ICdzbGFzaCcgJiYgTWF0aC5hYnModGhpcy5zcHJpdGUueCAtIGVuZW15LnNwcml0ZS54KSA8IDI1KSB7XG5cdFx0XHRcdGVuZW15LmhhbmRsZUtub2NrYmFjayh0aGlzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG59O1xuXG53aW5kb3cuUGxheWVyID0gUGxheWVyO1xuXG4iXX0=