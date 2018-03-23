import React, {Component} from 'react'
import {Button, Typography} from "material-ui";
import Card from "../CommonComponents/Card";
import AutoCompleteTextField from "../CommonComponents/AutoCompleteTextField";
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {getConnectedStops, getStops} from "../Information/Static/Stops";
import {stop} from '../CommonPropTypes'
import ButtonContainer from "../CommonComponents/ButtonContainer";


export default class EditableRoute extends Component {

	constructor(props) {
		super(props)
		this.state = {
			startStops: [],
			endStops: []
		}
	}


	async componentWillMount() {
		this.setState({startStops: await getStops()})
	}

	handleStartStopChange = async (stopId) => {
		this.props.onStartStopChange(stopId)
		this.setState({endStops: await getConnectedStops(stopId)})
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
					suggestions={this.state.endStops}
					value={this.props.endStop}
				/>

				<ButtonContainer>
					<Button onClick={this.props.onSaveClick} color="primary">
						{this.props.language.save}
					</Button>
					<Button onClick={this.props.onCancelClick}>
						{this.props.language.cancel}
					</Button>
					<Button onClick={this.props.onDeleteClick}>
						{this.props.language.delete}
					</Button>
				</ButtonContainer>

			</Card>
		)
	}

}


EditableRoute.propTypes = {
	startStop: stop,
	onStartStopChange: PropTypes.func.isRequired,

	endStop: stop,
	onEndStopChange: PropTypes.func.isRequired,

	language: PropTypes.object.isRequired,
	onSaveClick: PropTypes.func.isRequired,
	onCancelClick: PropTypes.func.isRequired,
	onDeleteClick: PropTypes.func.isRequired,
}

EditableRoute.defaultProps = {
	startStop: {
		text: "",
		value: ""
	},
	endStop: {
		text: "",
		value: ""
	}
}