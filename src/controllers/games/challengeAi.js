const { activeGameSchema } = require('../../models/activeGame');
const { userModel } = require('../../models/user');
const mongoose = require('mongoose');

module.exports = async( request, response ) => {

    const userId = request.body.userId;

    userModel.findOne({
        _id: userId
    }).then( user => {

        const challenged = request.body.challengedId;
        const challengedName = request.body.challengedName;
        const userName = request.body.userName;

        const alreadyChallenged = user.activeGames.find( game => {
            return game.player2.userName === challengedName;
        });


        if(alreadyChallenged !== undefined) {
            // response.status(400).send('You have already challenged this user!');
            response.status(400).json({
                message: `You have already challenged ${challengedName}!`
            });
        } else {

            const id = mongoose.Types.ObjectId();

                const newUserGame = {
                    _id: id,
                    player1: {
                        id: userId,
                        userName: userName
                    },
                    player2: {
                        id: challenged,
                        userName: challengedName
                    },
                    gameType: 'ai'
                }

                user.activeGames.unshift(newUserGame);
                user.save();

                response.status(200).send({
                    message: 'Challenge sent!',
                    gameId: id
                });

        }
    }).catch( error => {
        console.log(error);
    });

}
