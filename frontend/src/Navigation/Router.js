import React, {Component} from 'react'
import {Route, withRouter} from "react-router-dom";
import Situation from "../Situation/Situation";
import Routes from "../Routes/Routes";
import {connect} from "react-redux";
import LoginForm from "../User/LoginForm";
import CreateUserForm from "../User/CreateUserForm";

export class Router extends Component {

	render() {
		return(
			<div style={{marginLeft:this.props.drawerWidth}}>
				<Route exact path="/" render={() => <Situation/>} />
				<Route exact path="/routes" render={() => <Routes/>}/>
				<Route exact path="/login" render={()=> <LoginForm/>}/>
				<Route exact path="/signup" render={()=> <CreateUserForm/>}/>
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