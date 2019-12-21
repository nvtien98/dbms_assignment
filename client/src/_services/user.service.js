import axios from 'axios';
import { baseUrl } from './config';

export const userService = {
  login,
  logout,
  register,
  localSearchUser
}

async function login(email, password) {
  try {
    return await axios.post(`${baseUrl}/login`, { email, password })
      .then(res => res.data)
      .then(data => { localStorage.setItem('user', JSON.stringify(data)); return data; });
  }
  catch (err) {
    return Promise.reject(err);
  }
}

function logout() {
  console.log('remove localstorage and logout');
}

async function register(user) {
  try {
    const { email, firstname, lastname, password, avatar } = user;
    let bodyFormData = new FormData();
    bodyFormData.append('email', email);
    bodyFormData.append('firstname', firstname);
    bodyFormData.append('lastname', lastname);
    bodyFormData.append('password', password);
    bodyFormData.append('avatar', avatar);
    return await axios.post(`${baseUrl}/register`,
      bodyFormData
    )
      .then(res => res.data)
      .then(data => { return data });
  }
  catch (err) {
    return Promise.reject(err);
  }
}

function localSearchUser(users, filterText) {
  const lowerCaseText = filterText.toLowerCase();
  const results = users.filter((user) => {
    const firstnameMatch = user.firstname && user.firstname.toLowerCase().includes(lowerCaseText);
    const lastnameMatch = user.lastname && user.lastname.toLowerCase().includes(lowerCaseText);
    const fullNameMatch = (user.firstname && user.lastname) && (user.firstname + ' ' + user.lastname).toLowerCase().includes(lowerCaseText);
    return firstnameMatch || lastnameMatch || fullNameMatch;
  });
  return results;
}

