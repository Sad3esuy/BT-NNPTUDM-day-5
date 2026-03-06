const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    default: ""
  },
  avatarUrl: {
    type: String,
    default: "https://i.sstatic.net/l60Hf.png"
  },
  status: {
    type: Boolean,
    default: false
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  },
  loginCount: {
    type: Number,
    default: 0,
    min: 0
  },
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Middleware to filter out deleted users by default (optional, but helpful for soft delete)
// UserSchema.pre('find', function() {
//   this.where({ deleted: false });
// });

module.exports = mongoose.model('User', UserSchema);
