import React, {Component} from 'react'
import styled from 'styled-components'
import EditableRoute from "./EditableRoute";


export default class RoutesComponent extends Component {

	render() {
		return(
			<Container>
				{this.props.routes.map((route) =>
					<EditableRoute

						startStop={route.startStop}
						onStartStopChange={(stopId) => this.props.onStartStopChange(route, stopId)}

						endStop={route.endStop}
						onEndStopChange={(stopId) => this.props.onEndStopChangae(route, stopId)}

						language={this.props.language}
						onSaveClick={() => this.props.onSaveClick(route)}
						onCancelClick={() => this.props.onCancelClick(route)}
					/>
				)}
				<EditableRoute
					startStops={this.props.startStops}

					language={this.props.language}

					startStop={this.props.startStops[0]}
					endStop={this.props.startStops[100]}

					onStartStopChange={this.props.onStartStopChange}
					onEndStopChange={this.props.onStartStopChange}
				/>
			</Container>
		)
	}

}

let Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`