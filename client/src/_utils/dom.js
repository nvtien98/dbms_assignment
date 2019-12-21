import React from 'react'

import MessageGroup from './../components/ConversationContainer/ChatboxContainer/MessageGroup/MessageGroup';
import TimeDivider from './../components/ConversationContainer/ChatboxContainer/TimeDevider/TimeDivider';

const MESSAGE_TIME_DISTANCE = 5000;

export function renderMessages(messages, currentUserID) {

	let container = [];
	if (messages.length < 1) {
		return container;
	}

	let blockMessages = [];
	blockMessages.push(messages[0]);
	container.push(<TimeDivider key={"time_divider_" + 0} time={messages[0].send_time} />);

	for (let i = 1; i < messages.length; i++) {
		const messageITime = new Date(messages[i].send_time).getTime();
		const messageBeforeITime = new Date(messages[i - 1].send_time).getTime()
		const shouldDivide = messageITime - messageBeforeITime >= MESSAGE_TIME_DISTANCE;

		if (messages[i].send_user !== messages[i - 1].send_user) {
			container.push(<MessageGroup
				key={"message_group_" + blockMessages[0].send_time}
				messages={blockMessages}
				right={currentUserID === blockMessages[0].send_user}
			/>);
			if (shouldDivide) container.push(<TimeDivider key={"time_divider_" + i} time={messages[i].send_time} />);
			blockMessages = [];
		} else if (shouldDivide) {
			container.push(<MessageGroup
				key={"message_group_" + blockMessages[0].send_time}
				messages={blockMessages}
				right={currentUserID === blockMessages[0].send_user}
			/>);
			container.push(<TimeDivider key={"time_divider_" + i} time={messages[i].send_time} />);
			blockMessages = [];
		}
		blockMessages.push(messages[i]);
	}

	container.push(<MessageGroup
		key={"message_group_" + blockMessages[0].send_time}
		messages={blockMessages}
		right={currentUserID === blockMessages[0].send_user}
	/>);
	return container;
}