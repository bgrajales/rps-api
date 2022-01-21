const { userModel } = require('../../models/user');

module.exports = (request, response) => {

    const userId = request.query.userId;
    const gameId = request.query.gameId;
    const round = request.query.currentRound;

    userModel.findOne({
        _id: userId
    }).then(user => {

        user.activeGames.forEach(activeGame => {

            if ( activeGame.id === gameId ) {
                
                activeGame.currentRound =  parseInt(round) + 1;

                user.markModified('activeGames');

                user.save()
                    .then(() => {
                        response.send('success');
                    })

            }
        })
    })

}