"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
	_inherits(App, _React$Component);

	function App(props) {
		_classCallCheck(this, App);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(App).call(this));

		console.log('App initiated');
		return _this;
	}

	_createClass(App, [{
		key: "render",
		value: function render() {
			return React.createElement("canvas", { id: "forest-dungeon" });
		}
	}]);

	return App;
}(React.Component);

window.App = App;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbXBvbmVudHMvYXBwLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sRzs7O0FBRUwsY0FBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUE7O0FBRWxCLFVBQVEsR0FBUixDQUFZLGVBQVo7QUFGa0I7QUFHbEI7Ozs7MkJBRVE7QUFDUixVQUFPLGdDQUFRLElBQUcsZ0JBQVgsR0FBUDtBQUNBOzs7O0VBVGdCLE1BQU0sUzs7QUFheEIsT0FBTyxHQUFQLEdBQWEsR0FBYiIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cdFx0c3VwZXIoKTtcblx0XHRjb25zb2xlLmxvZygnQXBwIGluaXRpYXRlZCcpO1xuXHR9XG5cblx0cmVuZGVyKCkge1xuXHRcdHJldHVybiA8Y2FudmFzIGlkPVwiZm9yZXN0LWR1bmdlb25cIj48L2NhbnZhcz5cblx0fVxuXG59XG5cbndpbmRvdy5BcHAgPSBBcHA7Il19