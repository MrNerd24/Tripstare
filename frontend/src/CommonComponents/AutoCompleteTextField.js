import React, {Component} from 'react'
import Autosuggest from 'react-autosuggest';
import {TextField} from "material-ui";
import {MenuItem, Paper} from "material-ui";
import PropTypes from 'prop-types'

export default class AutoCompleteTextField extends Component {

	constructor(props) {
		super(props)

		this.state = {
			suggestions: [],
			value: ""
		}

		this.lastValue = null

	}

	componentWillReceiveProps(props) {
		if(props.value.text !== this.lastValue) {
			this.lastValue = props.value.text
			this.setState({
				value: this.lastValue
			})
		}
	}

	calculateSuggestions(filter) {
		if (!filter) {
			return []
		}
		filter = filter.trim().toLowerCase()
		if (!filter) {
			return []
		}

		let filters = filter.split(" ")

		let count = this.props.maxSuggestions || 5

		return this.props.suggestions.filter((suggestion) => {
			if (count <= 0) {
				return false
			}
			let found = true
			let text = suggestion.text.trim().toLowerCase();
			for (let i = 0; i < filters.length; i++) {
				if (!(text.includes(filters[i]))) {
					found = false
					break
				}
			}

			if (found) {
				count--
				return true
			} else {
				return false
			}
		})

	}

	handleSuggestionsFetchRequested = ({value}) => {
		this.setState({
			suggestions: this.calculateSuggestions(value),
		})
	}

	handleSuggestionsClearRequested = () => {
		this.setState({
			suggestions: [],
		})
	}

	getSuggestionValue = (suggestion) => {
		return suggestion.text
	}

	handleTextChange = (event, {newValue}) => {
		let text = newValue
		if (!text) {
			text = event.target.value
		}
		this.setState({value: text})
		this.reportValue(text)
	}

	reportValue = async (text) => {
		let suggestion = this.props.suggestions.find((sug) => sug.text === text)
		if (suggestion) {
			this.props.onChange(suggestion.value)
		}

	}

	renderSuggestion = (suggestion, {query, isHighlighted}) => {
		return (
			<MenuItem selected={isHighlighted} component="div">
				{suggestion.text}
			</MenuItem>
		)
	}

	renderTextField = (inputProps) => {
		return (
			<TextField
				fullWidth
				label={this.props.label}
				value={inputProps.value}
				onChange={inputProps.onChange}
				inputProps={inputProps}
				inputRef={inputProps.ref}
			/>
		)
	}


	renderContainer = ({containerProps, children}) => {
		return (
			<Paper {...containerProps} square>
				{children}
			</Paper>
		)
	}

	render() {


		return (
			<Autosuggest
				suggestions={this.state.suggestions}
				onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
				onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
				getSuggestionValue={this.getSuggestionValue}
				renderSuggestion={this.renderSuggestion}
				renderSuggestionsContainer={this.renderContainer}
				inputProps={{
					value: this.state.value,
					onChange: this.handleTextChange,
				}}
				renderInputComponent={this.renderTextField}
				theme={Style}
			/>
		)
	}

}

AutoCompleteTextField.propTypes = {
	onChange: PropTypes.func.isRequired,
	label: PropTypes.string.isRequired,
	suggestions: PropTypes.arrayOf(PropTypes.shape({
		text: PropTypes.string.isRequired,
		value: PropTypes.string.isRequired
	}))
}

let Style = {
	container: {
		flexGrow: 1,
		position: 'relative',
	},
	suggestionsContainerOpen: {
		position: 'absolute',
		zIndex: 1,
		marginTop: 5,
		left: 0,
		// right: 0,
	},
	suggestionsList: {
		margin: 0,
		padding: 0,
		listStyleType: 'none',
	},
	suggestion: {
		display: 'block',
	},
};