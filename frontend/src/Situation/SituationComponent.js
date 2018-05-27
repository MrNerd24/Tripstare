import React, {Component} from 'react'
import Container from "../CommonComponents/Container";
import RelevantRouteSituation from "./RelevantRouteSituation";
import IrrelevantRouteSituation from "./IrrelevantRouteSituation";
import RoutelessRouteSituation from "./RoutelessRouteSituation";


export default class SituationComponent extends Component {

	render() {
		return(
			<Container>
				{this.props.stoptimes.map((stoptime) => {
					switch(stoptime.label) {
						case "NEW":
							return null
						case "IRRELEVANT":
							return <IrrelevantRouteSituation key={stoptime.id} stoptime={stoptime} language={this.props.language}/>
						case "RELEVANT":
							return <RelevantRouteSituation key={stoptime.id} stoptime={stoptime} language={this.props.language}/>
						case "ROUTELESS":
							return <RoutelessRouteSituation key={stoptime.id} stoptime={stoptime} language={this.props.language} />
						default:
							return null
					}

				})}
			</Container>
		)
	}

}