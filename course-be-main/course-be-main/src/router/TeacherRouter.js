const express = require('express');
const router = express.Router();
const TeacherController = require('../controller/TeacherController');
const teacherRole = require('../middleware/TeacherRole');
const upload_course = require('../middleware/multerCourse');

router.get('/all-course', teacherRole, TeacherController.getAllCourse);
router.get('/all-subject', teacherRole, TeacherController.getAllSubject);
router.get('/delete-subject/:_id', teacherRole, TeacherController.deleteSubject);
router.get('/delete-course/:_id', teacherRole, TeacherController.deleteCourse);
router.get('/course/:_id', teacherRole, TeacherController.getCourse);
router.get('/search-course/:key', teacherRole, TeacherController.searchCourse);
router.get('/course-detail/:slug', TeacherController.getCourseDetail);
router.get('/course-detail/lecture/:id', TeacherController.getLecture);
router.get('/delete-lecture/:_id', teacherRole, TeacherController.getDelLecture);
router.get('/course/lecture-detail/:slug', teacherRole, TeacherController.getLectureDetail);
router.get('/course/lecture/exercise/delete-exercise/:id', teacherRole, TeacherController.getDelEx);
router.get('/delete-student/:_id', teacherRole, TeacherController.deleteStudent);
// router.get('/get-mark/:param1/:param2', TeacherController.getMarkStudent);
router.get('/get-mark', TeacherController.getMarkStudent);

router.post('/create-course', upload_course.single('image'), TeacherController.postCreateCourse);
router.post('/edit-course', teacherRole, TeacherController.postEditCourse);
router.post('/create-subject', teacherRole, TeacherController.postCreateSubject);
router.post('/course/create-lecture', teacherRole, TeacherController.postCreateLecture);
router.post('/course/lecture-detail/create-exercise', teacherRole, TeacherController.postCreateExercise);
router.post('/course/lecture-detail/create-question', TeacherController.postCreateQuestion);
router.post('/edit-subject/:_id', teacherRole, TeacherController.editSubject);
module.exports = router;