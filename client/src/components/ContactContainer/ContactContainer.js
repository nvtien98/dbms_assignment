import React from 'react';
import ContactSearch from './Search/ContactSearch';
import { Icon, Popup, Modal, Button, TransitionablePortal } from 'semantic-ui-react'
import Contact from './Contact/Contact';
import CreateGroup from './CreateGroup/CreateGroup';
import { getRecentConversations, getUsers } from "../../_services/api.service";
import ContactContainerPlaceHolder from './Placeholder';

import { connect } from 'react-redux';
import { history } from './../../_utils/history';

import { updateSeenStatus } from './../../_services/api.service';

import audioNotify from './../../images/pip.mp3';

import Socket from './../../Socket';

import "./ContactContainer.css";

export const DEFAULT_PROPS = {
  transition: {
    animation: "fade down",
    duration: 700
  }
};

class ContactContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conversations: [],
      users: [],
      isLoading: false,
      open: false
    }
    this.audio = new Audio(audioNotify);
  }


  contactRefs = {};

  componentDidMount() {
    this.fetchContacts();
    this.fetchUsers();
    Socket.on("ROOM.SERVER.SEND_MESSAGE", this.onMessageReceive);
    Socket.on("ROOM.SERVER.CREATE_GROUP", this.addNewConversation);
  }

  updateContact = (roomID, message) => {
    if (this.contactRefs[roomID]) {
      this.contactRefs[roomID].update(message);
      this.hoistContact(roomID, null);
    }
    else {
      const { conversation, user } = this.props;
      const newConversation = {
        _id: roomID,
        name: conversation.name,
        is_group: conversation.is_group,
        partner: conversation.user_id,
        lastMessageTime: new Date().getTime(),
        seenMembers: [user.user_id],
        lastMessage: message,
      }
      this.addNewConversation(newConversation);
    }
  }

  play = () => {
    this.audio.play();
  }

  onMessageReceive = (message) => {
    this.play();
    const { conversation_id } = message;
    this.hoistContact(conversation_id, message);
  }

  hoistContact = (roomID, message) => {
    this.setState((prevState) => {
      let candidateRoom;
      const restRooms = prevState.conversations.filter(room => {
        const match = room._id === roomID;
        if (match) candidateRoom = room;
        return !match;
      });

      if (!candidateRoom) {
        candidateRoom = {
          _id: message.conversation_id,
          name: message.name,
          is_group: false,
          partner: [message.send_user],
          lastMessageTime: message.send_time,
          seenMembers: [],
          lastMessage: {
            send_user: message.send_user,
            content: message.content,
            send_time: message.send_time,
          }
        }
      }

      return { conversations: [candidateRoom, ...restRooms] };
    });
  }

  updateSeenStatus = (roomID) => {
    const { user_id } = this.props.user;
    this.setState((prevState) => {
      const tempConversation = prevState.conversations.filter(contact => {
        const match = contact._id === roomID;
        if (match) {
          updateSeenStatus(roomID);
          contact.seenMembers.push(user_id);
        }
        return contact;
      });
      return { conversations: tempConversation };
    });
  }

  async fetchContacts() {
    this.setState({ isLoading: true });
    try {
      const res = await getRecentConversations();
      const conversations = res.data;
      this.setState({ conversations: conversations || [] });
    } catch (e) {
      console.warn('Error while fetching rooms', e);
      localStorage.removeItem('user');
      history.push('/login');
    } finally {
      this.setState({ isLoading: false });
    }
  }

  async fetchUsers() {
    this.setState({ isLoading: true });
    try {
      const users = await getUsers();
      this.setState({ users: users || [] });
    } catch (err) {
      console.warn('Error while fetching users', err);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  onOpenModel() {
    this.setState({ open: true });
  }

  onCloseModel() {
    this.setState({ open: false });
  }

  async onCreateGroup() {
    const data = await this.createGroup.handleSubmit();
    if (data) {
      this.onCloseModel();
    }
  }

  addNewConversation = (newConversation) => {
    let tempConversations = this.state.conversations;
    tempConversations.unshift(newConversation)
    this.setState({ conversations: tempConversations });
  }

  render() {
    const { conversations, isLoading, open, users } = this.state;
    const { transition } = this.props;
    if (isLoading) return <ContactContainerPlaceHolder />;

    return (
      <div className="ContactContainer">
        <div className="ContactContainer__SearchContainer">
          <ContactSearch users={users} />
          <div onClick={() => { console.log("Add friend") }} >
            <Popup content='Add friend'
              trigger={
                <Icon circular color="blue" size="large" name='user plus' />
              }
            />
          </div>
          <div onClick={() => { this.onOpenModel() }} >
            <Popup content='Create New Group'
              trigger={<Icon circular color="blue" size="large" name='users' />}

            />
          </div>
        </div>

        <div className="ContactContainer__ContactItemContainer">
          {users.length > 0 && conversations.map(contact => {
            return <Contact
              key={contact._id}
              users={users}
              {...contact}
              updateSeenStatus={this.updateSeenStatus}
              ref={el => this.contactRefs[contact._id] = el}
            />
          })}
        </div>

        <TransitionablePortal {...{ open }} {...{ transition }}>
          <Modal open={open} size={'small'} style={{ maxHeight: '585px', margin: 'auto' }}>

            <Modal.Header>Create Group</Modal.Header>

            <Modal.Content>
              <CreateGroup users={users} addNewConversation={this.addNewConversation} ref={el => this.createGroup = el} />
            </Modal.Content>

            <Modal.Actions>
              <Button color='red' onClick={() => { this.onCloseModel() }}>
                <Icon name='remove' /> Cancel
              </Button>
              <Button color='green' onClick={() => { this.onCreateGroup() }}>
                <Icon name='checkmark' /> Create
              </Button>
            </Modal.Actions>

          </Modal>
        </TransitionablePortal>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { user } = state.authentication;
  const { conversation } = state.conversation;
  return { user, conversation };
}


export default connect(mapStateToProps, null, null, { forwardRef: true })(ContactContainer);