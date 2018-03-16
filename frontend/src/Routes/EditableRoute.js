import React, {Component} from 'react'
import {Typography} from "material-ui";
import Card from "../CommonComponents/Card";
import Selector from "../CommonComponents/Selector";
import AutoCompleteTextField from "../CommonComponents/AutoCompleteTextField";


export default class EditableRoute extends Component {

	render() {
		return(
			<Card>
				<AutoCompleteTextField
					onChange={this.props.onStartStopChange}
					label={this.props.language.startStop}
					suggestions={this.props.startStops}
				/>
			</Card>
		)
	}

}