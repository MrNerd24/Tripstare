import React, {Component} from 'react'
import {MenuItem, TextField} from "material-ui";
import PropTypes from 'prop-types'


export default class Selector extends Component {

	render() {
		return(
			<div>
				<TextField
					{...this.props}
					select
					onChange={(event) => {this.props.onChange(event.target.value)}}
				>
					{this.props.data.map((data) =>
						<MenuItem key={data.value} value={data.value}>{data.text}</MenuItem>
					)}
				</TextField>
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
	})).isRequired
}

