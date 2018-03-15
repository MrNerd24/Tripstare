import React, {Component} from 'react'
import AppBarComponent from "./AppBarComponent";
import Actions from '../Actions'
import {connect} from "react-redux";
import {withTheme} from "material-ui";

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