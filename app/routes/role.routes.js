const express = require('express');
const router = express.Router();
const roleRoutes = require('../controllers/role.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', roleRoutes.getRoleList);

router.use(authMiddleware(['superAdmin']));

router.post('/create', roleRoutes.createRole);

router.route('/:roleId')
    .put(roleRoutes.update)
    .delete(roleRoutes.delete);

module.exports = router;
