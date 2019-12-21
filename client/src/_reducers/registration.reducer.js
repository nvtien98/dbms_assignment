import { userConstant } from './../_constants/user.constant';

export function registration(state = {}, action) {
	switch (action.type) {
		case userConstant.REGISTER_REQUEST:
			return { registering: true };

		case userConstant.REGISTER_SUCCESS:
			return {};

		case userConstant.REGISTER_FAILURE:
			return {};

		default:
			return state;
	}
}