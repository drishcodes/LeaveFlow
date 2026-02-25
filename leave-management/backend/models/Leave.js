const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  leaveType: {
    type: String,
    enum: ['annual', 'sick', 'casual', 'unpaid'],
    required: [true, 'Leave type is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  totalDays: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewComment: {
    type: String,
    default: ''
  },
  reviewedAt: {
    type: Date
  }
}, { timestamps: true });

// Calculate total days before save
leaveSchema.pre('save', function (next) {
  if (this.startDate && this.endDate) {
    const msPerDay = 1000 * 60 * 60 * 24;
    this.totalDays = Math.round((this.endDate - this.startDate) / msPerDay) + 1;
  }
  next();
});

module.exports = mongoose.model('Leave', leaveSchema);
