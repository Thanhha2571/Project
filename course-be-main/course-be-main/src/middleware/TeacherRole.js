const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const Account = require('../model/Account');
module.exports = teacherRole = async (req, res, next) => {
    const token = req.headers['authorization'];
    const token_decode = jwt_decode(token);
    await Account.findOne({ email: token_decode.email }).then(async account => {
        if (!account) {
            return res.status(400).json({ success: false, msg: "Tài Khoản Không Tồn Tại" })
        } else if (account.status == false) {
            return res.status(400).json({ success: false, msg: 'Tài Khoản Đang Bị Khoá' })
        } else {
            jwt.verify(token, 'abc', function (err) {
                if (err) {
                    // console.log(err);
                    return res.status(401).send('err')
                }
                else {
                    if (token_decode.level != '2') {
                        return res.status(404).json({ success: false, msg: 'Bạn Không Có Chức Năng Của Giảng Viên. Vui Lòng Đăng Nhập Bằng Tài Khoản Giảng Viên !!!' });
                    } else {
                        next();
                    }
                }
            });
        }
    });
}