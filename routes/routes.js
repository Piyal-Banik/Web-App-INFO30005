let express = require('express');
let multer = require('multer');
let router = express.Router();
let controllers = require('../controllers/controllers');
let db = require('../modules/db_connection');
let passport = require('passport');
let User = require('../modules/models/user_model');

//MULTER CONFIG: to get file photos to temp server storage
let multerConfig = {

    storage: multer.diskStorage({
        //Setup where the user's file will go
        destination: function(req, file, next){
            next(null, './assets/photo_storage');
        },

        filename: function(req, file, next){
            console.log(file);
            next(null, file.originalname);
        }
    }),

    //A means of ensuring only images are uploaded.
    fileFilter: function(req, file, next){
        if(!file){
            next();
        }
        const image = file.mimetype.startsWith('image/');
        if(image){
            console.log('photo uploaded');
            next(null, true);
        }else{
            console.log("file not supported");

            //TODO:  A better message response to user on failure.
            return next();
        }
    }
};

router.get('/', controllers.fetchIndexPage);

router.get('/login', controllers.fetchLoginPage);

router.post('/auth', passport.authenticate('local', {failureRedirect: '/login'}), function (req, res) {
    console.log("Login as: "+ req.user.username);
    res.redirect("/main");
});

router.post('/signup', controllers.signUpPost);

router.get('/main', controllers.fetchMainPage);

router.get('/main/foodrecipe', controllers.fetchFRPage);

router.get('/main/foodrecipe/searchresults', controllers.fetchFRResultPage);

router.get('/main/foodrecipe/info', controllers.fetchFRInfoPage);

router.get('/main/foodrecipe/submit', controllers.fetchFRSubmitPage);

router.post('/topthumbup', controllers.topThumbUpPost);

router.post('/infothumbup', controllers.infoThumbUpPost);

router.post('/recipeupload', multer(multerConfig).single('image'), controllers.recipePost);

router.get('/main/foodcalendar/', controllers.fetchFCPage);

router.get('/main/foodcalendar/foodoptions', controllers.fetchFCFormPage);

router.post('/main/foodcalendar/foodoptions', controllers.fetchFCFormPost);

router.get('/main/game', controllers.fetchGamePage);

router.get('/main/contact', controllers.fetchContactPage);

router.get('/main/game/market', controllers.fetchMarketPage);

router.post('/main/game/feeding', controllers.updatePiggyAttributes);

router.post('/main/game/plant', controllers.plantFromInventory);

router.post('/upload', multer(multerConfig).single('photo'), function(req,res){
    res.send('Complete!');
});

router.post('/main/game/market/', controllers.fetchMarketUpdate);

router.get('/main/game/learnmore/', controllers.fetchGameLearnMorePage);

module.exports= router;