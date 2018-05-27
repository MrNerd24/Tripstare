import React, {Component} from 'react'
import DrawerLink from "../Navigation/DrawerLink";
import {Person as ProfileIcon} from '@material-ui/icons'
import Actions from "../Actions";
import {connect} from "react-redux";

export class DrawerUserLink extends Component {

	render() {
		if(this.props.user.loggedIn) {
			return(
				<DrawerLink
					to="/profile"
					onClick={() => this.props.setDrawerState(false)}
					icon={<ProfileIcon />}
					text={this.props.user.info.username}
				/>
			)
		} else {
			return(
				<DrawerLink
					to="/login"
					onClick={() => this.props.setDrawerState(false)}
					icon={<ProfileIcon />}
					text={this.props.language.login}
				/>
			)
		}

	}

}

const mapStateToProps = (state, props) => {
	return {
		language: state.information.layout.language,
		user: state.user
	}
}

const mapDispatchToProps = (dispatch, props) => {
	return {
		setDrawerState: (open) => dispatch(Actions.setDrawerState(open))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerUserLink)