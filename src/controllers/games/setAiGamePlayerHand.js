const { userModel } = require('../../models/user');

module.exports = ( request, response ) => {

    const userId = request.body.userId;

    const gameId = request.body.gameId;
    const round = request.body.round;
    const hand = request.body.hand;
   
    userModel.findOne({
        _id: userId
    }).then( user => {

        user.activeGames.forEach( activeGame => {

            const hands = [ 'r', 'p', 's' ];

            const randomHand = hands[Math.floor(Math.random() * hands.length)];
            
            activeGame.rounds[round-1].player2hand = randomHand;

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
                        response.status(200).json({
                            message: 'success',
                            player2hand: activeGame.rounds[round-1].player2hand
                        });
                    })
                    
            }
        })

    })
        
}