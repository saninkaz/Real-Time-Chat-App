const dotenv = require("dotenv");
dotenv.config();

const dbconfig =  require('./config/dbconfig');

const server= require("./app");

const PORT =process.env.PORT;

server.listen(PORT,() => {
    console.log(`Listening on PORT ${PORT}`);
})