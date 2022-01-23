const { userModel } = require('../../models/user');

module.exports = ( request, response ) => {

    const userId = request.query.userId;
    const page = request.query.page;
    const limit = 3

    userModel.findOne({
        _id: userId
    }).then( user => {

        const gamesHistory = user.gamesHistory;

        const maxPages = (gamesHistory.length / limit) > 1 ? Math.ceil(gamesHistory.length / limit) : 1;

        const games = gamesHistory.slice( (page - 1) * limit, page * limit );

        response.json({
            games,
            maxPages
        });

    }).catch( err => {
        console.log(err);
    });

}