import React, {Component} from 'react'
import {Divider, Drawer, List} from "material-ui";
import {Info as InfoIcon, Directions as DirectionsIcon} from 'material-ui-icons'
import DrawerLink from "./DrawerLink";


export default class DrawerComponent extends Component {

	render() {
		return(
			<Drawer
				onClose={() => this.props.onDrawerStateChange(false)}
				open={this.props.open}
				variant={this.props.permanent ? "permanent" : "temporary"}
			>
				<div style={{height: this.props.toolbarHeight, width: 240, maxWidth:"95%"}} />
				<Divider/>
				<List component="nav">
					<DrawerLink
						to="/"
						onClick={() => this.props.onDrawerStateChange(false)}
						icon={<InfoIcon />}
						text={this.props.language.situation}
					/>
					<DrawerLink
						to="/routes"
						onClick={() => this.props.onDrawerStateChange(false)}
						icon={<DirectionsIcon />}
						text={this.props.language.routes}
					/>
				</List>
			</Drawer>
		)

	}

}