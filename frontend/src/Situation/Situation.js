import React, {Component} from 'react'
import SituationComponent from "./SituationComponent";
import {connect} from "react-redux";

export class Situation extends Component {

	render() {
		return(
			<SituationComponent
				routes={this.props.routes}
				language={this.props.language}
			/>
		)
	}

}

const mapStateToProps = (state, props) => {
	return {
		routes: state.routes,
		language : state.information.layout.language
	}
}

const mapDispatchToProps = (dispatch, props) => {
	return {

	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Situation)