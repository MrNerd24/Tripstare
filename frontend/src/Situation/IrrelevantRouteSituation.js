import React, {Component} from 'react'
import Card from "../CommonComponents/Card";
import {Typography} from "material-ui";

export default class IrrelevantRouteSituation extends Component {

	render() {
		return(
			<Card>
				<Typography variant="title" style={{color:"gray"}}>
					{this.props.stoptime.startStop.name} - {this.props.stoptime.endStop.name}
				</Typography>
			</Card>
		)
	}

}