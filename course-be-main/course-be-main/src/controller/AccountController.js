const Account = require('../model/Account');
const otp = require('../model/otp');
const service = require('../service/email');
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode')
const AccountController = {
    postRegister: async (req, res, next) => {
        const { email, password } = req.body;
        try {
            Account.findOne({ email: email }).then(async account => {
                if (!account) {
                    let data = {
                        email: email,
                        password: password,
                        fullname: '',
                        phone: '',
                        avatar: '',
                        dob: '',
                        sex: ''
                    }
                    await Account(data).save();
                    return res.status(200).json({ success: true, msg: 'Register success', data: data });
                } else {
                    return res.status(300).json({ success: false, msg: 'Account exist' });
                }
            })
        } catch (error) {
            return res.status(500).json({ success: true, msg: 'server error' });
        }
    },
    postLogin: async (req, res, next) => {
        const { email, password } = req.body;
        try {
            Account.findOne({ email: email }).then(async account => {
                if (!account) {
                    return res.status(400).json({ success: false, msg: 'Tài Khoản Không Tồn Tại' });
                } else {
                    if (password == account.password) {
                        // req.session.email = account.email;
                        // req.session.level = account.level;
                        const accessToken = jwt.sign({
                            email: account.email,
                            level: account.level
                        }, 'abc', {
                            expiresIn: '86400s',
                        });
                        if (account.status == false) {
                            return res.status(400).json({ success: true, msg: 'Tài Khoản Đang Bị Khoá. Vui Lòng Liên Hệ Admin !!!' });
                        }
                        return res.status(200).json({ success: true, msg: 'Login success', accessToken: accessToken, level: account.level });
                    } else {
                        return res.status(400).json({ success: false, msg: 'Sai Mật Khẩu !!!' });
                    }
                }
            })
        } catch (error) {
            return res.status(500).json({ success: false, msg: 'server error' });
        }
    },
    getLogout: async (req, res, next) => {
        try {
            await req.session.destroy();
            return res.status(200).json({ success: true, msg: 'Logout success' })
        } catch (error) {
            return res.status(500).json({ success: false, msg: 'server error' })
        }
    },
    postUpdateInformation: async (req, res, next) => {
        const token = req.headers['authorization'];
        const token_decode = jwt_decode(token);
        const { password, sex, dob, phone, fullname } = req.body;
        try {
            Account.findOne({ email: token_decode.email }).then(async account => {
                if (!account) {
                    return res.status(300).json({ success: false, msg: 'Account not exist' })
                } else {
                    // account.email = email;
                    account.dob = dob;
                    account.phone = phone;
                    account.fullname = fullname;
                    account.sex = sex;
                    account.password = password;
                    await account.save();
                    return res.status(200).json({ success: true, msg: 'Change Information Success!!' })
                }
            })
        } catch (error) {
            return res.status(500).json({ success: true, msg: 'Server Error!!' })
        }

    },
    postForgotPassword: async (req, res, next) => {
        const { email } = req.body;
        Account.findOne({ email: email }).then(async account => {
            if (!account) {
                return res.status(300).json({ success: false, msg: 'Account Not Exist' })
            } else {
                const data = {
                    email: email,
                    link: 'http://localhost:3000/reset-password'
                }
                await service.sendEmail(data.link, email);
                await otp(data).save();
                return res.status(200).json({ success: true, msg: 'Email Was Send. Please Check Your Email !' })
            }
        })
    },
    postCheckOTP: async (req, res, next) => {
        const { email } = req.body;
        otp.findOne({ email: email }).then(async email => {
            if (!email) {
                return res.status(300).json({ success: false })
            } else {
                return res.status(200)
            }
        })
    },
    postResetPassword: async (req, res, next) => {
        const { email, password } = req.body
        Account.findOne({ email: email }).then(async account => {
            if (!account) {
                return res.status(400).json({ success: false, msg: 'Account not exist' })
            } else {
                account.password = password;
                await account.save();
                return res.status(200).json({ success: true, msg: 'Reset Password Success' })
            }
        })
    },
    getProfile: async (req, res, next) => {
        const token = req.headers['authorization'];
        const token_decode = jwt_decode(token);
        try {
            Account.findOne({ email: token_decode.email }).then(async account => {
                if (!account) {
                    return res.status(300).json({ success: false, msg: 'Account not exist' })
                } else {
                    const data = {
                        email: account.email,
                        fullname: account.fullname,
                        phone: account.phone,
                        dob: account.dob,
                        sex: account.sex,
                        password: account.password
                        // avatar: account.avatar
                    }
                    return res.status(200).json({ success: true, data })
                }
            })
        } catch (error) {
            return res.status(500).json({ success: false, msg: 'Server Error' })
        }
    }
}
module.exports = AccountController;