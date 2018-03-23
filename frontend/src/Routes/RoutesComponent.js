import React, {Component} from 'react'
import styled from 'styled-components'
import EditableRoute from "./EditableRoute";
import {routes} from "../CommonPropTypes";
import PropTypes from 'prop-types'
import {Button} from "material-ui";
import {Add as AddIcon} from 'material-ui-icons'
import Container from "../CommonComponents/Container";


export default class RoutesComponent extends Component {

	render() {
		return(
			<Container>
				{this.props.routes.map((route) =>
					<EditableRoute
						key={route.id}

						startStop={route.startStop}
						onStartStopChange={(stopId) => this.props.onStartStopChange(route, stopId)}

						endStop={route.endStop}
						onEndStopChange={(stopId) => this.props.onEndStopChange(route, stopId)}

						language={this.props.language}
						onSaveClick={() => this.props.onSaveClick(route)}
						onCancelClick={() => this.props.onCancelClick(route)}
						onDeleteClick={() => this.props.onDeleteClick(route)}
					/>
				)}
				<CornerButtonContainer>
					<Button variant="fab" color="primary" onClick={this.props.onAddClick}>
						<AddIcon />
					</Button>
				</CornerButtonContainer>

			</Container>
		)
	}

}


let CornerButtonContainer = styled.div`
	position: fixed;
	right: 20px;
	bottom: 20px;
`

RoutesComponent.propTypes = {
	routes: routes,
	onStartStopChange: PropTypes.func.isRequired,
	onEndStopChange: PropTypes.func.isRequired,

	language: PropTypes.object.isRequired,
	onSaveClick: PropTypes.func.isRequired,
	onCancelClick: PropTypes.func.isRequired,
	onDeleteClick: PropTypes.func.isRequired,
	onAddClick: PropTypes.func.isRequired,
}