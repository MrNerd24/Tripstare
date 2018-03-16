import React, {Component} from 'react'
import Autosuggest from 'react-autosuggest';
import TextField from "./TextField";
import {MenuItem, Paper} from "material-ui";
import PropTypes from 'prop-types'

export default class AutoCompleteTextField extends Component {

	constructor(props) {
		super(props)

		this.state = {
			suggestions: [],
			value: ""
		}

	}

	calculateSuggestions(filter) {
		if(!filter) {
			return []
		}
		filter = filter.trim().toLowerCase()
		if(!filter) {
			return []
		}

		let count = this.props.maxSuggestions || 5

		return this.props.suggestions.filter((suggestion) => {
			if(suggestion.text.trim().toLowerCase().includes(filter) && count > 0) {
				count--
				return true
			}
			return false
		})

	}

	handleSuggestionsFetchRequested = ({ value }) => {
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
		if(!text) {
			text=event.target.value
		}
		this.setState({value: text})
		this.reportValue(text)
	}

	reportValue = async (text) => {
		let suggestion = this.props.suggestions.find((sug) => sug.text === text)
		if(suggestion) {
			this.props.onChange(suggestion.value)
		}

	}

	renderSuggestion = (suggestion, { query, isHighlighted }) => {
		return (
			<MenuItem selected={isHighlighted} component="div">
				{suggestion.text}
			</MenuItem>
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
				renderSuggestionsContainer={({containerProps, children}) => <Paper {...containerProps} square>{children}</Paper>}
				inputProps={{
					value: this.state.value,
					onChange: this.handleTextChange,
					label: this.props.label
				}}
				renderInputComponent={(inputProps) =>
					<TextField
						inputProps={inputProps}
						inputRef={inputProps.ref}
					/>
				}
				theme={{
					container: {
						flexGrow: 1,
						position: 'relative',
						height: 250,
					},
					suggestionsContainerOpen: {
						position: 'absolute',
						zIndex: 1,
						marginTop: 5,
						left: 0,
						right: 0,
					},
					suggestionsList: {
						margin: 0,
						padding: 0,
						listStyleType: 'none',
					},
					suggestion: {
						display: 'block',
					},
				}}
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