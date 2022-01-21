const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const userId = request.query.userId

    userModel.findOne({
        _id: userId
    }).then(user => {

        if (user.gamesHistory.length > 0) {
                    
        const gamesPlayed = user.gamesHistory.length

        const gamesWon = user.gamesHistory.filter(game => game.win === 1).length

        let winningStreak = {
            currentStreak: 0,
            unbroken: true,
        }

        if (gamesWon > 0) {

        for (let i = user.gamesHistory.length-1; i > 0; i--) {
            if (user.gamesHistory[i].win === 1 && winningStreak.unbroken) {
                winningStreak = winningStreak + 1
            } else {
                winningStreak = 0
                winningStreak.unbroken = false
            }
        }

        }

        response.json({
            gamesPlayed,
            gamesWon,
            winningStreak: winningStreak.currentStreak,
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