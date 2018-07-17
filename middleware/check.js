const check = require('../middleware/check');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

const theUserModel = new userModel();
const user = theUserModel.user;

const passwordHash = require('password-hash');
const secret = "9876";

exports.contentType = function(req, res, next) {
  res.header('Content-Type', 'application/json');
  next();
};

exports.passHash = function(req, res, next) {
    if(req.body.password)
    {
        console.log("before" + req.body.password);
        req.body.password = passwordHash.generate(req.body.password);
        console.log("after" + req.body.password);
        next();
    }
    else
    {
        console.log("password field empty");
        next('route');
    }
}

exports.checkRegistration = function(req, res, next) {
    let username = req.body.username;
    if (username) {
        let newUser = new theUserModel.user;
        user.findOne({username:username}, (err, doc) => {
            if (!doc && req.body.password) {
                console.log("Did not find user. Registration possible");
                //maybe we need an if(req.body.password)
                req.canRegister = true;
                next();
            }
            else {
                console.log("user found\n" + doc);
                req.canRegister = false;
                next();
            }
        });
    }
    else
    {
        req.canRegister = false;
        next();
    }
}

exports.register = function(req, res, next) {
    if (req.canRegister)
    {
        let newUser = new user();
        newUser.username = req.body.username;
        newUser.password = req.body.password;
        newUser.save((err)=> {
            if(!err)
            {
                console.log("user:"+req.body.username+" registered");
                next();
            }
            else
            {
                console.log("could not save user"+req.body.username);
                next();
            }
        });
    }
    else
    {
        console.log("registration impossible\n" +req.body.username);
        next();
    }
}

exports.checkLogin = function(req, res, next) {
    let usernameCurr = req.body.username;
    let passwordCurr = req.body.password;
    console.log(passwordCurr);
    console.log(usernameCurr);
    req.canLogin = false;
    if (usernameCurr && req.body.password)
    {
        user.findOne({username:usernameCurr}, (err, doc) => {
            if (!doc)
            {
                console.log("user not found");
                next();
            }
            else
            {
                if(passwordHash.verify(passwordCurr, doc.password))
                {
                    console.log("user credentials valid login can occur\n" + doc);
                    req.canLogin = true;
                    next();
                }
                else
                {
                    console.log("Username and password combination incorrect. login invalid");
                    next();
                }
            }

        });
    }
    else
    {
        console.log("username or password field is empty");
        next();
    }
}

exports.login = function(req, res, next) {
    let token = req.headers['x-access-token'];

    console.log("JWT : "+ token);
    /*
    if (!token)
    {
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    */
    jwt.verify(token, secret, function(err, decoded) {
        if (err) {
            if (req.canLogin) {
                // create a token
                let token = jwt.sign({username: req.body.username}, secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                console.log("JWT : "+ token);
                //res.render('login', {token});
                res.status(200).json({token});
                res.end();
                next();
            }
            else
            {
                res.status(500).send({auth: false, message: 'Failed to authenticate token.'});
                next();
            }
        }
        res.status(200).send(decoded);
    });
    //res.status(200).send(decoded);
    next();

}
/*
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
        user.findOne({username: usernameCurr, password:req.body.password}, (err, doc) => {
            if (!doc)
            {
                console.log("Username and password compination encorrect. login invalid");
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
*/