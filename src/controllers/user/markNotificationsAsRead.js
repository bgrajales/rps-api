const { userModel } = require('../../models/user');

module.exports = ( request, response ) => {

    const userId = request.query.userId;

    console.log('Marking notif as read', userId)

    userModel.findOne({
        _id: userId
    }).then( user => {

        console.log(user.notifications)

        user.notifications.forEach( notification => {
            notification.status = 'read';
        });

        user.save();

        console.log(user.notifications)

        response.json({
            message: 'Notifications marked as read'
        });

    }).catch( err => {
        console.log(err);
    });

}