'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HUD = function () {
	function HUD(image, health) {
		_classCallCheck(this, HUD);

		this.image = image;
		this.health = health;
		this.portrait;

		// The full health bar is supposed to remain static while the current health bar acts as
		// an overlay of sorts and decreases in size when the player is hit, therefore giving
		// the appearance that a single bar is losing health.
		this.fullHealthBar;
		this.currentHealthBar;

		// Damage display appears when an enemy is hit. This is an array made up of objects that
		// have the format: {text: <text object in create js>, createAt: <integer number> }
		// This way, the damage display can be checked with every render iteration to remove those
		// that have remained on the screen for too long.
		this.damageDisplay = [];
	}

	_createClass(HUD, [{
		key: 'renderPortrait',
		value: function renderPortrait() {
			this.portrait = new createjs.Shape();
			this.portrait.graphics.beginBitmapFill(this.image, 'no-repeat').drawCircle(75, 75, 75);

			this.portrait.scaleX = 0.40, this.portrait.scaleY = 0.40;
		}
	}, {
		key: 'renderHealthBars',
		value: function renderHealthBars() {
			this.fullHealthBar = new createjs.Shape();
			this.fullHealthBar.graphics.beginFill('#ffe95b').drawRoundRect(0, 0, 100, 15, 5);
			this.currentHealthBar = new createjs.Shape();
			this.currentHealthBar.graphics.beginFill('#c51d1d').drawRoundRect(0, 0, 100, 15, 5);
			this.fullHealthBar.x = 50, this.fullHealthBar.y = 10;
			this.currentHealthBar.x = 50, this.currentHealthBar.y = 10;
		}
	}, {
		key: 'renderHUD',
		value: function renderHUD(callback) {
			this.renderPortrait();
			this.renderHealthBars();

			callback(this.portrait, this.fullHealthBar, this.currentHealthBar);
		}

		// Damage and time are passed in from the app.js call to this function. The callback will be
		// passed the text object and used to call the render on the object.

	}, {
		key: 'renderDamage',
		value: function renderDamage(damage, time, position, callback) {
			var newText = {
				text: new createjs.Text('' + damage, '25px Impact', '#ffbf00'),
				createdAt: time
			};
			newText.text.x = position.x, newText.text.y = position.y;
			this.damageDisplay.push(newText);
			callback(newText.text);
		}
	}]);

	return HUD;
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NjcmlwdHMvaHVkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztJQUFNLEc7QUFFTCxjQUFZLEtBQVosRUFBbUIsTUFBbkIsRUFBMkI7QUFBQTs7QUFDMUIsT0FBSyxLQUFMLEdBQWEsS0FBYjtBQUNBLE9BQUssTUFBTCxHQUFjLE1BQWQ7QUFDQSxPQUFLLFFBQUw7Ozs7O0FBS0EsT0FBSyxhQUFMO0FBQ0EsT0FBSyxnQkFBTDs7Ozs7O0FBTUEsT0FBSyxhQUFMLEdBQXFCLEVBQXJCO0FBQ0E7Ozs7bUNBRWdCO0FBQ2hCLFFBQUssUUFBTCxHQUFnQixJQUFJLFNBQVMsS0FBYixFQUFoQjtBQUNBLFFBQUssUUFBTCxDQUFjLFFBQWQsQ0FBdUIsZUFBdkIsQ0FBdUMsS0FBSyxLQUE1QyxFQUFtRCxXQUFuRCxFQUFnRSxVQUFoRSxDQUEyRSxFQUEzRSxFQUErRSxFQUEvRSxFQUFtRixFQUFuRjs7QUFFQSxRQUFLLFFBQUwsQ0FBYyxNQUFkLEdBQXVCLElBQXZCLEVBQTZCLEtBQUssUUFBTCxDQUFjLE1BQWQsR0FBdUIsSUFBcEQ7QUFDQTs7O3FDQUVrQjtBQUNsQixRQUFLLGFBQUwsR0FBcUIsSUFBSSxTQUFTLEtBQWIsRUFBckI7QUFDQSxRQUFLLGFBQUwsQ0FBbUIsUUFBbkIsQ0FBNEIsU0FBNUIsQ0FBc0MsU0FBdEMsRUFBaUQsYUFBakQsQ0FBK0QsQ0FBL0QsRUFBa0UsQ0FBbEUsRUFBcUUsR0FBckUsRUFBMEUsRUFBMUUsRUFBOEUsQ0FBOUU7QUFDQSxRQUFLLGdCQUFMLEdBQXdCLElBQUksU0FBUyxLQUFiLEVBQXhCO0FBQ0EsUUFBSyxnQkFBTCxDQUFzQixRQUF0QixDQUErQixTQUEvQixDQUF5QyxTQUF6QyxFQUFvRCxhQUFwRCxDQUFrRSxDQUFsRSxFQUFxRSxDQUFyRSxFQUF3RSxHQUF4RSxFQUE2RSxFQUE3RSxFQUFpRixDQUFqRjtBQUNBLFFBQUssYUFBTCxDQUFtQixDQUFuQixHQUF1QixFQUF2QixFQUEyQixLQUFLLGFBQUwsQ0FBbUIsQ0FBbkIsR0FBdUIsRUFBbEQ7QUFDQSxRQUFLLGdCQUFMLENBQXNCLENBQXRCLEdBQTBCLEVBQTFCLEVBQThCLEtBQUssZ0JBQUwsQ0FBc0IsQ0FBdEIsR0FBMEIsRUFBeEQ7QUFDQTs7OzRCQUVTLFEsRUFBVTtBQUNuQixRQUFLLGNBQUw7QUFDQSxRQUFLLGdCQUFMOztBQUVBLFlBQVMsS0FBSyxRQUFkLEVBQXdCLEtBQUssYUFBN0IsRUFBNEMsS0FBSyxnQkFBakQ7QUFDQTs7Ozs7OzsrQkFJWSxNLEVBQVEsSSxFQUFNLFEsRUFBVSxRLEVBQVU7QUFDOUMsT0FBSSxVQUFVO0FBQ2IsVUFBTSxJQUFJLFNBQVMsSUFBYixDQUFrQixLQUFLLE1BQXZCLEVBQStCLGFBQS9CLEVBQThDLFNBQTlDLENBRE87QUFFYixlQUFXO0FBRkUsSUFBZDtBQUlBLFdBQVEsSUFBUixDQUFhLENBQWIsR0FBaUIsU0FBUyxDQUExQixFQUE2QixRQUFRLElBQVIsQ0FBYSxDQUFiLEdBQWlCLFNBQVMsQ0FBdkQ7QUFDQSxRQUFLLGFBQUwsQ0FBbUIsSUFBbkIsQ0FBd0IsT0FBeEI7QUFDQSxZQUFTLFFBQVEsSUFBakI7QUFDQSIsImZpbGUiOiJodWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBIVUQge1xuXG5cdGNvbnN0cnVjdG9yKGltYWdlLCBoZWFsdGgpIHtcblx0XHR0aGlzLmltYWdlID0gaW1hZ2U7XG5cdFx0dGhpcy5oZWFsdGggPSBoZWFsdGg7XG5cdFx0dGhpcy5wb3J0cmFpdDtcblxuXHRcdC8vIFRoZSBmdWxsIGhlYWx0aCBiYXIgaXMgc3VwcG9zZWQgdG8gcmVtYWluIHN0YXRpYyB3aGlsZSB0aGUgY3VycmVudCBoZWFsdGggYmFyIGFjdHMgYXNcblx0XHQvLyBhbiBvdmVybGF5IG9mIHNvcnRzIGFuZCBkZWNyZWFzZXMgaW4gc2l6ZSB3aGVuIHRoZSBwbGF5ZXIgaXMgaGl0LCB0aGVyZWZvcmUgZ2l2aW5nXG5cdFx0Ly8gdGhlIGFwcGVhcmFuY2UgdGhhdCBhIHNpbmdsZSBiYXIgaXMgbG9zaW5nIGhlYWx0aC4gXG5cdFx0dGhpcy5mdWxsSGVhbHRoQmFyO1xuXHRcdHRoaXMuY3VycmVudEhlYWx0aEJhcjtcblxuXHRcdC8vIERhbWFnZSBkaXNwbGF5IGFwcGVhcnMgd2hlbiBhbiBlbmVteSBpcyBoaXQuIFRoaXMgaXMgYW4gYXJyYXkgbWFkZSB1cCBvZiBvYmplY3RzIHRoYXRcblx0XHQvLyBoYXZlIHRoZSBmb3JtYXQ6IHt0ZXh0OiA8dGV4dCBvYmplY3QgaW4gY3JlYXRlIGpzPiwgY3JlYXRlQXQ6IDxpbnRlZ2VyIG51bWJlcj4gfVxuXHRcdC8vIFRoaXMgd2F5LCB0aGUgZGFtYWdlIGRpc3BsYXkgY2FuIGJlIGNoZWNrZWQgd2l0aCBldmVyeSByZW5kZXIgaXRlcmF0aW9uIHRvIHJlbW92ZSB0aG9zZVxuXHRcdC8vIHRoYXQgaGF2ZSByZW1haW5lZCBvbiB0aGUgc2NyZWVuIGZvciB0b28gbG9uZy4gXG5cdFx0dGhpcy5kYW1hZ2VEaXNwbGF5ID0gW107XG5cdH0gXG5cblx0cmVuZGVyUG9ydHJhaXQoKSB7XG5cdFx0dGhpcy5wb3J0cmFpdCA9IG5ldyBjcmVhdGVqcy5TaGFwZSgpO1xuXHRcdHRoaXMucG9ydHJhaXQuZ3JhcGhpY3MuYmVnaW5CaXRtYXBGaWxsKHRoaXMuaW1hZ2UsICduby1yZXBlYXQnKS5kcmF3Q2lyY2xlKDc1LCA3NSwgNzUpO1xuXG5cdFx0dGhpcy5wb3J0cmFpdC5zY2FsZVggPSAwLjQwLCB0aGlzLnBvcnRyYWl0LnNjYWxlWSA9IDAuNDA7XG5cdH0gXG5cblx0cmVuZGVySGVhbHRoQmFycygpIHtcblx0XHR0aGlzLmZ1bGxIZWFsdGhCYXIgPSBuZXcgY3JlYXRlanMuU2hhcGUoKTtcblx0XHR0aGlzLmZ1bGxIZWFsdGhCYXIuZ3JhcGhpY3MuYmVnaW5GaWxsKCcjZmZlOTViJykuZHJhd1JvdW5kUmVjdCgwLCAwLCAxMDAsIDE1LCA1KTtcblx0XHR0aGlzLmN1cnJlbnRIZWFsdGhCYXIgPSBuZXcgY3JlYXRlanMuU2hhcGUoKTtcblx0XHR0aGlzLmN1cnJlbnRIZWFsdGhCYXIuZ3JhcGhpY3MuYmVnaW5GaWxsKCcjYzUxZDFkJykuZHJhd1JvdW5kUmVjdCgwLCAwLCAxMDAsIDE1LCA1KTtcblx0XHR0aGlzLmZ1bGxIZWFsdGhCYXIueCA9IDUwLCB0aGlzLmZ1bGxIZWFsdGhCYXIueSA9IDEwO1xuXHRcdHRoaXMuY3VycmVudEhlYWx0aEJhci54ID0gNTAsIHRoaXMuY3VycmVudEhlYWx0aEJhci55ID0gMTA7XG5cdH1cblxuXHRyZW5kZXJIVUQoY2FsbGJhY2spIHtcblx0XHR0aGlzLnJlbmRlclBvcnRyYWl0KCk7XG5cdFx0dGhpcy5yZW5kZXJIZWFsdGhCYXJzKCk7XG5cblx0XHRjYWxsYmFjayh0aGlzLnBvcnRyYWl0LCB0aGlzLmZ1bGxIZWFsdGhCYXIsIHRoaXMuY3VycmVudEhlYWx0aEJhcik7XG5cdH1cblxuXHQvLyBEYW1hZ2UgYW5kIHRpbWUgYXJlIHBhc3NlZCBpbiBmcm9tIHRoZSBhcHAuanMgY2FsbCB0byB0aGlzIGZ1bmN0aW9uLiBUaGUgY2FsbGJhY2sgd2lsbCBiZVxuXHQvLyBwYXNzZWQgdGhlIHRleHQgb2JqZWN0IGFuZCB1c2VkIHRvIGNhbGwgdGhlIHJlbmRlciBvbiB0aGUgb2JqZWN0LiBcblx0cmVuZGVyRGFtYWdlKGRhbWFnZSwgdGltZSwgcG9zaXRpb24sIGNhbGxiYWNrKSB7IFxuXHRcdHZhciBuZXdUZXh0ID0ge1xuXHRcdFx0dGV4dDogbmV3IGNyZWF0ZWpzLlRleHQoJycgKyBkYW1hZ2UsICcyNXB4IEltcGFjdCcsICcjZmZiZjAwJyksXG5cdFx0XHRjcmVhdGVkQXQ6IHRpbWVcblx0XHR9O1xuXHRcdG5ld1RleHQudGV4dC54ID0gcG9zaXRpb24ueCwgbmV3VGV4dC50ZXh0LnkgPSBwb3NpdGlvbi55O1xuXHRcdHRoaXMuZGFtYWdlRGlzcGxheS5wdXNoKG5ld1RleHQpO1xuXHRcdGNhbGxiYWNrKG5ld1RleHQudGV4dCk7XG5cdH1cblxufSJdfQ==