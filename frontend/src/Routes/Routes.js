import React, {Component} from 'react'
import {connect} from "react-redux";
import RoutesComponent from "./RoutesComponent";
import Actions from '../Actions'
import RoutesServerDao from "./RoutesServerDao";
import RoutesLocalDao from "./RoutesLocalDao";
import {getStop} from "../Information/Static/Stops";

export class Routes extends Component {


	handleStartStopChange = async (route, stopId) => {
		route.startStop = await getStop(stopId)
		this.props.setRoute(route)
	}

	handleEndStopChange = async (route, stopId) => {
		route.endStop = await getStop(stopId)
		this.props.setRoute(route)
	}

	handleSaveClick = async (route) => {
		route.startStop = route.startStop ? route.startStop.gtfsId : null
		route.endStop = route.endStop ? route.endStop.gtfsId : null
		if(this.props.user.loggedIn) {
			RoutesServerDao.setRoute(route, this.props.user.info.token)
		} else {
			RoutesLocalDao.setRoute(route)
		}
	}

	handleCancelClick = async (route) => {
		if(this.props.user.loggedIn) {
			let oldRoute = await RoutesServerDao.getRoute(route.id, this.props.user.info.token)
			oldRoute.startStop = getStop(oldRoute.startStop)
			oldRoute.endStop = getStop(oldRoute.endStop)
			oldRoute.startStop = await oldRoute.startStop
			oldRoute.endStop = await oldRoute.endStop
			this.props.setRoute(oldRoute)
		} else {
			let oldRoute = await RoutesLocalDao.getRoute(route.id)
			oldRoute.startStop = getStop(oldRoute.startStop)
			oldRoute.endStop = getStop(oldRoute.endStop)
			oldRoute.startStop = await oldRoute.startStop
			oldRoute.endStop = await oldRoute.endStop
			this.props.setRoute(oldRoute)
		}
	}

	handleDeleteClick = (route) => {
		this.props.deleteRoute(route.id)
		if(this.props.user.loggedIn) {
			RoutesServerDao.deleteRoute(route, this.props.user.info.token)
		} else {
			RoutesLocalDao.deleteRoute(route)
		}
	}

	handleAddClick = async () => {
		let route = {
			startStop: null,
			endStop: null,
		}

		if(this.props.user.loggedIn) {
			let savedRoute = await RoutesServerDao.addRoute(route, this.props.user.info.token)
			this.props.addRoute(savedRoute)
		} else {
			let savedRoute = await RoutesLocalDao.addRoute(route)
			this.props.addRoute(savedRoute)
		}
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
		routes: state.routes,
		user: state.user
	}
}

const mapDispatchToProps = (dispatch, props) => {
	return {
		addRoute: (route) => dispatch(Actions.addRoute(route)),
		deleteRoute: (id) => dispatch(Actions.deleteRoute(id)),
		setRoute: (route) => dispatch(Actions.setRoute(route))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Routes)