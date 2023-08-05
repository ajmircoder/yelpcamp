const mongooes = require('mongoose');
const { Schema } = mongooes;
const passportLocalMongoose = require('passport-local-mongoose');
const UserSchema = new Schema({
    email:{
        type: String,
        require: true,
        unique: true
    },
    name:{
        type: String,
        require: true
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongooes.model('User', UserSchema);