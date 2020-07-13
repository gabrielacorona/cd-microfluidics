const jwt = require('jsonwebtoken')
const {
    JWT_KEY
} = require('../config/config');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        //console.log('CHECK ADMIN ', token);
        const decoded = jwt.verify(token, JWT_KEY);
        req.userData = decoded;
        if (!req.userData.isAdmin) {
            res.statusMessage = "Auth failed, you are not an admin"
            return res.status(401).end()
        }
        next();
    } catch (err) {
        res.statusMessage = "Auth failed"
        return res.status(401).end()
    }
}