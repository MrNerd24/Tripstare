import React, {Component} from 'react'
import {connect} from "react-redux";
import CreateUserFormComponent from "./CreateUserFormComponent";
import {usernameExists} from "./UserServerDao";
import Actions from '../Actions'

export class CreateUserForm extends Component {



	constructor(props) {
		super(props)

		this.state = {
			username: "",
			password: "",
			passwordAgain: "",
			passwordsMatch: true,
			passwordTooShort: false,
			usernameTaken: false,
			usernameBeingChecked: false,

		}

		this.usernameCheckingTimeout = null
	}



	handleUsernameChange = (event) => {
		let username = event.target.value
		this.setState({username})

		if(this.usernameCheckingTimeout) {
			clearTimeout(this.usernameCheckingTimeout)
		}

		this.usernameCheckingTimeout = setTimeout(async () => {
			this.setState({usernameBeingChecked: true})
			let exists = await usernameExists(username)
			this.setState({usernameBeingChecked: false, usernameTaken: exists})
		}, 1000)
	}

	handlePasswordChange = (event) => {
		let password = event.target.value
		this.setState({password, passwordTooShort: !!password && password.length < 5})
		this.checkForPasswordMatch(password, this.state.passwordAgain)
	}

	handlePasswordAgainChange = (event) => {
		let passwordAgain = event.target.value
		this.setState({passwordAgain})
		this.checkForPasswordMatch(this.state.password, passwordAgain)
	}

	checkForPasswordMatch = (password, passwordAgain) => {
		if(!password || !passwordAgain) {
			this.setState({passwordsMatch: true})
		} else if(password === passwordAgain) {
			this.setState({passwordsMatch: true})
		} else {
			this.setState({passwordsMatch: false})
		}
	}

	handleSignupClick = () => {
		if(!this.state.passwordTooShort && this.state.passwordsMatch && !this.state.usernameTaken) {
			this.props.addUser(this.state.username, this.state.password)
			this.setState({username: "", password: "", passwordAgain: "", passwordTooShort: false, usernameTaken: false, passwordsMatch: true})
		}
	}


	render() {
		return(
			<CreateUserFormComponent
				language={this.props.language}

				username={this.state.username}
				password={this.state.password}
				passwordAgain={this.state.passwordAgain}

				passwordsMatch={this.state.passwordsMatch}
				passwordTooShort={this.state.passwordTooShort}
				usernameTaken={this.state.usernameTaken}
				usernameBeingChecked={this.state.usernameBeingChecked}

				onUsernameChange={this.handleUsernameChange}
				onPasswordChange={this.handlePasswordChange}
				onPasswordAgainChange={this.handlePasswordAgainChange}
				onSignupClick={this.handleSignupClick}
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
		addUser: (username, password) => {dispatch(Actions.addUser(username, password))}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateUserForm)