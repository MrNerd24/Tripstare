import React, {Component} from 'react'
import Container from "../CommonComponents/Container";
import Card from "../CommonComponents/Card";
import {Button, Typography} from "@material-ui/core";
import Selector from "../CommonComponents/Selector";
import ButtonContainer from "../CommonComponents/ButtonContainer";

export default class ProfileComponent extends Component {

	render() {
		return(
			<Container>
				<Card>
					<Typography variant="title">{this.props.user.info.username}</Typography>
					<Selector
						label={this.props.language.language}
						value={this.props.languageValue}
						onChange={this.props.onLanguageChange}
						fullWidth
						data={[
							{
								value: "english",
								text: this.props.language.english
							},
							{
								value: "finnish",
								text: this.props.language.finnish
							}
						]}
					/>
					<ButtonContainer>
						<Button onClick={this.props.onLogoutClick}>
							{this.props.language.logout}
						</Button>
					</ButtonContainer>
				</Card>
			</Container>
		)
	}

}