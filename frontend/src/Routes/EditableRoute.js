import React, {Component} from 'react'
import {Button, Typography} from "material-ui";
import Card from "../CommonComponents/Card";
import AutoCompleteTextField from "../CommonComponents/AutoCompleteTextField";
import PropTypes from 'prop-types'
import styled from 'styled-components'


export default class EditableRoute extends Component {

	render() {
		return(
			<Card>
				<Typography variant={"title"}>{this.props.language.editRoute}</Typography>
				<AutoCompleteTextField
					onChange={this.props.onStartStopChange}
					label={this.props.language.startStop}
					suggestions={this.props.startStops}
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

EditableRoute.propsTypes = {
	startStop: PropTypes.shape({
		value: PropTypes.string.isRequired,
		text: PropTypes.string.isRequired
	}),
	startStops: PropTypes.arrayOf(PropTypes.shape({
		value: PropTypes.string.isRequired,
		text: PropTypes.string.isRequired
	})),
	onStartStopChange: PropTypes.func.isRequired,

	endStop: PropTypes.shape({
		value: PropTypes.string.isRequired,
		text: PropTypes.string.isRequired
	}),
	endStops: PropTypes.arrayOf(PropTypes.shape({
		value: PropTypes.string.isRequired,
		text: PropTypes.string.isRequired
	})),
	onEndStopChange: PropTypes.func.isRequired,

	language: PropTypes.object.isRequired,
	onSaveClick: PropTypes.func.isRequired,
	onCancelClick: PropTypes.func.isRequired,
}