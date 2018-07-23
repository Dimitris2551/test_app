"use strict";
//const bodyParser = require('body-parser');
//const expressValidator = require('express-validator');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const check = require('./middleware/check');
const { userController, authController } =  require('./controlers/Controllers');

mongoose.connect('mongodb://localhost/test');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Database connected...")
});

let app = express();

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended:false}));
//app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.use(check.enableCORS);

app.use('/user/find',check.contentType);
app.use('/user/find',check.checkLogin);
app.use('/user/find',check.login);

app.get('/secret',check.contentType);
app.get('/secret',check.checkLogin);
app.get('/secret',check.login);


app.post('/user/add',check.checkRegistration);
app.post('/user/add',check.passHash);
app.post('/user/add',check.register);

new userController('', app);
new authController('', app);

app.listen(8080);
