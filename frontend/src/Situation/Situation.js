import React, {Component} from 'react'
import SituationComponent from "./SituationComponent";
import {connect} from "react-redux";
import * as LocationListener from "../Information/Location/LocationListener";
import Geolib from 'geolib'

export class Situation extends Component {

	constructor(props) {
		super(props)

		this.lastLatitude = 0
		this.lastLongitude = 0
		this.labeledStoptimes = this.props.stoptimes
	}

	componentWillMount() {
		LocationListener.startListeningLocation()
	}

	componentWillUnmount() {
		LocationListener.stopListeningLocation()
	}

	render() {
		this.sortByLocation()
		return (
			<SituationComponent
				stoptimes={this.labeledStoptimes}
				language={this.props.language}
			/>
		)
	}

	sortByLocation = () => {
		if (this.props.location.locationKnown && (this.props.location.latitude !== this.lastLatitude || this.props.location.longitude !== this.props.lastLongitude)) {
			this.lastLatitude = this.props.location.latitude;
			this.lastLongitude = this.props.location.longitude;
			this.labeledStoptimes = this.props.stoptimes.map((stoptime) => {
				if (stoptime.label && (stoptime.label === "NEW" || stoptime.label === "ROUTELESS")) {
					return stoptime
				}
				if (Geolib.getDistance(this.props.location, stoptime.startStop) <= Geolib.getDistance(this.props.location, stoptime.endStop)) {
					return {...stoptime, label: "RELEVANT"}
				} else {
					return {...stoptime, label: "IRRELEVANT"}
				}
			})
			this.labeledStoptimes.sort(this.compareStopTimes)
		} else {
			this.labeledStoptimes = this.props.stoptimes.map((stoptime) => {
				if (stoptime.label && (stoptime.label === "NEW" || stoptime.label === "ROUTELESS")) {
					return stoptime
				}
				return {...stoptime, label: "RELEVANT"}
			})
		}
	}

	compareStopTimes = (a, b) => {
		switch (a.label) {
			case "NEW":
				switch (b.label) {
					case "NEW":
						return 0
					case "IRRELEVANT":
						return 1
					case "RELEVANT":
						return 1
					case "ROUTELESS":
						return -1
					default:
						return 0
				}
			case "IRRELEVANT":
				switch (b.label) {
					case "NEW":
						return -1
					case "IRRELEVANT":
						return 0
					case "RELEVANT":
						return 1
					case "ROUTELESS":
						return -1
					default:
						return 0
				}
			case "RELEVANT":
				switch (b.label) {
					case "NEW":
						return -1
					case "IRRELEVANT":
						return -1
					case "RELEVANT":
						return Geolib.getDistance(this.props.location, a.startStop) - Geolib.getDistance(this.props.location, b.startStop)
					case "ROUTELESS":
						return -1
					default:
						return 0
				}
			case "ROUTELESS":
				switch(b.label) {
					case "NEW":
						return -1
					case "IRRELEVAT":
						return 1
					case "RELEVANT":
						return 1
					case "ROUTELESS":
						return 0
					default:
						return 0

				}
			default:
				return 1
		}
	}
}



const mapStateToProps = (state, props) => {
	return {
		stoptimes: state.situation.stoptimes,
		language: state.information.layout.language,
		location: state.information.location
	}
}

const mapDispatchToProps = (dispatch, props) => {
	return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Situation)