const { userModel } = require('../../models/user');

module.exports = (request, response) => {

    const userId = request.query.userId;
    const page = request.query.page;
    const limit = 4

    userModel.findOne({
        _id: userId
    }).then( user => {

        const gamesArray = user.activeGames;

        const maxPages = (gamesArray.length / limit) > 1 ? Math.ceil(gamesArray.length / limit) : 1;
        
        const games = gamesArray.slice( (page - 1) * limit, page * limit );

        response.status(200).json({
            games,
            maxPages
        });

    }).catch( err => {
        console.log(err);
    });

}