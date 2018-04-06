import React, {Component} from 'react'
import Card from "../CommonComponents/Card";
import {Typography} from "material-ui";
import {routesBetweenStops} from "../Information/Static/Routes";
import {getArrivalTime, getTodaysStoptimesForStop, isRealtime} from "../Information/Realtime/RouteArrivalTimes";

export default class RouteSituation extends Component {


	constructor(props) {
		super(props)

		this.state = {
			secondsTillNextVehicle: 0,
			minutesTillNextVahicle: 0,
			stoptime: {
				time: -1,
				route: "",
				routeName: "",
				realtime: false,
				trip: ""
			}
		}

		this.routeIds = null
		this.serverIntervalId = null
		this.routes = null
		this.stopTimeQueue = []
	}


	async componentDidMount() {
		if(this.props.route.startStop && this.props.route.endStop) {
			this.routeIds = await routesBetweenStops(this.props.route.startStop.gtfsId, this.props.route.endStop.gtfsId)
			this.stopTimeQueue = await getTodaysStoptimesForStop(this.props.route.startStop.gtfsId, this.routeIds)
			await this.updateTime()
			this.serverIntervalId = setInterval(() => this.updateTime(), 30000)
			this.renderIntervalId = setInterval(() => this.updateRemainingTime(), 1000)
			this.stoptimesIntervalId = setInterval(async () => {this.stopTimeQueue = await getTodaysStoptimesForStop(this.props.route.startStop.gtfsId, this.routeIds)}, 600000)
		}
	}

	async updateTime() {
		let stoptime = null

		while (!stoptime || stoptime.time < Date.now()) {
			stoptime = this.stopTimeQueue.pop()
			if(!stoptime) {
				return
			}
			if(stoptime.realtime === undefined) {
				stoptime.realtime = await isRealtime(stoptime.trip, this.props.route.startStop.gtfsId)
			}
			if(stoptime.realtime) {
				stoptime.time = await getArrivalTime(stoptime.trip, this.props.route.startStop.gtfsId)
			}
		}
		this.stopTimeQueue.push(stoptime)
		this.setState({stoptime})


	}

	updateRemainingTime() {
		let timeRemaining = this.state.stoptime.time - Date.now()
		if (timeRemaining <= 0) {
			this.updateTime()
		} else {
			this.setState({secondsTillNextVehicle: Math.floor(timeRemaining / 1000)%60, minutesTillNextVahicle: Math.floor((timeRemaining / (1000*60)))})
		}
	}

	componentWillUnmount() {
		clearInterval(this.serverIntervalId)
		clearInterval(this.renderIntervalId)
		clearInterval(this.stoptimesIntervalId)
	}


	render() {
		if(this.props.route.startStop && this.props.route.endStop) {
			return this.renderSituation();
		}
		return null
	}


	renderSituation() {
		return (
			<Card>
				<Typography
					variant="title">{this.props.route.startStop.name} - {this.props.route.endStop.name}</Typography>
				<div style={{display: "flex", justifyContent: "space-between"}}>
					<Typography variant="subheading">{this.state.stoptime.routeName}</Typography>
					<Typography
						style={{color: this.state.stoptime.realtime ? "green" : "black"}}>{this.state.minutesTillNextVahicle !== 0 ? this.state.minutesTillNextVahicle + " min": null} {this.state.secondsTillNextVehicle} sec</Typography>
				</div>
			</Card>
		)
	}
}