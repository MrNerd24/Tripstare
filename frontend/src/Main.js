import React, {Component} from 'react'
import AppBar from "./Navigation/AppBar";
import Drawer from "./Navigation/Drawer";
import {BrowserRouter} from "react-router-dom";
import Router from "./Navigation/Router";

export default class Main extends Component {

	render() {
		return (
			<BrowserRouter>
				<div>
					<AppBar/>
					<Drawer/>
					<Router/>
				</div>
			</BrowserRouter>
		)
	}

}