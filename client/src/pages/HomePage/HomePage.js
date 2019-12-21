import React from 'react';
import Container from './../../components/Container/Container';
import ContactContainer from './../../components/ContactContainer/ContactContainer';
import ConversationContainer from './../../components/ConversationContainer/ConversationContainer';

import { Header } from './../../components/Header/Header';
import Footer from './../../components/Footer/Footer';

import { connect } from 'react-redux';

import Socket from './../../Socket';

import './HomePage.css'

class HomePage extends React.Component {

	componentDidMount() {
		const {user} = this.props;
		Socket.open({userID: user.user_id});
	}

	updateLastMessage = (roomID, lastMessage) => {
		this.contactContainer.updateContact(roomID, lastMessage);
	}

	addFakeRoom = (room) => {
		this.contactContainer.addFakeRoom(room);
	}

	replaceFakeRoom = (roomID, newRoom) => {
		this.contactContainer.replaceFakeRoom(roomID, newRoom);
	}

	render() {
		return (
			<div>
				<Header />
				<Container shadow={true}>
					<div className='MessagePage'>
						<ContactContainer ref={el => this.contactContainer = el} />
						<ConversationContainer updateLastMessage={this.updateLastMessage} replaceFakeRoom={this.replaceFakeRoom} addFakeRoom={this.addFakeRoom} />
					</div>
				</Container>
				<Footer />
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { user } = state.authentication;
	return { user };
}

export default connect(mapStateToProps, null)(HomePage);