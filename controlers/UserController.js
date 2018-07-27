
class UserController {
    constructor (baseApiUrl, router) {
        this.router = router;
        this.setup(baseApiUrl);
    }

    setup(baseApiUrl) {
        this.router.post(`${baseApiUrl}/user/add`, this.userAdd.bind(this));
    }

    userAdd(req, res){
        console.log("form submitted");
        console.log("user canRegister:"+req.canRegister);
        console.log("registered: "+req.registered)
        res.status(200).json({registered: req.registered});
    }

}

module.exports = UserController;
