import React, {Component} from 'react'
import {Link} from "react-router-dom";
import {ListItem, ListItemIcon, ListItemText} from "material-ui";


export default class DrawerLink extends Component {

	render() {
		return(
			<ListItem button component={Link} to={this.props.to} onClick={this.props.onClick}>
				<ListItemIcon>
					{this.props.icon}
				</ListItemIcon>
				<ListItemText primary={this.props.text} />
			</ListItem>
		)
	}

}