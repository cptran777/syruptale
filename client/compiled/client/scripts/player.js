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
				this.collisions(targets, 'slash');
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
				if (scenario !== 'slash' && Math.abs(_this2.sprite.x - enemy.sprite.x) < 3) {
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
					enemy.handleKnockback(_this2);
					callback ? callback() : null;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NjcmlwdHMvcGxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7SUFNTSxNOzs7QUFFTCxpQkFBWSxLQUFaLEVBQW1CLEtBQW5CLEVBQTBCLE9BQTFCLEVBQW1DO0FBQUE7O0FBQUEsd0ZBQzVCLEtBRDRCLEVBQ3JCLEtBRHFCLEVBQ2QsT0FEYzs7QUFFbEMsUUFBSyxlQUFMLEdBQXVCOztBQUV0QixHQUFDLEVBQUQsRUFBSyxDQUFMLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsQ0FBaEIsRUFBbUIsRUFBbkIsQ0FGc0I7O0FBSXRCLEdBQUMsRUFBRCxFQUFLLENBQUwsRUFBUSxFQUFSLEVBQVksRUFBWixFQUFnQixDQUFoQixFQUFtQixFQUFuQixDQUpzQixFQUt0QixDQUFDLEdBQUQsRUFBTSxDQUFOLEVBQVMsRUFBVCxFQUFhLEVBQWIsRUFBaUIsQ0FBakIsRUFBb0IsRUFBcEIsQ0FMc0IsRUFNdEIsQ0FBQyxHQUFELEVBQU0sQ0FBTixFQUFTLEVBQVQsRUFBYSxFQUFiLEVBQWlCLENBQWpCLEVBQW9CLEVBQXBCLENBTnNCLEVBT3RCLENBQUMsR0FBRCxFQUFNLENBQU4sRUFBUyxFQUFULEVBQWEsRUFBYixFQUFpQixDQUFqQixFQUFvQixFQUFwQixDQVBzQixFQVF0QixDQUFDLEdBQUQsRUFBTSxDQUFOLEVBQVMsRUFBVCxFQUFhLEVBQWIsRUFBaUIsQ0FBakIsRUFBb0IsRUFBcEIsQ0FSc0IsRUFTdEIsQ0FBQyxHQUFELEVBQU0sQ0FBTixFQUFTLEVBQVQsRUFBYSxFQUFiLEVBQWlCLENBQWpCLEVBQW9CLEVBQXBCLENBVHNCOztBQVd0QixHQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsQ0FBaEIsRUFBbUIsRUFBbkIsQ0FYc0IsRUFZdEIsQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLEVBQVQsRUFBYSxFQUFiLEVBQWlCLENBQWpCLEVBQW9CLEVBQXBCLENB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b3VyY2VzQ29udGVudCI6WyJcbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFBMQVlFUiBDTEFTUyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbi8vIEltYWdlIHJlZmVycyB0byBhbiBleHBlY3RlZCBzcHJpdGUgc2hlZXQgZmlsZSwgYW5kIHN0YXRzIGFyZSB0aGUgcGxheWVyJ3Ncbi8vIGluLWdhbWUgcGFyYW1ldGVycyBhcyBhbiBvYmplY3QgdGhhdCB3aWxsIGV2ZW50dWFsbHkgYmUgZXhwZWN0ZWQgdG8gYmUgcmVjZWl2ZWQgXG4vLyBmcm9tIGEgZGF0YWJhc2UgcXVlcnkuIFxuY2xhc3MgUGxheWVyIGV4dGVuZHMgQ2hhcmFjdGVyIHtcblxuXHRjb25zdHJ1Y3RvcihpbWFnZSwgc3RhdHMsIG9wdGlvbnMpIHtcblx0XHRzdXBlcihpbWFnZSwgc3RhdHMsIG9wdGlvbnMpO1xuXHRcdHRoaXMuc3ByaXRlc2hlZXRkYXRhID0gW1xuXHRcdC8vIFN0YW5kXG5cdFx0XHRbMzAsIDAsIDQ4LCA4MiwgMCwgMzJdLFxuXHRcdC8vIFJ1blxuXHRcdFx0Wzg2LCAwLCA0OCwgODIsIDAsIDMyXSxcblx0XHRcdFsxNDIsIDAsIDQ4LCA4MiwgMCwgMzJdLFxuXHRcdFx0WzE5OCwgMCwgNDgsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMjYyLCAwLCA0OCwgODIsIDAsIDMyXSxcblx0XHRcdFszMTgsIDAsIDQ4LCA4MiwgMCwgMzJdLFxuXHRcdFx0WzM4NCwgMCwgNDgsIDgyLCAwLCAzMl0sXG5cdFx0Ly8gU2xhc2hcblx0XHRcdFswLCA5NCwgNDgsIDgyLCAwLCAzMl0sXG5cdFx0XHRbNDgsIDk0LCA0OCwgODIsIDAsIDMyXSxcblx0XHRcdFs5NiwgOTQsIDYwLCA4MiwgMCwgMzJdLFxuXHRcdFx0WzE1OCwgOTQsIDUwLCA4MiwgMCwgMzJdLFxuXHRcdFx0WzIxOCwgOTQsIDQ4LCA4MiwgMCwgMzJdLFxuXHRcdFx0WzI3MiwgOTQsIDUwLCA4MiwgMCwgMzJdLFxuXHRcdFx0WzMyNiwgOTQsIDUwLCA4MiwgMCwgMzJdLFxuXHRcdC8vIERlYWRcblx0XHRcdFszMTYsIDE3MCwgNDgsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMzgwLCAxNzAsIDYwLCA4MiwgMCwgMzJdLFxuXHRcdFx0WzM4MCwgMTcwLCA2MCwgODIsIDAsIDMyXVxuXHRcdF07XG5cblx0XHQvLyBIZWxwcyB0byBub3Qgb3ZlcmxvYWQgY29sbGlzaW9uIGRldGVjdGlvbjogXG5cdFx0dGhpcy5sYXN0Q29sbGlzaW9uID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cblx0XHQvLyBUd28gc3RhdGVzIHRvIGhhbmRsZSBqdW1waW5nIGFuaW1hdGlvbi4gXG5cdFx0dGhpcy5tYXhKdW1wWSA9IDQwO1xuXHRcdHRoaXMuanVtcFN0YXRlID0gJ2dyb3VuZCc7XG5cdH1cblxuXHRoYW5kbGVBdHRhY2sodGFyZ2V0cywgY2FsbGJhY2spIHtcblx0XHRpZiAodGhpcy5zcHJpdGUuY3VycmVudEFuaW1hdGlvbiAhPT0gJ3NsYXNoJykge1xuXHRcdFx0dGhpcy5zcHJpdGUuZ290b0FuZFBsYXkoJ3NsYXNoJyk7XG5cdFx0XHR0aGlzLmNvbGxpc2lvbnModGFyZ2V0cywgJ3NsYXNoJyk7XG5cdFx0fSBcblx0fVxuXG5cdC8vIGhhbmRsZUp1bXAoYW5pbWF0aW9uKSB7XG5cdC8vIFx0aWYgKHRoaXMuc3ByaXRlLnkgPT09IDYwICYmIGFuaW1hdGlvbiA9PT0gJ2p1bXAnKSB7XG5cdC8vIFx0XHR0aGlzLmp1bXBTdGF0ZSA9ICd1cCdcblx0Ly8gXHRcdHRoaXMuc3ByaXRlLnNldFRyYW5zZm9ybSh0aGlzLnNwcml0ZS54LCAzMCk7XG5cdC8vIFx0fSBlbHNlIGlmICh0aGlzLnNwcml0ZS55ID09PSAzMCAmJiBhbmltYXRpb24gPT09ICdqdW1wJykge1xuXHQvLyBcdFx0dGhpcy5qdW1wU3RhdGUgPSAndXAnXG5cdC8vIFx0XHR0aGlzLnNwcml0ZS5zZXRUcmFuc2Zvcm0odGhpcy5zcHJpdGUueCwgNjApO1xuXHQvLyBcdH1cblx0Ly8gfVxuXG5cdC8vIENhbiB0YWtlIGNhcmUgb2YganVtcGluZyBhbmQgbGFuZGluZyB0aGUgcGxheWVyIHdpdGhpbiB0aGUgcmVuZGVyIGxvb3Bcblx0Ly8gaGFuZGxlSnVtcCBmdW5jdGlvbiB0YWtlcyBjYXJlIG9mIHRoZSBpbml0aWF0aW9uLiBcblx0Ly8gaGFuZGxlWSgpIHtcblx0Ly8gXHRpZiAodGhpcy5zcHJpdGUueSA8IDYwICYmIHRoaXMuc3ByaXRlLnkgPj0gMzgpIHtcblx0Ly8gXHRcdGNvbnNvbGUubG9nKCd0aGlzLmp1bXBzdGF0ZSA9JywgdGhpcy5qdW1wU3RhdGUpO1xuXHQvLyBcdFx0aWYgKHRoaXMuanVtcFN0YXRlID09PSAndXAnKSB7XG5cdC8vIFx0XHRcdGlmICh0aGlzLnNwcml0ZS55ID49IDQwKSB7XG5cdC8vIFx0XHRcdFx0dGhpcy5zcHJpdGUueSAtPSAyO1xuXHQvLyBcdFx0XHRcdGlmICh0aGlzLnNwcml0ZS5jdXJyZW50QW5pbWF0aW9uID09PSAncnVuJykge1xuXHQvLyBcdFx0XHRcdFx0dGhpcy5zcHJpdGUueCArPSB0aGlzLnNwcml0ZS5kaXJlY3Rpb24gPT09ICdsZWZ0JyA/IC0xIDogMTtcblx0Ly8gXHRcdFx0XHR9XG5cdC8vIFx0XHRcdFx0aWYgKHRoaXMuc3ByaXRlLnkgPD0gNDApIHtcblx0Ly8gXHRcdFx0XHRcdHRoaXMuanVtcFN0YXRlID0gJ2Rvd24nO1xuXHQvLyBcdFx0XHRcdH1cblx0Ly8gXHRcdFx0fVxuXHQvLyBcdFx0fSBlbHNlIGlmICh0aGlzLmp1bXBTdGF0ZSA9PT0gJ2Rvd24nKSB7XG5cdC8vIFx0XHRcdGNvbnNvbGUubG9nKCdzZWNvbmQgaWYgZ2V0dGluZyBjYWxsZWQnKTtcblx0Ly8gXHRcdFx0dGhpcy5zcHJpdGUueSArPSAyO1xuXHQvLyBcdFx0XHRpZiAodGhpcy5zcHJpdGUuY3VycmVudEFuaW1hdGlvbiA9PT0gJ3J1bicpIHtcblx0Ly8gXHRcdFx0XHR0aGlzLnNwcml0ZS54ICs9IHRoaXMuc3ByaXRlLmRpcmVjdGlvbiA9PT0gJ2xlZnQnID8gLTEgOiAxO1xuXHQvLyBcdFx0XHR9XG5cdC8vIFx0XHRcdGlmICh0aGlzLnNwcml0ZS55ID49IDYwKSB7XG5cdC8vIFx0XHRcdFx0dGhpcy5qdW1wU3RhdGUgPSAnZ3JvdW5kJztcblx0Ly8gXHRcdFx0fVxuXHQvLyBcdFx0fVxuXHQvLyBcdH1cblx0Ly8gfVxuXG5cdC8vIHNjZW5hcmlvIGhlbHBzIHRvIGluY3JlYXNlIHRoZSByZXVzYWJpbGl0eSBvZiB0aGUgY29sbGlzaW9uIGRldGVjdG9yXG5cdC8vIGJ5IGFsbG93aW5nIGRpZmZlcmVudCBmdW5jdGlvbiBjYWxscyBiYXNlZCBvbiB3aGF0J3MgaGFwcGVuaW5nXG5cdGNvbGxpc2lvbnMoZW5lbWllcywgc2NlbmFyaW8sIGNhbGxiYWNrKSB7XG5cdFx0ZW5lbWllcy5mb3JFYWNoKChlbmVteSkgPT4ge1xuXHRcdFx0aWYgKHNjZW5hcmlvICE9PSAnc2xhc2gnICYmIE1hdGguYWJzKHRoaXMuc3ByaXRlLnggLSBlbmVteS5zcHJpdGUueCkgPCAzKSB7XG5cdFx0XHRcdGlmIChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHRoaXMubGFzdENvbGxpc2lvbiA+IDUwMCkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdjb2xsaXNpb24gZGV0ZWN0ZWQhIG1lOiAnLCB0aGlzLnNwcml0ZS55LCAnIGVuZW15OiAnLCBlbmVteS5zcHJpdGUueSk7XG5cdFx0XHRcdFx0dGhpcy5sYXN0Q29sbGlzaW9uID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdFx0XHRcdFx0dGhpcy5ocCAtPSBlbmVteS5hdGsgLSB0aGlzLmRlZjtcblx0XHRcdFx0XHRpZiAodGhpcy5ocCA8IDEpIHtcblx0XHRcdFx0XHRcdHRoaXMuaHAgPSAwO1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2soKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoc2NlbmFyaW8gPT09ICdzbGFzaCcgJiYgTWF0aC5hYnModGhpcy5zcHJpdGUueCAtIGVuZW15LnNwcml0ZS54KSA8IDI1KSB7XG5cdFx0XHRcdGVuZW15LmhhbmRsZUtub2NrYmFjayh0aGlzKTtcblx0XHRcdFx0Y2FsbGJhY2sgPyBjYWxsYmFjaygpIDogbnVsbDtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8vIFBsYXllciBkZWF0aCBnb2VzIHRocm91Z2ggdGhlIGZyYW1lcywgYW5kIHRoZSBleHBlY3RlZCBjYWxsYmFjayBkZWZpbmVkIHdpdGhpbiBhcHAgd2lsbFxuXHQvLyByZW1vdmUgdGhlIHBsYXllciBmcm9tIHRoZSBzdGFnZSBhZnRlciBlbGFwc2VkIHRpbWUgKHRvIGdpdmUgcm9vbSBmb3IgdGhlIGRlYWQgYW5pbWF0aW9uKVxuXHRoYW5kbGVEZWF0aChjYWxsYmFjaykge1xuXHRcdHRoaXMuc3ByaXRlLmdvdG9BbmRQbGF5KCdkZWFkJyk7XG5cdFx0c2V0VGltZW91dChjYWxsYmFjaywgMTIwMCk7XG5cdH1cblxufTtcblxud2luZG93LlBsYXllciA9IFBsYXllcjtcblxuIl19