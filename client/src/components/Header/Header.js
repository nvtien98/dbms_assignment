import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';

import Container from './../Container/Container';
import Avatar from './../Avatar/Avatar';

import { userActions } from './../../_actions/user.actions';

import './Header.css';

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	render() {
		const { user, logout } = this.props;
		return (
			<div className="HeaderContainer">
				<Container className="Header" center={false} white={false}>
					<ul className="Header__Left">
						<Link to='/'>
							<div className="Header__Left__Logo">
								{'DBMS Chat App'}
							</div>
						</Link>
					</ul>

					<ul className="Header__Right">
						<li className="Header__Right__Item">
							<div className="Header__Right__Info">
								<div className="Header__Right__Info__Avatar" >
									<Avatar userID={user.user_id} width="2em" />
								</div>
								<div>{user.firstname + ' ' + user.lastname}</div>
							</div>

							<Dropdown direction='left'>
								<Dropdown.Menu>
									<Dropdown.Item onClick={logout} text="Logout" />
								</Dropdown.Menu>
							</Dropdown>
						</li>
					</ul>
				</Container>
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { user } = state.authentication;
	return { user };
}

const actionCreators = {
	logout: userActions.logout
}

const connectedHeader = connect(mapStateToProps, actionCreators)(Header)

export { connectedHeader as Header };