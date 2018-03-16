import React, {Component} from 'react'
import Store from './Store'
import {Provider} from "react-redux";
import Main from "./Main";
import {CssBaseline, MuiThemeProvider} from "material-ui";
import CustomTheme from "./CustomTheme";
import {initListeners} from "./Information/Layout/Listeners";
import {getStops} from "./Information/Static/Stops";

export default class App extends Component {

	async componentWillMount() {
		initListeners()
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

