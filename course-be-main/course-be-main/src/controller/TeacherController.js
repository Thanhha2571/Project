const Account = require('../model/Account');
const Course = require('../model/Course');
const Subject = require('../model/Subject');
const Lecture = require('../model/Lecture');
const Exercise = require('../model/Exercise');
const History = require('../model/HistoryCourse');
const MarkModelST = require("../model/mark");
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const fs = require('fs-extra');
const TeacherController = {
    postChangePassword: async (req, res, next) => {

    },
    getAllCourse: async (req, res, next) => {
        const token = req.headers['authorization'];
        const token_decode = jwt_decode(token);
        await Course.find({ teacher_email: token_decode.email }).then(async courses => {
            if (!courses) {
                return res.status(300).json({ success: false, msg: 'Khoá học không tồn tại' })
            }
            return res.status(200).json({ success: true, data: courses })
        })
    },
    getCourse: async (req, res, next) => {
        const _id = req.params._id;
        await Course.findOne({ _id: _id }).then(course => {
            if (!course) {
                return res.status(300).json({ success: false, msg: 'Không Tồn Tại Khoá Học' })
            } else {
                return res.status(200).json({ success: true, course })
            }
        })
    },
    postCreateCourse: async (req, res, next) => {
        const { course_id, course_name, course_description, dateStart, dateEnd, course_status, sub_id, course_price } = req.body;
        const file = req.file;
        if (!file) {
            return res.status(400).json({ success: false, msg: 'Vui Lòng Nhập Hình Ảnh' })
        }
        let filePath = `src/public/uploads/courses/${course_id}`;
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true });
            fs.move(`src/public/uploads/courses/${file.filename}`, `src/public/uploads/courses/${course_id}/${file.filename}`, function (err) {
                if (err) return console.error(err)
                // console.log("success!")
            })
        } else {
            next();
        };
        const token = req.headers['authorization'];
        const token_decode = jwt_decode(token);
        try {
            await Course.findOne({ course_id: course_id }).then(async course => {
                if (!course) {
                    const data = {
                        teacher_email: token_decode.email,
                        course_id: course_id,
                        course_price: course_price,
                        sub_id: sub_id,
                        course_name: course_name,
                        course_description: course_description,
                        dateStart: dateStart,
                        dateEnd: dateEnd,
                        course_status: course_status,
                        course_image: file.filename
                    }
                    await Course(data).save();
                    return res.status(200).json({ success: true, msg: 'Thêm Khoá Học Thành Công !' })
                } else {
                    return res.status(300).json({ success: false, msg: 'Khoá Học Đã Tồn Tại !!!' })
                }
            })
        } catch (error) {
            return res.status(500).json({ success: false, msg: 'Có lỗi xảy ra' })
        }
    },
    postEditCourse: async (req, res, next) => {
        const { course_id, course_name, course_description, course_price, course_status, dateStart, dateEnd } = req.body;
        const token = req.headers['authorization'];
        const token_decode = jwt_decode(token);
        await Course.findOne({ course_id: course_id, teacher_email: token_decode.email }).then(async course => {
            if (!course) {
                return res.status(400).json({ success: false, msg: 'Khoá học không tồn tại' })
            }
            course.course_id = course_id;
            course.course_name = course_name;
            course.course_description = course_description;
            course.dateStart = dateStart;
            course.dateEnd = dateEnd;
            course.course_price = course_price;
            course.course_status = course_status
            await course.save();
            return res.status(200).json({ success: true, msg: "Cập nhật thành công" });
        }).catch(err => {
            return res.status(400).json({ success: false, msg: 'Cập nhật thất bại !' });
        })
    },
    deleteCourse: async (req, res, next) => {
        const _id = req.params._id;
        try {
            await Course.findByIdAndDelete(_id).then(async course => {
                const filePath = `src/public/uploads/courses/${course.course_id}`;
                await fs.rmSync(filePath, { recursive: true, force: true });
                const lecture = await Lecture.findOne({ course_id: course.course_id });
                const exercise = await Exercise.findOne({ lecture_id: lecture.lecture_id });
                await Lecture.findByIdAndDelete(lecture._id);
                await Exercise.findByIdAndDelete(exercise._id);

            });
            return res.status(200).json({ success: true, msg: "Xoá Khoá Học Thành Công !!!" })
        } catch (error) {
            return res.status(500).json({ success: false, msg: "Có lỗi xảy ra. Vui lòng kiểm tra lại !!!" })
        }
    },
    searchCourse: async (req, res, next) => {
        const token = req.headers['authorization'];
        const token_decode = jwt_decode(token);
        try {
            await Course.find(
                {
                    "$or": [
                        { course_name: { $regex: req.params.key } },
                        { course_id: { $regex: req.params.key } },
                        { dateStart: { $regex: req.params.key } },
                        { dateEnd: { $regex: req.params.key } },

                    ],
                    teacher_email: token_decode.email
                }
            ).then(async courses => {
                let data = courses.map(course => {
                    return {
                        course_id: course.course_id,
                        course_name: course.course_name,
                        course_description: course.course_description,
                        dateStart: course.dateStart,
                        dateEnd: course.dateEnd,
                        course_status: course.course_status
                    }
                });
                return res.status(200).json({ success: true, record: data })
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, msg: 'Server Error' })
        }
    },
    getAllSubject: async (req, res, next) => {
        await Subject.find().then(subjects => {
            return res.status(200).json({ success: true, data: subjects })
        })
    },
    postCreateSubject: async (req, res, next) => {
        const token = req.headers['authorization'];
        const token_decode = jwt_decode(token);
        const { sub_id, sub_name } = req.body;
        await Subject.findOne({ sub_id: sub_id }).then(async subject => {
            if (!subject) {
                let data = {
                    sub_id: sub_id,
                    sub_name: sub_name,
                    teacher_email: token_decode.email
                }
                await Subject(data).save();
                return res.status(200).json({ success: true, msg: "Thêm Môn Học Thành Công", data: subject })
            } else {
                return res.status(300).json({ success: false, msg: "Môn Học Đã Tồn Tại !!!" })
            }
        })
    },
    deleteSubject: async (req, res, next) => {
        const _id = req.params._id;
        await Subject.findByIdAndDelete(_id).then(subject => {
            return res.status(200).json({ success: true, msg: 'Xoá Thành Công' })
        }).catch(err => {
            return res.status(400).json({ success: false, msg: 'Có Lỗi Xảy Ra' })
        })
    },
    editSubject: async (req, res, next) => {
        const _id = req.params._id;
        const { sub_name } = req.body
        console.log(sub_name);
        await Subject.findOne({ _id: _id }).then(async sub => {
            sub.sub_name = sub_name;
            await sub.save();
            return res.status(200).json({ success: true, msg: 'Thay Đổi Thành Công' })
        }).catch(err => {
            return res.status(400).json({ success: false, msg: 'Có Lỗi Xảy Ra' })
        })
    },
    getCourseDetail: async (req, res, next) => {
        const slug = req.params.slug;
        const token = req.headers['authorization'];
        const token_decode = jwt_decode(token);
        try {
            const course = await Course.findOne({ course_slug: slug });
            const subject = await Subject.findOne({ course_id: course.course_id });
            const lecture = await Lecture.find({ course_id: course.course_id }).lean();
            const history = await History.findOne({ course_id: course.course_id, email: token_decode.email });
            const studentList = await History.find({ course_id: course.course_id });
            const courseDetail = {
                course_id: course.course_id,
                course_name: course.course_name,
                course_description: course.course_description,
                course_price: course.course_price,
                course_status: course.course_status,
                sub_id: subject.sub_id,
                dateStart: course.dateStart,
                dateEnd: course.dateEnd,
                sub_name: subject.sub_name,
                course_image: course.course_image,
                isRegister: (history == null) ? false : true
            }
            return res.status(200).json({ success: true, courseDetail, lecture, studentList })
        } catch (error) {
            return res.status(500).json({ success: false, msg: 'Có Lỗi Xảy Ra. Vui Lòng Thử Lại !!!' });
        }

    },
    getLecture: async (req, res, next) => {
        const course_id = req.params.id
        await Lecture.findOne({ course_id: course_id }).then(lecture => {
            if (!lecture) {
                return res.status(400).json({ success: false, msg: 'Chưa Có Bài Giảng Nào Cho Khoá Học' })
            } else {
                return res.status(200).json({ success: true, lecture })
            }
        })
    },
    postCreateLecture: async (req, res, next) => {
        const { course_id, lecture_id, lecture_name, lecture_content, lecture_image, lecture_document } = req.body;
        const token = req.headers['authorization'];
        const token_decode = jwt_decode(token);
        await Lecture.findOne({ lecture_id: lecture_id }).then(async lecture => {
            if (!lecture) {
                const data = {
                    teacher_email: token_decode.email,
                    course_id: course_id,
                    lecture_id: lecture_id,
                    lecture_name: lecture_name,
                    lecture_content: lecture_content,
                    lecture_document: lecture_document,
                    lecture_image: lecture_image
                }
                await Lecture(data).save();
                return res.status(200).json({ success: true, msg: 'Thêm Bài Giảng Thành Công !' })
            } else {
                return res.status(400).json({ success: false, msg: 'Bài Giảng Đã Tồn Tại !' })
            }
        })
    },
    getDelLecture: async (req, res, next) => {
        const _id = req.params._id;
        try {
            await Lecture.findByIdAndDelete(_id);
            return res.status(200).json({ success: true, msg: 'Xoá Bài Giảng Thành Công' });
        } catch (error) {
            return res.status(400).json({ success: false, msg: 'Có Lỗi Xảy Ra Vui Lòng Thử Lại !!!' });
        }
    },
    getLectureDetail: async (req, res, next) => {
        const slug = req.params.slug;
        const lecture = await Lecture.findOne({ lecture_slug: slug });
        const exercise = await Exercise.find({ lecture_id: lecture.lecture_id });
        return res.status(200).json({ success: true, lecture, exercise });
    },
    getMarkStudent : async (req, res, next) => {
        // const token = req.headers['authorization'];
        // const token_decode = jwt_decode(token);
        // const getCourse = req.params.param1;
        // console.log("getCourse :" , getCourse)
        // const lecture = req.params.param2;
        // console.log("lecture :" , lecture)
        // const getMarkStudent = await MarkModelST.findOne({
        //     lecture_name:lecture ,
        //     course_name: getCourse

            
        // })
        // console.log("getMarkStudent :" , getMarkStudent)
        // res.status(200).json({ success: true, "mark of this course : " :getMarkStudent })
        await MarkModelST.find().then(marks => {
            return res.status(200).json({ success: true, data: marks })
        })
    },

    postCreateExercise: async (req, res, next) => {
        const { lecture_id, ex_id, ex_name } = req.body;
        const token = req.headers['authorization'];
        const token_decode = jwt_decode(token);
        await Exercise.findOne({ ex_id: ex_id }).then(async ex => {
            if (!ex) {
                const data = {
                    lecture_id: lecture_id,
                    ex_id: ex_id,
                    ex_name: ex_name,
                    teacher_email: token_decode.email
                }
                await Exercise(data).save();
                return res.status(200).json({ success: true, msg: 'Thêm Bài Tập Thành Công !!!' })
            } else {
                return res.status(400).json({ success: false, msg: 'Bài Tập Đã Tồn Tại !!!' })
            }
        })

    },
    getDelEx: async (req, res, next) => {
        const _id = req.params.id;
        try {
            await Exercise.findByIdAndDelete(_id)
            return res.status(200).json({ success: true, msg: 'Xoá Bài Tập Thành Công' })
        } catch (error) {
            return res.status(500).json({ success: false, msg: 'Có Lỗi Xảy Ra. Vui Lòng Thử Lại !!!' })
        }
    },
    postCreateQuestion: async (req, res, next) => {
        const { question_name, ex_id, question_content } = req.body;

        // ex_id la _id cua field
        await Exercise.findByIdAndUpdate({ _id: ex_id }, {
            $push: { ex_question: { question_name: question_name, question_content: question_content } }
        })
        return res.status(200).json({ success: true, msg: 'Thêm Câu Hỏi Thành Công' })
    },
    deleteStudent: async (req, res, next) => {
        const _id = req.params._id;
        try {
            await History.findByIdAndDelete(_id);
            return res.status(200).json({ msg: 'Xoá Học Viên Khỏi Khoá Học Thành Công' })
        } catch (error) {
            return res.status(400).json({ msg: 'Xoá Học Viên Không Thành Công' })
        }
    }
}
module.exports = TeacherController;