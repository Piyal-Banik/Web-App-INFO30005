let mongoose = require('mongoose');
let db = require('../db_connection');

//Define a schema
let Schema = mongoose.Schema;

//Define a model for food recipe
let UserModelSchema = new Schema({
    user_id: String,
    email: String,
    username: String,
    password: String,
    create_date: {type: Date, default: Date.now,},
    gold: {type: Number, default: 100},
    inventory: {"banana.qty": {type: Number,default:1},"banana.name": {type: String,default:"banana"},
        "apple.qty": {type: Number,default:1},"apple.name": {type: String,default:"apple"},
        "grapes.qty": {type: Number,default:1},"grapes.name": {type: String,default:"grapes"},
        "hamburger.qty": {type: Number,default:1},"hamburger.name": {type: String,default:"hamburger"},
        "mushroom.qty": {type: Number,default:1},"mushroom.name": {type: String,default:"mushroom"},
        "pear.qty": {type: Number,default:1},"pear.name": {type: String,default:"pear"},
        "fries.qty": {type: Number,default:1},"fries.name": {type: String,default:"fries"},
        "nuggets.qty": {type: Number,default:1},"nuggets.name": {type: String,default:"nuggets"},
        "cola.qty": {type: Number,default:1},"cola.name": {type: String,default:"cola"},
        "orange.qty": {type: Number,default:1},"orange.name": {type: String,default:"orange"},
        "watermelon.qty": {type: Number,default:1},"watermelon.name": {type: String,default:"watermelon"},
        "blueberry.qty": {type: Number,default:1},"blueberry.name": {type: String,default:"blueberry"}},

    farm: {"banana.qty": {type: Number,default:1},"banana.name": {type: String,default:"banana"},
        "apple.qty": {type: Number,default:1},"apple.name": {type: String,default:"apple"},
        "grapes.qty": {type: Number,default:1},"grapes.name": {type: String,default:"grapes"},
        "mushroom.qty": {type: Number,default:1},"mushroom.name": {type: String,default:"mushroom"},
        "pear.qty": {type: Number,default:1},"pear.name": {type: String,default:"pear"},
        "orange.qty": {type: Number,default:1},"orange.name": {type: String,default:"orange"},
        "watermelon.qty": {type: Number,default:1},"watermelon.name": {type: String,default:"watermelon"},
        "blueberry.qty": {type: Number,default:1},"blueberry.name": {type: String,default:"blueberry"}},
    happiness: {type: Number, default: 5},
    illness: {type: Number, default: 0},
    fatness: {type: Number, default: 0},
});


let User = mongoose.model('User', UserModelSchema);

User.createUserInstance =
    function (id, username, password, email) {
        return new User({
            user_id: id,
            username: username,
            password: password,
            email: email,
        })
    };

module.exports = User;

module.exports.authenticate =
    function (username, password, done) {
        console.log("username, password: " + username +", "+password);
        User.findOne({ username: username }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            if (user.password !== password) {
                return done(null, false);
            }
            return done(null, user);
        });
    };

