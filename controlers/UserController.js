const check = require('../middleware/check');

class UserController {
    constructor (baseApiUrl, router) {
        this.router = router;
        this.setup(baseApiUrl);
    }

    setup(baseApiUrl) {
        this.router.post(`${baseApiUrl}/user/find`, this.userFind.bind(this));
        this.router.post(`${baseApiUrl}/user/add`, this.userAdd.bind(this));
    }

    userFind(req, res){
        // find user and login if you find him
        //check.loginIfOk(req);
        //res.render('login');
        console.log("canLogin: "+req.canLogin);
        //res.redirect('/login');
        res.end();
    }

    userAdd(req, res){
        console.log("form submited");
        console.log("user canRegister:"+req.canRegister);
        console.log("registered: "+req.registered)
        res.status(200).json({registered: req.registered});
        //res.redirect('/register');
        //res.end();
    }

}

module.exports = UserController;

