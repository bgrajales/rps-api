const { userModel } = require('../models/user');

module.exports = ( userId, userName ) => {

    userModel.findOne({
        _id: userId
    }).then( user => {

        const newNotification = {
            date: new Date(),
            text: `${userName} has challenged you to a game!`,
            status: 'unread'
        }

        user.notifications.push(newNotification);

        user.save();
    }).catch( err => {
        console.log(err);
    })

}