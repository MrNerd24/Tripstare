import React, {Component} from 'react'
import Card from "../CommonComponents/Card";
import {Typography} from "material-ui";
import {routesBetweenStops} from "../Information/Static/Routes";
import {subscribe} from "../Information/HSLHVPDao";

export default class RouteSituation extends Component {


	async componentDidMount() {
		let routeIds = await routesBetweenStops(this.props.route.startStop.gtfsId, this.props.route.endStop.gtfsId)
		subscribe((input1) => {
			console.log(input1)
		}, null, null, null, "")
	}


	render() {
		return(
			<Card>
				<Typography variant="title">Title</Typography>
			</Card>
		)
	}

}