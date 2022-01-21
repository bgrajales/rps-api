module.exports = () => {
    if (process.env.DB_USER && process.env.DB_PASSWORD) {
        // mongodb+srv://<username>:<password>@todoscluster.znxef.mongodb.net/test
        return `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`
    } else {
        return `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
    }
     
}