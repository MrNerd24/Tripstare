import React, {Component} from 'react'
import Container from "../CommonComponents/Container";
import Card from "../CommonComponents/Card";
import {Button, TextField, Typography} from "material-ui";
import {Link} from "react-router-dom";
import ButtonContainer from "../CommonComponents/ButtonContainer";


export default class CreateUserFormComponent extends Component {

	render() {
		return (
			<Container>
				<Card>
					<Typography variant="title">{this.props.language.signup}</Typography>
					<TextField
						label={this.props.language.username}
						value={this.props.username}
						onChange={this.props.onUsernameChange}
						autoComplete="username"
					/>
					<TextField
						label={this.props.language.password}
						value={this.props.password}
						onChange={this.props.onPasswordChange}
						autoComplete="new-password"
						type="password"
					/>
					<TextField
						label={this.props.language.passwordAgain}
						value={this.props.passwordAgain}
						onChange={this.props.onPasswordAgainChange}
						autoComplete="new-password"
						type="password"
					/>
					<ButtonContainer>
						<Button onClick={this.props.onSignupClick} color="primary">
							{this.props.language.signup}
						</Button>
					</ButtonContainer>
				</Card>
			</Container>
		)
	}

}