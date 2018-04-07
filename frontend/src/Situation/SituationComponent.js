import React, {Component} from 'react'
import Container from "../CommonComponents/Container";
import RouteSituation from "./RouteSituation";


export default class SituationComponent extends Component {

	render() {
		return(
			<Container>
				{this.props.routes.map((route) => <RouteSituation key={route.id} route={route} language={this.props.language}/>)}
			</Container>
		)
	}

}