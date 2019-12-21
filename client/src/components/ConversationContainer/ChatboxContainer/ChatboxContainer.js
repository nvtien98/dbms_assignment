import React, { Component } from 'react';
import { connect } from 'react-redux';
import { renderMessages } from '../../../_utils/dom';
import ContainerContext from './ContainerContext.js';
import Loading from './../../Loading/Loading';
import { Message } from './../../../_models/message';
import MessageTyping from './MessageTyping/MessageTyping';

import Socket from './../../../Socket';

import "./ChatboxContainer.css";

class ChatboxContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			messageContent: '',
			messages: props.messages || [],
			roomID: props.roomID,
		}
		this.chatboxContainer = React.createRef();
	}

	shouldScrollTop = false;
	shouldScrollBottom = true;
	typingEmitted = false;

	componentWillReceiveProps(nextProps) {
		if (this.props.messages !== nextProps.messages) {
			this.setState({
				messages: nextProps.messages,
				roomID: nextProps.roomID
			});
		}
	}

	componentDidMount() {
		this.setState({
			chatboxContainer: this.chatboxContainer,
		})
		this.scrollToBottom();
		this.messageInput.focus();

		Socket.on('ROOM.SERVER.SEND_MESSAGE', this.onMessageReceive);
		Socket.on("ROOM.SERVER.TYPING", () => { this.onSomeoneTyping() });
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.roomID !== prevProps.roomID) {
			this.scrollToBottom();
			this.messageInput.focus();
		}

		if (this.props.roomID === prevProps.roomID && this.state.messages.length > prevState.messages.length) {

			if (this.shouldScrollTop) {
				setTimeout(this.scrollToTop, 0);
			}

			if (this.shouldScrollBottom) {
				this.scrollToBottom();
			}
		}
	}

	onMessageReceive = (message) => {
		const { roomID } = this.state;
		const { conversation_id, send_user, content } = message;

		if (roomID !== conversation_id) return;
		const receiveMessage = new Message(send_user, content);
		this.setState((preState) => ({ messages: [...preState.messages, receiveMessage] }))
		this.shouldScrollBottom = true;
	}

	onSomeoneTyping = () => {
		if (this.chatboxContainer) {
			const { scrollTop, scrollHeight, offsetHeight } = this.chatboxContainer;

			if (scrollTop + offsetHeight >= scrollHeight - 200) {
				setTimeout(this.scrollToBottom, 0);
			}
		}
	}

	scrollToTop = () => {
		this.chatboxContainer.scrollTop = 10;
		this.shouldScrollTop = false;
	}

	scrollToBottom = () => {
		this.chatboxContainer.scrollTop = this.chatboxContainer.scrollHeight;
	}

	onMessageInputChange = (event) => {
		event.preventDefault();
		const { roomID } = this.state;
		const { roomMembers } = this.props;
		const { value: content } = event.target;
		if (content === '') {
			Socket.emit("ROOM.CLIENT.STOP_TYPING", { conversation_id: roomID, roomMembers: roomMembers });
			this.typingEmitted = false;
			return;
		}

		if (!this.typingEmitted) {
			Socket.emit("ROOM.CLIENT.TYPING", { conversation_id: roomID, roomMembers: roomMembers });
			this.typingEmitted = true;
		}
	}

	onFormSubmit = (event) => {
		event.preventDefault();

		const messageContent = this.messageInput.value.trim();
		if (messageContent === "") {
			return;
		}

		const { roomID } = this.state;
		const { user, updateLastMessage, roomMembers } = this.props;
		const newMessage = new Message(user.user_id, messageContent, true);
		this.messageInput.value = "";

		Socket.emit("ROOM.CLIENT.STOP_TYPING", { conversation_id: roomID, roomMembers: roomMembers });
		this.typingEmitted = false;

		this.setState((prevState) => ({ messages: [...prevState.messages, newMessage] }));
		updateLastMessage(roomID, newMessage);
	}

	render() {
		const { user, roomMembers } = this.props;
		const { messages, isLoading, roomID } = this.state;
		return (
			<ContainerContext.Provider value={{ roomID, user, roomMembers }}>
				<div className="ChatboxContainer">
					<div className="ChatboxContainer__ChatboxContainer" ref={el => this.chatboxContainer = el}>
						{isLoading && <div className="ChatboxContainer__ChatboxContainer__Loader"><Loading /></div>}
						<div style={{ padding: "0.5em" }}>
							{renderMessages(messages || [], user.user_id)}
							<MessageTyping roomID={roomID} />
						</div>
					</div>

					<form className="ChatboxContainer__InputContainer" onSubmit={this.onFormSubmit} style={{ visibility: roomID ? 'visible' : 'hidden' }}>
						<input className="ChatboxContainer__InputContainer__Input" placeholder="Type message..." ref={el => this.messageInput = el} onChange={this.onMessageInputChange} />
						<div className="ChatboxContainer__InputContainer__SendBtn">
							<button>send</button>
						</div>
					</form>
				</div>
			</ContainerContext.Provider>
		)
	}
}

function mapStateToProps(state) {
	const { user } = state.authentication;
	return { user };
}

export default connect(mapStateToProps)(ChatboxContainer);