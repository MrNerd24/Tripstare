import React, {Component} from 'react'
import {Snackbar} from "@material-ui/core";
import Store from '../../Store'
import Actions from '../../Actions'
import {connect} from "react-redux";

export class Notification extends Component {

	render() {
		return(
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				open={!!this.props.notification}
				message={this.props.notification}
			/>
		)
	}

}

const mapStateToProps = (state, props) => {
	return {
		notification: state.information.layout.notification
	}
}

export const notify = (message) => {
	Store.dispatch(Actions.setNotification(message))
}

export default connect(mapStateToProps)(Notification)