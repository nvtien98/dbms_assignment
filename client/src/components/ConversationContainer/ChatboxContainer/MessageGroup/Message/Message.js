import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Popup } from 'semantic-ui-react';
import ContainerContext from './../../ContainerContext';
import { sendMessage } from './../../../../../_services/api.service';

import Socket from './../../../../../Socket';

import { connect } from 'react-redux';

import "./Message.css";

class Message extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: false,
		}
	}

	static contextType = ContainerContext;

	async componentDidMount() {
		const { content, is_new, user, conversation } = this.props;
		if (is_new) {
			try {
				const { roomID, roomMembers } = this.context;
				const message = {
					conversation_id: roomID,
					user_id: conversation.user_id,
					message_content: content
				}
				const fullName = user.firstname + ' ' + user.lastname;
				await sendMessage(message);

				setTimeout(() => {
					Socket.emit("ROOM.CLIENT.SEND_MESSAGE", { ...message, sendUser: user.user_id, roomMembers: roomMembers, sendTime: new Date().getTime(), name: fullName });
				}, 0)

			} catch (e) {
				this.setState({ error: true });
				console.log("Cannot send message", e);
			}
		}
	}

	render() {
		const { send_time, content } = this.props;
		const { error } = this.state;

		let className = '';
		if (error) {
			className = "Message Message--Error";
		} else {
			className = "Message"
		}

		const popUpContent = moment(new Date(send_time)).calendar().replace(/\sat\s/, ' ').replace('Today', '');

		return (
			<div className={className}>
				<Popup content={popUpContent} size="mini" position="right center" style={{ padding: "0.75em" }} inverted
					trigger={<div className="Message__Content">{content}</div>} />
			</div>
		)
	}
}

Message.propTypes = {
	content: PropTypes.string,
}

function mapStateToProps(state) {
	const { user } = state.authentication;
	const { conversation } = state.conversation;
	return { user, conversation };
}

export default connect(mapStateToProps, null)(Message);
