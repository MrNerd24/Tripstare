import React, {Component} from 'react'
import Card from "../CommonComponents/Card";
import {Typography} from "material-ui";
import {getRoute, routesBetweenStops} from "../Information/Static/Routes";
import {getTodaysTripsForRoute, getTrip} from "../Information/Realtime/RouteArrivalTimes";
import {subscribe, subscribe2} from "../Information/HSLHVPDao";

export default class RouteSituation extends Component {


	constructor(props) {
		super(props)

		this.state = {
			secondsTillNextVehicle: 0,
			stoptime: {
				time: 0,
				realtime: false,
				route: {
					shortName: "Unknown"
				}
			}
		}

		this.routeIds = null
		this.trips = null
		this.serverIntervalId = null
		this.routes = null
		this.stopTimeQueue = []
		this.today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
	}


	async componentDidMount() {

		this.routeIds = await routesBetweenStops(this.props.route.startStop.gtfsId, this.props.route.endStop.gtfsId)
		this.routes = await Promise.all(this.routeIds.map((routeId) => getRoute(routeId)))
		this.trips = await Promise.all(this.routeIds.map((routeId) => getTodaysTripsForRoute(routeId)))
		subscribe((message) => {
			console.log(message)
		}, null, null, null, null,null, null, null,this.props.route.startStop.gtfsId.split(":")[1])
		await this.buildTripsQueue()
		this.updateInfo()
		this.serverIntervalId = setInterval(this.updateInfo, 60000)
		this.renderIntervalId = setInterval(this.updateRemainingTime, 1000)
	}

	buildTripsQueue = async () => {
		for (let i = 0; i < this.trips.length; i++) {
			let route = this.routes[i]
			let stopIndex = null
			for (let j = 0; j < this.trips[i].length; j++) {
				let trip = await getTrip(this.trips[i][j])
				if (!stopIndex) {
					for (let k = 0; k < trip.stoptimes.length; k++) {

						if (trip.stoptimes[k].stop.gtfsId === this.props.route.startStop.gtfsId) {
							stopIndex = k
							break
						}
					}
				}
				let stoptime = trip.stoptimes[stopIndex]

				if (!stoptime || stoptime.stop.gtfsId !== this.props.route.startStop.gtfsId) {
					stopIndex = null
					for (let k = 0; k < trip.stoptimes.length; k++) {
						if (trip.stoptimes[k].stop.gtfsId === this.props.route.startStop.gtfsId) {
							stopIndex = k
							break
						}
					}
					stoptime = trip.stoptimes[stopIndex]
				}
				if(!stoptime) {
					continue
				}
				let time = stoptime.realtimeArrival * 1000 + this.today.getTime();
				if (time > Date.now()) {
					let stoptimeForQueue = {
						tripId: trip.gtfsId,
						time,
						route,
						realtime: stoptime.realtime,
					}
					this.stopTimeQueue.push(stoptimeForQueue)
				}
			}
		}
		this.stopTimeQueue.sort((a, b) => b.time - a.time)
	}

	updateRemainingTime = () => {
		if (this.state.stoptime.time !== 0) {
			let time = Math.floor((this.state.stoptime.time - Date.now()) / 1000);
			if (time >= 0) {
				this.setState({secondsTillNextVehicle: time})
			} else {
				this.updateInfo()
			}

		}
	}

	componentWillUnmount() {
		clearInterval(this.serverIntervalId)
		clearInterval(this.renderIntervalId)
	}

	updateInfo = async () => {

		let stoptime = this.stopTimeQueue.pop()
		if(!stoptime) {
			return
		}
		while (stoptime.time < Date.now()) {
			stoptime = this.stopTimeQueue.pop()
		}

		if(!stoptime) {
			return
		}
		console.log(stoptime)
		let trip = await getTrip(stoptime.tripId)
		console.log(trip)
		console.log(this.props.route.startStop.gtfsId)
		let stopTimeFromTrip = null
		for(let i = 0; i < trip.stoptimes.length; i++) {
			console.log(trip.stoptimes[i].stop.gtfsId)
			if(trip.stoptimes[i].stop.gtfsId === this.props.route.startStop.gtfsId) {
				console.log("found")
				stopTimeFromTrip = trip.stoptimes[i]
				break
			}
		}
		console.log(stopTimeFromTrip)
		let time = stopTimeFromTrip.realtimeArrival * 1000 + this.today.getTime()
		let newStopTime = {
			tripId: trip.gtfsId,
			time,
			route: stoptime.route,
			realtime: stopTimeFromTrip.realtime
		}
		this.stopTimeQueue.push(newStopTime)
		this.setState({stoptime: newStopTime})

	}

	render() {
		return (
			<Card>
				<Typography
					variant="title">{this.props.route.startStop.name} - {this.props.route.endStop.name}</Typography>
				<Typography>{this.state.secondsTillNextVehicle}</Typography>
				<Typography>{this.state.stoptime.route.shortName}</Typography>
			</Card>
		)
	}


}