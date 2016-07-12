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
		value: function collisions(enemies, scenario, callback) {
			var _this2 = this;

			enemies.forEach(function (enemy) {
				if (scenario !== 'slash' && Math.abs(_this2.sprite.x - enemy.sprite.x) < 3) {
					if (new Date().getTime() - _this2.lastCollision > 500) {
						console.log('collision detected! HP: ', _this2.hp);
						_this2.lastCollision = new Date().getTime();
						_this2.hp -= enemy.atk - _this2.def;
						if (_this2.hp < 1) {
							callback();
						}
					}
				} else if (scenario === 'slash' && Math.abs(_this2.sprite.x - enemy.sprite.x) < 25) {
					enemy.handleKnockback(_this2);
				}
			});
		}
	}, {
		key: 'handleDeath',
		value: function handleDeath(callback) {
			this.sprite.gotoAndPlay('dead');
			setTimeout(callback, 1200);
		}
	}]);

	return Player;
}(Character);

;

window.Player = Player;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NjcmlwdHMvcGxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7SUFNTSxNOzs7QUFFTCxpQkFBWSxLQUFaLEVBQW1CLEtBQW5CLEVBQTBCLE9BQTFCLEVBQW1DO0FBQUE7O0FBQUEsd0ZBQzVCLEtBRDRCLEVBQ3JCLEtBRHFCLEVBQ2QsT0FEYzs7QUFFbEMsUUFBSyxlQUFMLEdBQXVCOztBQUV0QixHQUFDLEVBQUQsRUFBSyxDQUFMLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsQ0FBaEIsRUFBbUIsRUFBbkIsQ0FGc0I7O0FBSXRCLEdBQUMsRUFBRCxFQUFLLENBQUwsRUFBUSxFQUFSLEVBQVksRUFBWixFQUFnQixDQUFoQixFQUFtQixFQUFuQixDQUpzQixFQUt0QixDQUFDLEdBQUQsRUFBTSxDQUFOLEVBQVMsRUFBVCxFQUFhLEVBQWIsRUFBaUIsQ0FBakIsRUFBb0IsRUFBcEIsQ0FMc0IsRUFNdEIsQ0FBQyxHQUFELEVBQU0sQ0FBTixFQUFTLEVBQVQsRUFBYSxFQUFiLEVBQWlCLENBQWpCLEVBQW9CLEVBQXBCLENBTnNCLEVBT3RCLENBQUMsR0FBRCxFQUFNLENBQU4sRUFBUyxFQUFULEVBQWEsRUFBYixFQUFpQixDQUFqQixFQUFvQixFQUFwQixDQVBzQixFQVF0QixDQUFDLEdBQUQsRUFBTSxDQUFOLEVBQVMsRUFBVCxFQUFhLEVBQWIsRUFBaUIsQ0FBakIsRUFBb0IsRUFBcEIsQ0FSc0IsRUFTdEIsQ0FBQyxHQUFELEVBQU0sQ0FBTixFQUFTLEVBQVQsRUFBYSxFQUFiLEVBQWlCLENBQWpCLEVBQW9CLEVBQXBCLENBVHNCOztBQVd0QixHQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsQ0FBaEIsRUFBbUIsRUFBbkIsQ0FYc0IsRUFZdEIsQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLEVBQVQsRUFBYSxFQUFiLEVBQWlCLENBQWpCLEVBQW9CLEVBQXBCLENBWnNCLEVBYXRCLENBQUMsRUFBRCxFQUFLLEVBQUwsRUFBUyxFQUFULEVBQWEsRUFBYixFQUFpQixDQUFqQixFQUFvQixFQUFwQixDQWJzQixFQWN0QixDQUFDLEdBQUQsRUFBTSxFQUFOLEVBQVUsRUFBVixFQUFjLEVBQWQsRUFBa0IsQ0FBbEIsRUFBcUIsRUFBckIsQ0Fkc0IsRUFldEIsQ0FBQyxHQUFELEVBQU0sRUFBTixFQUFVLEVBQVYsRUFBYyxFQUFkLEVBQWtCLENBQWxCLEVBQXFCLEVBQXJCLENBZnNCLEVBZ0J0QixDQUFDLEdBQUQsRUFBTSxFQUFOLEVBQVUsRUFBVixFQUFjLEVBQWQsRUFBa0IsQ0FBbEIsRUFBcUIsRUFBckIsQ0FoQnNCLEVBaUJ0QixDQUFDLEdBQUQsRUFBTSxFQUFOLEVBQVUsRUFBVixFQUFjLEVBQWQsRUFBa0IsQ0FBbEIsRUFBcUIsRUFBckIsQ0FqQnNCOztBQW1CdEIsR0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEVBQVgsRUFBZSxFQUFmLEVBQW1CLENBQW5CLEVBQXNCLEVBQXRCLENBbkJzQixFQW9CdEIsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEVBQVgsRUFBZSxFQUFmLEVBQW1CLENBQW5CLEVBQXNCLEVBQXRCLENBcEJzQixFQXFCdEIsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEVBQVgsRUFBZSxFQUFmLEVBQW1CLENBQW5CLEVBQXNCLEVBQXRCLENBckJzQixDQUF2QjtBQXVCQSxRQUFLLGFBQUwsR0FBcUIsSUFBSSxJQUFKLEdBQVcsT0FBWCxFQUFyQjtBQXpCa0M7QUEwQmxDOzs7OytCQUVZLE8sRUFBUztBQUNyQixPQUFJLEtBQUssTUFBTCxDQUFZLGdCQUFaLEtBQWlDLE9BQXJDLEVBQThDO0FBQzdDLFNBQUssTUFBTCxDQUFZLFdBQVosQ0FBd0IsT0FBeEI7QUFDQSxTQUFLLFVBQUwsQ0FBZ0IsT0FBaEIsRUFBeUIsT0FBekI7QUFDQTtBQUNEOzs7Ozs7OzZCQUlVLE8sRUFBUyxRLEVBQVUsUSxFQUFVO0FBQUE7O0FBQ3ZDLFdBQVEsT0FBUixDQUFnQixVQUFDLEtBQUQsRUFBVztBQUMxQixRQUFJLGFBQWEsT0FBYixJQUF3QixLQUFLLEdBQUwsQ0FBUyxPQUFLLE1BQUwsQ0FBWSxDQUFaLEdBQWdCLE1BQU0sTUFBTixDQUFhLENBQXRDLElBQTJDLENBQXZFLEVBQTBFO0FBQ3pFLFNBQUksSUFBSSxJQUFKLEdBQVcsT0FBWCxLQUF1QixPQUFLLGFBQTVCLEdBQTRDLEdBQWhELEVBQXFEO0FBQ3BELGNBQVEsR0FBUixDQUFZLDBCQUFaLEVBQXdDLE9BQUssRUFBN0M7QUFDQSxhQUFLLGFBQUwsR0FBcUIsSUFBSSxJQUFKLEdBQVcsT0FBWCxFQUFyQjtBQUNBLGFBQUssRUFBTCxJQUFXLE1BQU0sR0FBTixHQUFZLE9BQUssR0FBNUI7QUFDQSxVQUFJLE9BQUssRUFBTCxHQUFVLENBQWQsRUFBaUI7QUFDaEI7QUFDQTtBQUNEO0FBQ0QsS0FURCxNQVNPLElBQUksYUFBYSxPQUFiLElBQXdCLEtBQUssR0FBTCxDQUFTLE9BQUssTUFBTCxDQUFZLENBQVosR0FBZ0IsTUFBTSxNQUFOLENBQWEsQ0FBdEMsSUFBMkMsRUFBdkUsRUFBMkU7QUFDakYsV0FBTSxlQUFOO0FBQ0E7QUFDRCxJQWJEO0FBY0E7Ozs4QkFFVyxRLEVBQVU7QUFDckIsUUFBSyxNQUFMLENBQVksV0FBWixDQUF3QixNQUF4QjtBQUNBLGNBQVcsUUFBWCxFQUFxQixJQUFyQjtBQUNBOzs7O0VBM0RtQixTOztBQTZEcEI7O0FBRUQsT0FBTyxNQUFQLEdBQWdCLE1BQWhCIiwiZmlsZSI6InBsYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogUExBWUVSIENMQVNTICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuLy8gSW1hZ2UgcmVmZXJzIHRvIGFuIGV4cGVjdGVkIHNwcml0ZSBzaGVldCBmaWxlLCBhbmQgc3RhdHMgYXJlIHRoZSBwbGF5ZXInc1xuLy8gaW4tZ2FtZSBwYXJhbWV0ZXJzIGFzIGFuIG9iamVjdCB0aGF0IHdpbGwgZXZlbnR1YWxseSBiZSBleHBlY3RlZCB0byBiZSByZWNlaXZlZCBcbi8vIGZyb20gYSBkYXRhYmFzZSBxdWVyeS4gXG5jbGFzcyBQbGF5ZXIgZXh0ZW5kcyBDaGFyYWN0ZXIge1xuXG5cdGNvbnN0cnVjdG9yKGltYWdlLCBzdGF0cywgb3B0aW9ucykge1xuXHRcdHN1cGVyKGltYWdlLCBzdGF0cywgb3B0aW9ucyk7XG5cdFx0dGhpcy5zcHJpdGVzaGVldGRhdGEgPSBbXG5cdFx0Ly8gU3RhbmRcblx0XHRcdFszMCwgMCwgNDgsIDgyLCAwLCAzMl0sXG5cdFx0Ly8gUnVuXG5cdFx0XHRbODYsIDAsIDQ4LCA4MiwgMCwgMzJdLFxuXHRcdFx0WzE0MiwgMCwgNDgsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMTk4LCAwLCA0OCwgODIsIDAsIDMyXSxcblx0XHRcdFsyNjIsIDAsIDQ4LCA4MiwgMCwgMzJdLFxuXHRcdFx0WzMxOCwgMCwgNDgsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMzg0LCAwLCA0OCwgODIsIDAsIDMyXSxcblx0XHQvLyBTbGFzaFxuXHRcdFx0WzAsIDk0LCA0OCwgODIsIDAsIDMyXSxcblx0XHRcdFs0OCwgOTQsIDQ4LCA4MiwgMCwgMzJdLFxuXHRcdFx0Wzk2LCA5NCwgNjAsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMTU4LCA5NCwgNTAsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMjE4LCA5NCwgNDgsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMjcyLCA5NCwgNTAsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMzI2LCA5NCwgNTAsIDgyLCAwLCAzMl0sXG5cdFx0Ly8gRGVhZFxuXHRcdFx0WzMxNiwgMTcwLCA0OCwgODIsIDAsIDMyXSxcblx0XHRcdFszODAsIDE3MCwgNjAsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMzgwLCAxNzAsIDYwLCA4MiwgMCwgMzJdXG5cdFx0XTtcblx0XHR0aGlzLmxhc3RDb2xsaXNpb24gPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0fVxuXG5cdGhhbmRsZUF0dGFjayh0YXJnZXRzKSB7XG5cdFx0aWYgKHRoaXMuc3ByaXRlLmN1cnJlbnRBbmltYXRpb24gIT09ICdzbGFzaCcpIHtcblx0XHRcdHRoaXMuc3ByaXRlLmdvdG9BbmRQbGF5KCdzbGFzaCcpO1xuXHRcdFx0dGhpcy5jb2xsaXNpb25zKHRhcmdldHMsICdzbGFzaCcpO1xuXHRcdH0gXG5cdH1cblxuXHQvLyBzY2VuYXJpbyBoZWxwcyB0byBpbmNyZWFzZSB0aGUgcmV1c2FiaWxpdHkgb2YgdGhlIGNvbGxpc2lvbiBkZXRlY3RvclxuXHQvLyBieSBhbGxvd2luZyBkaWZmZXJlbnQgZnVuY3Rpb24gY2FsbHMgYmFzZWQgb24gd2hhdCdzIGhhcHBlbmluZ1xuXHRjb2xsaXNpb25zKGVuZW1pZXMsIHNjZW5hcmlvLCBjYWxsYmFjaykge1xuXHRcdGVuZW1pZXMuZm9yRWFjaCgoZW5lbXkpID0+IHtcblx0XHRcdGlmIChzY2VuYXJpbyAhPT0gJ3NsYXNoJyAmJiBNYXRoLmFicyh0aGlzLnNwcml0ZS54IC0gZW5lbXkuc3ByaXRlLngpIDwgMykge1xuXHRcdFx0XHRpZiAobmV3IERhdGUoKS5nZXRUaW1lKCkgLSB0aGlzLmxhc3RDb2xsaXNpb24gPiA1MDApIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnY29sbGlzaW9uIGRldGVjdGVkISBIUDogJywgdGhpcy5ocCk7XG5cdFx0XHRcdFx0dGhpcy5sYXN0Q29sbGlzaW9uID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdFx0XHRcdFx0dGhpcy5ocCAtPSBlbmVteS5hdGsgLSB0aGlzLmRlZjtcblx0XHRcdFx0XHRpZiAodGhpcy5ocCA8IDEpIHtcblx0XHRcdFx0XHRcdGNhbGxiYWNrKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKHNjZW5hcmlvID09PSAnc2xhc2gnICYmIE1hdGguYWJzKHRoaXMuc3ByaXRlLnggLSBlbmVteS5zcHJpdGUueCkgPCAyNSkge1xuXHRcdFx0XHRlbmVteS5oYW5kbGVLbm9ja2JhY2sodGhpcyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRoYW5kbGVEZWF0aChjYWxsYmFjaykge1xuXHRcdHRoaXMuc3ByaXRlLmdvdG9BbmRQbGF5KCdkZWFkJyk7XG5cdFx0c2V0VGltZW91dChjYWxsYmFjaywgMTIwMCk7XG5cdH1cblxufTtcblxud2luZG93LlBsYXllciA9IFBsYXllcjtcblxuIl19