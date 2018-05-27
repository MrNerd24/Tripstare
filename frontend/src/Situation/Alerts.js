import React, {Component} from 'react'
import {getAlerts} from "../Information/Realtime/Alerts";
import {Typography} from "@material-ui/core";


export default class alerts extends Component {

	constructor(props) {
		super(props)

		this.state = {
			alerts: []
		}
	}

	async componentWillReceiveProps(props) {
		if(this.props.route !== props.route || this.props.stop !== props.stop || this.props.language !== props.language) {
			let alerts = await getAlerts(props.route, props.stop, props.language.metaLanguageShortName);
			this.setState({alerts})
		}
	}

	render() {
		return (
			<div>
				{this.state.alerts.length > 0 ? <Typography variant="subheading" style={{color: "red", marginTop: 10}}>{this.props.language.alerts}</Typography>:null}
				{this.state.alerts.map((alert) =>
					<div key={alert.id}>
						{alert.header ? <Typography variant="subheading">{alert.header}</Typography>:null}
						{alert.description ? <Typography>{alert.description}</Typography>:null}
					</div>
				)}
			</div>
		)
	}

}