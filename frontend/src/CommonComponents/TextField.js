import React, {Component} from 'react'
import {TextField as MUITextField} from 'material-ui'

export default class TextField extends Component {

	render() {
		return(
			<MUITextField
				{...this.props}
			/>
		)
	}

}