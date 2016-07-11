"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* ***************************** PLAYER CLASS ******************************* */

// Image refers to an expected sprite sheet file, and stats are the player's
// in-game parameters as an object that will eventually be expected to be received
// from a database query.

var Player = function (_Character) {
	_inherits(Player, _Character);

	function Player(image, stats) {
		_classCallCheck(this, Player);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Player).call(this, image, stats));
	}

	return Player;
}(Character);

;

window.Player = Player;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NjcmlwdHMvcGxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0lBTU0sTTs7O0FBRUwsaUJBQVksS0FBWixFQUFtQixLQUFuQixFQUEwQjtBQUFBOztBQUFBLG1GQUNuQixLQURtQixFQUNaLEtBRFk7QUFFekI7OztFQUptQixTOztBQU1wQjs7QUFFRCxPQUFPLE1BQVAsR0FBZ0IsTUFBaEIiLCJmaWxlIjoicGxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBQTEFZRVIgQ0xBU1MgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG4vLyBJbWFnZSByZWZlcnMgdG8gYW4gZXhwZWN0ZWQgc3ByaXRlIHNoZWV0IGZpbGUsIGFuZCBzdGF0cyBhcmUgdGhlIHBsYXllcidzXG4vLyBpbi1nYW1lIHBhcmFtZXRlcnMgYXMgYW4gb2JqZWN0IHRoYXQgd2lsbCBldmVudHVhbGx5IGJlIGV4cGVjdGVkIHRvIGJlIHJlY2VpdmVkIFxuLy8gZnJvbSBhIGRhdGFiYXNlIHF1ZXJ5LiBcbmNsYXNzIFBsYXllciBleHRlbmRzIENoYXJhY3RlciB7XG5cblx0Y29uc3RydWN0b3IoaW1hZ2UsIHN0YXRzKSB7XG5cdFx0c3VwZXIoaW1hZ2UsIHN0YXRzKTtcblx0fVxuXG59O1xuXG53aW5kb3cuUGxheWVyID0gUGxheWVyO1xuXG4iXX0=