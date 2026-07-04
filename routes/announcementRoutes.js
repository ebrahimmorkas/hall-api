const express = require('express');
const router = express.Router();
const { addAnnouncement, deleteAnnouncement } = require('../controllers/announcementController');
const { validateAddAnnouncement, validateDeleteAnnouncement } = require('../middlewares/validations/announcementValidations');

router.post('/add-announcement', validateAddAnnouncement, addAnnouncement);
router.delete('/delete-announcement', validateDeleteAnnouncement, deleteAnnouncement);

module.exports = router;