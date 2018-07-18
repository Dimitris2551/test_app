const check = require('../middleware/check');

class UserController {
    constructor (baseApiUrl, router) {
        this.router = router;
        this.setup(baseApiUrl);
    }

    setup(baseApiUrl) {
        this.router.post(`${baseApiUrl}/user/find`, this.userFind.bind(this));
    }

    userFind(req, res){
        // find user and login if you find him
        //check.loginIfOk(req);
        //res.render('login');
        console.log("canLogin: "+req.canLogin);
        //res.redirect('/login');
        res.end();
    }

}

module.exports = UserController;

