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
			console.log('hud render running');
			var newText = {
				text: new createjs.Text('' + damage, '45px Impact', '#ffbf00'),
				createdAt: time
			};
			newText.text.x = position.x, newText.text.y = position.y;
			this.damageDisplay.push(newText);
			callback(newText.text);
		}
	}]);

	return HUD;
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NjcmlwdHMvaHVkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztJQUFNLEc7QUFFTCxjQUFZLEtBQVosRUFBbUIsTUFBbkIsRUFBMkI7QUFBQTs7QUFDMUIsT0FBSyxLQUFMLEdBQWEsS0FBYjtBQUNBLE9BQUssTUFBTCxHQUFjLE1BQWQ7QUFDQSxPQUFLLFFBQUw7Ozs7O0FBS0EsT0FBSyxhQUFMO0FBQ0EsT0FBSyxnQkFBTDs7Ozs7O0FBTUEsT0FBSyxhQUFMLEdBQXFCLEVBQXJCO0FBQ0E7Ozs7bUNBRWdCO0FBQ2hCLFFBQUssUUFBTCxHQUFnQixJQUFJLFNBQVMsS0FBYixFQUFoQjtBQUNBLFFBQUssUUFBTCxDQUFjLFFBQWQsQ0FBdUIsZUFBdkIsQ0FBdUMsS0FBSyxLQUE1QyxFQUFtRCxXQUFuRCxFQUFnRSxVQUFoRSxDQUEyRSxFQUEzRSxFQUErRSxFQUEvRSxFQUFtRixFQUFuRjs7QUFFQSxRQUFLLFFBQUwsQ0FBYyxNQUFkLEdBQXVCLElBQXZCLEVBQTZCLEtBQUssUUFBTCxDQUFjLE1BQWQsR0FBdUIsSUFBcEQ7QUFDQTs7O3FDQUVrQjtBQUNsQixRQUFLLGFBQUwsR0FBcUIsSUFBSSxTQUFTLEtBQWIsRUFBckI7QUFDQSxRQUFLLGFBQUwsQ0FBbUIsUUFBbkIsQ0FBNEIsU0FBNUIsQ0FBc0MsU0FBdEMsRUFBaUQsYUFBakQsQ0FBK0QsQ0FBL0QsRUFBa0UsQ0FBbEUsRUFBcUUsR0FBckUsRUFBMEUsRUFBMUUsRUFBOEUsQ0FBOUU7QUFDQSxRQUFLLGdCQUFMLEdBQXdCLElBQUksU0FBUyxLQUFiLEVBQXhCO0FBQ0EsUUFBSyxnQkFBTCxDQUFzQixRQUF0QixDQUErQixTQUEvQixDQUF5QyxTQUF6QyxFQUFvRCxhQUFwRCxDQUFrRSxDQUFsRSxFQUFxRSxDQUFyRSxFQUF3RSxHQUF4RSxFQUE2RSxFQUE3RSxFQUFpRixDQUFqRjtBQUNBLFFBQUssYUFBTCxDQUFtQixDQUFuQixHQUF1QixFQUF2QixFQUEyQixLQUFLLGFBQUwsQ0FBbUIsQ0FBbkIsR0FBdUIsRUFBbEQ7QUFDQSxRQUFLLGdCQUFMLENBQXNCLENBQXRCLEdBQTBCLEVBQTFCLEVBQThCLEtBQUssZ0JBQUwsQ0FBc0IsQ0FBdEIsR0FBMEIsRUFBeEQ7QUFDQTs7OzRCQUVTLFEsRUFBVTtBQUNuQixRQUFLLGNBQUw7QUFDQSxRQUFLLGdCQUFMOztBQUVBLFlBQVMsS0FBSyxRQUFkLEVBQXdCLEtBQUssYUFBN0IsRUFBNEMsS0FBSyxnQkFBakQ7QUFDQTs7Ozs7OzsrQkFJWSxNLEVBQVEsSSxFQUFNLFEsRUFBVSxRLEVBQVU7QUFDOUMsV0FBUSxHQUFSLENBQVksb0JBQVo7QUFDQSxPQUFJLFVBQVU7QUFDYixVQUFNLElBQUksU0FBUyxJQUFiLENBQWtCLEtBQUssTUFBdkIsRUFBK0IsYUFBL0IsRUFBOEMsU0FBOUMsQ0FETztBQUViLGVBQVc7QUFGRSxJQUFkO0FBSUEsV0FBUSxJQUFSLENBQWEsQ0FBYixHQUFpQixTQUFTLENBQTFCLEVBQTZCLFFBQVEsSUFBUixDQUFhLENBQWIsR0FBaUIsU0FBUyxDQUF2RDtBQUNBLFFBQUssYUFBTCxDQUFtQixJQUFuQixDQUF3QixPQUF4QjtBQUNBLFlBQVMsUUFBUSxJQUFqQjtBQUNBIiwiZmlsZSI6Imh1ZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEhVRCB7XG5cblx0Y29uc3RydWN0b3IoaW1hZ2UsIGhlYWx0aCkge1xuXHRcdHRoaXMuaW1hZ2UgPSBpbWFnZTtcblx0XHR0aGlzLmhlYWx0aCA9IGhlYWx0aDtcblx0XHR0aGlzLnBvcnRyYWl0O1xuXG5cdFx0Ly8gVGhlIGZ1bGwgaGVhbHRoIGJhciBpcyBzdXBwb3NlZCB0byByZW1haW4gc3RhdGljIHdoaWxlIHRoZSBjdXJyZW50IGhlYWx0aCBiYXIgYWN0cyBhc1xuXHRcdC8vIGFuIG92ZXJsYXkgb2Ygc29ydHMgYW5kIGRlY3JlYXNlcyBpbiBzaXplIHdoZW4gdGhlIHBsYXllciBpcyBoaXQsIHRoZXJlZm9yZSBnaXZpbmdcblx0XHQvLyB0aGUgYXBwZWFyYW5jZSB0aGF0IGEgc2luZ2xlIGJhciBpcyBsb3NpbmcgaGVhbHRoLiBcblx0XHR0aGlzLmZ1bGxIZWFsdGhCYXI7XG5cdFx0dGhpcy5jdXJyZW50SGVhbHRoQmFyO1xuXG5cdFx0Ly8gRGFtYWdlIGRpc3BsYXkgYXBwZWFycyB3aGVuIGFuIGVuZW15IGlzIGhpdC4gVGhpcyBpcyBhbiBhcnJheSBtYWRlIHVwIG9mIG9iamVjdHMgdGhhdFxuXHRcdC8vIGhhdmUgdGhlIGZvcm1hdDoge3RleHQ6IDx0ZXh0IG9iamVjdCBpbiBjcmVhdGUganM+LCBjcmVhdGVBdDogPGludGVnZXIgbnVtYmVyPiB9XG5cdFx0Ly8gVGhpcyB3YXksIHRoZSBkYW1hZ2UgZGlzcGxheSBjYW4gYmUgY2hlY2tlZCB3aXRoIGV2ZXJ5IHJlbmRlciBpdGVyYXRpb24gdG8gcmVtb3ZlIHRob3NlXG5cdFx0Ly8gdGhhdCBoYXZlIHJlbWFpbmVkIG9uIHRoZSBzY3JlZW4gZm9yIHRvbyBsb25nLiBcblx0XHR0aGlzLmRhbWFnZURpc3BsYXkgPSBbXTtcblx0fSBcblxuXHRyZW5kZXJQb3J0cmFpdCgpIHtcblx0XHR0aGlzLnBvcnRyYWl0ID0gbmV3IGNyZWF0ZWpzLlNoYXBlKCk7XG5cdFx0dGhpcy5wb3J0cmFpdC5ncmFwaGljcy5iZWdpbkJpdG1hcEZpbGwodGhpcy5pbWFnZSwgJ25vLXJlcGVhdCcpLmRyYXdDaXJjbGUoNzUsIDc1LCA3NSk7XG5cblx0XHR0aGlzLnBvcnRyYWl0LnNjYWxlWCA9IDAuNDAsIHRoaXMucG9ydHJhaXQuc2NhbGVZID0gMC40MDtcblx0fSBcblxuXHRyZW5kZXJIZWFsdGhCYXJzKCkge1xuXHRcdHRoaXMuZnVsbEhlYWx0aEJhciA9IG5ldyBjcmVhdGVqcy5TaGFwZSgpO1xuXHRcdHRoaXMuZnVsbEhlYWx0aEJhci5ncmFwaGljcy5iZWdpbkZpbGwoJyNmZmU5NWInKS5kcmF3Um91bmRSZWN0KDAsIDAsIDEwMCwgMTUsIDUpO1xuXHRcdHRoaXMuY3VycmVudEhlYWx0aEJhciA9IG5ldyBjcmVhdGVqcy5TaGFwZSgpO1xuXHRcdHRoaXMuY3VycmVudEhlYWx0aEJhci5ncmFwaGljcy5iZWdpbkZpbGwoJyNjNTFkMWQnKS5kcmF3Um91bmRSZWN0KDAsIDAsIDEwMCwgMTUsIDUpO1xuXHRcdHRoaXMuZnVsbEhlYWx0aEJhci54ID0gNTAsIHRoaXMuZnVsbEhlYWx0aEJhci55ID0gMTA7XG5cdFx0dGhpcy5jdXJyZW50SGVhbHRoQmFyLnggPSA1MCwgdGhpcy5jdXJyZW50SGVhbHRoQmFyLnkgPSAxMDtcblx0fVxuXG5cdHJlbmRlckhVRChjYWxsYmFjaykge1xuXHRcdHRoaXMucmVuZGVyUG9ydHJhaXQoKTtcblx0XHR0aGlzLnJlbmRlckhlYWx0aEJhcnMoKTtcblxuXHRcdGNhbGxiYWNrKHRoaXMucG9ydHJhaXQsIHRoaXMuZnVsbEhlYWx0aEJhciwgdGhpcy5jdXJyZW50SGVhbHRoQmFyKTtcblx0fVxuXG5cdC8vIERhbWFnZSBhbmQgdGltZSBhcmUgcGFzc2VkIGluIGZyb20gdGhlIGFwcC5qcyBjYWxsIHRvIHRoaXMgZnVuY3Rpb24uIFRoZSBjYWxsYmFjayB3aWxsIGJlXG5cdC8vIHBhc3NlZCB0aGUgdGV4dCBvYmplY3QgYW5kIHVzZWQgdG8gY2FsbCB0aGUgcmVuZGVyIG9uIHRoZSBvYmplY3QuIFxuXHRyZW5kZXJEYW1hZ2UoZGFtYWdlLCB0aW1lLCBwb3NpdGlvbiwgY2FsbGJhY2spIHtcblx0XHRjb25zb2xlLmxvZygnaHVkIHJlbmRlciBydW5uaW5nJyk7IFxuXHRcdHZhciBuZXdUZXh0ID0ge1xuXHRcdFx0dGV4dDogbmV3IGNyZWF0ZWpzLlRleHQoJycgKyBkYW1hZ2UsICc0NXB4IEltcGFjdCcsICcjZmZiZjAwJyksXG5cdFx0XHRjcmVhdGVkQXQ6IHRpbWVcblx0XHR9O1xuXHRcdG5ld1RleHQudGV4dC54ID0gcG9zaXRpb24ueCwgbmV3VGV4dC50ZXh0LnkgPSBwb3NpdGlvbi55O1xuXHRcdHRoaXMuZGFtYWdlRGlzcGxheS5wdXNoKG5ld1RleHQpO1xuXHRcdGNhbGxiYWNrKG5ld1RleHQudGV4dCk7XG5cdH1cblxufSJdfQ==