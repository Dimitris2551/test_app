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
/*
exports.enableCORS = function(req, res, next){
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTIONS');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
    next();
};
*/
exports.passHash = function(req, res, next) {
    console.log("in passHash");
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
};

exports.checkRegistration = function(req, res, next) {
    req.registered = false;
    let username = req.body.username;
    console.log(req.body.username);
    console.log(req.body.password);
    if (username) {
        user.findOne({username:username}, (err, doc) => {
            if (!doc && req.body.password) {
                console.log("Did not find user. Registration possible");
                //maybe we need an if(req.body.password)
                req.canRegister = true;
                next();
            }
            else {
                console.log("user found\n" + doc);
                console.log(`doc.secret: ${doc.secret}`);
                req.secret = doc.secret;
                console.log(`the users secret is: ${req.secret}`)
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
        newUser.username = req.body.username;
        newUser.password = req.body.password;
        newUser.secret = req.body.secret;
        newUser.save((err)=> {
            if(!err)
            {
                console.log("user:"+req.body.username+" registered");
                req.registered = true;
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
};

exports.checkLogin = function(req, res, next) {
    let usernameCurr = req.body.username;
    let passwordCurr = req.body.password;
    console.log(passwordCurr);
    console.log(usernameCurr);

    req.canLogin = false;
    if (usernameCurr && passwordCurr)
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
    let token;
    if(req.body.token)
    {
        token = req.body.token;
        console.log("there is a body");
    }
    else
    {
        token = req.query.token;
        console.log("there is not a body");
    }

    req.auth = false;
    let thePath = req.originalUrl.split('?')[0];
    console.log("JWT1 : "+ token);

    jwt.verify(token, secret, function(err, decoded) {
        if (err)
        {
            if (req.canLogin && (thePath === '/user/find'))
            {
                // create a token
                let token = jwt.sign({username: req.body.username}, secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                console.log("JWT2 : "+ token);
                //res.render('login', {token});
                res.status(200).json({token});
                next();
            }
            else
            {
                if(thePath === '/user/find')
                {
                    res.status(200).json({auth:req.auth , message: 'Failed to authenticate token and no valid credentials were given.'});
                }
                next();
            }
        }
        else
        {
            req.auth = true;
            console.log(`req.auth: ${req.auth}`);
            req.body.username = decoded.username;
            console.log(`the decoded token contains the username: ${req.username}`);
            if(thePath === '/user/find')
            {
                res.status(200).json({auth: req.auth, message: 'already logged in'});
            }
            next();
        }
    });
};
