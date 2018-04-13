import React, {Component} from 'react'
import SituationComponent from "./SituationComponent";
import {connect} from "react-redux";

export class Situation extends Component {

	render() {
		return(
			<SituationComponent
				stoptimes={this.props.stoptimes}
				language={this.props.language}
			/>
		)
	}

}

const mapStateToProps = (state, props) => {
	return {
		stoptimes: state.situation.stoptimes,
		language : state.information.layout.language
	}
}

const mapDispatchToProps = (dispatch, props) => {
	return {

	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Situation)