'use strict';

/* ***************************** APP INITIATION ******************************* */

// Using create.js to set up and render background:

var stage, loader, canvasWidth, canvasHeight;
var background;

function init() {

	stage = new createjs.Stage('forest-dungeon');

	// Canvas width and height stored in var w and h for future use.
	canvasWidth = stage.canvas.width;
	canvasHeight = stage.canvas.height;

	// Manifest will create and store background image for future use. Looks like
	// the render will need to be adjusted to align the image properly.
	manifest = [{ src: 'background.png', id: 'background' }];
	// Loader will render the necessary items
	loader = new createjs.LoadQueue(false);
	loader.addEventListener('complete', handleComplete);
	loader.loadManifest(manifest, true, 'assets/images/');
}

init();

/* **************************** CREATE THE STAGE ***************************** */

function handleComplete(event) {

	// Creates background image.
	background = new createjs.Shape();
	backgroundImg = loader.getResult('background');
	background.graphics.beginBitmapFill(backgroundImg).drawRect(0, 0, canvasWidth + backgroundImg.width, canvasHeight + backgroundImg.height);
	stage.addChild(background);

	// Adjustment to line the image mentioned above.
	background.y = -105;
}

/* ****************************** RENDER LOOP ******************************** */

createjs.Ticker.addEventListener('tick', handleTick);
function handleTick(event) {

	var deltaS = event.delta / 1000;

	stage.update();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9zY3JpcHRzL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFJQSxJQUFJLEtBQUosRUFBVyxNQUFYLEVBQW1CLFdBQW5CLEVBQWdDLFlBQWhDO0FBQ0EsSUFBSSxVQUFKOztBQUVBLFNBQVMsSUFBVCxHQUFnQjs7QUFFZixTQUFRLElBQUksU0FBUyxLQUFiLENBQW1CLGdCQUFuQixDQUFSOzs7QUFHQSxlQUFjLE1BQU0sTUFBTixDQUFhLEtBQTNCO0FBQ0EsZ0JBQWUsTUFBTSxNQUFOLENBQWEsTUFBNUI7Ozs7QUFJQSxZQUFXLENBQ1YsRUFBQyxLQUFLLGdCQUFOLEVBQXdCLElBQUksWUFBNUIsRUFEVSxDQUFYOztBQUlBLFVBQVMsSUFBSSxTQUFTLFNBQWIsQ0FBdUIsS0FBdkIsQ0FBVDtBQUNBLFFBQU8sZ0JBQVAsQ0FBd0IsVUFBeEIsRUFBb0MsY0FBcEM7QUFDQSxRQUFPLFlBQVAsQ0FBb0IsUUFBcEIsRUFBOEIsSUFBOUIsRUFBb0MsZ0JBQXBDO0FBQ0E7O0FBRUQ7Ozs7QUFJQSxTQUFTLGNBQVQsQ0FBd0IsS0FBeEIsRUFBK0I7OztBQUc5QixjQUFhLElBQUksU0FBUyxLQUFiLEVBQWI7QUFDQSxpQkFBZ0IsT0FBTyxTQUFQLENBQWlCLFlBQWpCLENBQWhCO0FBQ0EsWUFBVyxRQUFYLENBQW9CLGVBQXBCLENBQW9DLGFBQXBDLEVBQW1ELFFBQW5ELENBQTRELENBQTVELEVBQStELENBQS9ELEVBQWtFLGNBQWMsY0FBYyxLQUE5RixFQUFxRyxlQUFlLGNBQWMsTUFBbEk7QUFDQSxPQUFNLFFBQU4sQ0FBZSxVQUFmOzs7QUFHQSxZQUFXLENBQVgsR0FBZSxDQUFDLEdBQWhCO0FBQ0E7Ozs7QUFJRCxTQUFTLE1BQVQsQ0FBZ0IsZ0JBQWhCLENBQWlDLE1BQWpDLEVBQXlDLFVBQXpDO0FBQ0EsU0FBUyxVQUFULENBQW9CLEtBQXBCLEVBQTJCOztBQUUxQixLQUFJLFNBQVMsTUFBTSxLQUFOLEdBQWMsSUFBM0I7O0FBRUEsT0FBTSxNQUFOO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogQVBQIElOSVRJQVRJT04gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG4vLyBVc2luZyBjcmVhdGUuanMgdG8gc2V0IHVwIGFuZCByZW5kZXIgYmFja2dyb3VuZDogXG5cbnZhciBzdGFnZSwgbG9hZGVyLCBjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0O1xudmFyIGJhY2tncm91bmQ7XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG5cblx0c3RhZ2UgPSBuZXcgY3JlYXRlanMuU3RhZ2UoJ2ZvcmVzdC1kdW5nZW9uJyk7XG5cblx0Ly8gQ2FudmFzIHdpZHRoIGFuZCBoZWlnaHQgc3RvcmVkIGluIHZhciB3IGFuZCBoIGZvciBmdXR1cmUgdXNlLiBcblx0Y2FudmFzV2lkdGggPSBzdGFnZS5jYW52YXMud2lkdGg7XG5cdGNhbnZhc0hlaWdodCA9IHN0YWdlLmNhbnZhcy5oZWlnaHQ7XG5cblx0Ly8gTWFuaWZlc3Qgd2lsbCBjcmVhdGUgYW5kIHN0b3JlIGJhY2tncm91bmQgaW1hZ2UgZm9yIGZ1dHVyZSB1c2UuIExvb2tzIGxpa2UgXG5cdC8vIHRoZSByZW5kZXIgd2lsbCBuZWVkIHRvIGJlIGFkanVzdGVkIHRvIGFsaWduIHRoZSBpbWFnZSBwcm9wZXJseS4gXG5cdG1hbmlmZXN0ID0gW1xuXHRcdHtzcmM6ICdiYWNrZ3JvdW5kLnBuZycsIGlkOiAnYmFja2dyb3VuZCd9XG5cdF07XG5cdC8vIExvYWRlciB3aWxsIHJlbmRlciB0aGUgbmVjZXNzYXJ5IGl0ZW1zIFxuXHRsb2FkZXIgPSBuZXcgY3JlYXRlanMuTG9hZFF1ZXVlKGZhbHNlKTtcblx0bG9hZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbXBsZXRlJywgaGFuZGxlQ29tcGxldGUpO1xuXHRsb2FkZXIubG9hZE1hbmlmZXN0KG1hbmlmZXN0LCB0cnVlLCAnYXNzZXRzL2ltYWdlcy8nKTtcbn1cblxuaW5pdCgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIENSRUFURSBUSEUgU1RBR0UgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuZnVuY3Rpb24gaGFuZGxlQ29tcGxldGUoZXZlbnQpIHtcblx0XG5cdC8vIENyZWF0ZXMgYmFja2dyb3VuZCBpbWFnZS4gXG5cdGJhY2tncm91bmQgPSBuZXcgY3JlYXRlanMuU2hhcGUoKTtcblx0YmFja2dyb3VuZEltZyA9IGxvYWRlci5nZXRSZXN1bHQoJ2JhY2tncm91bmQnKTtcblx0YmFja2dyb3VuZC5ncmFwaGljcy5iZWdpbkJpdG1hcEZpbGwoYmFja2dyb3VuZEltZykuZHJhd1JlY3QoMCwgMCwgY2FudmFzV2lkdGggKyBiYWNrZ3JvdW5kSW1nLndpZHRoLCBjYW52YXNIZWlnaHQgKyBiYWNrZ3JvdW5kSW1nLmhlaWdodCk7XG5cdHN0YWdlLmFkZENoaWxkKGJhY2tncm91bmQpO1xuXG5cdC8vIEFkanVzdG1lbnQgdG8gbGluZSB0aGUgaW1hZ2UgbWVudGlvbmVkIGFib3ZlLiBcblx0YmFja2dyb3VuZC55ID0gLTEwNTtcbn1cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFJFTkRFUiBMT09QICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbmNyZWF0ZWpzLlRpY2tlci5hZGRFdmVudExpc3RlbmVyKCd0aWNrJywgaGFuZGxlVGljayk7IFxuZnVuY3Rpb24gaGFuZGxlVGljayhldmVudCkge1xuXG5cdHZhciBkZWx0YVMgPSBldmVudC5kZWx0YSAvIDEwMDA7XG5cblx0c3RhZ2UudXBkYXRlKCk7XG59XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4iXX0=