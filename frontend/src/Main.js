import React, {Component} from 'react'
import AppBar from "./Navigation/AppBar";
import Drawer from "./Navigation/Drawer";
import {BrowserRouter} from "react-router-dom";

export default class Main extends Component {

	render() {
		return (
			<BrowserRouter>
				<div>
					<AppBar/>
					<Drawer/>
				</div>
			</BrowserRouter>
		)
	}

}