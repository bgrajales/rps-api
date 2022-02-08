const { userModel } = require('../../models/user');

module.exports = ( request, response ) => {

    const userId = request.body.userId;

    userModel.findOne({
        _id: userId
    }).then( user => {

        user.notifications.forEach( notification => {
            notification.status = 'read';
        });

        user.save();

        response.json({
            message: 'Notifications marked as read'
        });

    }).catch( err => {
        console.log(err);
    });

}