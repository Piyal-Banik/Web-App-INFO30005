let express = require('express');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let app = express();
let router = require('./routes/routes');

// const fakeUsers = require('./modules/db');

const PORT = process.env.PORTno || 3000;

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(cookieParser("foo"));

app.use(express.static('assets'));

app.use(express.static('views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret: "foo", resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());


// passport config
let User = require('./modules/models/user_model');
passport.use(new LocalStrategy(function (username, password, done) {
    console.log("username, password: " + username +", "+password);
    User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (user.password !== password) { return done(null, false); }
        return done(null, user);
    });
}));
// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user.id);
    // where is this user.id going? Are we supposed to access this anywhere?
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

app.use('/', router);

app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.listen(PORT, function(){
    console.log(`Express listening on port ${PORT}`);
});