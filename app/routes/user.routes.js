const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', userController.getUserList);
router.get('/checkAccess', userController.checkAccess);

router.use(authMiddleware(['admin', 'superAdmin']));

router.route('/:userId')
    .put(userController.update)
    .delete(userController.delete);

router.post('/bulkUpdate', userController.bulkUpdate);
router.post('/bulkUpdateCustom', userController.bulkUpdateCustom);

module.exports = router;
