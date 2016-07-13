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
		_this.level = 1;
		_this.experience = 0;
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
	}, {
		key: 'addExp',
		value: function addExp(amount, callback) {
			this.experience += amount;
			if (this.experience >= Math.pow(this.level + 2, 3) + 5) {
				this.level++;
				this.atk += this.level;
				this.def += 1;
				this.maxHP += 5;
				this.hp += 5;
				callback();
			}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NjcmlwdHMvcGxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7SUFNTSxNOzs7QUFFTCxpQkFBWSxLQUFaLEVBQW1CLEtBQW5CLEVBQTBCLE9BQTFCLEVBQW1DO0FBQUE7O0FBQUEsd0ZBQzVCLEtBRDRCLEVBQ3JCLEtBRHFCLEVBQ2QsT0FEYzs7QUFFbEMsUUFBSyxlQUFMLEdBQXVCOztBQUV0QixHQUFDLEVBQUQsRUFBSyxDQUFMLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsQ0FBaEIsRUFBbUIsRUFBbkIsQ0FGc0I7O0FBSXRCLEdBQUMsRUFBRCxFQUFLLENBQUwsRUFBUSxFQUFSLEVBQVksRUFBWixFQUFnQixDQUFoQixFQUFtQixFQUFuQixDQUpzQixFQUt0QixDQUFDLEdBQUQsRUFBTSxDQUFOLEVBQVMsRUFBVCxFQUFhLEVBQWIsRUFBaUIsQ0FBakIsRUFBb0IsRUFBcEIsQ0FMc0IsRUFNdEIsQ0FBQyxHQUFELEVBQU0sQ0FBTixFQUFTLEVBQVQsRUFBYSxFQUFiLEVBQWlCLENBQWpCLEVBQW9CLEVBQXBCLENBTnNCLEVBT3RCLENBQUMsR0FBRCxFQUFNLENBQU4sRUFBUyxFQUFULEVBQWEsRUFBYixFQUFpQixDQUFqQixFQUFvQixFQUFwQixDQVBzQixFQVF0QixDQUFDLEdBQUQsRUFBTSxDQUFOLEVBQVMsRUFBVCxFQUFhLEVBQWIsRUFBaUIsQ0FBakIsRUFBb0IsRUFBcEIsQ0FSc0IsRUFTdEIsQ0FBQyxHQUFELEVBQU0sQ0FBTixFQUFTLEVBQVQsRUFBYSxFQUFiLEVBQWlCLENBQWpCLEVBQW9CLEVBQXBCLENBVHNCOztBQVd0QixHQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsQ0FBaEIsRUFBbUIsRUFBbkIsQ0FYc0IsRUFZdEIsQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLEVBQVQsRUFBYSxFQUFiLEVBQWlCLENBQWpCLEVBQW9CLEVBQXBCLENB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Q0EsT0FBSSxLQUFLLFVBQUwsSUFBbUIsS0FBSyxHQUFMLENBQVMsS0FBSyxLQUFMLEdBQWEsQ0FBdEIsRUFBeUIsQ0FBekIsSUFBOEIsQ0FBckQsRUFBd0Q7QUFDdkQsU0FBSyxLQUFMO0FBQ0EsU0FBSyxHQUFMLElBQVksS0FBSyxLQUFqQjtBQUNBLFNBQUssR0FBTCxJQUFZLENBQVo7QUFDQSxTQUFLLEtBQUwsSUFBYyxDQUFkO0FBQ0EsU0FBSyxFQUFMLElBQVcsQ0FBWDtBQUNBO0FBQ0E7QUFDRDs7Ozs7Ozs4QkFJVyxRLEVBQVU7QUFDckIsUUFBSyxNQUFMLENBQVksV0FBWixDQUF3QixNQUF4QjtBQUNBLGNBQVcsUUFBWCxFQUFxQixJQUFyQjtBQUNBOzs7O0VBekhtQixTOztBQTJIcEI7O0FBRUQsT0FBTyxNQUFQLEdBQWdCLE1BQWhCIiwiZmlsZSI6InBsYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogUExBWUVSIENMQVNTICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuLy8gSW1hZ2UgcmVmZXJzIHRvIGFuIGV4cGVjdGVkIHNwcml0ZSBzaGVldCBmaWxlLCBhbmQgc3RhdHMgYXJlIHRoZSBwbGF5ZXInc1xuLy8gaW4tZ2FtZSBwYXJhbWV0ZXJzIGFzIGFuIG9iamVjdCB0aGF0IHdpbGwgZXZlbnR1YWxseSBiZSBleHBlY3RlZCB0byBiZSByZWNlaXZlZCBcbi8vIGZyb20gYSBkYXRhYmFzZSBxdWVyeS4gXG5jbGFzcyBQbGF5ZXIgZXh0ZW5kcyBDaGFyYWN0ZXIge1xuXG5cdGNvbnN0cnVjdG9yKGltYWdlLCBzdGF0cywgb3B0aW9ucykge1xuXHRcdHN1cGVyKGltYWdlLCBzdGF0cywgb3B0aW9ucyk7XG5cdFx0dGhpcy5zcHJpdGVzaGVldGRhdGEgPSBbXG5cdFx0Ly8gU3RhbmRcblx0XHRcdFszMCwgMCwgNDgsIDgyLCAwLCAzMl0sXG5cdFx0Ly8gUnVuXG5cdFx0XHRbODYsIDAsIDQ4LCA4MiwgMCwgMzJdLFxuXHRcdFx0WzE0MiwgMCwgNDgsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMTk4LCAwLCA0OCwgODIsIDAsIDMyXSxcblx0XHRcdFsyNjIsIDAsIDQ4LCA4MiwgMCwgMzJdLFxuXHRcdFx0WzMxOCwgMCwgNDgsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMzg0LCAwLCA0OCwgODIsIDAsIDMyXSxcblx0XHQvLyBTbGFzaFxuXHRcdFx0WzAsIDk0LCA0OCwgODIsIDAsIDMyXSxcblx0XHRcdFs0OCwgOTQsIDQ4LCA4MiwgMCwgMzJdLFxuXHRcdFx0Wzk2LCA5NCwgNjAsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMTU4LCA5NCwgNTAsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMjE4LCA5NCwgNDgsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMjcyLCA5NCwgNTAsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMzI2LCA5NCwgNTAsIDgyLCAwLCAzMl0sXG5cdFx0Ly8gRGVhZFxuXHRcdFx0WzMxNiwgMTcwLCA0OCwgODIsIDAsIDMyXSxcblx0XHRcdFszODAsIDE3MCwgNjAsIDgyLCAwLCAzMl0sXG5cdFx0XHRbMzgwLCAxNzAsIDYwLCA4MiwgMCwgMzJdXG5cdFx0XTtcblxuXHRcdC8vIEhlbHBzIHRvIG5vdCBvdmVybG9hZCBjb2xsaXNpb24gZGV0ZWN0aW9uOiBcblx0XHR0aGlzLmxhc3RDb2xsaXNpb24gPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuXHRcdC8vIFR3byBzdGF0ZXMgdG8gaGFuZGxlIGp1bXBpbmcgYW5pbWF0aW9uLiBcblx0XHR0aGlzLm1heEp1bXBZID0gNDA7XG5cdFx0dGhpcy5qdW1wU3RhdGUgPSAnZ3JvdW5kJztcblx0XHR0aGlzLmxldmVsID0gMTsgXG5cdFx0dGhpcy5leHBlcmllbmNlID0gMDsgXG5cdH1cblxuXHRoYW5kbGVBdHRhY2sodGFyZ2V0cywgY2FsbGJhY2spIHtcblx0XHRpZiAodGhpcy5zcHJpdGUuY3VycmVudEFuaW1hdGlvbiAhPT0gJ3NsYXNoJykge1xuXHRcdFx0dGhpcy5zcHJpdGUuZ290b0FuZFBsYXkoJ3NsYXNoJyk7XG5cdFx0XHR0aGlzLmNvbGxpc2lvbnModGFyZ2V0cywgJ3NsYXNoJywgY2FsbGJhY2spO1xuXHRcdH0gXG5cdH1cblxuXHQvLyBoYW5kbGVKdW1wKGFuaW1hdGlvbikge1xuXHQvLyBcdGlmICh0aGlzLnNwcml0ZS55ID09PSA2MCAmJiBhbmltYXRpb24gPT09ICdqdW1wJykge1xuXHQvLyBcdFx0dGhpcy5qdW1wU3RhdGUgPSAndXAnXG5cdC8vIFx0XHR0aGlzLnNwcml0ZS5zZXRUcmFuc2Zvcm0odGhpcy5zcHJpdGUueCwgMzApO1xuXHQvLyBcdH0gZWxzZSBpZiAodGhpcy5zcHJpdGUueSA9PT0gMzAgJiYgYW5pbWF0aW9uID09PSAnanVtcCcpIHtcblx0Ly8gXHRcdHRoaXMuanVtcFN0YXRlID0gJ3VwJ1xuXHQvLyBcdFx0dGhpcy5zcHJpdGUuc2V0VHJhbnNmb3JtKHRoaXMuc3ByaXRlLngsIDYwKTtcblx0Ly8gXHR9XG5cdC8vIH1cblxuXHQvLyBDYW4gdGFrZSBjYXJlIG9mIGp1bXBpbmcgYW5kIGxhbmRpbmcgdGhlIHBsYXllciB3aXRoaW4gdGhlIHJlbmRlciBsb29wXG5cdC8vIGhhbmRsZUp1bXAgZnVuY3Rpb24gdGFrZXMgY2FyZSBvZiB0aGUgaW5pdGlhdGlvbi4gXG5cdC8vIGhhbmRsZVkoKSB7XG5cdC8vIFx0aWYgKHRoaXMuc3ByaXRlLnkgPCA2MCAmJiB0aGlzLnNwcml0ZS55ID49IDM4KSB7XG5cdC8vIFx0XHRjb25zb2xlLmxvZygndGhpcy5qdW1wc3RhdGUgPScsIHRoaXMuanVtcFN0YXRlKTtcblx0Ly8gXHRcdGlmICh0aGlzLmp1bXBTdGF0ZSA9PT0gJ3VwJykge1xuXHQvLyBcdFx0XHRpZiAodGhpcy5zcHJpdGUueSA+PSA0MCkge1xuXHQvLyBcdFx0XHRcdHRoaXMuc3ByaXRlLnkgLT0gMjtcblx0Ly8gXHRcdFx0XHRpZiAodGhpcy5zcHJpdGUuY3VycmVudEFuaW1hdGlvbiA9PT0gJ3J1bicpIHtcblx0Ly8gXHRcdFx0XHRcdHRoaXMuc3ByaXRlLnggKz0gdGhpcy5zcHJpdGUuZGlyZWN0aW9uID09PSAnbGVmdCcgPyAtMSA6IDE7XG5cdC8vIFx0XHRcdFx0fVxuXHQvLyBcdFx0XHRcdGlmICh0aGlzLnNwcml0ZS55IDw9IDQwKSB7XG5cdC8vIFx0XHRcdFx0XHR0aGlzLmp1bXBTdGF0ZSA9ICdkb3duJztcblx0Ly8gXHRcdFx0XHR9XG5cdC8vIFx0XHRcdH1cblx0Ly8gXHRcdH0gZWxzZSBpZiAodGhpcy5qdW1wU3RhdGUgPT09ICdkb3duJykge1xuXHQvLyBcdFx0XHRjb25zb2xlLmxvZygnc2Vjb25kIGlmIGdldHRpbmcgY2FsbGVkJyk7XG5cdC8vIFx0XHRcdHRoaXMuc3ByaXRlLnkgKz0gMjtcblx0Ly8gXHRcdFx0aWYgKHRoaXMuc3ByaXRlLmN1cnJlbnRBbmltYXRpb24gPT09ICdydW4nKSB7XG5cdC8vIFx0XHRcdFx0dGhpcy5zcHJpdGUueCArPSB0aGlzLnNwcml0ZS5kaXJlY3Rpb24gPT09ICdsZWZ0JyA/IC0xIDogMTtcblx0Ly8gXHRcdFx0fVxuXHQvLyBcdFx0XHRpZiAodGhpcy5zcHJpdGUueSA+PSA2MCkge1xuXHQvLyBcdFx0XHRcdHRoaXMuanVtcFN0YXRlID0gJ2dyb3VuZCc7XG5cdC8vIFx0XHRcdH1cblx0Ly8gXHRcdH1cblx0Ly8gXHR9XG5cdC8vIH1cblxuXHQvLyBzY2VuYXJpbyBoZWxwcyB0byBpbmNyZWFzZSB0aGUgcmV1c2FiaWxpdHkgb2YgdGhlIGNvbGxpc2lvbiBkZXRlY3RvclxuXHQvLyBieSBhbGxvd2luZyBkaWZmZXJlbnQgZnVuY3Rpb24gY2FsbHMgYmFzZWQgb24gd2hhdCdzIGhhcHBlbmluZ1xuXHRjb2xsaXNpb25zKGVuZW1pZXMsIHNjZW5hcmlvLCBjYWxsYmFjaykge1xuXHRcdGVuZW1pZXMuZm9yRWFjaCgoZW5lbXkpID0+IHtcblx0XHRcdGlmIChzY2VuYXJpbyAhPT0gJ3NsYXNoJyAmJiBNYXRoLmFicyh0aGlzLnNwcml0ZS54IC0gZW5lbXkuc3ByaXRlLngpIDwgOCkge1xuXHRcdFx0XHRpZiAobmV3IERhdGUoKS5nZXRUaW1lKCkgLSB0aGlzLmxhc3RDb2xsaXNpb24gPiA1MDApIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnY29sbGlzaW9uIGRldGVjdGVkISBtZTogJywgdGhpcy5zcHJpdGUueSwgJyBlbmVteTogJywgZW5lbXkuc3ByaXRlLnkpO1xuXHRcdFx0XHRcdHRoaXMubGFzdENvbGxpc2lvbiA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHRcdFx0XHRcdHRoaXMuaHAgLT0gZW5lbXkuYXRrIC0gdGhpcy5kZWY7XG5cdFx0XHRcdFx0aWYgKHRoaXMuaHAgPCAxKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmhwID0gMDtcblx0XHRcdFx0XHRcdGNhbGxiYWNrKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKHNjZW5hcmlvID09PSAnc2xhc2gnICYmIE1hdGguYWJzKHRoaXMuc3ByaXRlLnggLSBlbmVteS5zcHJpdGUueCkgPCAyNSkge1xuXHRcdFx0XHRlbmVteS5oYW5kbGVLbm9ja2JhY2sodGhpcywgJ2tub2NrYmFjaycpO1xuXHRcdFx0XHRjYWxsYmFjayA/IGNhbGxiYWNrKHRoaXMuYXRrIC0gZW5lbXkuZGVmKSA6IG51bGw7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRhZGRFeHAoYW1vdW50LCBjYWxsYmFjaykge1xuXHRcdHRoaXMuZXhwZXJpZW5jZSArPSBhbW91bnQ7XG5cdFx0aWYgKHRoaXMuZXhwZXJpZW5jZSA+PSBNYXRoLnBvdyh0aGlzLmxldmVsICsgMiwgMykgKyA1KSB7XG5cdFx0XHR0aGlzLmxldmVsKys7XG5cdFx0XHR0aGlzLmF0ayArPSB0aGlzLmxldmVsO1xuXHRcdFx0dGhpcy5kZWYgKz0gMTtcblx0XHRcdHRoaXMubWF4SFAgKz0gNTtcblx0XHRcdHRoaXMuaHAgKz0gNTtcblx0XHRcdGNhbGxiYWNrKCk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gUGxheWVyIGRlYXRoIGdvZXMgdGhyb3VnaCB0aGUgZnJhbWVzLCBhbmQgdGhlIGV4cGVjdGVkIGNhbGxiYWNrIGRlZmluZWQgd2l0aGluIGFwcCB3aWxsXG5cdC8vIHJlbW92ZSB0aGUgcGxheWVyIGZyb20gdGhlIHN0YWdlIGFmdGVyIGVsYXBzZWQgdGltZSAodG8gZ2l2ZSByb29tIGZvciB0aGUgZGVhZCBhbmltYXRpb24pXG5cdGhhbmRsZURlYXRoKGNhbGxiYWNrKSB7XG5cdFx0dGhpcy5zcHJpdGUuZ290b0FuZFBsYXkoJ2RlYWQnKTtcblx0XHRzZXRUaW1lb3V0KGNhbGxiYWNrLCAxMjAwKTtcblx0fVxuXG59O1xuXG53aW5kb3cuUGxheWVyID0gUGxheWVyO1xuXG4iXX0=