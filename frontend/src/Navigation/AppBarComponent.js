import React, {Component} from 'react'
import {AppBar, IconButton, Toolbar, Typography} from "material-ui";
import {Menu as MenuIcon} from 'material-ui-icons';



export default class AppBarComponent extends Component {

	render() {
		return(
			<AppBar>
				<Toolbar>
					<IconButton style={{visibility: this.props.menuIsVisible ? "visible" : "hidden"}} aria-label="Menu" onClick={this.props.onMenuClick}>
						<MenuIcon />
					</IconButton>
					<Typography variant="title" color="inherit">
						Tripstare
					</Typography>
				</Toolbar>
			</AppBar>
		)
	}

}