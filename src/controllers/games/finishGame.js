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
                        } else if (round.winner === 'tie') {
                            winsTie++
                        }
        
                })
                
                let win
                
                if (winsPlayer1 > winsPlayer2) {
                    win = 1
                } else if (winsPlayer1 < winsPlayer2) {
                    win = 0
                } else {
                    win = 2
                }

                const finishedGame = {
                    endDate: new Date(),
                    opponent: activeGame.player2.userName,
                    win: win,
                    picks: [
                        {
                            winner: activeGame.rounds[0].winner,
                            pick: activeGame.rounds[0].player1hand
                        },
                        {
                            winner: activeGame.rounds[1].winner,
                            pick: activeGame.rounds[1].player1hand
                        },
                        {
                            winner: activeGame.rounds[2].winner,
                            pick: activeGame.rounds[2].player1hand
                        }
                    ]
                }
                    
                user.gamesHistory.unshift(finishedGame)

                user.markModified('gameHistory')
                user.save().then(() => {

                    userModel.findOne({
                        _id: userId
                    }).then( user => {

                            const index = user.activeGames.findIndex( activeGame => activeGame.id === gameId )
                        
                            user.activeGames.splice(index, 1)
                            // user.activeGames.splice(user.activeGames.indexOf(activeGame), 1)

                            const notifIndex = user.notifications.findIndex( notif => notif.gameId === gameId )

                            user.notifications.splice(notifIndex, 1)

                            user.markModified('notifications')
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