const Account = require('../model/Account');
const fs = require('fs-extra');
const FAQs = require('../model/FAQs');
const AdminController = {
    getAllStudent: async (req, res, next) => {
        try {
            Account.find({ level: '1' }).lean().then(async accounts => {
                if (!accounts) {
                    return res.status(300).json({ success: false, msg: 'Dont have Student !!!' })
                } else {
                    let data = accounts.map(account => {
                        return {
                            _id: account._id,
                            email: account.email,
                            fullname: account.fullname,
                            phone: account.phone,
                            sex: account.sex,
                            dob: account.dob,
                            status: account.status
                        }
                    });
                    return res.status(200).json({ success: true, data: data })
                }
            })
        } catch (error) {
            return res.status(500).json({ success: false, msg: 'server error' })
        }
    },
    getAllTeacher: async (req, res, next) => {
        try {
            Account.find({ level: '2' }).lean().then(async accounts => {
                if (!accounts) {
                    return res.status(300).json({ success: false, msg: 'Dont have Teacher !!!' })
                } else {
                    const data = accounts.map(account => {
                        return {
                            _id: account._id,
                            email: account.email,
                            fullname: account.fullname,
                            phone: account.phone,
                            status: account.status,
                            avatar: account.avatar
                        }
                    })
                    return res.status(200).json({ success: true, data: data })
                }
            })
        } catch (error) {
            return res.status(500).json({ success: false, msg: 'server error' })
        }
    },
    getSearch: async (req, res, next) => {
        try {
            await Account.find(
                {
                    "$or": [
                        { email: { $regex: req.params.key } },
                        { fullname: { $regex: req.params.key } },
                        { phone: { $regex: req.params.key } },
                        { sex: { $regex: req.params.key } },
                    ],
                    level: '1'
                }
            ).then(async accounts => {
                let data = accounts.map(account => {
                    return {
                        email: account.email,
                        fullname: account.fullname,
                        phone: account.phone,
                        sex: account.sex,
                        dob: account.dob,
                        avatar: account.avatar
                    }
                });
                return res.status(200).json({ success: true, record: data })
            })
        } catch (error) {
            return res.status(500).json({ success: false, msg: 'Server Error' })
        }
    },
    getSearchTeacher: async (req, res, next) => {
        try {
            await Account.find(
                {
                    "$or": [
                        { email: { $regex: req.params.key } },
                        { fullname: { $regex: req.params.key } },
                        { phone: { $regex: req.params.key } },
                        { sex: { $regex: req.params.key } },
                    ],
                    level: '2'
                }
            ).then(async accounts => {
                let data = accounts.map(account => {
                    return {
                        _id: account._id,
                        email: account.email,
                        fullname: account.fullname,
                        phone: account.phone,
                        sex: account.sex,
                        dob: account.dob,
                        avatar: account.avatar
                    }
                });
                return res.status(200).json({ success: true, record: data })
            })
        } catch (error) {
            return res.status(500).json({ success: false, msg: 'Server Error' })
        }
    },
    createTeacher: async (req, res, next) => {
        const file = req.file;
        const { fullname, email, dob, phone, sex, password, status } = req.body;
        try {
            let filePath = `src/public/uploads/avatar/${email}`;
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true });
                fs.move(`src/public/uploads/avatar/${file.filename}`, `src/public/uploads/avatar/${email}/${file.filename}`, function (err) {
                    if (err) return console.error(err)
                });
            }
            await Account.findOne({ email: email }).then(async account => {
                if (!account) {
                    let data = {
                        fullname: fullname,
                        email: email,
                        password: password,
                        level: '2',
                        dob: dob,
                        phone: phone,
                        sex: sex,
                        verifyAccount: true,
                        status: status,
                        avatar: file.filename
                    }
                    await Account(data).save();
                    return res.status(200).json({ success: true, msg: `Tài Khoản ${email} đã được tạo thành công` });
                } else {
                    return res.status(300).json({ success: false, msg: `Tài Khoản ${email} đã tồn tại` });
                }
            })
        } catch (error) {
            return res.status(500).json({ success: false, msg: 'Server Error' });
        }
    },
    updateTeacher: async (req, res, next) => {
        const { fullname, dob, phone, sex, avatar, status } = req.body;
        const _id = req.params._id;

        try {
            await Account.findByIdAndUpdate(_id, {
                fullname: fullname,
                dob: dob,
                phone: phone,
                sex: sex,
                status: status,
            }).then(async account => {
                return res.status(200).json({ success: true, msg: 'Cập nhật thành công !' })
            })
        } catch (error) {
            return res.status(500).json({ success: false, msg: 'Cập nhật thất bại. Vui Lòng Kiểm Tra Lại !' })
        }

    },
    deleteAccount: async (req, res, next) => {
        const _id = req.params._id;
        await Account.findByIdAndDelete({ _id: _id }).then(async account => {
            const filePath = `src/public/uploads/avatar/${account.email}`;
            await fs.rmSync(filePath, { recursive: true, force: true });
            return res.status(200).json({ success: true, msg: 'Xoá Thành Công' });
        }).catch(err => console.log(err))
    },
    getProfile: async (req, res, next) => {
        const _id = req.params._id;
        await Account.findOne({ _id: _id }).then(async account => {
            let data = {
                email: account.email,
                fullname: account.fullname,
                phone: account.phone,
                sex: account.sex,
                dob: account.dob,
                status: account.status
            }
            return res.status(200).json({ success: true, data: data })
        })
    },
    createFAQ: async (req, res, next) => {
        const { faq_question, faq_answer } = req.body
        const data = {
            faq_question: faq_question,
            faq_answer: faq_answer
        }
        try {
            await FAQs(data).save();
            return res.status(200).json({ success: true, msg: 'Tạo FAQ thành công' })
        } catch (error) {
            return res.status(400).json({ success: true, msg: 'Có lỗi xảy ra' })
        }
    },
    getFAQs: async (req, res, next) => {
        await FAQs.find().lean().then(faqs => {
            return res.status(200).json({ success: true, faqs })
        })
    },
    deleteFAQ: async (req, res, next) => {
        const _id = req.params._id;
        try {
            await FAQs.findByIdAndDelete(_id);
            return res.status(200).json({ msg: 'Xoá FAQ thành công' })
        } catch (error) {
            return res.status(400).json({ msg: 'Có lỗi xảy ra' })
        }
    },
    updateFAQ: async (req, res, next) => {
        const { faq_question, faq_answer } = req.body;
        const _id = req.params._id;
        try {
            await FAQs.findOne({ _id: _id }).then(async faq => {
                if (!faq) {
                    return res.status(400).json({ msg: 'Không tìm thấy dữ liệu' })
                } else {
                    faq.faq_question = faq_question;
                    faq.faq_answer = faq_answer;
                    await faq.save();
                    return res.status(200).json({ msg: 'Cập nhật FAQ Thành Công' })
                }
            })
        } catch (error) {
            return res.status(500).json({ msg: 'Có lỗi Xảy Ra' })
        }
    },
    searchFAQ: async (req, res, next) => {
        try {
            await FAQs.find(
                {
                    "$or": [
                        { faq_answer: { $regex: req.params.key } },
                        { faq_question: { $regex: req.params.key } },
                    ]
                }
            ).then(async faqs => {
                return res.status(200).json({ success: true, faqs })
            })
        } catch (error) {
            return res.status(500).json({ success: false, msg: 'Server Error' })
        }
    }
}
module.exports = AdminController;