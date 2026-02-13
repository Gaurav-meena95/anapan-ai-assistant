const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  meetingId: {
    type: String,
    required: true
  },
  attendeeEmail: {
    type: String,
    required: true
  },
  generatedPrep: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

meetingSchema.index({ meetingId: 1, attendeeEmail: 1 }, { unique: true });

module.exports = mongoose.model('Meeting', meetingSchema);
