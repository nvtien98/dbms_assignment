const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
var multer = require('multer');

var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './public/avatars');
	},
	filename: (req, file, cb) => {
		cb(null, req.body.email);
	}
});
var upload = multer({ storage: storage });

router.post('/register', upload.single('avatar'), async function (req, res) {
	var user = await userModel.findOne({ email: req.body.email }).exec()
	if (user) {
		fs.unlink('./public/avatars/' + req.body.email, (err) => {
			if (err) {
				console.error(err)
				return
			}
		})
		res.status(409).json({
			error: 'Email ' + req.body.email + ' is already taken'
		});
	}
	else {
		bcrypt.hash(req.body.password, 10, function (err, hash) {
			if (err) {
				return res.status(500).json({
					error: err
				});
			}
			else {
				const user = new userModel({
					_id: new mongoose.Types.ObjectId(),
					email: req.body.email,
					firstname: req.body.firstname,
					lastname: req.body.lastname,
					password: hash
				});

				fs.rename('./public/avatars/' + user.email, './public/avatars/' + user._id + '.jpg', function (err) {
					if (err) throw err;
				});

				user.save().then(function (result) {
					res.status(200).json({
						success: 'Register successfully',
						avatarUrl: 'localhost:8000/avatars/' + user._id + '.jpg'
					});
				}).catch(error => {
					res.status(500).json({
						error
					});
				});
			}
		});
	}

});

router.post('/login', function (req, res) {
	userModel.findOne({ email: req.body.email })
		.exec()
		.then(function (user) {
			bcrypt.compare(req.body.password, user.password, function (err, result) {
				if (err) {
					return res.status(401).json({
						error: 'Email or password is incorrect'
					});
				}
				if (result) {
					const JWTToken = jwt.sign({
						email: user.email,
						_id: user._id
					},
						'secret',
						{
							expiresIn: '24h'
						});
					return res.status(200).json({
						user_id: user._id,
						firstname: user.firstname,
						lastname: user.lastname,
						token: "Bearer " + JWTToken
					});
				}

				return res.status(401).json({
					error: 'Email or password is incorrect'
				});
			});
		})
		.catch(error => {
			res.status(401).json({
				error: 'Email or password is incorrect'
			});
		});
});

module.exports = router;