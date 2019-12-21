import React from 'react';

import './Avatar.css'

import defaultAvatar from './../../images/x.png';
import { baseUrl } from '../../_services/config';

export default function Avatar({ isActive, userID, width = "2.5em", height }) {
	isActive = true;
	let className = "Avatar";
	if (isActive === true) {
		className += " Avatar--Active";
	} else if (isActive === false) {
		className += " Avatar--Inactive"
	}

	const avatarURL = userID ? `${baseUrl}/avatars/${userID}.jpg` : defaultAvatar;
	const style = {
		background: `url(${avatarURL})`,
		backgroundPosition: "50% 50%",
		backgroundSize: "cover",
		width: width, height: height || width
	}

	return <div className={className} style={style} />;
}