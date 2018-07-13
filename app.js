"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const check = require('./middleware/check');
const userModel = require('./models/Models');
const { userController } =  require('./controlers/Controllers');

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Database connected...")
});
let newUserModel = new userModel();
const user = newUserModel.user;

let app = express();
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
//app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.post('/users/add', function(req, res) {
    console.log("form submited");
    let username = req.body.username;
    let password = req.body.username;

    check.registerIfOk(username, password);
    res.redirect('/register');
});

app.all("/register", (req, res)=> {
    res.render('register');
});


app.all("/login", (req, res)=> {
    res.render('login');
});

new userController('', app);

app.get('/', (req, res) =>{
    //res.send("Hi good to have you here");
    /*
    res.render('register', {
        title: 'Customers'
    });
    */
    res.render('Welcome');
})



app.listen(8080);