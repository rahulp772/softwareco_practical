const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Role = require('../models/role.model');
const validator = require('validator');
const { sendSuccessResponse, sendErrorResponse } = require('../helpers/responseHelper')

exports.register = async (req, res) => {
    try {
      const { firstName, lastName, password, roleId } = req.body;
      const email = req.body.email.toLowerCase();
      
      if (!firstName || !lastName || !email || !password) {
        return sendErrorResponse({ res, code: 400, message: 'All fields are required' })
      }
  
      if (!validator.isEmail(email)) {
        return sendErrorResponse({ res, code: 400, message: 'Invalid email address' })
      }
  
      let user = await User.findOne({ email });
      if (user) {
        return sendErrorResponse({ res, message: 'User is already exist.' })
      }
  
      let role = await Role.findById(roleId);
      if(!role) {
        return sendErrorResponse({ res, message: 'Invalid roleId' });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: roleId
      });
  
      await user.save();
  
      return sendSuccessResponse({ code: 201, res, message: "User registered successfully", data: user })
  
    } catch (err) {
      console.error('Error registering user:', err);
      return sendErrorResponse({ res, err })
    }
  };
  
  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return sendErrorResponse({ res, code: 400, message: 'All fields are required' })
      }
  
      if (!validator.isEmail(email)) {
        return sendErrorResponse({ res, code: 400, message: 'Invalid email address' })
      }
  
      const user = await User.findOne({ email: email.toLowerCase() }).populate({
        path: 'role', select: '-_id roleName accessModules'
      });
      if (!user) {
        return sendErrorResponse({ res, code: 400, message: 'Your username or password is invalid.' })
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return sendErrorResponse({ res, code: 400, message: 'Your username or password is invalid.' })
      }
  
      const token = jwt.sign({user}, process.env.JWT_SECRET);
  
      return sendSuccessResponse({ res, message: "Login Successful", data: { user, token } })
  
    } catch (err) {
      console.error('Error logging in:', err);
      return sendErrorResponse({ res, err })
    }
  };