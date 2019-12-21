import { chatConstants } from './../_constants/chat.constants';

const initialState = {}

export function conversation(state = initialState, action) {
    switch (action.type) {
        case chatConstants.SELECT_CONVERSATION:
            return { conversation: action.conversation };
        default:
            return state;
    }
}


