import React, {Component} from 'react'
import {AppBar, IconButton, Toolbar, Typography} from "@material-ui/core";
import {Menu as MenuIcon} from '@material-ui/icons';
import {getAppbarHeight} from "./AppBar";



export default class AppBarComponent extends Component {

	render() {
		return(
			<div style={{height: getAppbarHeight()}}>
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
			</div>

		)
	}

}