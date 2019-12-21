const jwt = require('jsonwebtoken');

function saveModel(res, model) {
    model.save().catch(error => {
        res.status(500).json({ error });
    });
}

function decodeJwt(req) {
    var token = req.headers['x-access-token'] || req.headers['authorization'];
    token = token.slice(7, token.length);
    return jwt.decode(token);
}

module.exports = { saveModel, decodeJwt };