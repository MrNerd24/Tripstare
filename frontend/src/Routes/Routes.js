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
			}],

		}
	}

	async componentWillMount() {
		let stops = await getStops();
		console.log(stops)
		this.setState({startStops: (stops).map(this.formatStop)})
	}

	formatStop(stop) {
		let code = stop.code ? stop.code + " " : "";
		let name = stop.name ? stop.name + " " : "";
		let platformCode = stop.platformCode ? stop.platformCode + " " : "";
		let desc = stop.desc ? stop.desc : "";

		return {
			value: stop.id,
			text: `${code}${name}${platformCode}${desc}`,
			code, name, platformCode, desc
		}
	}

	handleStartStopChange = (route, stopId) => {
		console.log(stopId)
	}

	render() {
		return(
			<RoutesComponent
				language={this.props.language}
				startStops={this.state.startStops}
				routes={this.props.routes}

				onStartStopChange={this.handleStartStopChange}
			/>
		)
	}

}

const mapStateToProps = (state, props) => {
	return {
		language: state.information.layout.language,
		routes: state.routes
	}
}

const mapDispatchToProps = (dispatch, props) => {
	return {

	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Routes)