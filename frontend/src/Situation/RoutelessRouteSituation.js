import React, {Component} from 'react'
import Card from "../CommonComponents/Card";
import Typography from "material-ui/es/Typography/Typography";

export default class RoutelessRouteSituation extends Component {

	render() {
		return (
			<Card>
				<Typography variant="title" style={{color: "red"}}>
					{this.props.stoptime.startStop.name} - {this.props.stoptime.endStop.name}
				</Typography>
				<Typography style={{color: "red"}}>
					{this.props.language.noRoute}
				</Typography>
			</Card>
		)
	}


}