import React, {Component} from 'react'
import Container from "../CommonComponents/Container";
import Card from "../CommonComponents/Card";
import {Button, Checkbox, FormControlLabel, TextField, Typography} from "material-ui";
import {Link} from "react-router-dom";
import ButtonContainer from "../CommonComponents/ButtonContainer";


export default class LoginFormComponent extends Component {

	render() {
		return (
			<Container>
				<Card>
					<Typography variant="title">{this.props.language.login}</Typography>
					<Typography variant="caption"><Link to="/signup">{this.props.language.orSignupHere}</Link></Typography>
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
						autoComplete="current-password"
						type="password"
					/>
					<FormControlLabel
						label={this.props.language.stayLoggedIn}
						control={
							<Checkbox
								checked={this.props.stayLoggedIn}
								onChange={this.props.onStayLoggedInChange}
							/>
						}
					/>
					<ButtonContainer>
						<Button onClick={this.props.onLoginClick} color="primary">
							{this.props.language.login}
						</Button>
					</ButtonContainer>
				</Card>
			</Container>
		)
	}

}