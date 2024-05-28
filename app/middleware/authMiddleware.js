const jwt = require('jsonwebtoken'); 
const { sendErrorResponse } = require('../helpers/responseHelper')


module.exports = (roleNames) => {
  return (req, res, next) => {
    const token = req.header('Authorization');
  
    if (!token)
      return sendErrorResponse({ res, code: 401, message: 'No token, authorization denied' })
  
    try {
      const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);

      if(!roleNames.includes(decoded.user.role.roleName)) {
        return sendErrorResponse({ res, code: 401, message: "You don't have permission to perform this action" });
      }

      req.user = decoded.user;
      next();
    } catch (err) {
      console.log(err);
      return sendErrorResponse({ res, code: 401, message: 'Token is not valid' });
    }
  };
}