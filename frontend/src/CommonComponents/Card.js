import React, {Component} from 'react'
import {Paper} from "material-ui";
import styled from "styled-components";

export default class Card extends Component {

	render() {
		return(
			<StyledPaper {...this.props} />
		)
	}

}

let StyledPaper = styled(Paper)`
	margin-top: 5px;
	padding: 5px;
	width: 100%;
	max-width: 600px;
`