const check = require('../middleware/check');

class UserController {
    constructor (baseApiUrl, app) {
        this.app = app;
        this.setup(baseApiUrl);
    }

    setup(baseApiUrl) {
        this.app.post(`${baseApiUrl}/user/find`, this.userFind.bind(this));
    }

    userFind(req, res){
        // find user and login if you find him
        //check.loginIfOk(req);
        //res.render('login');
        console.log("canLogin: "+req.canLogin);
        res.redirect('/login');
    }

}

module.exports = UserController;

