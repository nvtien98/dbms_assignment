import React from 'react';
import PropTypes from 'prop-types';

import "./Typing.css";

export default function Typing(props) {
	const { inverted } = props;

	let className = '';
	if (inverted) {
		className = "MessageTyping MessageTyping--Inverted";
	} else {
		className = "MessageTyping";
	}

	return (
		<div className={className}>
			<div></div>
			<div></div>
			<div></div>
		</div>
	)
}

Typing.propTypes = {
	inverted: PropTypes.bool
}

Typing.defaultProps = {
	inverted: false
}