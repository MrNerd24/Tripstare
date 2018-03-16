import React, {Component} from 'react'
import SituationComponent from "./SituationComponent";
import {connect} from "react-redux";

export class Situation extends Component {

	render() {
		return(
			<SituationComponent/>
		)
	}

}

const mapStateToProps = (state, props) => {
	return {

	}
}

const mapDispatchToProps = (dispatch, props) => {
	return {

	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Situation)