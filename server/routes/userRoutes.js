const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole, toggleBlockUser } = require('../controllers/userController');
const { protect, superAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, superAdmin, getUsers);

router.route('/:id/role')
  .put(protect, superAdmin, updateUserRole);

router.route('/:id/block')
  .put(protect, superAdmin, toggleBlockUser);

module.exports = router;
