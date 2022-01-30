const jwt = require('jsonwebtoken')

module.exports = () => {
    return (request, response, next) => {
        // Obtenemos token del header
        const token = request.headers.authorization

        try {
            // Valido que el token enviado por el usuario sea correcto
            const decoded = jwt.verify(token, process.env.JWT_KEY)

            // Si el token es correcto, seguimos con el proceso
            if (decoded) {
                next()
            } else {
                response.status(403).json({
                    message: 'Invalid token'
                })
            }
        } catch(error) {
            console.error('Token error', error)
    
            return response.status(403).json({
                message: 'Invalid token'
            })
        }
    }
}