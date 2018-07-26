const mongoose = require('mongoose');


class userModel {
    constructor() {
        const schema = mongoose.Schema;
        //const userSchema
        this.userSchema = schema({
            username: String,
            password: String,
            secret: String
        });
        this.user = mongoose.model('user', this.userSchema);
    }
}

module.exports = userModel;