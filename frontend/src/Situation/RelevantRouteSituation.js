import React, {Component} from 'react'
import Card from "../CommonComponents/Card";
import {Typography} from "material-ui";
import Alerts from "./Alerts";
import StoptimesDao from "../Information/Realtime/StoptimesDao";

export default class RelevantRouteSituation extends Component {

	constructor(props) {
		super(props)

		this.state = {
			minutesTillNextVahicle: 0,
			secondsTillNextVehicle: 0,
		}
	}

	intervalId = null
	componentWillMount() {
		this.intervalId = setInterval(() => {
			this.calculateRemainingTime()
		}, 1000)
	}


	componentWillUnmount() {
		clearInterval(this.intervalId)
	}
	requestigNewTimes = false
	calculateRemainingTime() {
		if(this.props.stoptime.departureTime) {
			let timeRemaining = this.props.stoptime.departureTime-Date.now()
			if(timeRemaining >= 0) {
				this.requestigNewTimes = false
				this.setState({
					secondsTillNextVehicle: Math.floor(timeRemaining / 1000) % 60,
					minutesTillNextVahicle: Math.floor((timeRemaining / (1000 * 60)))
				})
			} else {
				if(!this.requestigNewTimes) {
					StoptimesDao.requestUpdate(this.props.stoptime)
					this.requestigNewTimes = true
				}
			}

		}
	}

	render() {
		if (this.props.stoptime.startStop && this.props.stoptime.endStop && !this.props.stoptime.justAdded) {
			return this.renderSituation();
		}
		return null
	}

	renderSituation() {
		let departureTime = new Date(this.props.stoptime.departureTime)
		let arrivalTime = new Date(this.props.stoptime.arrivalTime)
		let timeRemainingString = `${this.state.minutesTillNextVahicle !== 0 ? this.state.minutesTillNextVahicle + " min" : ""} ${this.state.secondsTillNextVehicle + " sec"}`
		let departureTimeString = `${departureTime.getHours() < 10 ? "0" + departureTime.getHours() : departureTime.getHours()}:${departureTime.getMinutes() < 10 ? "0" + departureTime.getMinutes() : departureTime.getMinutes()}:${departureTime.getSeconds() < 10 ? "0" + departureTime.getSeconds() : departureTime.getSeconds()}`
		let arrivalTimeString = `${arrivalTime.getHours() < 10 ? "0" + arrivalTime.getHours() : arrivalTime.getHours()}:${arrivalTime.getMinutes() < 10 ? "0" + arrivalTime.getMinutes() : arrivalTime.getMinutes()}:${arrivalTime.getSeconds() < 10 ? "0" + arrivalTime.getSeconds() : arrivalTime.getSeconds()}`
		return (
			<Card>
				<Typography
					variant="title">{this.props.stoptime.startStop.name} - {this.props.stoptime.endStop.name}</Typography>
				<Typography variant="subheading">{this.props.stoptime.routeName}</Typography>
				<div style={{display: "flex", justifyContent: "space-between"}}>
					<Typography>{this.props.language.arrivesAt}</Typography>
					<Typography
						style={{color: this.props.stoptime.realtime ? "#6b9b37" : "black"}}>{departureTimeString}</Typography>
				</div>
				<div style={{display: "flex", justifyContent: "space-between"}}>
					<Typography>{this.props.language.timeRemaining}</Typography>
					<Typography
						style={{color: this.props.stoptime.realtime ? "#6b9b37" : "black"}}>{timeRemainingString}</Typography>
				</div>
				<div style={{display: "flex", justifyContent: "space-between"}}>
					<Typography>{this.props.language.atDestination}</Typography>
					<Typography
						style={{color: this.props.stoptime.realtime ? "#6b9b37" : "black"}}>{arrivalTimeString}</Typography>
				</div>
				<Alerts
					route={this.props.stoptime.route}
					stop={this.props.stoptime.startStop.gtfsId}
					language={this.props.language}
				/>
			</Card>
		)
	}


}