const express = require('express');
const router = express.Router();
const userModel = require('../models/user');
const mongoose = require('mongoose');
const conversationModel = require('../models/conversation');
const utils = require('../services/utils');

// sử dụng được transaction
router.post('/groups', async function (req, res) {
    var decoded = utils.decodeJwt(req), members = [];
    for (var i = 0; i < req.body.members.length; i++) {
        var user = await userModel.findOne({ _id: req.body.members[i] }).exec();
        members.push({
            user_id: req.body.members[i],
            firstname: user.firstname,
            lastname: user.lastname
        });
    }

    var conversation = new conversationModel({
        _id: new mongoose.Types.ObjectId(),
        creator: decoded._id,
        is_group: true,
        group_name: req.body.group_name,
        members,
        last_message_time: Date.now(),
        seen_members: new Array(decoded._id)
    });

    req.body.members.forEach(async member_id => {
        var user = await userModel.findOne({ _id: member_id }).exec();
        user.conversations.push(conversation._id);
        utils.saveModel(res, user);
    });
    utils.saveModel(res, conversation);
    res.status(200).json(conversation);
});

module.exports = router;