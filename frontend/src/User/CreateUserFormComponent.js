import React, {Component} from 'react'
import Container from "../CommonComponents/Container";
import Card from "../CommonComponents/Card";
import {Button, TextField, Typography} from "material-ui";
import ButtonContainer from "../CommonComponents/ButtonContainer";


export default class CreateUserFormComponent extends Component {

	render() {
		return (
			<Container>
				<Card>
					<Typography variant="title">{this.props.language.signup}</Typography>
					<TextField
						error={!this.props.usernameBeingChecked && this.props.usernameTaken}
						label={this.props.language.username}
						value={this.props.username}
						onChange={this.props.onUsernameChange}
						autoComplete="username"
						helperText={this.props.usernameBeingChecked ? this.props.language.usernameBeingChecked : this.props.usernameTaken ? this.props.language.usernameTaken : null}
					/>
					<TextField
						error={this.props.passwordTooShort}
						label={this.props.language.password}
						value={this.props.password}
						onChange={this.props.onPasswordChange}
						autoComplete="new-password"
						type="password"
						helperText={this.props.passwordTooShort ? this.props.language.passwordTooShort : null}
					/>
					<TextField
						error={!this.props.passwordsMatch}
						label={this.props.language.passwordAgain}
						value={this.props.passwordAgain}
						onChange={this.props.onPasswordAgainChange}
						autoComplete="new-password"
						type="password"
						helperText={!this.props.passwordsMatch ? this.props.language.passwordsDontMatch : null}
					/>
					<ButtonContainer>
						<Button onClick={this.props.onSignupClick} color="secondary">
							{this.props.language.signup}
						</Button>
					</ButtonContainer>
				</Card>
			</Container>
		)
	}

}