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

		// Helps to not overload collision detection:
		_this.lastCollision = new Date().getTime();

		// Two states to handle jumping animation.
		_this.maxJumpY = 40;
		_this.jumpState = 'ground';
		return _this;
	}

	_createClass(Player, [{
		key: 'handleAttack',
		value: function handleAttack(targets, callback) {
			if (this.sprite.currentAnimation !== 'slash') {
				this.sprite.gotoAndPlay('slash');
				this.collisions(targets, 'slash', callback);
			}
		}

		// handleJump(animation) {
		// 	if (this.sprite.y === 60 && animation === 'jump') {
		// 		this.jumpState = 'up'
		// 		this.sprite.setTransform(this.sprite.x, 30);
		// 	} else if (this.sprite.y === 30 && animation === 'jump') {
		// 		this.jumpState = 'up'
		// 		this.sprite.setTransform(this.sprite.x, 60);
		// 	}
		// }

		// Can take care of jumping and landing the player within the render loop
		// handleJump function takes care of the initiation.
		// handleY() {
		// 	if (this.sprite.y < 60 && this.sprite.y >= 38) {
		// 		console.log('this.jumpstate =', this.jumpState);
		// 		if (this.jumpState === 'up') {
		// 			if (this.sprite.y >= 40) {
		// 				this.sprite.y -= 2;
		// 				if (this.sprite.currentAnimation === 'run') {
		// 					this.sprite.x += this.sprite.direction === 'left' ? -1 : 1;
		// 				}
		// 				if (this.sprite.y <= 40) {
		// 					this.jumpState = 'down';
		// 				}
		// 			}
		// 		} else if (this.jumpState === 'down') {
		// 			console.log('second if getting called');
		// 			this.sprite.y += 2;
		// 			if (this.sprite.currentAnimation === 'run') {
		// 				this.sprite.x += this.sprite.direction === 'left' ? -1 : 1;
		// 			}
		// 			if (this.sprite.y >= 60) {
		// 				this.jumpState = 'ground';
		// 			}
		// 		}
		// 	}
		// }

		// scenario helps to increase the reusability of the collision detector
		// by allowing different function calls based on what's happening

	}, {
		key: 'collisions',
		value: function collisions(enemies, scenario, callback) {
			var _this2 = this;

			enemies.forEach(function (enemy) {
				if (scenario !== 'slash' && Math.abs(_this2.sprite.x - enemy.sprite.x) < 8) {
					if (new Date().getTime() - _this2.lastCollision > 500) {
						console.log('collision detected! me: ', _this2.sprite.y, ' enemy: ', enemy.sprite.y);
						_this2.lastCollision = new Date().getTime();
						_this2.hp -= enemy.atk - _this2.def;
						if (_this2.hp < 1) {
							_this2.hp = 0;
							callback();
						}
					}
				} else if (scenario === 'slash' && Math.abs(_this2.sprite.x - enemy.sprite.x) < 25) {
					enemy.handleKnockback(_this2, 'knockback');
					callback ? callback(_this2.atk - enemy.def) : null;
				}
			});
		}

		// Player death goes through the frames, and the expected callback defined within app will
		// remove the player from the stage after elapsed time (to give room for the dead animation)

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NjcmlwdHMvcGxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7SUFNTSxNOzs7QUFFTCxpQkFBWSxLQUFaLEVBQW1CLEtBQW5CLEVBQTBCLE9BQTFCLEVBQW1DO0FBQUE7O0FBQUEsd0ZBQzVCLEtBRDRCLEVBQ3JCLEtBRHFCLEVBQ2QsT0FEYzs7QUFFbEMsUUFBSyxlQUFMLEdBQXVCOztBQUV0QixHQUFDLEVBQUQsRUFBSyxDQUFMLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsQ0FBaEIsRUFBbUIsRUFBbkIsQ0FGc0I7O0FBSXRCLEdBQUMsRUFBRCxFQUFLLENBQUwsRUFBUSxFQUFSLEVBQVksRUFBWixFQUFnQixDQUFoQixFQUFtQixFQUFuQixDQUpzQixFQUt0QixDQUFDLEdBQUQsRUFBTSxDQUFOLEVBQVMsRUFBVCxFQUFhLEVBQWIsRUFBaUIsQ0FBakIsRUFBb0IsRUFBcEIsQ0FMc0IsRUFNdEIsQ0FBQyxHQUFELEVBQU0sQ0FBTixFQUFTLEVBQVQsRUFBYSxFQUFiLEVBQWlCLENBQWpCLEVBQW9CLEVBQXBCLENBTnNCLEVBT3RCLENBQUMsR0FBRCxFQUFNLENBQU4sRUFBUyxFQUFULEVBQWEsRUFBYixFQUFpQixDQUFqQixFQUFvQixFQUFwQixDQVBzQixFQVF0QixDQUFDLEdBQUQsRUFBTSxDQUFOLEVBQVMsRUFBVCxFQUFhLEVBQWIsRUFBaUIsQ0FBakIsRUFBb0IsRUFBcEIsQ0FSc0IsRUFTdEIsQ0FBQyxHQUFELEVBQU0sQ0FBTixFQUFTLEVBQVQsRUFBYSxFQUFiLEVBQWlCLENBQWpCLEVBQW9CLEVBQXBCLENBVHNCOztBQVd0QixHQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsQ0FBaEIsRUFBbUIsRUFBbkIsQ0FYc0IsRUFZdEIsQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLEVBQVQsRUFBYSxFQUFiLEVBQWlCLENBQWpCLEVBQW9CLEVBQXBCLENBWnNCLEVBYXRCLENBQUMsRUFBRCxFQUFLLEVBQUwsRUFBUyxFQUFULEVBQWEsRUFBYixFQUFpQixDQUFqQixFQUFvQixFQUFwQixDQWJzQixFQWN0QixDQUFDLEdBQUQsRUFBTSxFQUFOLEVBQVUsRUFBVixFQUFjLEVBQWQsRUFBa0IsQ0FBbEIsRUFBcUIsRUFBckIsQ0Fkc0IsRUFldEIsQ0FBQyxHQUFELEVBQU0sRUFBTixFQUFVLEVBQVYsRUFBYyxFQUFkLEVBQWtCLENBQWxCLEVBQXFCLEVBQXJCLENBZnNCLEVBZ0J0QixDQUFDLEdBQUQsRUFBTSxFQUFOLEVBQVUsRUFBVixFQUFjLEVBQWQsRUFBa0IsQ0FBbEIsRUFBcUIsRUFBckIsQ0FoQnNCLEVBaUJ0QixDQUFDLEdBQUQsRUFBTSxFQUFOLEVBQVUsRUFBVixFQUFjLEVBQWQsRUFBa0IsQ0FBbEIsRUFBcUIsRUFBckIsQ0FqQnNCOztBQW1CdEIsR0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEVBQVgsRUFBZSxFQUFmLEVBQW1CLENBQW5CLEVBQXNCLEVBQXRCLENBbkJzQixFQW9CdEIsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEVBQVgsRUFBZSxFQUFmLEVBQW1CLENBQW5CLEVBQXNCLEVBQXRCLENBcEJzQixFQXFCdEIsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEVBQVgsRUFBZSxFQUFmLEVBQW1CLENBQW5CLEVBQXNCLEVBQXRCLENBckJzQixDQUF2Qjs7O0FBeUJBLFFBQUssYUFBTCxHQUFxQixJQUFJLElBQUosR0FBVyxPQUFYLEVBQXJCOzs7QUFHQSxRQUFLLFFBQUwsR0FBZ0IsRUFBaEI7QUFDQSxRQUFLLFNBQUwsR0FBaUIsUUFBakI7QUEvQmtDO0FBZ0NsQzs7OzsrQkFFWSxPLEVBQVMsUSxFQUFVO0FBQy9CLE9BQUksS0FBSyxNQUFMLENBQVksZ0JBQVosS0FBaUMsT0FBckMsRUFBOEM7QUFDN0MsU0FBSyxNQUFMLENBQVksV0FBWixDQUF3QixPQUF4QjtBQUNBLFNBQUssVUFBTCxDQUFnQixPQUFoQixFQUF5QixPQUF6QixFQUFrQyxRQUFsQztBQUNBO0FBQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs2QkEwQ1UsTyxFQUFTLFEsRUFBVSxRLEVBQVU7QUFBQTs7QUFDdkMsV0FBUSxPQUFSLENBQWdCLFVBQUMsS0FBRCxFQUFXO0FBQzFCLFFBQUksYUFBYSxPQUFiLElBQXdCLEtBQUssR0FBTCxDQUFTLE9BQUssTUFBTCxDQUFZLENBQVosR0FBZ0IsTUFBTSxNQUFOLENBQWEsQ0FBdEMsSUFBMkMsQ0FBdkUsRUFBMEU7QUFDekUsU0FBSSxJQUFJLElBQUosR0FBVyxPQUFYLEtBQXVCLE9BQUssYUFBNUIsR0FBNEMsR0FBaEQsRUFBcUQ7QUFDcEQsY0FBUSxHQUFSLENBQVksMEJBQVosRUFBd0MsT0FBSyxNQUFMLENBQVksQ0FBcEQsRUFBdUQsVUFBdkQsRUFBbUUsTUFBTSxNQUFOLENBQWEsQ0FBaEY7QUFDQSxhQUFLLGFBQUwsR0FBcUIsSUFBSSxJQUFKLEdBQVcsT0FBWCxFQUFyQjtBQUNBLGFBQUssRUFBTCxJQUFXLE1BQU0sR0FBTixHQUFZLE9BQUssR0FBNUI7QUFDQSxVQUFJLE9BQUssRUFBTCxHQUFVLENBQWQsRUFBaUI7QUFDaEIsY0FBSyxFQUFMLEdBQVUsQ0FBVjtBQUNBO0FBQ0E7QUFDRDtBQUNELEtBVkQsTUFVTyxJQUFJLGFBQWEsT0FBYixJQUF3QixLQUFLLEdBQUwsQ0FBUyxPQUFLLE1BQUwsQ0FBWSxDQUFaLEdBQWdCLE1BQU0sTUFBTixDQUFhLENBQXRDLElBQTJDLEVBQXZFLEVBQTJFO0FBQ2pGLFdBQU0sZUFBTixTQUE0QixXQUE1QjtBQUNBLGdCQUFXLFNBQVMsT0FBSyxHQUFMLEdBQVcsTUFBTSxHQUExQixDQUFYLEdBQTRDLElBQTVDO0FBQ0E7QUFDRCxJQWZEO0FBZ0JBOzs7Ozs7OzhCQUlXLFEsRUFBVTtBQUNyQixRQUFLLE1BQUwsQ0FBWSxXQUFaLENBQXdCLE1BQXhCO0FBQ0EsY0FBVyxRQUFYLEVBQXFCLElBQXJCO0FBQ0E7Ozs7RUEzR21CLFM7O0FBNkdwQjs7QUFFRCxPQUFPLE1BQVAsR0FBZ0IsTUFBaEIiLCJmaWxlIjoicGxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBQTEFZRVIgQ0xBU1MgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG4vLyBJbWFnZSByZWZlcnMgdG8gYW4gZXhwZWN0ZWQgc3ByaXRlIHNoZWV0IGZpbGUsIGFuZCBzdGF0cyBhcmUgdGhlIHBsYXllcidzXG4vLyBpbi1nYW1lIHBhcmFtZXRlcnMgYXMgYW4gb2JqZWN0IHRoYXQgd2lsbCBldmVudHVhbGx5IGJlIGV4cGVjdGVkIHRvIGJlIHJlY2VpdmVkIFxuLy8gZnJvbSBhIGRhdGFiYXNlIHF1ZXJ5LiBcbmNsYXNzIFBsYXllciBleHRlbmRzIENoYXJhY3RlciB7XG5cblx0Y29uc3RydWN0b3IoaW1hZ2UsIHN0YXRzLCBvcHRpb25zKSB7XG5cdFx0c3VwZXIoaW1hZ2UsIHN0YXRzLCBvcHRpb25zKTtcblx0XHR0aGlzLnNwcml0ZXNoZWV0ZGF0YSA9IFtcblx0XHQvLyBTdGFuZFxuXHRcdFx0WzMwLCAwLCA0OCwgODIsIDAsIDMyXSxcblx0XHQvLyBSdW5cblx0XHRcdFs4NiwgMCwgNDgsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMTQyLCAwLCA0OCwgODIsIDAsIDMyXSxcblx0XHRcdFsxOTgsIDAsIDQ4LCA4MiwgMCwgMzJdLFxuXHRcdFx0WzI2MiwgMCwgNDgsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMzE4LCAwLCA0OCwgODIsIDAsIDMyXSxcblx0XHRcdFszODQsIDAsIDQ4LCA4MiwgMCwgMzJdLFxuXHRcdC8vIFNsYXNoXG5cdFx0XHRbMCwgOTQsIDQ4LCA4MiwgMCwgMzJdLFxuXHRcdFx0WzQ4LCA5NCwgNDgsIDgyLCAwLCAzMl0sXG5cdFx0XHRbOTYsIDk0LCA2MCwgODIsIDAsIDMyXSxcblx0XHRcdFsxNTgsIDk0LCA1MCwgODIsIDAsIDMyXSxcblx0XHRcdFsyMTgsIDk0LCA0OCwgODIsIDAsIDMyXSxcblx0XHRcdFsyNzIsIDk0LCA1MCwgODIsIDAsIDMyXSxcblx0XHRcdFszMjYsIDk0LCA1MCwgODIsIDAsIDMyXSxcblx0XHQvLyBEZWFkXG5cdFx0XHRbMzE2LCAxNzAsIDQ4LCA4MiwgMCwgMzJdLFxuXHRcdFx0WzM4MCwgMTcwLCA2MCwgODIsIDAsIDMyXSxcblx0XHRcdFszODAsIDE3MCwgNjAsIDgyLCAwLCAzMl1cblx0XHRdO1xuXG5cdFx0Ly8gSGVscHMgdG8gbm90IG92ZXJsb2FkIGNvbGxpc2lvbiBkZXRlY3Rpb246IFxuXHRcdHRoaXMubGFzdENvbGxpc2lvbiA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG5cdFx0Ly8gVHdvIHN0YXRlcyB0byBoYW5kbGUganVtcGluZyBhbmltYXRpb24uIFxuXHRcdHRoaXMubWF4SnVtcFkgPSA0MDtcblx0XHR0aGlzLmp1bXBTdGF0ZSA9ICdncm91bmQnO1xuXHR9XG5cblx0aGFuZGxlQXR0YWNrKHRhcmdldHMsIGNhbGxiYWNrKSB7XG5cdFx0aWYgKHRoaXMuc3ByaXRlLmN1cnJlbnRBbmltYXRpb24gIT09ICdzbGFzaCcpIHtcblx0XHRcdHRoaXMuc3ByaXRlLmdvdG9BbmRQbGF5KCdzbGFzaCcpO1xuXHRcdFx0dGhpcy5jb2xsaXNpb25zKHRhcmdldHMsICdzbGFzaCcsIGNhbGxiYWNrKTtcblx0XHR9IFxuXHR9XG5cblx0Ly8gaGFuZGxlSnVtcChhbmltYXRpb24pIHtcblx0Ly8gXHRpZiAodGhpcy5zcHJpdGUueSA9PT0gNjAgJiYgYW5pbWF0aW9uID09PSAnanVtcCcpIHtcblx0Ly8gXHRcdHRoaXMuanVtcFN0YXRlID0gJ3VwJ1xuXHQvLyBcdFx0dGhpcy5zcHJpdGUuc2V0VHJhbnNmb3JtKHRoaXMuc3ByaXRlLngsIDMwKTtcblx0Ly8gXHR9IGVsc2UgaWYgKHRoaXMuc3ByaXRlLnkgPT09IDMwICYmIGFuaW1hdGlvbiA9PT0gJ2p1bXAnKSB7XG5cdC8vIFx0XHR0aGlzLmp1bXBTdGF0ZSA9ICd1cCdcblx0Ly8gXHRcdHRoaXMuc3ByaXRlLnNldFRyYW5zZm9ybSh0aGlzLnNwcml0ZS54LCA2MCk7XG5cdC8vIFx0fVxuXHQvLyB9XG5cblx0Ly8gQ2FuIHRha2UgY2FyZSBvZiBqdW1waW5nIGFuZCBsYW5kaW5nIHRoZSBwbGF5ZXIgd2l0aGluIHRoZSByZW5kZXIgbG9vcFxuXHQvLyBoYW5kbGVKdW1wIGZ1bmN0aW9uIHRha2VzIGNhcmUgb2YgdGhlIGluaXRpYXRpb24uIFxuXHQvLyBoYW5kbGVZKCkge1xuXHQvLyBcdGlmICh0aGlzLnNwcml0ZS55IDwgNjAgJiYgdGhpcy5zcHJpdGUueSA+PSAzOCkge1xuXHQvLyBcdFx0Y29uc29sZS5sb2coJ3RoaXMuanVtcHN0YXRlID0nLCB0aGlzLmp1bXBTdGF0ZSk7XG5cdC8vIFx0XHRpZiAodGhpcy5qdW1wU3RhdGUgPT09ICd1cCcpIHtcblx0Ly8gXHRcdFx0aWYgKHRoaXMuc3ByaXRlLnkgPj0gNDApIHtcblx0Ly8gXHRcdFx0XHR0aGlzLnNwcml0ZS55IC09IDI7XG5cdC8vIFx0XHRcdFx0aWYgKHRoaXMuc3ByaXRlLmN1cnJlbnRBbmltYXRpb24gPT09ICdydW4nKSB7XG5cdC8vIFx0XHRcdFx0XHR0aGlzLnNwcml0ZS54ICs9IHRoaXMuc3ByaXRlLmRpcmVjdGlvbiA9PT0gJ2xlZnQnID8gLTEgOiAxO1xuXHQvLyBcdFx0XHRcdH1cblx0Ly8gXHRcdFx0XHRpZiAodGhpcy5zcHJpdGUueSA8PSA0MCkge1xuXHQvLyBcdFx0XHRcdFx0dGhpcy5qdW1wU3RhdGUgPSAnZG93bic7XG5cdC8vIFx0XHRcdFx0fVxuXHQvLyBcdFx0XHR9XG5cdC8vIFx0XHR9IGVsc2UgaWYgKHRoaXMuanVtcFN0YXRlID09PSAnZG93bicpIHtcblx0Ly8gXHRcdFx0Y29uc29sZS5sb2coJ3NlY29uZCBpZiBnZXR0aW5nIGNhbGxlZCcpO1xuXHQvLyBcdFx0XHR0aGlzLnNwcml0ZS55ICs9IDI7XG5cdC8vIFx0XHRcdGlmICh0aGlzLnNwcml0ZS5jdXJyZW50QW5pbWF0aW9uID09PSAncnVuJykge1xuXHQvLyBcdFx0XHRcdHRoaXMuc3ByaXRlLnggKz0gdGhpcy5zcHJpdGUuZGlyZWN0aW9uID09PSAnbGVmdCcgPyAtMSA6IDE7XG5cdC8vIFx0XHRcdH1cblx0Ly8gXHRcdFx0aWYgKHRoaXMuc3ByaXRlLnkgPj0gNjApIHtcblx0Ly8gXHRcdFx0XHR0aGlzLmp1bXBTdGF0ZSA9ICdncm91bmQnO1xuXHQvLyBcdFx0XHR9XG5cdC8vIFx0XHR9XG5cdC8vIFx0fVxuXHQvLyB9XG5cblx0Ly8gc2NlbmFyaW8gaGVscHMgdG8gaW5jcmVhc2UgdGhlIHJldXNhYmlsaXR5IG9mIHRoZSBjb2xsaXNpb24gZGV0ZWN0b3Jcblx0Ly8gYnkgYWxsb3dpbmcgZGlmZmVyZW50IGZ1bmN0aW9uIGNhbGxzIGJhc2VkIG9uIHdoYXQncyBoYXBwZW5pbmdcblx0Y29sbGlzaW9ucyhlbmVtaWVzLCBzY2VuYXJpbywgY2FsbGJhY2spIHtcblx0XHRlbmVtaWVzLmZvckVhY2goKGVuZW15KSA9PiB7XG5cdFx0XHRpZiAoc2NlbmFyaW8gIT09ICdzbGFzaCcgJiYgTWF0aC5hYnModGhpcy5zcHJpdGUueCAtIGVuZW15LnNwcml0ZS54KSA8IDgpIHtcblx0XHRcdFx0aWYgKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gdGhpcy5sYXN0Q29sbGlzaW9uID4gNTAwKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ2NvbGxpc2lvbiBkZXRlY3RlZCEgbWU6ICcsIHRoaXMuc3ByaXRlLnksICcgZW5lbXk6ICcsIGVuZW15LnNwcml0ZS55KTtcblx0XHRcdFx0XHR0aGlzLmxhc3RDb2xsaXNpb24gPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0XHRcdFx0XHR0aGlzLmhwIC09IGVuZW15LmF0ayAtIHRoaXMuZGVmO1xuXHRcdFx0XHRcdGlmICh0aGlzLmhwIDwgMSkge1xuXHRcdFx0XHRcdFx0dGhpcy5ocCA9IDA7XG5cdFx0XHRcdFx0XHRjYWxsYmFjaygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmIChzY2VuYXJpbyA9PT0gJ3NsYXNoJyAmJiBNYXRoLmFicyh0aGlzLnNwcml0ZS54IC0gZW5lbXkuc3ByaXRlLngpIDwgMjUpIHtcblx0XHRcdFx0ZW5lbXkuaGFuZGxlS25vY2tiYWNrKHRoaXMsICdrbm9ja2JhY2snKTtcblx0XHRcdFx0Y2FsbGJhY2sgPyBjYWxsYmFjayh0aGlzLmF0ayAtIGVuZW15LmRlZikgOiBudWxsO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0Ly8gUGxheWVyIGRlYXRoIGdvZXMgdGhyb3VnaCB0aGUgZnJhbWVzLCBhbmQgdGhlIGV4cGVjdGVkIGNhbGxiYWNrIGRlZmluZWQgd2l0aGluIGFwcCB3aWxsXG5cdC8vIHJlbW92ZSB0aGUgcGxheWVyIGZyb20gdGhlIHN0YWdlIGFmdGVyIGVsYXBzZWQgdGltZSAodG8gZ2l2ZSByb29tIGZvciB0aGUgZGVhZCBhbmltYXRpb24pXG5cdGhhbmRsZURlYXRoKGNhbGxiYWNrKSB7XG5cdFx0dGhpcy5zcHJpdGUuZ290b0FuZFBsYXkoJ2RlYWQnKTtcblx0XHRzZXRUaW1lb3V0KGNhbGxiYWNrLCAxMjAwKTtcblx0fVxuXG59O1xuXG53aW5kb3cuUGxheWVyID0gUGxheWVyO1xuXG4iXX0=