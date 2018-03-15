import React, {Component} from 'react'
import DrawerComponent from "./DrawerComponent";
import Actions from "../Actions";
import {connect} from "react-redux";
import {withTheme} from "material-ui";

export class Drawer extends Component {

	render() {
		return (
			<DrawerComponent
				open={this.props.open}
				onDrawerStateChange={this.props.setDrawerState}
				permanent={this.isPermanent()}
				language={this.props.language}
				toolbarHeight={this.getToolBarHeight()}
			/>
		)
	}

	isPermanent() {
		return this.props.windowWidth >= this.props.theme.breakpoints.values.lg
	}

	getToolBarHeight() {
		if (this.props.windowWidth >= this.props.theme.breakpoints.values.sm) {
			return 64
		}
		if (window.matchMedia("(orientation: landscape)").matches) {
			return 48
		} else {
			return 56
		}
	}
}

const mapStateToProps = (state, props) => {
	return {
		open: state.navigation.drawerOpen,
		windowWidth: state.information.layout.width,
		language: state.information.layout.language
	}
}

const mapDispatchToProps = (dispatch, props) => {
	return {
		setDrawerState: (open) => dispatch(Actions.setDrawerState(open))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withTheme()(Drawer))