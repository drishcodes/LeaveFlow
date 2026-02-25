const User = require('../models/User');

// @desc    Get all users (admin)
// @route   GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update user role (admin)
// @route   PUT /api/users/:id/role
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['employee', 'manager', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Toggle user active status (admin)
// @route   PUT /api/users/:id/status
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isActive = !user.isActive;
    await user.save();

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update user leave balance (admin)
// @route   PUT /api/users/:id/balance
exports.updateLeaveBalance = async (req, res) => {
  try {
    const { leaveBalance } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { leaveBalance },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
