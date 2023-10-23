const express = require('express');
const router = express.Router();
const AdminController = require('../controller/AdminController');

const adminRole = require('../middleware/AdminRole');
const upload = require('../middleware/multerAvatar');

router.get('/all-student', adminRole, AdminController.getAllStudent);
router.get('/all-teacher', adminRole, AdminController.getAllTeacher);
router.get('/search/:key', adminRole, AdminController.getSearch);
router.get('/search-teacher/:key', adminRole, AdminController.getSearchTeacher);
router.get('/update-getProfile/:_id', adminRole, AdminController.getProfile);
router.get('/delete-account/:_id', adminRole, AdminController.deleteAccount);
router.get('/all-faqs', adminRole, AdminController.getFAQs);
router.get('/delete-faq/:_id', adminRole, AdminController.deleteFAQ);
router.get('/search-faq/:key', adminRole, AdminController.searchFAQ);


router.post('/create-teacher', adminRole, upload.single('file'), AdminController.createTeacher);
router.post('/update-teacher/:_id', adminRole, AdminController.updateTeacher);
router.post('/create-faq', adminRole, AdminController.createFAQ);
router.post('/update-faq/:_id', adminRole, AdminController.updateFAQ);
module.exports = router;
