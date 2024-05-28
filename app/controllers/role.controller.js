const Role = require('../models/role.model');
const { sendSuccessResponse, sendErrorResponse } = require('../helpers/responseHelper')

exports.getRoleList = async (req, res) => {
  try {
    const roles = await Role.find();
    return sendSuccessResponse({ res, message: "All roles fetched successfully", data: roles })
  } catch (err) {
    console.error('Error fetching roles:', err);
    return sendErrorResponse({ res, err })
  }
};

exports.createRole = async (req, res) => {
  try {
    const { roleName, accessModules } = req.body;

    if (!roleName || !accessModules.length) {
      return sendErrorResponse({ res, code: 400, message: 'All fields are required' })
    }

    let role = await Role.findOne({ roleName });
    if (role) {
      return sendErrorResponse({ res, message: 'Role is already exist' })
    }

    role = new Role({
      roleName,
      accessModules: [...new Set(accessModules)],
    });

    await role.save();

    return sendSuccessResponse({ code: 201, res, message: "New role has been added.", data: role })

  } catch (err) {
    console.error('Error while creating new role:', err);
    return sendErrorResponse({ res, err })
  }
};

exports.update = async (req, res) => {
  try {
    const { roleName, accessModules } = req.body;
    const roleId = req.params.roleId;

    let updateObj = {};

    const role = await Role.findById(roleId);
    if(!role) return sendErrorResponse({ res, code: 400, message: 'Invalid roleId' }); 

    if (!accessModules || !accessModules.length) {
      return sendErrorResponse({ code: 500, res, message: "Please provide roles." }) 
    }

    if (roleName) updateObj.roleName = roleName;
    if (accessModules) updateObj.accessModules = [...new Set(accessModules)];

    const updatedRole = await Role.findByIdAndUpdate(
      roleId,
      updateObj,
      { new: true }
    );

    return sendSuccessResponse({ res, message: "User updated successfully", data: updatedRole })

  } catch (err) {
    console.error('Error updating user:', err);
    return sendErrorResponse({ res, err })
  }
};

exports.delete = async (req, res) => {
  try {
    const roleId = req.params.roleId;

    const role = await Role.findByIdAndDelete(roleId);
    
    if(!role) {
      return sendErrorResponse({ res, code: 400, message: 'Role not found.' });
    }
    
    return sendSuccessResponse({ res, message: "Role deleted successfully." });

  } catch (err) {
    console.error('Error deleting role:', err);
    return sendErrorResponse({ res, err })
  }
};