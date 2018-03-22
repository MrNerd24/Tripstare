import React, {Component} from 'react'
import {Button, Typography} from "material-ui";
import Card from "../CommonComponents/Card";
import AutoCompleteTextField from "../CommonComponents/AutoCompleteTextField";
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {getStops} from "../Information/Static/Stops";


export default class EditableRoute extends Component {

	constructor(props) {
		super(props)
		this.state = {
			startStops: []
		}
	}


	async componentWillMount() {

		this.setState({startStops: (await getStops()).map(this.formatStop)})

	}

	formatStop(stop) {
		let code = stop.code ? stop.code + " " : "";
		let name = stop.name ? stop.name + " " : "";
		let platformCode = stop.platformCode ? stop.platformCode + " " : "";
		let desc = stop.desc ? stop.desc : "";

		return {
			value: stop.id,
			text: `${code}${name}${platformCode}${desc}`,
			code, name, platformCode, desc
		}
	}

	handleStartStopChange = async (stopId) => {

		this.props.onStartStopChange(stopId)
	}

	render() {
		return(
			<Card>
				<Typography variant={"title"}>{this.props.language.editRoute}</Typography>
				<AutoCompleteTextField
					onChange={this.handleStartStopChange}
					label={this.props.language.startStop}
					suggestions={this.state.startStops}
					value={this.props.startStop}
				/>
				<AutoCompleteTextField
					onChange={this.props.onEndStopChange}
					label={this.props.language.endStop}
					suggestions={this.props.startStops}
					value={this.props.endStop}
				/>

				<ButtonContainer>
					<Button onClick={this.props.onSaveClick} color="primary">
						{this.props.language.save}
					</Button>
					<Button onClick={this.props.onCancelClick}>
						{this.props.language.cancel}
					</Button>
				</ButtonContainer>

			</Card>
		)
	}

}

let ButtonContainer = styled.div`
	display: flex;
	flex-direction: row;
	margin-top: 20px;
`

EditableRoute.propTypes = {
	startStop: PropTypes.shape({
		value: PropTypes.string.isRequired,
		text: PropTypes.string.isRequired
	}).isRequired,
	onStartStopChange: PropTypes.func.isRequired,

	endStop: PropTypes.shape({
		value: PropTypes.string.isRequired,
		text: PropTypes.string.isRequired
	}).isRequired,
	onEndStopChange: PropTypes.func.isRequired,

	language: PropTypes.object.isRequired,
	onSaveClick: PropTypes.func.isRequired,
	onCancelClick: PropTypes.func.isRequired,
}