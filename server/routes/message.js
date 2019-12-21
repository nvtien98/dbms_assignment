const express = require('express');
const router = express.Router();
const userModel = require('../models/user');
const conversationModel = require('../models/conversation');
const utils = require('../services/utils');

//sử dụng được transaction
router.post('/messages', async function (req, res) {
	var conversation_id = req.body.conversation_id;
	var decoded = utils.decodeJwt(req);
	var conversation = await conversationModel.findOne({ _id: conversation_id }).exec();
	if (conversation === null) {
		var user = await userModel.findOne({ _id: decoded._id }).exec();
		var other = await userModel.findOne({ _id: req.body.user_id }).exec();
		conversation = new conversationModel({
			_id: conversation_id,
			creator: decoded._id,
			members: new Array(
				{
					user_id: decoded._id,
					firstname: user.firstname,
					lastname: user.lastname
				},
				{
					user_id: req.body.user_id,
					firstname: other.firstname,
					lastname: other.lastname
				}
			),
			last_message_time: Date.now(),
			seen_members: new Array(decoded._id)
		});

		user.conversations.push(conversation._id)
		other.conversations.push(conversation._id)
		utils.saveModel(res, user);
		utils.saveModel(res, other);
	}

	var message = {
		send_user: decoded._id,
		content: req.body.message_content,
		send_time: Date.now()
	}
	conversation.last_message_time = Date.now();
	conversation.seen_members = new Array(decoded._id);
	conversation.messages.push(message);
	utils.saveModel(res, conversation);
	res.status(200).json({ notification: "Send message successfully" });
});

router.get('/messages/:conversation_id', async function (req, res) {
	var conversation = await conversationModel.findOne({ _id: req.params.conversation_id }).exec();
	if (conversation)
		messages = conversation.messages;
	else
		messages = [];
	res.status(200).json(messages);
});

module.exports = router;