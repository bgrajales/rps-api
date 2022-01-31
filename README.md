# RPS API README

Api for the Rock Paper Scissors game.

## Heroku enviroment

**Hosted on heroku at https://rpsgame-api-sockets.herokuapp.com/**

> This API contains controllers for the handling of the users games, as well as the users themselves.

> It also has on the root api.js file handling of the websocket for realtime updates of the games and live chat on games.

## For local testing

Create a .env file with the following variables:

```bash
socketPort=4001
JWT_KEY=*generatedJWTKey*
DB_HOST=*dataBaseHost*
DB_PORT=27017
DB_NAME=*databaseName*
DB_USER=*databaseUser*
DB_PASSWORD=*databasePassword*
```