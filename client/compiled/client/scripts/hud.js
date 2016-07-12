'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HUD = function () {
	function HUD(image, health) {
		_classCallCheck(this, HUD);

		this.image = image;
		this.health = health;
		this.portrait;
		this.fullHealthBar;
		this.currentHealthBar;
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
	}]);

	return HUD;
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NjcmlwdHMvaHVkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztJQUFNLEc7QUFFTCxjQUFZLEtBQVosRUFBbUIsTUFBbkIsRUFBMkI7QUFBQTs7QUFDMUIsT0FBSyxLQUFMLEdBQWEsS0FBYjtBQUNBLE9BQUssTUFBTCxHQUFjLE1BQWQ7QUFDQSxPQUFLLFFBQUw7QUFDQSxPQUFLLGFBQUw7QUFDQSxPQUFLLGdCQUFMO0FBQ0EsT0FBSyxhQUFMLEdBQXFCLEVBQXJCO0FBQ0E7Ozs7bUNBRWdCO0FBQ2hCLFFBQUssUUFBTCxHQUFnQixJQUFJLFNBQVMsS0FBYixFQUFoQjtBQUNBLFFBQUssUUFBTCxDQUFjLFFBQWQsQ0FBdUIsZUFBdkIsQ0FBdUMsS0FBSyxLQUE1QyxFQUFtRCxXQUFuRCxFQUFnRSxVQUFoRSxDQUEyRSxFQUEzRSxFQUErRSxFQUEvRSxFQUFtRixFQUFuRjs7QUFFQSxRQUFLLFFBQUwsQ0FBYyxNQUFkLEdBQXVCLElBQXZCLEVBQTZCLEtBQUssUUFBTCxDQUFjLE1BQWQsR0FBdUIsSUFBcEQ7QUFDQTs7O3FDQUVrQjtBQUNsQixRQUFLLGFBQUwsR0FBcUIsSUFBSSxTQUFTLEtBQWIsRUFBckI7QUFDQSxRQUFLLGFBQUwsQ0FBbUIsUUFBbkIsQ0FBNEIsU0FBNUIsQ0FBc0MsU0FBdEMsRUFBaUQsYUFBakQsQ0FBK0QsQ0FBL0QsRUFBa0UsQ0FBbEUsRUFBcUUsR0FBckUsRUFBMEUsRUFBMUUsRUFBOEUsQ0FBOUU7QUFDQSxRQUFLLGdCQUFMLEdBQXdCLElBQUksU0FBUyxLQUFiLEVBQXhCO0FBQ0EsUUFBSyxnQkFBTCxDQUFzQixRQUF0QixDQUErQixTQUEvQixDQUF5QyxTQUF6QyxFQUFvRCxhQUFwRCxDQUFrRSxDQUFsRSxFQUFxRSxDQUFyRSxFQUF3RSxHQUF4RSxFQUE2RSxFQUE3RSxFQUFpRixDQUFqRjtBQUNBLFFBQUssYUFBTCxDQUFtQixDQUFuQixHQUF1QixFQUF2QixFQUEyQixLQUFLLGFBQUwsQ0FBbUIsQ0FBbkIsR0FBdUIsRUFBbEQ7QUFDQSxRQUFLLGdCQUFMLENBQXNCLENBQXRCLEdBQTBCLEVBQTFCLEVBQThCLEtBQUssZ0JBQUwsQ0FBc0IsQ0FBdEIsR0FBMEIsRUFBeEQ7QUFDQTs7OzRCQUVTLFEsRUFBVTtBQUNuQixRQUFLLGNBQUw7QUFDQSxRQUFLLGdCQUFMOztBQUVBLFlBQVMsS0FBSyxRQUFkLEVBQXdCLEtBQUssYUFBN0IsRUFBNEMsS0FBSyxnQkFBakQ7QUFDQSIsImZpbGUiOiJodWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBIVUQge1xuXG5cdGNvbnN0cnVjdG9yKGltYWdlLCBoZWFsdGgpIHtcblx0XHR0aGlzLmltYWdlID0gaW1hZ2U7XG5cdFx0dGhpcy5oZWFsdGggPSBoZWFsdGg7XG5cdFx0dGhpcy5wb3J0cmFpdDtcblx0XHR0aGlzLmZ1bGxIZWFsdGhCYXI7XG5cdFx0dGhpcy5jdXJyZW50SGVhbHRoQmFyO1xuXHRcdHRoaXMuZGFtYWdlRGlzcGxheSA9IFtdO1xuXHR9IFxuXG5cdHJlbmRlclBvcnRyYWl0KCkge1xuXHRcdHRoaXMucG9ydHJhaXQgPSBuZXcgY3JlYXRlanMuU2hhcGUoKTtcblx0XHR0aGlzLnBvcnRyYWl0LmdyYXBoaWNzLmJlZ2luQml0bWFwRmlsbCh0aGlzLmltYWdlLCAnbm8tcmVwZWF0JykuZHJhd0NpcmNsZSg3NSwgNzUsIDc1KTtcblxuXHRcdHRoaXMucG9ydHJhaXQuc2NhbGVYID0gMC40MCwgdGhpcy5wb3J0cmFpdC5zY2FsZVkgPSAwLjQwO1xuXHR9IFxuXG5cdHJlbmRlckhlYWx0aEJhcnMoKSB7XG5cdFx0dGhpcy5mdWxsSGVhbHRoQmFyID0gbmV3IGNyZWF0ZWpzLlNoYXBlKCk7XG5cdFx0dGhpcy5mdWxsSGVhbHRoQmFyLmdyYXBoaWNzLmJlZ2luRmlsbCgnI2ZmZTk1YicpLmRyYXdSb3VuZFJlY3QoMCwgMCwgMTAwLCAxNSwgNSk7XG5cdFx0dGhpcy5jdXJyZW50SGVhbHRoQmFyID0gbmV3IGNyZWF0ZWpzLlNoYXBlKCk7XG5cdFx0dGhpcy5jdXJyZW50SGVhbHRoQmFyLmdyYXBoaWNzLmJlZ2luRmlsbCgnI2M1MWQxZCcpLmRyYXdSb3VuZFJlY3QoMCwgMCwgMTAwLCAxNSwgNSk7XG5cdFx0dGhpcy5mdWxsSGVhbHRoQmFyLnggPSA1MCwgdGhpcy5mdWxsSGVhbHRoQmFyLnkgPSAxMDtcblx0XHR0aGlzLmN1cnJlbnRIZWFsdGhCYXIueCA9IDUwLCB0aGlzLmN1cnJlbnRIZWFsdGhCYXIueSA9IDEwO1xuXHR9XG5cblx0cmVuZGVySFVEKGNhbGxiYWNrKSB7XG5cdFx0dGhpcy5yZW5kZXJQb3J0cmFpdCgpO1xuXHRcdHRoaXMucmVuZGVySGVhbHRoQmFycygpO1xuXG5cdFx0Y2FsbGJhY2sodGhpcy5wb3J0cmFpdCwgdGhpcy5mdWxsSGVhbHRoQmFyLCB0aGlzLmN1cnJlbnRIZWFsdGhCYXIpO1xuXHR9XG5cbn0iXX0=