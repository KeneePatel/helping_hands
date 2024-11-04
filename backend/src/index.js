const express = require('express');
const server = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const Constants = require('./utils/Constants');
const mongodb = require('./config/DatabaseConnection');
const authRoute = require('./routes/AuthRoute');
const profileRoute = require('./routes/ProfileRoute');
const itemRoute = require('./routes/ItemRoute');
const requestRoute = require('./routes/RequestRoute');
const cors = require('cors');

server.use(cors());

const SERVERPORT = process.env.PORT || 8080;
server.use(bodyParser.json({ limit: "50mb" }));
server.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

try{
    mongodb();
}
catch(e){
    console.error(e.message);
}

server.use(bodyParser.json({ limit: "50mb" }));
server.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

server.use('/api/auth', authRoute);
server.use('/profile', profileRoute);
server.use('/item', itemRoute);
server.use('/request', requestRoute);

server.get('/', (req, res) => {
    res.send(Constants.BASEROUTEMSG);
});

server.listen(SERVERPORT, () => {
    console.log('Server is up and running successfully.');
});


