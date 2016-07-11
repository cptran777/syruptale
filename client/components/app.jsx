class App extends React.Component {

	constructor(props) {
		super();
		console.log('App initiated');
	}

	render() {
		return <canvas id="forest-dungeon"></canvas>
	}

}

window.App = App;