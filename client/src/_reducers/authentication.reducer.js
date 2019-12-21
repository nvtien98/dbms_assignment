import { userConstant } from './../_constants/user.constant';

let user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? { loggedIn: true, user } : {};

export function authentication(state = initialState, action) {
	switch (action.type) {
		case userConstant.LOGIN_REQUEST:
			return {
				loggingIn: true,
				user: action.user
			};

		case userConstant.LOGIN_SUCCESS:
			return {
				loggedIn: true,
				user: action.user
			};

		case userConstant.LOGIN_FAILURE:
			return {};

		case userConstant.LOGOUT:
			return {...state, loggedIn: false, user: undefined};

		default:
			return state;
	}
}