const express = require('express');
const router = express.Router();
const userModel = require('../models/user');
const conversationModel = require('../models/conversation');
const utils = require('../services/utils');

router.put('/notification/:conversation_id', async function (req, res) {
    var decoded = utils.decodeJwt(req);
    var conversation = await conversationModel.findOne({ _id: req.params.conversation_id }).exec();
    if (!conversation.seen_members.includes(decoded._id))
        conversation.seen_members.push(decoded._id);
    utils.saveModel(res, conversation);
    res.status(200).json({
        notification: "Check notification successfully"
    });
});

router.get('/users', async function (req, res) {
    var decoded = utils.decodeJwt(req);
    var currentUser = await userModel.findOne({ _id: decoded._id }).exec();
    var users = await userModel.find().exec(), results = [];
    for (var i = 0; i < users.length; i++) {
        if (users[i]._id.toString() === decoded._id.toString()) continue;
        var conversationList = currentUser.conversations.concat(users[i].conversations);
        var sameConversation = conversationList.filter((value, index, self) => {
            return self.indexOf(value) !== index;
        });

        var conversation_id = "";
        for (var j = 0; j < sameConversation.length; j++) {
            var conversation = await conversationModel.findOne({ _id: sameConversation[j] }).exec();
            if (!conversation.is_group) {
                conversation_id = sameConversation[j];
            }
        }

        results.push({
            _id: users[i]._id,
            firstname: users[i].firstname,
            lastname: users[i].lastname,
            conversation_id
        });
    }
    res.status(200).json(results);
});

module.exports = router;