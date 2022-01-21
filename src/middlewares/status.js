const { userModel } = require('../models/user');

module.exports = (userId, status) => {
    
    userModel.findOne({
        _id: userId
    }).then( user => {
        // Change user status to online or offline
        user.status = status;
        user.save();
    }).catch( err => {
        console.log(err);
    })

}