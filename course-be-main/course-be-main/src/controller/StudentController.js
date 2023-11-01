const Account = require('../model/Account');
const Course = require('../model/Course');
const History = require('../model/HistoryCourse');
const Lecture = require('../model/Lecture');
const Subject = require('../model/Subject');
const Exercise = require('../model/Exercise');
const MarkModelST = require("../model/mark");
const FAQs = require('../model/FAQs');
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const fs = require('fs-extra');
const mark = require('../model/mark');
const StudentController = {
    getAllCourse: async (req, res, next) => {
        await Course.find({ course_status: true }).sort({ createdAt: -1 }).limit(3).lean().then(async courses => {
            const history = await History.find().lean();
            return res.status(200).json({ success: true, courses, history })
        }).catch(err => {
            return res.status(404).json({ success: false, msg: "Có Lỗi Xảy Ra" })
        });
    },

    getLectureDetail: async (req, res, next) => {
        try {
            const lectureID = req.params.lectureID;
            // const course_slug = req.params.course_slug;
            // console.log(slug);
            // console.log(course_slug);
            const lecture = await Lecture.findOne({ _id: lectureID });
            // console.log(lecture);

            if (!lecture) {
                return res.status(404).json({ success: false, message: 'Lecture not found' });
            }

            const exercises = await Exercise.find({ lecture_id: lectureID });
            // console.log(exercises);

            return res.status(200).json({ success: true, lecture, exercises });
        } catch (error) {
            // Handle any potential errors, log them, and provide an appropriate response.
            console.error(error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    getQuestionDetail: async (req, res, next) => {
        try {
            const lectureID = req.params.lectureID;
            const lecture = await Lecture.findOne({ _id: lectureID });
            const currentProgress = await mark.findOne({ lecture_name: lecture.lecture_name });
            // console.log(currentProgress.mark);
            const currentMark = currentProgress.mark;

            if (!lecture) {
                return res.status(404).json({ success: false, message: 'Lecture not found' });
            }

            const exercises = await Exercise.find({ lecture_id: lectureID });

            const questionNameToFind = req.query.question_name;

            const specificExercise = exercises.find((exercise) =>
                exercise.ex_question.some((question) => question.question_name === questionNameToFind)
            );

            if (specificExercise) {
                const specificQuestion = specificExercise.ex_question.find(
                    (question) => question.question_name === questionNameToFind
                );

                if (specificQuestion) {
                    const correctAnswer = ['A', 'B', 'C', 'D']
                        .find((option) => specificQuestion.question_content[`flag_${option.toLowerCase()}`] === 1);

                    specificQuestion.correct_answer = correctAnswer;

                    console.log('Specific Question:', specificQuestion);
                    const userAnswer = req.body.userAnswer;

                    if (userAnswer == correctAnswer) {
                        currentMark = currentMark + 1;
                        await mark.findOneAndUpdate(
                            { lecture_name: lecture.lecture_name },
                            { $set: mark == currentMark }
                        )
                    }
                    return res.status(200).json({ success: true, lecture, specificQuestion });
                } else {
                    console.log('Specific question not found');
                    return res.status(404).json({ success: false, message: 'Question not found' });
                }
            } else {
                console.log('Exercise not found');
                return res.status(404).json({ success: false, message: 'Exercise not found' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    postAnswer: async (req, res, next) => {
        try {
            const lectureID = req.params.lectureID;
            const lecture = await Lecture.findOne({ _id: lectureID });
            const currentProgress = await mark.findOne({ lecture_name: lecture.lecture_name });
            // console.log(currentProgress.mark);
            const currentMark = currentProgress.mark;

            if (!lecture) {
                return res.status(404).json({ success: false, message: 'Lecture not found' });
            }

            const exercises = await Exercise.find({ lecture_id: lectureID });

            const questionNameToFind = req.query.question_name;

            const specificExercise = exercises.find((exercise) =>
                exercise.ex_question.some((question) => question.question_name === questionNameToFind)
            );

            if (specificExercise) {
                const specificQuestion = specificExercise.ex_question.find(
                    (question) => question.question_name === questionNameToFind
                );

                if (specificQuestion) {
                    const correctAnswer = ['A', 'B', 'C', 'D']
                        .find((option) => specificQuestion.question_content[`flag_${option.toLowerCase()}`] === 1);

                    specificQuestion.correct_answer = correctAnswer;

                    // console.log('Specific Question:', specificQuestion);
                    const userAnswer = req.body.userAnswer;
                    console.log(userAnswer);
                    console.log(specificQuestion.correct_answer);

                    if (userAnswer !== specificQuestion.correct_answer) {
                        console.log("Wrong answer");
                        return res.status(200).json({ success: true, currentProgress });

                    }
                    else if (userAnswer === specificQuestion.correct_answer) {
                        const updateMark = currentMark + 1;
                        const newProgress = await mark.findOneAndUpdate(
                            { lecture_name: currentProgress.lecture_name },
                            { $set: { mark: updateMark } }
                        );
                        console.log(newProgress);
                        return res.status(200).json({ success: true, newProgress });
                    }
                } else {
                    console.log('Specific question not found');
                    return res.status(404).json({ success: false, message: 'Question not found' });
                }
            } else {
                console.log('Exercise not found');
                return res.status(404).json({ success: false, message: 'Exercise not found' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    getFaqs: async (req, res, next) => {
        await FAQs.find().lean().then(faqs => {
            return res.status(200).json({ success: true, faqs })
        })
    },
    changePassword: async (req, res, next) => {
        const { old_password, password } = req.body;
        const token = req.headers['authorization'];
        const token_decode = jwt_decode(token);
        await Account.findOne({ email: token_decode.email }).then(account => {
            if (account.password != old_password) {
                return res.status(400).json({ success: false, msg: 'Mật Khẩu Cũ Không Trùng Khớp' });
            } else {
                account.password = password;
                account.save();
                return res.status(200).json({ success: true, msg: 'Thay Đổi Mật Khẩu Thành Công' })
            }
        })
    },
    registerCourse: async (req, res, next) => {
        const token = req.headers['authorization'];
        const token_decode = jwt_decode(token);
        const { course_id } = req.body;
        await History.findOne({ course_id: course_id, email: token_decode.email }).then(async history => {
            console.log(history);
            if (!history) {
                const data = {
                    email: token_decode.email,
                    course_id: course_id
                }
                await History(data).save();
                return res.status(200).json({ success: true, msg: 'Đăng Ký Khoá Học Thành Công' })
            } else {
                return res.status(400).json({ success: false, msg: 'Bạn Đã Đăng Ký Khoá Học Này Rồi' })
            }
        }).catch(err => {
            console.log(err);
            return res.status(500).json({ msg: 'Có Lỗi Xảy Ra' })
        })

    },
    updateInformation: async (req, res, next) => {
        const { fullname, phone, dob, sex } = req.body;
        const file = req.file;
        const token = req.headers['authorization'];
        const token_decode = jwt_decode(token);
        try {
            let filePath = `src/public/uploads/avatar/${token_decode.email}`;
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true });
                fs.move(`src/public/uploads/avatar/${file.filename}`, `src/public/uploads/avatar/${token_decode.email}/${file.filename}`, function (err) {
                    if (err) return console.error(err)
                });
            }
            await Account.findOne({ email: token_decode.email }).then(async account => {
                if (!account) {
                    return res.status(400).json({ msg: 'Tài Khoản Không Tồn Tại' })
                } else {
                    account.fullname = fullname;
                    account.phone = phone;
                    account.dob = dob;
                    account.sex = sex;
                    account.avatar = file.filename;
                    await account.save();
                    return res.status(200).json({ msg: 'Cập Nhật Thông Tin Thành Công' })
                }
            })
        } catch (error) {
            return res.status(500).json({ success: false, msg: 'Server Error' });
        }
    },
    getHistoryCourse: async (req, res, next) => {
        const token = req.headers['authorization']
        const token_decode = jwt_decode(token);
        const history = await History.find({ email: token_decode.email }).lean();
        return res.status(200).json({ success: true, history })
    },
    MarkStudent: async (req, res, next) => {
        const token = req.headers["authorization"];
        const token_decode = jwt_decode(token);
        const email_student = token_decode.email
        const MarkStudent = req.body.mark;
        const course = req.params.param1;
        const lecture = req.params.param2;
        console.log("course :", course)
        console.log("lecture:", lecture)
        console.log(req.body);

        const createMark = await MarkModelST.create({
            course_name: course,
            lecture_name: lecture,
            student_email: email_student,
            mark: MarkStudent
        })


        res.status(200).json({ success: true, "mark of this course : ": createMark })
    }
}
module.exports = StudentController;