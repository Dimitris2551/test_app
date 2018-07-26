
class AuthController {
    constructor (baseApiUrl, router) {
        this.router = router;
        this.setup(baseApiUrl);
    }

    setup(baseApiUrl) {

        this.router.post(`${baseApiUrl}/user/find`, this.userFind.bind(this));
        this.router.get(`${baseApiUrl}/secret`, this.getSecret.bind(this));
    }

    userFind(req, res){
        // find user and login if you find him
        console.log("canLogin: "+req.canLogin);
        res.end();
    }

    getSecret(req, res){
        console.log("in getSecret");
        console.log(`req.auth: ${req.auth}`);
        console.log(`req.secret: ${req.secret}`);
        if(req.auth)
        {
            res.json({secret: req.secret});
        }
        else
        {
            res.json({auth: req.auth, message: "Can't really show you the secret. you need to be logged in for that"});
        }
    }
}

module.exports = AuthController;

