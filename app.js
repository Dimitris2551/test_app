"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const check = require('./middleware/check');
const userModel = require('./models/Models');
const { userController } =  require('./controlers/Controllers');
const crypto = require('crypto');

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Database connected...")
});



let app = express();

//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
//app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));




app.all("/register", (req, res)=> {
    res.render('register');
});


app.all("/login", (req, res)=> {

    res.render('login');
});



app.get('/', (req, res) =>{
    //res.send("Hi good to have you here");
    /*
    res.render('register', {
        title: 'Customers'
    });
    */
    res.render('Welcome');
})


app.use(check.checkRegistration);
app.use(check.checkLogin);

new userController('', app);

app.use(check.passHash);
app.use(check.register);

app.post('/users/add', function(req, res) {
    console.log("form submited");
    console.log("user canRegister:"+req.canRegister);
    res.redirect('/register');
});

app.listen(8080);
