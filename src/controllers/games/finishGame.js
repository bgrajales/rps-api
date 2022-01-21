const { userModel } = require('../../models/user');
const { gameHistoryModel } = require('../../models/gameHistory');

module.exports = ( request, response ) => { 

    const userId = request.query.userId
    const gameId = request.query.gameId

    userModel.findOne({
        _id: userId
    }).then( user => {

        user.activeGames.forEach( activeGame => {
            if (activeGame.id === gameId) {
                console.log(activeGame)
                let winsPlayer1 = 0
                let winsPlayer2 = 0
                let winsTie = 0

                activeGame.rounds.forEach((round) => {
                        
                        if (round.winner === 'player1') {
                            winsPlayer1++
                        } else if (round.winner === 'player2') {
                            winsPlayer2++
                        } else if (round.winner === 'draw') {
                            winsTie++
                        }

        
                })
                
                let win
                if (winsPlayer1 > winsPlayer2) {
                    win = 1
                } else {
                    win = 0
                }

                const finishedGame = {
                    endDate: new Date(),
                    opponent: activeGame.player2.userName,
                    win: win,
                    picks: [
                        activeGame.rounds[0].player1hand,
                        activeGame.rounds[1].player1hand,
                        activeGame.rounds[2].player1hand,
                    ]
                }
                    
                user.gamesHistory.push(finishedGame)

                user.markModified('gameHistory')
                user.save().then(() => {

                    userModel.findOne({
                        _id: userId
                    }).then( user => {
                        
                            user.activeGames.splice(user.activeGames.indexOf(activeGame), 1)
                            user.markModified('activeGames')
                            user.save()
                            .then(() => {
                                console.log('Game finished')
                                response.status(200).send('Game finished')
                            })

                    })

                })

                
            
            }
            
        })

            



        })

}