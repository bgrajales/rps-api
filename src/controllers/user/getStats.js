const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const userId = request.query.userId

    userModel.findOne({
        _id: userId
    }).then(user => {

        if (user.gamesHistory.length > 0) {
                    
        const gamesPlayed = user.gamesHistory.length

        const gamesWon = user.gamesHistory.filter(game => game.win === 1).length

        let winningStreak = 0
        let stop = false

        if (gamesWon > 0) {

            user.gamesHistory.forEach( (game, index) => {

                if ( index === 0 && game.win === 0 ) {
                    winningStreak = 0
                    stop = true
                } else {
                    if ( game.win === 1 && !stop ) {
                        winningStreak++
                        stop = false
                    } else {
                        stop = true
                    }
                }
            })

        }

        response.json({
            gamesPlayed,
            gamesWon,
            winningStreak
        })
    } else {
        response.json({
            gamesPlayed: 0,
            gamesWon: 0,
            winningStreak: 0,
        })
    }
    }).catch(error => {
        console.error(error)
        response.status(500).end()
    })

}