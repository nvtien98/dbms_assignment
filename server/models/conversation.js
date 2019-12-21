const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  creator: {type: String, required: true},
  is_group: {type: Boolean, default: false},
  group_name: {type: String, default: ''},
  members: {type: [Object], required: true},
  messages: {type: [Object], default: []},
  is_online: {type: Boolean, default: false},
  last_message_time: {type: Number, required: true},
  seen_members: {type: [String], required: true}
});

module.exports = mongoose.model("conversation", conversationSchema);