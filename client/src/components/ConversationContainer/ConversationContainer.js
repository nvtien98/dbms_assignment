import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import ContactInfo from './ContactInfo/ContactInfo'
import ChatboxContainer from './ChatboxContainer/ChatboxContainer';
import ConversationPlaceholder from './Placeholder';

import { getConversationInfor, getMessages } from './../../_services/api.service';

import { selectConversation } from './../../_actions/chat.actions';

const initialState = {
	isLoading: false,
	roomID: null,
	roonName: 'Room Title',
	roomMembers: [],
	messages: [],
}

class ConversationContainer extends Component {
	constructor(props) {
		super(props);
		this.state = initialState;
	}

	componentDidMount() {
		this.setState({ roomID: this.props.match.params.roomID });
		this.fetchRoomInfo();
	}

	componentDidUpdate(prevProps) {
		if (this.props.match.params.roomID !== prevProps.match.params.roomID) {
			if (!this.props.match.params.roomID) {
				this.setState({ ...initialState });
			}
			else {
				this.setState({
					roomID: this.props.match.params.roomID,
					roonName: this.props.conversation.name
				});
				this.fetchRoomInfo();
			}
		}
	}

	async fetchRoomInfo() {
		const user_id = this.props.user.user_id;
		const { roomID } = this.props.match.params;
		if (!roomID) return;
		try {

			this.setState({ isLoading: true })
			const res = await getConversationInfor(roomID);
			const data = res.data;

			if (data === null) {
				const partner_id = this.props.conversation.user_id;
				this.setState({
					roomMembers: [partner_id],
					messages: [],
				})
				return;
			}

			const members = data.members.filter(member => {
				const match = user_id === member.user_id;
				return !match;
			})

			const memberIDs = members.map(member => {
				return member.user_id;
			})

			this.setState({
				messages: data.messages,
				roomMembers: memberIDs,
				roonName: data.group_name
			});

		} catch (err) {
			console.warn('Can not fetch information of room', err);
		} finally {
			this.setState({ isLoading: false })
		}
	}

	async fetchMessages() {
		const { roomID } = this.props.match.params;
		try {
			this.setState({ isLoading: true })
			const res = await getMessages(roomID);
			const data = res.data;
			this.setState({ messages: data });
		} catch (err) {
			console.warn('Can not fetch messages of room', err);
		} finally {
			this.setState({ isLoading: false })
		}
	}

	render() {
		const { isLoading, roomID, roomMembers, messages, roonName } = this.state
		const { updateLastMessage, conversation } = this.props;

		let isGroup = false;
		if (conversation) isGroup = conversation.is_group;
		if (isLoading) return <ConversationPlaceholder />;
		return (
			<div className="MessageInfoContainer">
				<ContactInfo header={roonName} isGroup={isGroup} />
				<ChatboxContainer roomID={roomID} roomMembers={roomMembers} messages={messages} updateLastMessage={updateLastMessage} />
			</div>
		)
	}
}

function mapStateToProps(state) {
	const { user } = state.authentication;
	const { conversation } = state.conversation;
	return { user, conversation };
}

const actionCreators = {
	selectConversation: selectConversation
}

export default withRouter(connect(mapStateToProps, actionCreators)(ConversationContainer));
