const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  updateLeaveBalance,
  deleteUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/', getAllUsers);
router.put('/:id/role', updateUserRole);
router.put('/:id/status', toggleUserStatus);
router.put('/:id/balance', updateLeaveBalance);
router.delete('/:id', deleteUser);

module.exports = router;
