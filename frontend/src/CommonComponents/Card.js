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
	margin-top: 10px;
	margin-bottom: 10px;
	padding: 10px;
	width: 100%;
	max-width: 600px;
`