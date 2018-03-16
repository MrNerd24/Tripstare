import React, {Component} from 'react'
import {connect} from "react-redux";
import RoutesComponent from "./RoutesComponent";
import {getStops} from "../Information/Static/Stops";

export class Routes extends Component {

	constructor(props) {
		super(props)

		this.state = {
			startStops: [{
				value: "0",
				text: "Loading"
			}]
		}
	}

	async componentWillMount() {
		let stops = await getStops();
		console.log(stops)
		this.setState({startStops: (stops).map(this.formatStop)})
	}

	formatStop(stop) {
		return {
			value: stop.id,
			text: stop.name
		}
	}

	render() {
		return(
			<RoutesComponent
				language={this.props.language}
				startStops={this.state.startStops}
				onStartStopChange={(id) => console.log(id)}
			/>
		)
	}


}

const mapStateToProps = (state, props) => {
	return {
		language: state.information.layout.language
	}
}

const mapDispatchToProps = (dispatch, props) => {
	return {

	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Routes)