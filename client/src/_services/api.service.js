import axios from 'axios';
import { baseUrl } from './config';

const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user.token;
}

const getDefaultHeader = () => ({ Authorization: getToken() });

export function getRecentConversations() {
  return axios.get(
    `${baseUrl}/conversations`,
    {
      headers: getDefaultHeader()
    }
  );
}

export function getConversationInfor(id) {
  return axios.get(
    `${baseUrl}/conversations/${id}`,
    {
      headers: getDefaultHeader()
    }
  )
}

export function getUsers() {
  return axios.get(
    `${baseUrl}/users`,
    {
      headers: getDefaultHeader()
    }
  )
    .then(res => res.data)
    .then(data => { return data });
}

export function getMessages(room_id) {
  return axios.get(
    `${baseUrl}/messages/${room_id}`,
    {
      headers: getDefaultHeader()
    }
  )
}

export function sendMessage(message) {
  return axios.post(
    `${baseUrl}/messages`,
    { ...message },
    {
      headers: getDefaultHeader()
    }
  )
}

export function createGroup(group_name, members) {
  const user = JSON.parse(localStorage.getItem('user'));
  return axios.post(
    `${baseUrl}/groups`,
    { group_name: group_name, members: members.concat([user.user_id]) },
    {
      headers: getDefaultHeader()
    }
  )
    .then(res => res.data)
}

export function updateSeenStatus(roomID) {
  return axios.put(
    `${baseUrl}/notification/${roomID}`,
    {},
    {
      headers: getDefaultHeader()
    }
  )
}