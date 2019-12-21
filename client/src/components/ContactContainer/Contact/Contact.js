import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from './../../Avatar/Avatar';
import { toHHMM } from "../../../_utils/time";
import { withRouterInnerRef } from '../../../hocs/withRouter';
import { connect } from 'react-redux';
import { selectConversation } from '../../../_actions/chat.actions'

import Socket from './../../../Socket';

import './Contact.css';

class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newMessage: false,
      lastMessage: props.lastMessage
    }
  }

  componentDidMount() {
    const { user, seenMembers } = this.props;
    const user_id = user.user_id;
    this.setState({ newMessage: !seenMembers.includes(user_id) });
    Socket.on('ROOM.SERVER.SEND_MESSAGE', this.onMessageReceive);
  }

  componentWillUnmount() {

  }

  componentDidUpdate(prevProps) {
    if (this.roomMatch(this.props) && !this.roomMatch(prevProps)) {
      this.setState({ newMessage: false });
    }
  }

  onMessageReceive = (message) => {
    const { _id, conversation } = this.props;
    const { conversation_id, send_user, content, send_time } = message;
    if (_id !== conversation_id) return;
    if (conversation && _id !== conversation._id) {
      console.log('onMessageReceive');
      this.setState({ newMessage: true });
    }
    this.setState({ lastMessage: { send_user: send_user, content: content, send_time: send_time } })
  }

  roomMatch(props) {
    const { id } = props;
    const { type: isGroupChat } = props;
    const { roomIdOrUsername } = 'nvtien';
    const usernameMatch = !isGroupChat && 'nvtien' === roomIdOrUsername;
    const idMatch = isGroupChat && id === roomIdOrUsername;
    return usernameMatch || idMatch;
  }

  // Update last message
  update = (message) => {
    this.setState({ lastMessage: message });
  }

  handleSelectConversation = () => {
    const { _id, name, is_group, lastMessageTime, seenMembers, lastMessage } = this.props;
    if (this.state.newMessage) {
      this.setState({ newMessage: false });
      this.props.updateSeenStatus(_id);
    }
    this.props.selectConversation({ _id, name, is_group, lastMessageTime, seenMembers, lastMessage })
  }

  userNameForID = (parnerID) => {
    let partnerName = ''
    // this.props.users.map(user => {
    //   if (user._id === parnerID) {
    //     partnerName = user.lastname.concat(':');
    //     return '';
    //   }
    //   return '';
    // })
    // console.log('partnerName', partnerName);
    return partnerName;
  }

  render() {
    const { newMessage, lastMessage } = this.state;
    const { user, name, _id, is_group, partner } = this.props;
    // const partnerName = this.userNameForID(lastMessage.send_user);

    let className = 'ContactItemContainer__ContactItem';
    if (newMessage) className = className + ' ContactItemContainer__ContactItem--NewMessage';


    return (
      <Link to={`/${_id}`} onClick={this.handleSelectConversation}>
        <div className={className}>
          <div>
            <Avatar userID={is_group ? null : partner} />
          </div>
          <div className="ContactItemContainer__ContactItem__Content">
            <div className="Fullname">{name}</div>
            {lastMessage &&
              <div className="ContactItemContainer__ContactItem__Content__LastMessage">
                {user.user_id === lastMessage.send_user && "You:"}&nbsp;{lastMessage.content}
              </div>
            }
          </div>
          {lastMessage &&
            <div className="ContactItemContainer__ContactItem__Time">
              {toHHMM(new Date(lastMessage.send_time))}
            </div>
          }
        </ div>
      </Link>
    );
  }
}


function mapStateToProps(state) {
  const { user } = state.authentication;
  const { conversation } = state.conversation;
  return { user, conversation };
}

const actionCreators = {
  selectConversation: selectConversation
}

export default withRouterInnerRef(connect(mapStateToProps, actionCreators, null, { forwardRef: true })(Contact));