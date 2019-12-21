import { userService } from '../_services/user.service';
import { userConstant } from '../_constants/user.constant';
import { alertActions } from './alert.actions';
import { history } from './../_utils/history';

import Socket from './../Socket';

export const userActions = {
	login,
	logout,
	register,
}

function login(email, passowrd) {
	return dispatch => {
		dispatch(request({ email }));
		userService.login(email, passowrd)
			.then(user => {
				Socket.open({ userID: user.user_id });
				dispatch(success(user));
				history.push('/');
			})
			.catch((err) => {
				const errMessage = 'Username or password is incorrect';
				dispatch(failure(errMessage));
				dispatch(alertActions.error(errMessage));
				console.log(err);
			});
	}

	function request(user) {
		return { type: userConstant.LOGIN_REQUEST, user };
	}

	function success(user) {
		return { type: userConstant.LOGIN_SUCCESS, user };
	}

	function failure(error) {
		return { type: userConstant.LOGIN_FAILURE, error };
	}
}

function logout() {
	return async dispatch => {
		try {
			await userService.logout();
			localStorage.removeItem('user');
			history.push('/login');
			dispatch({ type: userConstant.LOGOUT });
			Socket.close();
		}
		catch (err) {
			console.log("Cannot logout user", err);
		}
	}
}

function register(user) {
	return dispatch => {
		dispatch(request(user));
		userService.register(user)
			.then(() => {
				dispatch(success(user));
				history.push('/login');
				dispatch(alertActions.success('Registration successful'))
			})
			.catch(() => {
				const errMessage = 'Email "' + user.email + '" is already taken';
				dispatch(failure(errMessage));
				dispatch(alertActions.error(errMessage));
			});
	}

	function request(user) {
		return { type: userConstant.REGISTER_REQUEST, user };
	};

	function success(user) {
		return { type: userConstant.REGISTER_SUCCESS, user };
	};

	function failure(error) {
		return { type: userConstant.REGISTER_FAILURE, error };
	};
}