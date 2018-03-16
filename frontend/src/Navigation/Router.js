import React, {Component} from 'react'
import {Route, withRouter} from "react-router-dom";
import Situation from "../Situation/Situation";
import Routes from "../Routes/Routes";
import {connect} from "react-redux";

export class Router extends Component {

	render() {
		console.log("router rendered")
		return(
			<div style={{marginLeft:this.props.drawerWidth}}>
				<Route exact path="/" render={() => <Situation/>} />
				<Route exact path="/routes" render={() => <Routes/>}/>
			</div>
		)
	}

}

const mapStateToProps = (state, props) => {
	return {
		drawerWidth: state.information.layout.width >= 1280 ? 240 : 0
	}
}

export default withRouter(connect(mapStateToProps)(Router))