const { activeGameSchema } = require('../../models/activeGame');
const { userModel } = require('../../models/user');
const mongoose = require('mongoose');

module.exports = async( request, response ) => {

    const userId = request.body.userId;

    console.log(`User ${userId} is challenging you!`);

    userModel.findOne({
        _id: userId
    }).then( user => {

        const challenged = request.body.challengedId;
        const challengedName = request.body.challengedName;
        const userName = request.body.userName;

        console.log(user.activeGames, challenged);

        const alreadyChallenged = user.activeGames.find( game => {
            return game.player2.userName === challengedName;
        });


        if(alreadyChallenged !== undefined) {
            // response.status(400).send('You have already challenged this user!');
            response.status(400).json({
                message: `You have already challenged ${challengedName}!`
            });
        } else {

            userModel.findOne({
                _id: challenged
            }).then( challengedUser => {

                const alreadyChallenged = challengedUser.activeGames.find( game => {
                    return game.player2.userName === userName;
                });

                if(alreadyChallenged !== undefined) {
                    response.status(400).json({
                        message: 'You have already been challenged by this user!'
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
                }

                user.activeGames.unshift(newUserGame);
                user.save();

                userModel.findOne({
                    _id: challenged
                }).then( challengedUser => {

                    const newChallengedGame = {
                        _id: id,
                        player1: {
                            id: challenged,
                            userName: challengedName
                        },
                        player2: {
                            id: userId,
                            userName: userName
                        },
                    }

                    const newNotification = {
                        id: mongoose.Types.ObjectId(),
                        message: `${userName} has challenged you!`,
                        challenger: userName,
                        gameId: id,
                    }

                    challengedUser.notifications.unshift(newNotification);
                    challengedUser.activeGames.unshift(newChallengedGame);
                    challengedUser.save();

                    response.status(200).send({
                        message: 'Challenge sent!',
                        gameId: id
                    });
                }).catch( error => {
                    console.log(error);
                });
                }
            }).catch( error => {
                console.log(error);
            });

        }
    }).catch( error => {
        console.log(error);
    });

}
