const { userModel } = require('../../models/user');
const otplib = require('otplib')

module.exports = (gameId, userId, challengedId, message) => {

    userModel.findOne({
        _id: userId,
    }).then(user => {
        
        if(user) {

            const newMessage = {
                sender: 'player1',
                message,
                date: new Date(),    
            }

            user.activeGames.forEach(game => {
                if(game.id === gameId) {
                    game.chat.push(newMessage)
                }
            })

            user.markModified('activeGames')
            user.save()

        }

        userModel.findOne({
            _id: challengedId,
        }).then(userTwo => {

            if(userTwo) {

                const newMessage = {
                    sender: 'player2',
                    message,
                    date: new Date(),    
                }

                userTwo.activeGames.forEach(game => {
                    if(game.id === gameId) {
                        game.chat.push(newMessage)
                    }
                })

                userTwo.markModified('activeGames')
                userTwo.save()

            }

        })

    }).catch(err => {
        console.log(err)
    })

}