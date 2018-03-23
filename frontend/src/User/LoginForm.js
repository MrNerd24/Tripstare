import React, {Component} from 'react'
import {connect} from "react-redux";
import LoginFormComponent from "./LoginFormComponent";

export class LoginForm extends Component {

	render() {
		return(
			<LoginFormComponent
				language={this.props.language}
			/>
		)
	}

}

const mapStateToProps = (state,props) => {
	return {
		language: state.information.layout.language,
	}
}

const mapDispatchToProps = (dispatch,props) => {
	return {

	}
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)