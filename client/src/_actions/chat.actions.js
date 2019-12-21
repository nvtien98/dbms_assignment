import { chatConstants } from '../_constants/chat.constants';

export function selectConversation(conversation) {
    return dispatch => {
        dispatch({
            type: chatConstants.SELECT_CONVERSATION,
            conversation
        })
    }
}
