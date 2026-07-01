const express = require('express');
const router = express.Router();
const { addAnnouncement } = require('../controllers/announcementController');
const { validateAddAnnouncement } = require('../middlewares/validations/announcementValidations');

router.post('/add-announcement', validateAddAnnouncement, addAnnouncement);

module.exports = router;