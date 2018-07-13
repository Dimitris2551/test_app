const check = require('../middleware/check');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const userModel = require('../models/userModel')

const user = newUserModel.user;

exports.isfound = function(req) {
    let username = req.body.username;
    let password = req.body.password;
    console.log(usernameCurr);
    if (usernameCurr)
    {
        user.findOne({username}, (err, doc) => {
            if (!doc)
            {
                console.log("Did not find user. login invalid");
            }
            else
            {
                console.log("user credentials valid login can occur\n" + doc);
            }
        });
    }
    else
    {
        console.log("field is empty");
    }

}

exports.registerIfOk = function(usernameCurr, password){
    console.log(usernameCurr);
    if (usernameCurr)
    {
        user.findOne({username: usernameCurr}, (err, doc) => {
            if (!doc)
            {
                console.log("Did not find user so you can register");
                let newUser = new user();
                newUser.username = usernameCurr;
                newUser.password = password;
                newUser.save((err)=> {
                    if(!err)
                    {
                        console.log("user:"+usernameCurr+" registered");
                    }
                    else
                    {
                        console.log("could not save user"+usernameCurr);
                    }
                });
            }
            else
            {
                console.log("username already exists\n" + doc);
            }
        });
    }
    else
    {
        console.log("field is empty");
    }

}

exports.loginIfOk = function loginIfOk(req) {
    let usernameCurr = req.body.username;
    console.log(usernameCurr);
    if (usernameCurr)
    {
        user.findOne({username: usernameCurr}, (err, doc) => {
            if (!doc)
            {
                console.log("Did not find user. login invalid");
            }
            else
            {
                console.log("user credentials valid login can occur\n" + doc);
            }
        });
    }
    else
    {
        console.log("field is empty");
    }

}
