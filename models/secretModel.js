const mongoose = require('mongoose');


class secretModel {
    constructor() {
        const schema = mongoose.Schema;
        //const userSchema
        this.secretSchema = schema({
            username: String,
            title: String,
            secret: String
        });
        this.secret = mongoose.model('secret', this.secretSchema);
    }
}

module.exports = secretModel;
