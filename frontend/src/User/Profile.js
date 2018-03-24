import React, {Component} from 'react'
import ProfileComponent from "./ProfileComponent";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import Actions from "../Actions";
import LocalForage from 'localforage'
import {setUserLanguage} from "./UserServerDao";


export class Profile extends Component {

	handleLogoutClick = () => {
		this.props.setUser(null)
		LocalForage.removeItem("token")
	}

	handleLanguageChange = (language) => {
		this.props.setLanguage(language)
		setUserLanguage(language, this.props.user.info.token)
	}

	render() {
		if (!this.props.user.loggedIn) {
			return(
				<Redirect to="/login"/>
			)
		}
		return (
			<ProfileComponent
				language={this.props.language}
				user={this.props.user}
				languageValue={this.props.languageValue}
				onLanguageChange={this.handleLanguageChange}
				onLogoutClick={this.handleLogoutClick}
			/>
		)
	}

}


const mapStateToProps = (state, props) => {
	return {
		language: state.information.layout.language,
		languageValue: state.information.layout.languageValue,
		user: state.user,
		history: props.history
	}
}

const mapDispatchToProps = (dispatch, props) => {
	return {
		setLanguage: (language) => dispatch(Actions.setLanguage(language)),
		setUser: (user) => dispatch(Actions.setUser(user))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)