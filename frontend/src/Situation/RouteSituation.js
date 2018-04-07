import React, {Component} from 'react'
import Card from "../CommonComponents/Card";
import {Typography} from "material-ui";
import {routesBetweenStops} from "../Information/Static/Routes";
import {getUpdatedTimes, getTodaysStoptimesForStop} from "../Information/Realtime/RouteArrivalTimes";
import Alerts from "./Alerts";

export default class RouteSituation extends Component {


	constructor(props) {
		super(props)

		this.state = {
			secondsTillNextVehicle: 0,
			minutesTillNextVahicle: 0,
			stoptime: {
				departureTime: -1,
				arrivalTime: -1,
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
		if (this.props.route.startStop && this.props.route.endStop) {
			this.routeIds = await routesBetweenStops(this.props.route.startStop.gtfsId, this.props.route.endStop.gtfsId)
			this.stopTimeQueue = await getTodaysStoptimesForStop(this.props.route.startStop.gtfsId, this.props.route.endStop.gtfsId, this.routeIds)
			await this.updateTime()
			this.serverIntervalId = setInterval(() => this.updateTime(), 30000)
			this.renderIntervalId = setInterval(() => this.updateRemainingTime(), 1000)
			this.stoptimesIntervalId = setInterval(async () => {
				this.stopTimeQueue = await getTodaysStoptimesForStop(this.props.route.startStop.gtfsId, this.props.route.endStop.gtfsId, this.routeIds)
			}, 600000)
		}
	}

	async updateTime() {
		let stoptime = null

		while (!stoptime || stoptime.departureTime < Date.now()) {
			stoptime = this.stopTimeQueue.pop()
			if (!stoptime) {
				return
			}
			let update = await getUpdatedTimes(stoptime.trip, this.props.route.startStop.gtfsId, this.props.route.endStop.gtfsId);
			if (update) {
				stoptime.departureTime = update.departureTime
				stoptime.realtime = update.realtime
				stoptime.arrivalTime = update.arrivalTime
			}

		}
		this.stopTimeQueue.push(stoptime)
		this.setState({stoptime})


	}

	updateRemainingTime() {
		let timeRemaining = this.state.stoptime.departureTime - Date.now()
		if (timeRemaining <= 0) {
			this.updateTime()
		} else {
			this.setState({
				secondsTillNextVehicle: Math.floor(timeRemaining / 1000) % 60,
				minutesTillNextVahicle: Math.floor((timeRemaining / (1000 * 60)))
			})
		}
	}

	componentWillUnmount() {
		clearInterval(this.serverIntervalId)
		clearInterval(this.renderIntervalId)
		clearInterval(this.stoptimesIntervalId)
	}


	render() {
		if (this.props.route.startStop && this.props.route.endStop) {
			return this.renderSituation();
		}
		return null
	}


	renderSituation() {
		let departureTime = new Date(this.state.stoptime.departureTime)
		let arrivalTime = new Date(this.state.stoptime.arrivalTime)
		let timeRemainingString = `${this.state.minutesTillNextVahicle !== 0 ? this.state.minutesTillNextVahicle + " min" : ""} ${this.state.secondsTillNextVehicle + " sec"}`
		let departureTimeString = `${departureTime.getHours() < 10 ? "0" + departureTime.getHours() : departureTime.getHours()}:${departureTime.getMinutes() < 10 ? "0" + departureTime.getMinutes() : departureTime.getMinutes()}:${departureTime.getSeconds() < 10 ? "0" + departureTime.getSeconds() : departureTime.getSeconds()}`
		let arrivalTimeString = `${arrivalTime.getHours() < 10 ? "0" + arrivalTime.getHours() : arrivalTime.getHours()}:${arrivalTime.getMinutes() < 10 ? "0" + arrivalTime.getMinutes() : arrivalTime.getMinutes()}:${arrivalTime.getSeconds() < 10 ? "0" + arrivalTime.getSeconds() : arrivalTime.getSeconds()}`
		return (
			<Card>
				<Typography
					variant="title">{this.props.route.startStop.name} - {this.props.route.endStop.name}</Typography>
				<Typography variant="subheading">{this.state.stoptime.routeName}</Typography>
				<div style={{display: "flex", justifyContent: "space-between"}}>
					<Typography>{this.props.language.arrivesAt}</Typography>
					<Typography
						style={{color: this.state.stoptime.realtime ? "#6b9b37" : "black"}}>{departureTimeString}</Typography>
				</div>
				<div style={{display: "flex", justifyContent: "space-between"}}>
					<Typography>{this.props.language.timeRemaining}</Typography>
					<Typography
						style={{color: this.state.stoptime.realtime ? "#6b9b37" : "black"}}>{timeRemainingString}</Typography>
				</div>
				<div style={{display: "flex", justifyContent: "space-between"}}>
					<Typography>{this.props.language.atDestination}</Typography>
					<Typography
						style={{color: this.state.stoptime.realtime ? "#6b9b37" : "black"}}>{arrivalTimeString}</Typography>
				</div>
				<Alerts
					route={this.state.stoptime.route}
					stop={this.props.route.startStop.gtfsId}
					language={this.props.language}
				/>
			</Card>
		)
	}
}