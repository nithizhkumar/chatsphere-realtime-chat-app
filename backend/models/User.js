import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // allows multiple docs without username (mobile-only accounts)
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [20, 'Username must be at most 20 characters'],
    },
    mobileNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // allows multiple docs without mobileNumber (username-only accounts)
      match: [/^\d{10}$/, 'Mobile number must be exactly 10 digits'],
    },
    online: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    socketId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// A user must have at least a username or a mobile number to be identifiable
userSchema.pre('validate', function (next) {
  if (!this.username && !this.mobileNumber) {
    return next(new Error('Either username or mobileNumber is required'));
  }
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
