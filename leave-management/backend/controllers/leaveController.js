const Leave = require('../models/Leave');
const User = require('../models/User');

// @desc    Apply for leave
// @route   POST /api/leaves
exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: 'Start date must be before end date' });
    }

    const msPerDay = 1000 * 60 * 60 * 24;
    const totalDays = Math.round((new Date(endDate) - new Date(startDate)) / msPerDay) + 1;

    // Check leave balance for non-unpaid
    if (leaveType !== 'unpaid') {
      const user = await User.findById(req.user._id);
      if (user.leaveBalance[leaveType] < totalDays) {
        return res.status(400).json({ message: `Insufficient ${leaveType} leave balance` });
      }
    }

    const leave = await Leave.create({
      employee: req.user._id,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason
    });

    await leave.populate('employee', 'name email department');

    res.status(201).json({ success: true, leave });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get my leaves
// @route   GET /api/leaves/my
exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.user._id })
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, leaves });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all leaves (manager/admin)
// @route   GET /api/leaves
exports.getAllLeaves = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const leaves = await Leave.find(filter)
      .populate('employee', 'name email department')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, leaves });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Review leave (approve/reject)
// @route   PUT /api/leaves/:id/review
exports.reviewLeave = async (req, res) => {
  try {
    const { status, reviewComment } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected' });
    }

    const leave = await Leave.findById(req.params.id).populate('employee');
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    if (leave.status !== 'pending') return res.status(400).json({ message: 'Leave already reviewed' });

    leave.status = status;
    leave.reviewedBy = req.user._id;
    leave.reviewComment = reviewComment || '';
    leave.reviewedAt = new Date();
    await leave.save();

    // Update leave balance if approved
    if (status === 'approved' && leave.leaveType !== 'unpaid') {
      await User.findByIdAndUpdate(leave.employee._id, {
        $inc: { [`leaveBalance.${leave.leaveType}`]: -leave.totalDays }
      });
    }

    await leave.populate('employee', 'name email department');
    await leave.populate('reviewedBy', 'name');

    res.json({ success: true, leave });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete/cancel leave
// @route   DELETE /api/leaves/:id
exports.deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });

    if (leave.employee.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({ message: 'Can only cancel pending leaves' });
    }

    await leave.deleteOne();
    res.json({ success: true, message: 'Leave cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get leave stats
// @route   GET /api/leaves/stats
exports.getStats = async (req, res) => {
  try {
    const total = await Leave.countDocuments();
    const pending = await Leave.countDocuments({ status: 'pending' });
    const approved = await Leave.countDocuments({ status: 'approved' });
    const rejected = await Leave.countDocuments({ status: 'rejected' });
    const totalEmployees = await User.countDocuments({ role: 'employee' });

    res.json({ success: true, stats: { total, pending, approved, rejected, totalEmployees } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
