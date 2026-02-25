const express = require('express');
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  reviewLeave,
  deleteLeave,
  getStats
} = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', applyLeave);
router.get('/my', getMyLeaves);
router.get('/stats', authorize('manager', 'admin'), getStats);
router.get('/', authorize('manager', 'admin'), getAllLeaves);
router.put('/:id/review', authorize('manager', 'admin'), reviewLeave);
router.delete('/:id', deleteLeave);

module.exports = router;
