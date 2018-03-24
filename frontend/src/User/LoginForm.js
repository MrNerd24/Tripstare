import React, {Component} from 'react'
import {connect} from "react-redux";
import LoginFormComponent from "./LoginFormComponent";
import {loginWithUsernameAndPassword} from "./UserServerDao";
import Actions from "../Actions";
import {notify} from "../Information/Layout/Notification";
import LocalForage from 'localforage'

export class LoginForm extends Component {

	constructor(props) {
		super(props)

		this.state={
			username: "",
			password: "",
			stayLoggedIn: false
		}
	}

	handleLoginClick = async () => {
		let user = await loginWithUsernameAndPassword(this.state.username, this.state.password)
		if(user.username) {
			this.props.setUser(user)
			if(this.state.stayLoggedIn) {
				LocalForage.setItem("token", user.token)
			}
			this.props.history.push("/")
		} else {
			if(user.status === 401) {
				notify(this.props.language.badUsernameOrPassword)
			} else {
				notify(user.error)
			}

		}
	}

	render() {
		return(
			<LoginFormComponent
				language={this.props.language}

				username={this.state.username}
				password={this.state.password}

				onUsernameChange={(event) => this.setState({username: event.target.value})}
				onPasswordChange={(event) => this.setState({password: event.target.value})}

				stayLoggedIn={this.state.stayLoggedIn}
				onStayLoggedInChange={(event) => this.setState({stayLoggedIn: event.target.checked})}

				onLoginClick={this.handleLoginClick}
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
		setUser: (user) => dispatch(Actions.setUser(user))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)