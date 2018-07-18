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
    console.log("in passHash");
    if(req.query.password)
    {
        console.log("before" + req.query.password);
        req.query.password = passwordHash.generate(req.query.password);
        console.log("after" + req.query.password);
        next();
    }
    else
    {
        console.log("password field empty");
        next('route');
    }
}

exports.checkRegistration = function(req, res, next) {
    let username = req.query.username;
    console.log(req.query.username);
    console.log(req.query.password);
    if (username) {
        let newUser = new theUserModel.user;
        user.findOne({username:username}, (err, doc) => {
            if (!doc && req.query.password) {
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
    req.registered = false;
    if (req.canRegister)
    {
        let newUser = new user();
        newUser.username = req.query.username;
        newUser.password = req.query.password;
        newUser.save((err)=> {
            if(!err)
            {
                console.log("user:"+req.query.username+" registered");
                req.registered = true;
                next();
            }
            else
            {
                console.log("could not save user"+req.query.username);
                next();
            }
        });
    }
    else
    {
        console.log("registration impossible\n" +req.query.username);
        req.registered = true;
        next();
    }
}

exports.checkLogin = function(req, res, next) {
    let usernameCurr = req.query.username;
    let passwordCurr = req.query.password;
    console.log(passwordCurr);
    console.log(usernameCurr);
    req.canLogin = false;
    if (usernameCurr && req.query.password)
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
    req.auth = false;
    console.log("JWT : "+ token);
    /*
    if (!token)
    {
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    */
    jwt.verify(token, secret, function(err, decoded) {
        if (err)
        {
            if (req.canLogin)
            {
                // create a token
                let token = jwt.sign({username: req.query.username}, secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                console.log("JWT : "+ token);
                //res.render('login', {token});
                res.status(200).json({token});
                next();
            }
            else
            {
                res.status(500).send({auth:req.auth , message: 'Failed to authenticate token and no valid credentials were given.'});
                next();
            }
        }
        else
        {
            req.auth = true;
            res.status(200).json({auth:req.auth, message:'already logged in'});
        }
    });
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
    let usernameCurr = req.query.username;
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