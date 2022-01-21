const { userModel } = require('../../models/user');

module.exports = (request, response) => {

    const userId = request.query.userId;
    const gameId = request.query.gameId;

    userModel.findOne({
        _id: userId
    }).then(user => {

        user.activeGames.forEach(game => {
            if (game.id === gameId) {
                response.status(200).send(game);
            }
        });

    }).catch(err => {
        console.log(err);
        response.status(500).send(err);
    });

}