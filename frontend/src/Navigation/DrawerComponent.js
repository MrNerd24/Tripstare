import React, {Component} from 'react'
import {Divider, Drawer, List, ListItem, ListItemIcon, ListItemText} from "material-ui";
import {Info as InfoIcon, Directions as DirectionsIcon} from 'material-ui-icons'
import {Link} from "react-router-dom";


export default class DrawerComponent extends Component {

	render() {
		return(
			<Drawer
				onClose={() => this.props.onDrawerStateChange(false)}
				open={this.props.open}
				variant={this.props.permanent ? "permanent" : "temporary"}
			>
				<div style={{height: this.props.toolbarHeight}} />
				<Divider/>
				<List component="nav">
					<ListItem button component={Link} to="/" onClick={() => this.props.onDrawerStateChange(false)}>
						<ListItemIcon>
							<InfoIcon />
						</ListItemIcon>
						<ListItemText primary={this.props.language.situation} />
					</ListItem>
					<ListItem button component={Link} to="/routes" onClick={() => this.props.onDrawerStateChange(false)}>
						<ListItemIcon>
							<DirectionsIcon />
						</ListItemIcon>
						<ListItemText primary={this.props.language.routes} />
					</ListItem>
				</List>
			</Drawer>
		)

	}

}