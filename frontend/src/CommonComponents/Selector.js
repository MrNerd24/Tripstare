import React, {Component} from 'react'
import {InputLabel, MenuItem, Select} from "material-ui";
import PropTypes from 'prop-types'


export default class Selector extends Component {

	render() {
		return(
			<div>
				<InputLabel>{this.props.label}</InputLabel>
				<Select
					value={this.props.value}
					onChange={this.props.onChange}
				>
					{this.props.data.map((data) =>
						<MenuItem key={data.value} value={data.value}>{data.text}</MenuItem>
					)}
				</Select>
			</div>


		)
	}

}

Selector.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	data: PropTypes.arrayOf(PropTypes.shape({
		value: PropTypes.string,
		text: PropTypes.string
	}))
}

