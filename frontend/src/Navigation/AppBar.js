import React, {Component} from 'react'
import AppBarComponent from "./AppBarComponent";
import Actions from '../Actions'
import {connect} from "react-redux";
import {withTheme} from "material-ui";
import Store from '../Store'


export class Appbar extends Component {

	render() {
		return(
			<AppBarComponent
				onMenuClick={this.props.openDrawer}
				menuIsVisible={this.menuIsVisible()}
			/>
		)
	}

	menuIsVisible() {
		return this.props.windowWidth < this.props.theme.breakpoints.values.lg
	}
}

const mapStateToProps = (state, props) => {
	return {
		windowWidth: state.information.layout.width
	}
}

const mapdispatchToProps = (dispatch, props) => {
	return {
		openDrawer: () => dispatch(Actions.setDrawerState(true))
	}
}

export default connect(mapStateToProps, mapdispatchToProps)(withTheme()(Appbar))

export const getAppbarHeight = () => {
	if (Store.getState().information.layout.width >= 600) {
		return 64
	}
	if (window.matchMedia("(orientation: landscape)").matches) {
		return 48
	} else {
		return 56
	}
}