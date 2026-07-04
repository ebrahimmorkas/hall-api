const express = require('express');
const router = express.Router();
const { addAnnouncement, deleteAnnouncement, updateAnnouncement } = require('../controllers/announcementController');
const { validateAddAnnouncement, validateDeleteAnnouncement, validateUpdateAnnouncement } = require('../middlewares/validations/announcementValidations');

router.post('/add-announcement', validateAddAnnouncement, addAnnouncement);
router.delete('/delete-announcement', validateDeleteAnnouncement, deleteAnnouncement);
router.put('/update-announcement', validateUpdateAnnouncement, updateAnnouncement);

module.exports = router;