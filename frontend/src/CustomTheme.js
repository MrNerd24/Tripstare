import {createMuiTheme} from "material-ui";

export default createMuiTheme({
	palette: {
		primary: {
			main: "#4db6ac",
			light: "#82e9de",
			dark: "#00867d",
			contrastText: "#000000"
		},
		secondary: {
			main: "#cddc39",
			light: "#ffff6e",
			dark: "#99aa00",
			contrastText: "#000000"
		}
	},

	zIndex: {
		mobileStepper: 1000,
		appBar: 1200,
		drawer: 1100,
		modal: 1300,
		snackbar: 1400,
		tooltip: 1500,
	}
});