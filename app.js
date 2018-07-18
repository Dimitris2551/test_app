"use strict";
const express = require('express');
//const bodyParser = require('body-parser');
const path = require('path');
//const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const check = require('./middleware/check');
const userModel = require('./models/Models');
const { userController } =  require('./controlers/Controllers');
//const jwt = require('jsonwebtoken');

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Database connected...")
});



let app = express();

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended:false}));
//app.use(express.static(path.join(__dirname, 'public')));
//app.set('view engine', 'ejs');
//app.set('views', path.join(__dirname,'views'));



/*
app.all("/register", (req, res)=> {
    res.render('register');
});


app.all("/login", (req, res)=> {

    res.render('login');
});
*/

/*
app.get('/', (req, res) =>{
    res.render('Welcome');
})
*/

//let router = express.Router();
//app.use(router);
app.use('/user/find',check.contentType);
app.use('/user/find',check.checkLogin);
app.use('/user/find',check.login);



app.post('/user/add',check.checkRegistration);
app.post('/user/add',check.passHash);
app.post('/user/add',check.register);

new userController('', app);

/*
app.post('/user/add', function(req, res) {
    console.log("form submited");
    console.log("user canRegister:"+req.canRegister);
    console.log("registered: "+req.registered)
    res.status(200).json({registered: req.registered});
    //res.redirect('/register');
    //res.end();
});
*/
app.listen(8080);
