const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode')
module.exports = adminRole = async (req, res, next) => {
    const token = req.headers['authorization'];
    const token_decode = jwt_decode(token);
    await jwt.verify(token, 'abc', function (err) {
        if (err) {
            // console.log(err);
            return res.status(401).send('err')
        }
        else {
            if (token_decode.level != '3') {
                return res.status(404).json({ success: false, msg: 'you are not admin' })
            } else {
                next();
            }
        }
    })
}