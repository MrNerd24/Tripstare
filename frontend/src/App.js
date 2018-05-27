import React, {Component} from 'react'
import Store from './Store'
import {Provider} from "react-redux";
import Main from "./Main";
import {CssBaseline, MuiThemeProvider} from "@material-ui/core";
import CustomTheme from "./CustomTheme";
import {initListeners} from "./Information/Layout/Listeners";
import {initUser} from "./User/UserFunctions";

export default class App extends Component {

	async componentWillMount() {
		initListeners()
		initUser()
	}

	render() {
		return(
			<Provider store={Store}>
				<MuiThemeProvider theme={CustomTheme}>
					<CssBaseline />
					<Main/>
				</MuiThemeProvider>
			</Provider>
		)

	}

}

