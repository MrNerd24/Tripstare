import React, {Component} from 'react'
import styled from 'styled-components'
import EditableRoute from "./EditableRoute";


export default class RoutesComponent extends Component {

	render() {
		return(
			<Container>
				<EditableRoute
					startStops={this.props.startStops}
					language={this.props.language}
					startStop={this.props.startStops[0].value}
					onStartStopChange={this.props.onStartStopChange}
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