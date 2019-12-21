const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {type: String, required: true},
  firstname: {type: String, required: true},
  lastname: {type: String, required: true},
  password: {type: String, required: true},
  is_online: {type: Boolean, default: false},
  conversations: {type: [String], default: []}
});

userSchema.index({
  firstname: 'text',
  lastname: 'text',
});

module.exports = mongoose.model("users", userSchema);