const express = require('express');
const router = express.Router();
const StudentController = require('../controller/StudentController');
const upload = require('../middleware/multerAvatar');



router.post('/change-password', StudentController.changePassword);
router.post('/register-course', StudentController.registerCourse);
router.post('/update-information', upload.single('file'), StudentController.updateInformation);




router.get('/all-course', StudentController.getAllCourse);
// router.get('/course/lecture-detail/:course_slug/:slug',StudentController.getLectureDetail);
router.get('/course/lecture-detail/:slug',StudentController.getLectureDetail);
router.get('/all-faqs', StudentController.getFaqs);
router.post('/update-mark/:param1/:param2', StudentController.MarkStudent);
router.get('/history-course', StudentController.getHistoryCourse);
module.exports = router;

