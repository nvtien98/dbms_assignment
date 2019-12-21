const express = require('express');
const router = express.Router();
const userModel = require('../models/user');
const conversationModel = require('../models/conversation');
const utils = require('../services/utils');

router.get('/conversations', async function (req, res) {
	var decoded = utils.decodeJwt(req), conversationList = [];
	var conversation_id, conversation_name;
	var user = await userModel.findOne({ _id: decoded._id }).exec();
	for (conversation_id of user.conversations) {
		var conversation = await conversationModel.findOne({ _id: conversation_id }).exec();
		if (conversation.is_group) {
			conversation_name = conversation.group_name;
		}
		else {
			conversation_name = conversation.members.find(element => {
				return element.user_id !== decoded._id;
			});
			conversation_name = conversation_name.firstname + ' ' + conversation_name.lastname;
		}

		var partner = '';
		if (!conversation.is_group) {
			partner = conversation.members[0].user_id === decoded._id ? conversation.members[1].user_id : conversation.members[0].user_id
		}

		conversationList.push({
			_id: conversation_id,
			name: conversation_name,
			is_group: conversation.is_group,
			partner: partner,
			lastMessageTime: conversation.last_message_time,
			seenMembers: conversation.seen_members,
			lastMessage: conversation.messages[conversation.messages.length - 1]
		});
	}
	conversationList.sort(function (a, b) { return b.lastMessageTime - a.lastMessageTime; });
	res.status(200).json(conversationList);
});

router.get('/conversations/:conversation_id', async function (req, res) {
	var decoded = utils.decodeJwt(req);
	var conversation = await conversationModel.findOne({ _id: req.params.conversation_id }).exec();
	var conversation_name;
	if (conversation) {
		if (conversation.is_group) {
			conversation_name = conversation.group_name;
		}
		else {
			conversation_name = conversation.members.find(element => {
				return element.user_id !== decoded._id;
			});
			conversation_name = conversation_name.firstname + ' ' + conversation_name.lastname;
		}
		conversation.group_name = conversation_name;
		res.status(200).json(conversation);
	}
	else {
		res.status(200).json(null);
	}
})

module.exports = router;