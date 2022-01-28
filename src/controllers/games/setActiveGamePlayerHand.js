const { userModel } = require('../../models/user');

module.exports = ( request, response ) => {

    const userId = request.query.userId;
    const challengedId = request.query.challengedId;

    const gameId = request.query.gameId;
    const round = request.query.round;
    const hand = request.query.hand;
   
    userModel.findOne({
        _id: userId
    }).then( user => {

        user.activeGames.forEach( activeGame => {

            if( activeGame.id === gameId ) {

                activeGame.rounds[round-1].player1hand = hand;

                if ( activeGame.rounds[round-1].player2hand !== 'null' ) {
                        
                        if ( activeGame.rounds[round-1].player1hand === activeGame.rounds[round-1].player2hand ) {
                            activeGame.rounds[round-1].winner = 'tie';
                        } else if ( activeGame.rounds[round-1].player1hand === 'r' && activeGame.rounds[round-1].player2hand === 's' ) {
                            activeGame.rounds[round-1].winner = 'player1';
                        } else if ( activeGame.rounds[round-1].player1hand === 'p' && activeGame.rounds[round-1].player2hand === 'r' ) {
                            activeGame.rounds[round-1].winner = 'player1';
                        } else if ( activeGame.rounds[round-1].player1hand === 's' && activeGame.rounds[round-1].player2hand === 'p' ) {
                            activeGame.rounds[round-1].winner = 'player1';
                        } else {
                            activeGame.rounds[round-1].winner = 'player2';
                        }
    
                } else {
                    console.log('no player2hand')
                }
             
                user.markModified('activeGames');

                user.save()
                    .then( () => {
                      
                        userModel.findOne({
                            _id: challengedId
                        }).then( challengedUser => {

                            challengedUser.activeGames.forEach( challengerActiveGame => {

                                if ( challengerActiveGame.id === gameId) {
                                    
                                    challengerActiveGame.rounds[round-1].player2hand = hand;

                                    if ( challengerActiveGame.rounds[round-1].player1hand !== 'null' ) {

                                        if ( challengerActiveGame.rounds[round-1].player1hand === challengerActiveGame.rounds[round-1].player2hand ) {
                                            challengerActiveGame.rounds[round-1].winner = 'tie';
                                        } else if ( challengerActiveGame.rounds[round-1].player1hand === 'r' && challengerActiveGame.rounds[round-1].player2hand === 's' ) {
                                            challengerActiveGame.rounds[round-1].winner = 'player1';
                                        } else if ( challengerActiveGame.rounds[round-1].player1hand === 'p' && challengerActiveGame.rounds[round-1].player2hand === 'r' ) {
                                            challengerActiveGame.rounds[round-1].winner = 'player1';
                                        } else if ( challengerActiveGame.rounds[round-1].player1hand === 's' && challengerActiveGame.rounds[round-1].player2hand === 'p' ) {
                                            challengerActiveGame.rounds[round-1].winner = 'player1';
                                        } else {
                                            challengerActiveGame.rounds[round-1].winner = 'player2';
                                        }
                                        
                                    } else {
                                        console.log('no player2hand')
                                    }

                                    challengedUser.markModified('activeGames');
                                    
                                    challengedUser.save()
                                        .then( () => {
                                            
                                            if(challengerActiveGame.rounds[round-1].winner === 'draw') {
                                                response.status(200).send({
                                                    winner: 'draw'
                                                })
                                            } else if ( challengerActiveGame.rounds[round-1].winner === 'player1' ) {
                                                response.status(200).send({
                                                    winner: 'player2'
                                                })
                                            } else if ( challengerActiveGame.rounds[round-1].winner === 'player2' ) {
                                                response.status(200).send({
                                                    winner: 'player1'
                                                })
                                            } else {
                                                response.status(200).send({
                                                    winner: 'null'
                                                })
                                            }
                                                
                                        })
                                }
                            })
                        
                        })

                    })
            
            }
        })

    })
        
}