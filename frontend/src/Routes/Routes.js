import React, {Component} from 'react'
import {connect} from "react-redux";
import RoutesComponent from "./RoutesComponent";
import {getStops} from "../Information/Static/Stops";
import {addRoute} from "./RoutesActions";

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

	}


	handleStartStopChange = (route, stopId) => {
		console.log(route)
		console.log(stopId)
	}

	handleEndStopChange = (route, stopId) => {

	}

	handleSaveClick = (route) => {

	}

	handleCancelClick = (route) => {

	}

	handleDeleteClick = (route) => {

	}

	handleAddClick = () => {
		let route = {
			startStop: null,
			endStop: null,
		}

		this.props.addRoute(route)
	}

	render() {
		return(
			<RoutesComponent
				language={this.props.language}
				routes={this.props.routes}

				onStartStopChange={this.handleStartStopChange}
				onEndStopChange={this.handleEndStopChange}
				onSaveClick={this.handleSaveClick}
				onCancelClick={this.handleCancelClick}
				onDeleteClick={this.handleDeleteClick}
				onAddClick={this.handleAddClick}
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
		addRoute: (route) => dispatch(addRoute(route))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Routes)