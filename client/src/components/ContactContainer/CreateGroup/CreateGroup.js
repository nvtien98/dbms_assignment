import React from 'react';
import { Input } from 'semantic-ui-react'
import { User } from './../../../_models/user';
import Avatar from './../../Avatar/Avatar';
import { createGroup } from './../../../_services/api.service';
import { userService } from './../../../_services/user.service';

import { withRouterInnerRef } from './../../../hocs/withRouter';

import { selectConversation } from './../../../_actions/chat.actions';
import { history } from './../../../_utils/history';
import { connect } from 'react-redux';

import Socket from './../../../Socket';

import './CreateGroup.css';

class CreateGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      userSelecteds: [],
      userRenders: [],
      groupName: '',
      submitted: false,
    }
  }

  componentDidMount() {
    const { users } = this.props;
    this.setState({
      userRenders: users,
    })
  }

  handleCheck = (event, user) => {
    if (event.target.checked) {
      const newUser = new User(user._id, user.firstname, user.lastname);
      this.setState((preState) => ({
        userSelecteds: [...preState.userSelecteds, newUser],
      }));
    }
    else {
      this.setState((preState) => {
        const restUserSelecteds = preState.userSelecteds.filter(userSelected => {
          const match = user._id === userSelected._id;
          return !match;
        })
        return { userSelecteds: [...restUserSelecteds] };
      })
    }
  }

  handleRemove = (event, user) => {
    event.preventDefault();
    this.setState((preState) => {
      const restUserSelecteds = preState.userSelecteds.filter(userSelected => {
        const match = user._id === userSelected._id;
        return !match;
      })
      return { userSelecteds: [...restUserSelecteds] };
    })
  }

  handleSearchInput = (event, { value }) => {
    event.preventDefault();
    const { users } = this.props;
    this.setState({ isLoading: true });
    setTimeout(() => {
      if (value === '') {
        this.setState({
          userRenders: users
        })
      }
      else {
        const results = userService.localSearchUser(users, value);
        this.setState({
          userRenders: results,
        })
      }
      this.setState({ isLoading: false });
    }, 300);

  }

  handleChangeGroupName = (event) => {
    event.preventDefault();
    const value = event.target.value;
    this.setState({ groupName: value });
  }

  async handleSubmit() {
    const { groupName, userSelecteds } = this.state;
    this.setState({ submitted: true });
    if (userSelecteds.length < 2) {
      alert("Require number of members is greater than 3");
      return false;
    }
    if (groupName) {
      try {
        const members = userSelecteds.map(user => {
          return user._id;
        })
        const resData = await createGroup(groupName, members);
        const conversation_id = resData._id;
        const name = resData.group_name;
        const lastMessageTime = resData.last_message_time
        const seenMembers = resData.seen_members;

        const newConversation = {
          _id: conversation_id,
          name: name,
          is_group: true,
          lastMessageTime: lastMessageTime,
          seenMembers: seenMembers,
          lastMessage: null,
        };
        this.props.addNewConversation(newConversation);

        this.props.selectConversation({
          conversation_id,
          name,
          is_group: true,
          lastMessageTime,
          seenMembers,
          lastMessage: null
        });

        Socket.emit('ROOM.CLIENT.CREATE_GROUP', { ...newConversation, members})

        history.push(`/${conversation_id}`);
        return true;
      }
      catch (err) {
        console.log(err);
      }
    }
    return false;
  }

  render() {
    const { userRenders, userSelecteds, isLoading, groupName, submitted } = this.state;
    const numberSelected = userSelecteds.length;
    return (
      <div className='Creat-Group-Form'>
        <form name='form' onSubmit={this.handleSubmit}>
          <div className={'form-group' + (submitted && !groupName ? ' has-error' : '')} style={{ height: '50px' }}>
            <input type="text"
              className="form-control"
              name="groupName"
              value={groupName}
              style={{ fontSize: '18px', height: '38px' }}
              onChange={(event) => { this.handleChangeGroupName(event) }}
            />
            {submitted && !groupName &&
              <div className="help-block">Group name is required</div>
            }
          </div>
        </form>

        <hr></hr>

        <div className='Form-Group'>
          <div className='List-Member-Container'>
            <Input loading={isLoading} size='mini'
              placeholder='Search for people to add'
              style={{ width: '95%', fontSize: '14px' }}
              onChange={this.handleSearchInput}
            />
            <hr></hr>

            <div className='Users-Container'>
              {userRenders.length > 0
                ? userRenders.map(user => {
                  const fullname = user.firstname + ' ' + user.lastname;
                  return (
                    <div className="ResultContainer" key={user._id}>
                      <div><Avatar userID={user._id} /></div>
                      <div className="Fullname">{fullname}</div>
                      <input type='checkbox' defaultChecked={false} onChange={(event) => { this.handleCheck(event, user) }}></input>
                    </div>
                  );
                })
                : <p style={{ textAlign: 'center' }}>No users</p>
              }
            </div>
          </div>

          <div className='Selected-Member-Container'>
            <div className='Selected-Number-Container'>
              <span className='Selected-Text'>SELECTED</span>
              <span className='Selected-Number'>{numberSelected}</span>
            </div>
            <div className='Selected-User-Container'>
              {
                userSelecteds.map(user => {
                  const fullname = user.firstname + ' ' + user.lastname;
                  return (
                    <div className="Selected-User" key={user._id} onClick={() => { }}>
                      <div><Avatar userID={user._id} /></div>
                      <div className="Fullname">{fullname}</div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const actionCreators = {
  selectConversation: selectConversation
}

export default withRouterInnerRef(connect(null, actionCreators, null, { forwardRef: true })(CreateGroup));