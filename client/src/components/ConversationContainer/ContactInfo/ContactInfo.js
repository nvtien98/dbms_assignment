import React from 'react';
import { Dropdown } from 'semantic-ui-react';

import OnlineStatus from '../../OnlineStatus/OnlineStatus';

import "./ContactInfo.css";

function ContactInfo(props) {
	const { header, isGroup } = props;

	const partner = {
		id: '5d60e08f9f675c60fc512905',
		lastLogin: '1566850290558',

	}

	return (
		<div className="MessageInfoContainer__Info">

			<div className="MessageInfoContainer__Info__Detail">
				<div className="Fullname">{header}</div>
				<div className="Status">
					<OnlineStatus partnerID={partner.id} lastLogin={partner.lastLogin} lastLogout={partner.lastLogout} />
				</div>
			</div>

			{isGroup &&
				<div className='Dropdown'>
					<Dropdown>
						<Dropdown.Menu>
							<Dropdown.Item icon='user plus' text='Add people' onClick={() => {console.log('add people')}}/>
							<Dropdown.Item icon='share square' text='Live group' onClick={() => {console.log('leave group')}}/>
						</Dropdown.Menu>
					</Dropdown>
				</div>
			}

		</div>
	)
}

export default ContactInfo;