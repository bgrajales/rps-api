const { userModel } = require('../../models/user');

module.exports = ( request, response ) => {

    const userId = request.query.userId;
    const gameId = request.query.gameId;

    console.log('Deleting notifications', userId, gameId)

    userModel.findOne({
        _id: userId
    }).then( user => {

        const index = user.notifications.findIndex(notif => notif.gameId === gameId);

        user.notifications.splice(index, 1);

        user.save();

        response.json({
            message: 'Notification deleted'
        });

    }).catch( err => {
        console.log(err);
    });

}