const User = require('../models/user.model');
const validator = require('validator');
const mongoose = require('mongoose');
const { sendSuccessResponse, sendErrorResponse } = require('../helpers/responseHelper');
const {chunkArray} = require('../helpers/util');

exports.getUserList = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const search = req.query.search || "";
    const limit = +req.query.limit || 10;
    let skip = (page - 1) * limit;

    const results = await User.aggregate([
      {
        $match: {
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }
      },
      {
        $lookup: {
          from: 'roles',
          localField: 'role',
          foreignField: '_id',
          as: 'role'
        }
      },
      {
        $unwind: {
          path: '$role',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          createdAt: 1,
          updatedAt: 1,
          role: {
            roleName: 1,
            accessModules: 1
          }
        }
      },
      {
        $facet: {
          totalCount: [
            { $count: 'count' }
          ],
          users: [
            { $skip: skip },
            { $limit: limit + 1 },
            { $sort: {
                createdAt: -1
              } 
            }
          ]
        }
      }
    ]);
  
    const total = results[0].totalCount[0] ? results[0].totalCount[0].count : 0;
    const users = results[0].users.slice(0, limit);
    const hasMore = results[0].users.length > limit;

    return sendSuccessResponse({ 
      res, 
      message: "User list fetched successfully", 
      data: { 
        count: users.length, 
        total, 
        hasMore, 
        users 
      } 
    });
    
  } catch (err) {
    console.error('Error fetching user list:', err);
    return sendErrorResponse({ res, err })
  }
};

exports.update = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const userId = req.params.userId;

    let updateObj = {};

    const user = await User.findById(userId);
    if(!user) return sendErrorResponse({ res, code: 400, message: 'Invalid userId' }); 

    if (email) {
      if (!validator.isEmail(email)) {
        return sendErrorResponse({ res, code: 400, message: 'Invalid email address' });
      }

      const userExist = await User.findOne({ email, _id: { $ne: userId } });
      if (userExist) { 
        return sendErrorResponse({ code: 500, res, message: "This email is already in use. please use another email." }) 
      }
      updateObj.email = email;
    }

    if (firstName) updateObj.firstName = firstName;
    if (lastName) updateObj.lastName = lastName;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateObj,
      { new: true }
    );

    return sendSuccessResponse({ res, message: "User updated successfully", data: updatedUser })

  } catch (err) {
    console.error('Error updating user:', err);
    return sendErrorResponse({ res, err })
  }
};

exports.delete = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findByIdAndDelete(userId);
    
    if(!user) {
      return sendErrorResponse({ res, code: 400, message: 'User not found.' });
    }
    
    return sendSuccessResponse({ res, message: "User deleted successfully." });

  } catch (err) {
    console.error('Error deleting user:', err);
    return sendErrorResponse({ res, err })
  }
};

exports.checkAccess = async (req, res) => {
  try {
    const {userId, module} = req.body;

    const user = await User.findById(userId).populate({ path: 'role', select: 'accessModules'});

    if(!user) {
      return sendErrorResponse({ res, code: 400, message: 'User not found.' });
    }

    let haveAccess = false;

    if(user.role.accessModules.includes(module)) {
      haveAccess = true;
    }

    return sendSuccessResponse({ res, message: "Role access fetched successfully.", data: { haveAccess } });
  } catch (err) {
    console.error('Error fetching user list:', err);
    return sendErrorResponse({ res, err })
  }
};

exports.bulkUpdate = async (req, res) => {
  try {
    const batchSize = req.body.batchSize || 1;
    const updateData = req.body || {};
    let totalUpdated = 0;

    const totalUsers = await User.countDocuments();
    const totalBatches = Math.ceil(totalUsers / batchSize);

    for (let i = 0; i < totalBatches; i++) {
      const users = await User.find()
        .skip(i * batchSize)
        .limit(batchSize);

      const userIds = users.map(user => new mongoose.Types.ObjectId(user._id));

      let updated = await User.updateMany({ _id: { $in: userIds } }, { $set: updateData });
      totalUpdated += updated.modifiedCount;

      console.log(`Batch ${i + 1} updated successfully`);
    }

    return sendSuccessResponse({ res, message: `All ${totalUpdated} records updated successfully.`});
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.bulkUpdateCustom = async (req, res) => {
  try {
    const updateData = req.body.updateData;

    if (!Array.isArray(updateData) || updateData.length === 0) {
      return res.status(400).json({ error: 'Please provide proper update data' });
    }

    const batchSize = req.body.batchSize || 1; 

    const userChunks = chunkArray(updateData, batchSize);

    for (let chunk of userChunks) {
      const bulkData = chunk.map(record => ({
        updateOne: {
          filter: { _id: record.id },
          update: { $set: record.data }
        }
      }));

      await User.bulkWrite(bulkData);
    }

    return sendSuccessResponse({ res, message: `All records updated successfully.`});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};