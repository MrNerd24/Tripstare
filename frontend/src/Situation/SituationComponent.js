import React, {Component} from 'react'
import Container from "../CommonComponents/Container";
import RouteSituation from "./RouteSituation";


export default class SituationComponent extends Component {

	render() {
		return(
			<Container>
				{this.props.stoptimes.map((stoptime) => <RouteSituation key={stoptime.id} stoptime={stoptime} language={this.props.language}/>)}
			</Container>
		)
	}

}