const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const io = require('socket.io');
const userRouter = require('./routes/user');
const groupRouter = require('./routes/group');
const messageRouter = require('./routes/message');
const conversationRouter = require('./routes/conversation');
const utilRouter = require('./routes/util');
const authentication = require('./authentication');
const config = require('./config');
const PORT = config.PORT;

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const mongoUrl = "mongodb://localhost:27017/chat_db"
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
});

app.use('/', userRouter);
app.use(authentication.checkToken, groupRouter);
app.use(authentication.checkToken, messageRouter);
app.use(authentication.checkToken, conversationRouter);
app.use(authentication.checkToken, utilRouter);

app.listen(PORT, () => { console.log('Server is running... on port =', PORT) });

server = io.listen(8080);

let userId2Socket = new Map();

server.on('connection', (socket) => {
  console.info(`Client connected [id=${socket.id}]`);

  socket.on('CLIENT.SEND_INFO', (data) => {
    userId2Socket.set(socket, data.userID);
    console.log(userId2Socket.size);
  });


  socket.on("disconnect", () => {
    console.info(`Client gone [id=${socket.id}]`);
    userId2Socket.delete(socket);
    console.log(userId2Socket.size);
  });

  socket.on('ROOM.CLIENT.SEND_MESSAGE', (data) => {
    const { roomMembers, conversation_id, sendUser, message_content, sendTime, name } = data;
    for (const [client, userID] of userId2Socket.entries()) {
      if (roomMembers.includes(userID)) {
        const message = { conversation_id: conversation_id, send_user: sendUser, content: message_content, send_time: sendTime, name: name };
        client.emit('ROOM.SERVER.SEND_MESSAGE', message);
      }
    }
  });

  socket.on('ROOM.CLIENT.TYPING', (data) => {
    const { conversation_id, roomMembers } = data;
    const actorID = userId2Socket.get(socket);
    for (const [client, userID] of userId2Socket.entries()) {
      if (roomMembers.includes(userID)) {
        const message = { conversation_id: conversation_id, actorID: actorID };
        client.emit('ROOM.SERVER.TYPING', message);
      }
    }
  });

  socket.on('ROOM.CLIENT.STOP_TYPING', (data) => {
    const { conversation_id, roomMembers } = data;
    const actorID = userId2Socket.get(socket);
    for (const [client, userID] of userId2Socket.entries()) {
      if (roomMembers.includes(userID)) {
        const message = { conversation_id: conversation_id, actorID: actorID };
        client.emit('ROOM.SERVER.STOP_TYPING', message);
      }
    }
  })

  socket.on('ROOM.CLIENT.CREATE_GROUP', (data) => {
    const message = {
      _id: data._id,
      name: data.name,
      is_group: data.is_group,
      seenMembers: data.seenMembers,
      lastMessageTime: data.lastMessageTime,
      lastMessage: data.lastMessage
    }

    const groupMembers = data.members;
    for (const [client, userID] of userId2Socket.entries()) {
      if (groupMembers.includes(userID)) {
        client.emit('ROOM.SERVER.CREATE_GROUP', message);
      }
    }
  });

});