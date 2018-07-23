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

exports.enableCORS = function(req, res, next){
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
};

exports.checkRegistration = function(req, res, next) {
    req.registered = false;
    let username = req.query.username;
    console.log(req.query.username);
    console.log(req.query.password);
    if (username) {
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
                req.registered = true;
                next();
            }
        });
    }
    else
    {
        req.canRegister = false;
        next();
    }
};

exports.register = function(req, res, next) {
    if (req.canRegister && (!req.registered))
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
        next();
    }
};

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
};

exports.login = function(req, res, next) {
    let token = req.headers['x-access-token'];
    req.auth = false;
    let thePath = req.originalUrl.split('?')[0];
    console.log("JWT : "+ token);

    jwt.verify(token, secret, function(err/*, decoded*/) {
        if (err)
        {
            if (req.canLogin && (thePath === '/user/find'))
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
                if(thePath === '/user/find')
                {
                    res.status(500).json({auth:req.auth , message: 'Failed to authenticate token and no valid credentials were given.'});
                }
                next();
            }
        }
        else
        {
            req.auth = true;
            if(thePath === '/user/find')
            {
                res.status(200).json({auth: req.auth, message: 'already logged in'});
            }
            next();
        }
    });
};
