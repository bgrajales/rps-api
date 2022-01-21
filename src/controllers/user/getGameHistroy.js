const { userModel } = require('../../models/user');

module.exports = ( request, response ) => {

    const userId = request.query.userId;

    console.log('Getting active games', userId)

    userModel.findOne({
        _id: userId
    }).then( user => {

        const gamesHistory = user.gamesHistory;

        response.json({
            gamesHistory
        });

    }).catch( err => {
        console.log(err);
    });

}