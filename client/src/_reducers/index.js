import {combineReducers} from 'redux';

import {alert} from './alert.reducer';
import {authentication} from './authentication.reducer';
import {registration} from './registration.reducer';
import {conversation} from './chat.reducer';

const rootReducer = combineReducers({
    authentication,
    alert,
    registration,
    conversation
})

export default rootReducer;