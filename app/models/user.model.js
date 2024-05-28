const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Role'}
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;

  return userObject;
}

userSchema.index({'$**': 'search'});

const User = mongoose.model('User', userSchema);

module.exports = User;
