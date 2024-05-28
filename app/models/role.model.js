const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: true,
  },
  accessModules: {
    type: [String],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
},
  { timestamps: true }
);

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
