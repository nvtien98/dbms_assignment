import React from 'react';
import { withRouter } from 'react-router';
import { Search } from 'semantic-ui-react';
import Avatar from '../../Avatar/Avatar';

import { connect } from 'react-redux';
import { selectConversation } from './../../../_actions/chat.actions';
import { history } from './../../../_utils/history';

import _ from 'lodash';

import { userService } from './../../../_services/user.service';

import mongoose from 'mongoose';

import "./ContactSearch.css";

const resultRenderer = ({ title, data }) => {
	if (title === "__feching_data__") return <div className="FechingData">Fetching data...</div>;
	if (title === "__no_results__") return <div className="FechingData">No results</div>;
	else {
		return (
			<div className="ResultContainer">
				<div><Avatar userID={data._id} /></div>
				<div className="Fullname">{title}</div>
			</div>
		);
	}
}

const initialState = { isLoading: false, results: [], value: '' }

class ContactSearch extends React.Component {
	state = initialState;

	componentDidMount() {
	}

	handleResultSelect = (event, { result }) => {
		event.preventDefault();
		const name = result.data.firstname + ' ' + result.data.lastname;
		const user_id = result.data._id;
		let conversation_id = '';
		if (result.data.conversation_id !== '') {
			conversation_id = result.data.conversation_id;
		} else {
			conversation_id = mongoose.Types.ObjectId();
		}
		this.props.selectConversation({ conversation_id, name, user_id: user_id, is_group: false, lastMessageTime: null, seenMembers: null, lastMessage: null });
		history.push(`/${conversation_id}`);
		this.setState({ ...initialState });
	}

	handleSearchChange = (event, { value }) => {
		event.preventDefault();
		this.setState({
			isLoading: true,
			value, results: [{ title: "__feching_data__", data: undefined }]
		});
		const { users } = this.props;
		setTimeout(() => {
			if (value === "") {
				this.setState({ ...initialState });
				return;
			}
			const results = userService.localSearchUser(users, value);
			if (results.length > 0) {
				this.setState({
					results: results.slice(0, 6).map((result) => ({ title: result.firstname + ' ' + result.lastname, data: result }))
				});
			} else {
				this.setState({ results: [{ title: "__no_results__", data: undefined }] });
			}
			this.setState({ isLoading: false });
		}, 400)
	}

	render() {
		const { isLoading, value, results } = this.state;
		return (
			<Search
				input={{ icon: 'search', iconPosition: 'left' }}
				loading={isLoading}
				onResultSelect={this.handleResultSelect}
				onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
				results={results.map((item, index) => ({ ...item, key: index }))}
				value={value}
				resultRenderer={resultRenderer}
			/>
		)
	}
}

const actionCreators = {
	selectConversation: selectConversation
}

export default withRouter(connect(null, actionCreators)(ContactSearch));