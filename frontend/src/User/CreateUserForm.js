import React, {Component} from 'react'
import {connect} from "react-redux";
import CreateUserFormComponent from "./CreateUserFormComponent";
import {createUser, usernameExists} from "./UserServerDao";
import Actions from '../Actions'
import {notify} from "../Information/Layout/Notification";

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

	handleSignupClick = async () => {
		if(this.state.username && this.state.password && this.state.passwordAgain && !this.state.passwordTooShort && this.state.passwordsMatch && !this.state.usernameTaken) {
			let user = await createUser(this.state.username, this.state.password)
			if (user.username) {
				this.props.setUser(user)
				this.setState({
					username: "",
					password: "",
					passwordAgain: "",
					passwordTooShort: false,
					usernameTaken: false,
					passwordsMatch: true
				})
				this.history.push("/")
			} else {
				notify(user.error)
			}
		} else {
			notify(this.props.language.fixForm)
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
		history: props.history
	}
}

const mapDispatchToProps = (dispatch,props) => {
	return {
		setUser: (user) => {dispatch(Actions.setUser(user))}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateUserForm)