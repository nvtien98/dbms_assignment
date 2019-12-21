import React from 'react';
import moment from 'moment';

import './TimeDevider.css';

export default function TimeDevider(props) {
	const { time } = props;
	return (
		<div className="ChatboxContainer__TimeDivider">
			{moment(new Date(time)).calendar().replace(/\sat\s/, ' ').replace('Today', '')}
		</div>
	);
}
