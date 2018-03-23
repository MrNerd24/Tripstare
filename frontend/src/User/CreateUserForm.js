import React, {Component} from 'react'
import {connect} from "react-redux";
import CreateUserFormComponent from "./CreateUserFormComponent";

export class CreateUserForm extends Component {

	render() {
		return(
			<CreateUserFormComponent
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateUserForm)