let db = require('../modules/db_connection');
let FoodRecipe = require('../modules/models/food_recipe_model');
let User = require('../modules/models/user_model');
let FoodRecord = require('../modules/models/food_record');

module.exports.fetchIndexPage =
    function (req, res) {
        res.render('ejs/index.ejs');
    };

module.exports.fetchLoginPage =
    function (req, res) {
        res.render('ejs/login.ejs');
    };

module.exports.signUpPost =
    function (req, res) {
        if(req.body.signUp === "signUp") {
            let id = id_generate();
            let username = req.body.username;
            let password = req.body.password;
            let email = req.body.email;

            let newUserInstance = User.createUserInstance(id, username, password, email);
            newUserInstance.save(function (err) {
                if (err) return handleError(err);
                // saved!
                console.log("Successfully created a new account!!");

            });
            return res.redirect("/login");
        }

    };

module.exports.fetchMainPage =
    function(req,res){

        if (!req.user) {
            res.redirect("/");
        }
        else {
            res.render('ejs/main.ejs', {
                username: req.user.username,
                title: "PIGGY PIGGY",
                text: "How can we raise kids' awareness of the benefits of fresh food so they can make better choices?",
            });
        }
    };

module.exports.fetchFRPage =
    function (req, res) {
        let search_title = req.query.title;
        if(!req.user){
            res.redirect("/")
        }
        else if (req.query.search === "Searching") {
            res.redirect("/main/foodrecipe/searchresults?title="+search_title);
        }
        else {
            db.collection("foodrecipes").find().sort({health_like_num:-1}).limit(3).toArray(function (err, recipe) {
                let h_path1;
                let d_path1;
                let h_path2;
                let d_path2;
                let h_path3;
                let d_path3;
                let h_active1="";
                let h_active2="";
                let h_active3="";
                let d_active1="";
                let d_active2="";
                let d_active3="";

                if(recipe[0].health_like_list.indexOf(req.user.user_id) > -1){
                    h_path1 = "/images/like_active.png";
                    h_active1 = "like-active";
                }
                else {
                    h_path1 = "/images/like.png";
                }
                if(recipe[0].delicious_like_list.indexOf(req.user.user_id) > -1){
                    d_path1 = "/images/like_active.png";
                    d_active1 = "like-active";
                }
                else {
                    d_path1 = "/images/like.png";
                }
                if(recipe[1].health_like_list.indexOf(req.user.user_id) > -1){
                    h_path2 = "/images/like_active.png";
                    h_active2 = "like-active";
                }
                else {
                    h_path2 = "/images/like.png";
                }
                if(recipe[1].delicious_like_list.indexOf(req.user.user_id) > -1){
                    d_path2 = "/images/like_active.png";
                    d_active2 = "like-active";
                }
                else {
                    d_path2 = "/images/like.png";
                }
                if(recipe[2].health_like_list.indexOf(req.user.user_id) > -1){
                    h_path3 = "/images/like_active.png";
                    h_active3 = "like-active";
                }
                else {
                    h_path3 = "/images/like.png";
                }
                if(recipe[2].delicious_like_list.indexOf(req.user.user_id) > -1){
                    d_path3 = "/images/like_active.png";
                    d_active3 = "like-active";
                }
                else {
                    d_path3 = "/images/like.png";
                }
                res.render('ejs/food_recipes.ejs', {
                    username: req.user.username,
                    title: "Food Recipe",
                    id_top1: recipe[0].recipe_id,
                    healthy_no_one:recipe[0].health_like_num,
                    delicious_no_one: recipe[0].delicious_like_num,
                    path_one: recipe[0].image_path,
                    name_one: recipe[0].title.toUpperCase(),
                    id_top2: recipe[1].recipe_id,
                    healthy_no_two: recipe[1].health_like_num,
                    delicious_no_two: recipe[1].delicious_like_num,
                    path_two: recipe[1].image_path,
                    name_two: recipe[1].title.toUpperCase(),
                    id_top3: recipe[2].recipe_id,
                    healthy_no_three: recipe[2].health_like_num,
                    delicious_no_three: recipe[2].delicious_like_num,
                    path_three: recipe[2].image_path,
                    name_three: recipe[2].title.toUpperCase(),
                    h_path1: h_path1,
                    h_path2: h_path2,
                    h_path3: h_path3,
                    d_path1: d_path1,
                    d_path2: d_path2,
                    d_path3: d_path3,
                    h_active1: h_active1,
                    h_active2: h_active2,
                    h_active3: h_active3,
                    d_active1: d_active1,
                    d_active2: d_active2,
                    d_active3: d_active3,
                });
            });
        }
    };

module.exports.fetchFRResultPage =
    function (req, res) {
        if(!req.user){
            res.redirect("/")
        }
        else if (req.query.search === "Searching") {
            let search_title = req.query.title;
            res.redirect("/main/foodrecipe/searchresults?title="+search_title);
        }
        else {
            let page_title = "We Find These For You"
            let key_words = req.query.title;
            // query substring on titles of recipes, case-insensitive
            FoodRecipe.find({title: {$regex: key_words, $options: 'i'}}, function (err, results) {
                if (!results[0]) {
                    console.log("NO RESULTS FOUND");
                    res.render('ejs/recipe_search.ejs', {
                        username: req.user.username,
                        title: page_title,
                        notfound: "NO MATCH RESULTS, PLEASE TRY AGAIN",
                        result_l: "",
                    })
                }
                else {
                    let i = 0;
                    let result_l = [];
                    while (results[i]) {
                        result_l[i] = [results[i].recipe_id, results[i].title];
                        i += 1;
                    }
                    res.render('ejs/recipe_search.ejs', {
                        username: req.user.username,
                        title: page_title,
                        notfound: "",
                        result_l: result_l,
                    })
                }
            });
        }

    };

module.exports.fetchFRInfoPage =
    function (req, res) {
        if(!req.user){
            res.redirect("/")
        }
        else {
            let id = req.query.id;
            if (id) {
                FoodRecipe.findOne({recipe_id: id}, function (err, recipe) {
                    if (err) return handleError(err);
                    if (recipe) {
                        let h_path;
                        let h_active_class = "";
                        let d_path;
                        let d_active_class = "";
                        if(recipe.health_like_list.indexOf(req.user.user_id) > -1){
                            h_path = "/images/like_active.png";
                            h_active_class = "like-active";
                        }
                        else {
                            h_path = "/images/like.png";
                        }
                        if(recipe.delicious_like_list.indexOf(req.user.user_id) > -1){
                            d_path = "/images/like_active.png";
                            d_active_class = "like-active";
                        }
                        else {
                            d_path = "/images/like.png";
                        }
                        res.render('ejs/recipe_info.ejs', {
                            username: req.user.username,
                            title: recipe.title.toUpperCase(),
                            creator: recipe.username,
                            imagePath: recipe.image_path,
                            ingredients: recipe.ingredients,
                            steps: recipe.steps,
                            h_path: h_path,
                            h_likes: recipe.health_like_num,
                            h_active_class: h_active_class,
                            d_path: d_path,
                            d_likes: recipe.delicious_like_num,
                            d_active_class: d_active_class,
                            r_id: id,
                        });
                    }
                    else {
                        res.redirect("/main/foodrecipe");
                    }
                })
            }
            else {
                res.redirect("/main/foodrecipe");
            }
        }

    };

module.exports.fetchFRSubmitPage =
    function (req, res) {
        if(!req.user){
            res.redirect("/")
        }
        else  {
            res.render('ejs/recipe_submit_form.ejs', {
                username: req.user.username,
                title: "MY RECIPE FORM",
            });
        }

    };

module.exports.topThumbUpPost =
    function (req, res) {
        let id;
        if (req.body.id_top1) {
            id = req.body.id_top1;
        }
        else if (req.body.id_top2) {
            id = req.body.id_top2;
        }
        else {
            id = req.body.id_top3;
        }
        let action = req.body.action;
        thumbUpUpdate(req, id, action);
        res.redirect("/main/foodrecipe");
    };

module.exports.infoThumbUpPost =
    function (req, res) {
        let id = req.body.r_id;
        let action = req.body.action;
        thumbUpUpdate(req, id, action);
        res.redirect("/main/foodrecipe/info?id="+id);

    };

module.exports.recipePost =
    function (req, res) {
        // create an instance for the latest recipe submitted
        if (req.body.submit === "Submitted" ) {
            let id = id_generate();
            let name = req.body.name;
            let in_l = [];
            let in_count = 1;
            while (req.body["in"+in_count]) {
                in_l[in_count-1] = req.body["in"+in_count];
                in_count += 1;
            }
            let step_l = [];
            let step_count = 1;
            while (req.body["step"+step_count]) {
                step_l[step_count-1] = req.body["step"+step_count];
                step_count += 1;
            }
            let img_path;
            if (!req.file) {
                img_path = "/images/noimage.jpg";
            }
            else {
                img_path = "/photo_storage/" + req.file.originalname;
            }
            let recipeModel = FoodRecipe.createRecipeInstance(id, name, in_l, step_l, req.user.user_id, req.user.username, img_path);
            // Save the new model instance, passing a callback
            recipeModel.save(function (err) {
                if (err) return handleError(err);
                // saved!
                console.log("Successfully saved the recipe!!");

            });
        }
        res.redirect("/main/foodrecipe");

    };

module.exports.fetchFCPage =
    function (req, res) {
        if(!req.user){
            res.redirect("/")
        }
        else{
            FoodRecord.find({user_id: req.user.user_id}, function (err, records) {
                if (err) return handleError(err);
                res.render('ejs/calendar.ejs', {
                    username: req.user.username,
                    title: "FOOD CALENDAR",
                    records: records,
                });
            });
        }
    };

module.exports.fetchFCFormPage =
    function (req, res) {
        if(!req.user){
            res.redirect("/")
        }
        else {
            var date = req.query.date;
            FoodRecord.findOne({user_id: req.user.user_id, date: date}, function (err, record) {
                if (err) return handleError(err);
                if (record) {
                    res.render('ejs/view_foodRecord.ejs', {
                        username: req.user.username,
                        title: "Daily Record",
                        date: date,
                        breakfast: record.breakfast,
                        lunch: record.lunch,
                        dinner: record.dinner,
                        comment: record.comment
                    });
                }
                else{
                    res.render('ejs/food_options.ejs', {
                        username: req.user.username,
                        title: "DAILY MEAL",
                    });
                }
            })
        }
};

module.exports.fetchFCFormPost =
    function (req, res) {
        if(req.body.submit === "Submit") {
            let id = id_generate();
            let date = req.query.date;
            let breakfast = req.body.breakfast;
            let lunch = req.body.lunch;
            let dinner = req.body.dinner;
            let comment = req.body.comment;
            let newFoodInstance = FoodRecord.createFoodInstance(req.user.user_id,id,date, breakfast,lunch,dinner,comment);
            newFoodInstance.save(function (err) {
                if (err) return handleError(err);
                // saved!
                console.log("Successfully created a new record!!");

            });
            return res.redirect("/main/foodcalendar?date="+date);
        }
    };

module.exports.fetchGamePage =
    function (req, res) {
        if(!req.user){
            res.redirect("/")
        }
        else {
            let collection = db.collection('users');
            let list = collection.find({user_id: req.user.user_id}).toArray();
            let happiness = 0;
            let illness = 0;
            let fatness = 0;
            let ill_pig = "ill_pig.png";
            let fat_pig = "fat_pig.png";
            let angry_pig = "angry_pig.png";
            let mypig = "pig.png";

            list.then(function(result) {
                if(result[0].happiness >= 0 && result[0].happiness <= 10){
                    happiness = result[0].happiness;
                }else if(result[0].happiness >= 10){
                    happiness = 10;
                }

                if(result[0].illness >= 0 && result[0].illness <= 10){
                    illness = result[0].illness;
                }else if(result[0].illness >= 10){
                    illness = 10;
                }

                if(result[0].fatness >= 0 && result[0].fatness <= 10 ){
                    fatness = result[0].fatness;
                }else if(result[0].fatness >= 10){
                    fatness = 10;
                }
                if(result[0].fatness >= 7){
                    mypig = fat_pig;
                }else if(result[0].illness >= 5){
                    mypig = ill_pig;
                }else if(result[0].happiness <= 4){
                    mypig = angry_pig;
                }


                res.render('ejs/game.ejs', {
                    username: req.user.username,
                    title: "FEED THE PIGGY",

                    inventory1:result[0].inventory.banana.name,
                    inventoryNum1:result[0].inventory.banana.qty,
                    inventory2:result[0].inventory.apple.name,
                    inventoryNum2:result[0].inventory.apple.qty,
                    inventory3:result[0].inventory.grapes.name,
                    inventoryNum3:result[0].inventory.grapes.qty,
                    inventory4:result[0].inventory.hamburger.name,
                    inventoryNum4:result[0].inventory.hamburger.qty,
                    inventory5:result[0].inventory.mushroom.name,
                    inventoryNum5:result[0].inventory.mushroom.qty,
                    inventory6:result[0].inventory.pear.name,
                    inventoryNum6:result[0].inventory.pear.qty,
                    inventory7:result[0].inventory.fries.name,
                    inventoryNum7:result[0].inventory.fries.qty,
                    inventory8:result[0].inventory.nuggets.name,
                    inventoryNum8:result[0].inventory.nuggets.qty,
                    inventory9:result[0].inventory.blueberry.name,
                    inventoryNum9:result[0].inventory.blueberry.qty,
                    inventory10:result[0].inventory.cola.name,
                    inventoryNum10:result[0].inventory.cola.qty,
                    inventory11:result[0].inventory.watermelon.name,
                    inventoryNum11:result[0].inventory.watermelon.qty,
                    inventory12:result[0].inventory.orange.name,
                    inventoryNum12:result[0].inventory.orange.qty,

                    pig_img:mypig,
                    mygold: result[0].gold,
                    farm1:result[0].farm.apple.name,
                    farmqty1: result[0].farm.apple.qty,
                    farm2:result[0].farm.banana.name,
                    farmqty2: result[0].farm.banana.qty,
                    farm3:result[0].farm.grapes.name,
                    farmqty3: result[0].farm.grapes.qty,
                    farm4:result[0].farm.mushroom.name,
                    farmqty4: result[0].farm.mushroom.qty,
                    farm5:result[0].farm.pear.name,
                    farmqty5: result[0].farm.pear.qty,
                    farm6:result[0].farm.blueberry.name,
                    farmqty6: result[0].farm.blueberry.qty,
                    farm7:result[0].farm.watermelon.name,
                    farmqty7: result[0].farm.watermelon.qty,
                    farm8:result[0].farm.orange.name,
                    farmqty8: result[0].farm.orange.qty,

                    happiness:happiness,
                    illness:illness,
                    fatness:fatness,

                });
            })
        }
    };

module.exports.fetchContactPage =
    function (req, res) {
        if(!req.user){
            res.redirect("/")
        }
        else {
            res.render('ejs/main.ejs', {
                title: "PIGGY PIGGY",
                username: req.user.username,
                text: "Please Contact: junhany@student.unimelb.edu.au",
            });
        }
    };


module.exports.fetchMarketPage =
    function (req, res) {
        if(!req.user){
            res.redirect("/")
        }
        else {
            let collection = db.collection('fooditems');
            let list = collection.find({}).toArray();
            let myusers = db.collection('users');
            let myuserlist = myusers.find({user_id: req.user.user_id}).toArray();
            let mygold = 0;
            myuserlist.then(function(userinfo) {
                mygold = userinfo[0].gold;

                list.then(function(result) {
                    let qty1 = result[0].qty;
                    let qty2 = result[1].qty;
                    let qty3 = result[2].qty;
                    let qty4 = result[3].qty;

                    let qty5 = result[4].qty;
                    let qty6 = result[5].qty;
                    let qty7 = result[6].qty;
                    let qty8 = result[7].qty;
                    let qty9 = result[8].qty;
                    let qty10 = result[9].qty;
                    let qty11 = result[10].qty;
                    let qty12 = result[11].qty;

                    res.render('ejs/market.ejs', {
                        username: req.user.name,
                        title: "Market Place",

                        imgpath1: result[0].item,
                        myqty1:qty1,
                        price1: result[0].price,

                        imgpath2: result[1].item,
                        price2:result[1].price,
                        myqty2:qty2,

                        imgpath3: result[2].item,
                        price3:result[2].price,
                        myqty3:qty3,

                        imgpath4: result[3].item,
                        price4:result[3].price,
                        myqty4:qty4,

                        imgpath5: result[4].item,
                        price5:result[4].price,
                        myqty5:qty5,

                        imgpath6: result[5].item,
                        price6:result[5].price,
                        myqty6:qty6,

                        imgpath7: result[6].item,
                        price7:result[6].price,
                        myqty7:qty7,

                        imgpath8: result[7].item,
                        price8:result[7].price,
                        myqty8:qty8,

                        imgpath9: result[8].item,
                        price9:result[8].price,
                        myqty9:qty9,

                        imgpath10: result[9].item,
                        price10:result[9].price,
                        myqty10:qty10,

                        imgpath11: result[10].item,
                        price11:result[10].price,
                        myqty11:qty11,

                        imgpath12: result[11].item,
                        price12:result[11].price,
                        myqty12:qty12,



                        goldqty:userinfo[0].gold,
                    });
                })
            });

        }

    };

module.exports.updatePiggyAttributes =
    function (req, res) {
        let item = req.body.item;
        db.collection("fooditems").findOne({item: item}, function (err, fooditem) {
            if (err) return HandleError(err);
            if (fooditem) {
                let happiness = fooditem.happiness;
                let illness = fooditem.illness;
                let fatness = fooditem.fatness;
                db.collection("users").findOne({user_id: req.user.user_id}, function (err, user) {
                    if (err) return HandleError(err);
                    if (user) {
                        if(item.localeCompare("banana") == 0 && req.user.farm.banana.qty > 0){
                            db.collection("users").update({user_id: req.user.user_id},
                                {$set:
                                        {"farm.banana.qty": req.user.farm.banana.qty - 1, "gold": req.user.gold + 10}
                                });
                            if(user.happiness + happiness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"happiness": 10}
                                    });
                            }else if (user.happiness + happiness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"happiness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"happiness": happiness}
                                    });
                            }
                            if(user.illness + illness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"illness": 10}
                                    });
                            }else if (user.illness + illness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"illness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"illness": illness}
                                    });
                            }
                            if(user.fatness + fatness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"fatness": 10}
                                    });
                            }
                            else if (user.fatness + fatness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"fatness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"fatness": fatness}
                                    });
                            }
                        }
                        else if(item.localeCompare("grapes") == 0 && req.user.farm.grapes.qty > 0){
                            db.collection("users").update({user_id: req.user.user_id},
                                {$set:
                                        {"farm.grapes.qty": req.user.farm.grapes.qty - 1, "gold": req.user.gold + 100}
                                });
                            if(user.happiness + happiness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"happiness": 10}
                                    });
                            }else if (user.happiness + happiness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"happiness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"happiness": happiness}
                                    });
                            }
                            if(user.illness + illness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"illness": 10}
                                    });
                            }else if (user.illness + illness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"illness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"illness": illness}
                                    });
                            }
                            if(user.fatness + fatness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"fatness": 10}
                                    });
                            }
                            else if (user.fatness + fatness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"fatness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"fatness": fatness}
                                    });
                            }

                        }
                        else if(item.localeCompare("apple") == 0 && req.user.farm.apple.qty != 0) {
                            db.collection("users").update({user_id: req.user.user_id},
                                {$set:
                                        {"farm.apple.qty": req.user.farm.apple.qty - 1, "gold": req.user.gold + 5}
                                });
                            if(user.happiness + happiness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"happiness": 10}
                                    });
                            }else if (user.happiness + happiness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"happiness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"happiness": happiness}
                                    });
                            }
                            if(user.illness + illness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"illness": 10}
                                    });
                            }else if (user.illness + illness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"illness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"illness": illness}
                                    });
                            }
                            if(user.fatness + fatness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"fatness": 10}
                                    });
                            }
                            else if (user.fatness + fatness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"fatness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"fatness": fatness}
                                    });
                            }
                        }else if(item.localeCompare("hamburger") == 0 && req.user.inventory.hamburger.qty > 0) {

                            db.collection("users").update({user_id: req.user.user_id},
                                {
                                    $set:
                                        {"inventory.hamburger.qty": req.user.inventory.hamburger.qty - 1, "gold": req.user.gold + 30}
                                });
                            if(user.happiness + happiness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"happiness": 10}
                                    });
                            }else if (user.happiness + happiness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"happiness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"happiness": happiness}
                                    });
                            }
                            if(user.illness + illness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"illness": 10}
                                    });
                            }else if (user.illness + illness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"illness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"illness": illness}
                                    });
                            }
                            if(user.fatness + fatness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"fatness": 10}
                                    });
                            }
                            else if (user.fatness + fatness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"fatness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"fatness": fatness}
                                    });
                            }
                        }
                        else if(item.localeCompare("fries") == 0 && req.user.inventory.fries.qty > 0) {
                            db.collection("users").update({user_id: req.user.user_id},
                                {
                                    $set:
                                        {"inventory.fries.qty": req.user.inventory.fries.qty - 1, "gold": req.user.gold + 10}
                                });
                            if(user.happiness + happiness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"happiness": 10}
                                    });
                            }else if (user.happiness + happiness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"happiness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"happiness": happiness}
                                    });
                            }
                            if(user.illness + illness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"illness": 10}
                                    });
                            }else if (user.illness + illness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"illness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"illness": illness}
                                    });
                            }
                            if(user.fatness + fatness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"fatness": 10}
                                    });
                            }
                            else if (user.fatness + fatness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"fatness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"fatness": fatness}
                                    });
                            }
                        }
                        else if(item.localeCompare("nuggets") == 0 && req.user.inventory.nuggets.qty > 0) {
                            db.collection("users").update({user_id: req.user.user_id},
                                {
                                    $set:
                                        {"inventory.nuggets.qty": req.user.inventory.nuggets.qty - 1, "gold": req.user.gold + 10}
                                });
                            if(user.happiness + happiness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"happiness": 10}
                                    });
                            }else if (user.happiness + happiness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"happiness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"happiness": happiness}
                                    });
                            }
                            if(user.illness + illness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"illness": 10}
                                    });
                            }else if (user.illness + illness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"illness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"illness": illness}
                                    });
                            }
                            if(user.fatness + fatness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"fatness": 10}
                                    });
                            }
                            else if (user.fatness + fatness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"fatness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"fatness": fatness}
                                    });
                            }
                        }
                        else if(item.localeCompare("cola") == 0 && req.user.inventory.cola.qty > 0) {
                            db.collection("users").update({user_id: req.user.user_id},
                                {
                                    $set:
                                        {"inventory.cola.qty": req.user.inventory.cola.qty - 1, "gold": req.user.gold + 5}
                                });
                            if(user.happiness + happiness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"happiness": 10}
                                    });
                            }else if (user.happiness + happiness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"happiness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"happiness": happiness}
                                    });
                            }
                            if(user.illness + illness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"illness": 10}
                                    });
                            }else if (user.illness + illness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"illness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"illness": illness}
                                    });
                            }
                            if(user.fatness + fatness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"fatness": 10}
                                    });
                            }
                            else if (user.fatness + fatness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"fatness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"fatness": fatness}
                                    });
                            }
                        }
                        else if(item.localeCompare("mushroom") == 0 && req.user.farm.mushroom.qty > 0) {
                            db.collection("users").update({user_id: req.user.user_id},
                                {
                                    $set:
                                        {"farm.mushroom.qty": req.user.farm.mushroom.qty - 1, "gold": req.user.gold + 15}
                                });
                            if(user.happiness + happiness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"happiness": 10}
                                    });
                            }else if (user.happiness + happiness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"happiness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"happiness": happiness}
                                    });
                            }
                            if(user.illness + illness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"illness": 10}
                                    });
                            }else if (user.illness + illness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"illness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"illness": illness}
                                    });
                            }
                            if(user.fatness + fatness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"fatness": 10}
                                    });
                            }
                            else if (user.fatness + fatness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"fatness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"fatness": fatness}
                                    });
                            }
                        }
                        else if(item.localeCompare("pear") == 0 && req.user.farm.pear.qty > 0) {
                            db.collection("users").update({user_id: req.user.user_id},
                                {
                                    $set:
                                        {"farm.pear.qty": req.user.farm.pear.qty - 1, "gold": req.user.gold + 15}
                                });
                            if(user.happiness + happiness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"happiness": 10}
                                    });
                            }else if (user.happiness + happiness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"happiness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"happiness": happiness}
                                    });
                            }
                            if(user.illness + illness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"illness": 10}
                                    });
                            }else if (user.illness + illness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"illness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"illness": illness}
                                    });
                            }
                            if(user.fatness + fatness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"fatness": 10}
                                    });
                            }
                            else if (user.fatness + fatness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"fatness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"fatness": fatness}
                                    });
                            }
                        }
                        else if(item.localeCompare("blueberry") == 0 && req.user.farm.blueberry.qty > 0) {
                            db.collection("users").update({user_id: req.user.user_id},
                                {
                                    $set:
                                        {"farm.blueberry.qty": req.user.farm.blueberry.qty - 1, "gold": req.user.gold + 25}
                                });
                            if(user.happiness + happiness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"happiness": 10}
                                    });
                            }else if (user.happiness + happiness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"happiness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"happiness": happiness}
                                    });
                            }
                            if(user.illness + illness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"illness": 10}
                                    });
                            }else if (user.illness + illness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"illness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"illness": illness}
                                    });
                            }
                            if(user.fatness + fatness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"fatness": 10}
                                    });
                            }
                            else if (user.fatness + fatness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"fatness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"fatness": fatness}
                                    });
                            }
                        }
                        else if(item.localeCompare("watermelon") == 0 && req.user.farm.watermelon.qty > 0) {
                            db.collection("users").update({user_id: req.user.user_id},
                                {
                                    $set:
                                        {
                                            "farm.watermelon.qty": req.user.farm.watermelon.qty - 1,
                                            "gold": req.user.gold + 15
                                        }
                                });
                            if (user.happiness + happiness >= 10) {
                                db.collection("users").update({user_id: req.user.user_id},
                                    {
                                        $set:
                                            {"happiness": 10}
                                    });
                            } else if (user.happiness + happiness <= 0) {
                                db.collection("users").update({user_id: req.user.user_id},
                                    {
                                        $set:
                                            {"happiness": 0}
                                    });
                            } else {
                                db.collection("users").update({user_id: req.user.user_id},
                                    {
                                        $inc:
                                            {"happiness": happiness}
                                    });
                            }
                            if (user.illness + illness >= 10) {
                                db.collection("users").update({user_id: req.user.user_id},
                                    {
                                        $set:
                                            {"illness": 10}
                                    });
                            } else if (user.illness + illness <= 0) {
                                db.collection("users").update({user_id: req.user.user_id},
                                    {
                                        $set:
                                            {"illness": 0}
                                    });
                            } else {
                                db.collection("users").update({user_id: req.user.user_id},
                                    {
                                        $inc:
                                            {"illness": illness}
                                    });
                            }
                            if (user.fatness + fatness >= 10) {
                                db.collection("users").update({user_id: req.user.user_id},
                                    {
                                        $set:
                                            {"fatness": 10}
                                    });
                            }
                            else if (user.fatness + fatness <= 0) {
                                db.collection("users").update({user_id: req.user.user_id},
                                    {
                                        $set:
                                            {"fatness": 0}
                                    });
                            } else {
                                db.collection("users").update({user_id: req.user.user_id},
                                    {
                                        $inc:
                                            {"fatness": fatness}
                                    });
                            }
                        }
                        else if(item.localeCompare("orange") == 0 && req.user.farm.orange.qty > 0) {
                            db.collection("users").update({user_id: req.user.user_id},
                                {
                                    $set:
                                        {"farm.orange.qty": req.user.farm.orange.qty - 1, "gold": req.user.gold + 15}
                                });
                            if(user.happiness + happiness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"happiness": 10}
                                    });
                            }else if (user.happiness + happiness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"happiness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"happiness": happiness}
                                    });
                            }
                            if(user.illness + illness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"illness": 10}
                                    });
                            }else if (user.illness + illness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"illness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"illness": illness}
                                    });
                            }
                            if(user.fatness + fatness >= 10){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"fatness": 10}
                                    });
                            }
                            else if (user.fatness + fatness <= 0){
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$set:
                                            {"fatness": 0}
                                    });
                            }else{
                                db.collection("users").update({user_id: req.user.user_id},
                                    {$inc:
                                            {"fatness": fatness}
                                    });
                            }
                        }
                    }
                })

            }
            res.redirect("/main/game");
        })

    };

module.exports.fetchMarketUpdate =
    function (req, res) {
        let img_path = req.body.path;
        let collection = db.collection('fooditems');
        let myusers = db.collection('users');
        let myuserlist = myusers.find({user_id: req.user.user_id}).toArray();
        let foodlist = collection.find({item: img_path}).toArray();
        let myqty = 0;
        foodlist.then(function(result){
            myuserlist.then(function(userinfo){
                // console.log(userinfo[0].inventory.apple)
                if(userinfo[0].gold >= result[0].price){
                        // console.log(userinfo.inventory.apple);
                    if(img_path.localeCompare("hamburger") == 0){
                        myusers.updateOne({user_id: req.user.user_id}, {$set: {"inventory.hamburger.qty": userinfo[0].inventory.hamburger.qty + 1}});
                        myusers.updateOne({user_id: req.user.user_id}, {$set: {"gold": userinfo[0].gold - result[0].price}});
                        myqty = result[0].qty - 1;
                        collection.updateOne({item: img_path}, {$set: {"qty": myqty}});
                    }
                    else if(img_path.localeCompare("banana") == 0){
                        myusers.updateOne({user_id: req.user.user_id}, {$set: {"inventory.banana.qty": userinfo[0].inventory.banana.qty + 1}});
                        myusers.updateOne({user_id: req.user.user_id}, {$set: {"gold": userinfo[0].gold - result[0].price}});
                        myqty = result[0].qty - 1;
                        collection.updateOne({item: img_path}, {$set: {"qty": myqty}});

                    }
                    else if(img_path.localeCompare("grapes") == 0){
                        myusers.updateOne({user_id: req.user.user_id}, {$set: {"inventory.grapes.qty": userinfo[0].inventory.grapes.qty + 1}});
                        myusers.updateOne({user_id: req.user.user_id}, {$set: {"gold": userinfo[0].gold - result[0].price}});
                        myqty = result[0].qty - 1;
                        collection.updateOne({item: img_path}, {$set: {"qty": myqty}});

                    }
                    else if(img_path.localeCompare("apple") == 0){
                        myusers.updateOne({user_id: req.user.user_id}, {$set: {"inventory.apple.qty": userinfo[0].inventory.apple.qty + 1}});
                        myusers.updateOne({user_id: req.user.user_id}, {$set: {"gold": userinfo[0].gold - result[0].price}});
                        myqty = result[0].qty - 1;
                        collection.updateOne({item: img_path}, {$set: {"qty": myqty}});

                    }
                    else if(img_path.localeCompare("mushroom") == 0){
                        myusers.updateOne({user_id: req.user.user_id}, {$set: {"inventory.mushroom.qty": userinfo[0].inventory.mushroom.qty + 1}});
                        myusers.updateOne({user_id: req.user.user_id}, {$set: {"gold": userinfo[0].gold - result[0].price}});
                        myqty = result[0].qty - 1;
                        collection.updateOne({item: img_path}, {$set: {"qty": myqty}});

                    }
                    else if(img_path.localeCompare("pear") == 0){
                        myusers.updateOne({user_id: req.user.user_id}, {$set: {"inventory.pear.qty": userinfo[0].inventory.pear.qty + 1}});
                        myusers.updateOne({user_id: req.user.user_id}, {$set: {"gold": userinfo[0].gold - result[0].price}});
                        myqty = result[0].qty - 1;
                        collection.updateOne({item: img_path}, {$set: {"qty": myqty}});

                    }
                    else if(img_path.localeCompare("fries") == 0){
                        myusers.updateOne({user_id: req.user.user_id}, {$set: {"inventory.fries.qty": userinfo[0].inventory.fries.qty + 1}});
                        myusers.updateOne({user_id: req.user.user_id}, {$set: {"gold": userinfo[0].gold - result[0].price}});
                        myqty = result[0].qty - 1;
                        collection.updateOne({item: img_path}, {$set: {"qty": myqty}});
                    }
                    else if(img_path.localeCompare("nuggets") == 0){
                        myusers.updateOne({user_id: req.user.user_id}, {$set: {"inventory.nuggets.qty": userinfo[0].inventory.nuggets.qty + 1}});
                        myusers.updateOne({user_id: req.user.user_id}, {$set: {"gold": userinfo[0].gold - result[0].price}});
                        myqty = result[0].qty - 1;
                        collection.updateOne({item: img_path}, {$set: {"qty": myqty}});
                    }
                    else if(img_path.localeCompare("blueberry") == 0){
                        myusers.updateOne({user_id: req.user.user_id}, {$set: {"inventory.blueberry.qty": userinfo[0].inventory.blueberry.qty + 1}});
                        myusers.updateOne({user_id: req.user.user_id}, {$set: {"gold": userinfo[0].gold - result[0].price}});
                        myqty = result[0].qty - 1;
                        collection.updateOne({item: img_path}, {$set: {"qty": myqty}});
                    }
                    else if(img_path.localeCompare("cola") == 0){
                        myusers.updateOne({user_id: req.user.user_id}, {$set: {"inventory.cola.qty": userinfo[0].inventory.cola.qty + 1}});
                        myusers.updateOne({user_id: req.user.user_id}, {$set: {"gold": userinfo[0].gold - result[0].price}});
                        myqty = result[0].qty - 1;
                        collection.updateOne({item: img_path}, {$set: {"qty": myqty}});
                    }
                    else if(img_path.localeCompare("watermelon") == 0){
                        myusers.updateOne({user_id: req.user.user_id}, {$set: {"inventory.watermelon.qty": userinfo[0].inventory.watermelon.qty + 1}});
                        myusers.updateOne({user_id: req.user.user_id}, {$set: {"gold": userinfo[0].gold - result[0].price}});
                        myqty = result[0].qty - 1;
                        collection.updateOne({item: img_path}, {$set: {"qty": myqty}});
                    }
                    else if(img_path.localeCompare("orange") == 0){
                        myusers.updateOne({user_id: req.user.user_id}, {$set: {"inventory.orange.qty": userinfo[0].inventory.orange.qty + 1}});
                        myusers.updateOne({user_id: req.user.user_id}, {$set: {"gold": userinfo[0].gold - result[0].price}});
                        myqty = result[0].qty - 1;
                        collection.updateOne({item: img_path}, {$set: {"qty": myqty}});
                    }

                }
                else{
                    myqty = result[0].qty;
                    collection.updateOne({item: img_path}, {$set: {"qty": myqty}});
                }


            });
        });


        res.redirect("/main/game/market");
    };
module.exports.plantFromInventory =
    function (req, res) {
        let inventory= req.body.inventory;
        console.log(inventory);
        if(inventory.localeCompare("banana") == 0 && req.user.inventory.banana.qty > 0){
            db.collection("users").update({user_id: req.user.user_id},
                {$set:
                        {"farm.banana.qty": req.user.farm.banana.qty + 1, "inventory.banana.qty": req.user.inventory.banana.qty - 1}
                });
            console.log("item transfered");
        }
        else if(inventory.localeCompare("grapes") == 0 && req.user.inventory.grapes.qty > 0){
            db.collection("users").update({user_id: req.user.user_id},
                {$set:
                        {"farm.grapes.qty": req.user.farm.grapes.qty + 1, "inventory.grapes.qty": req.user.inventory.grapes.qty - 1}
                });

        }
        else if(inventory.localeCompare("apple") == 0 && req.user.inventory.apple.qty > 0) {
            db.collection("users").update({user_id: req.user.user_id},
                {
                    $set:
                        {
                            "farm.apple.qty": req.user.farm.apple.qty + 1,
                            "inventory.apple.qty": req.user.inventory.apple.qty - 1
                        }
                });
        }
        else if(inventory.localeCompare("mushroom") == 0 && req.user.inventory.mushroom.qty > 0) {
            db.collection("users").update({user_id: req.user.user_id},
                {
                    $set:
                        {
                            "farm.mushroom.qty": req.user.farm.mushroom.qty + 1,
                            "inventory.mushroom.qty": req.user.inventory.mushroom.qty - 1
                        }
                });
        }
        else if(inventory.localeCompare("pear") == 0 && req.user.inventory.pear.qty > 0) {
            db.collection("users").update({user_id: req.user.user_id},
                {
                    $set:
                        {
                            "farm.pear.qty": req.user.farm.pear.qty + 1,
                            "inventory.pear.qty": req.user.inventory.pear.qty - 1
                        }
                });
        }
        else if(inventory.localeCompare("blueberry") == 0 && req.user.inventory.blueberry.qty > 0) {
            db.collection("users").update({user_id: req.user.user_id},
                {
                    $set:
                        {
                            "farm.blueberry.qty": req.user.farm.blueberry.qty + 1,
                            "inventory.blueberry.qty": req.user.inventory.blueberry.qty - 1
                        }
                });
        }
        else if(inventory.localeCompare("watermelon") == 0 && req.user.inventory.watermelon.qty > 0) {
            db.collection("users").update({user_id: req.user.user_id},
                {
                    $set:
                        {
                            "farm.watermelon.qty": req.user.farm.watermelon.qty + 1,
                            "inventory.watermelon.qty": req.user.inventory.watermelon.qty - 1
                        }
                });
        }
        else if(inventory.localeCompare("orange") == 0 && req.user.inventory.orange.qty > 0) {
            db.collection("users").update({user_id: req.user.user_id},
                {
                    $set:
                        {
                            "farm.orange.qty": req.user.farm.orange.qty + 1,
                            "inventory.orange.qty": req.user.inventory.orange.qty - 1
                        }
                });
        }



        res.redirect("/main/game");

    };

module.exports.fetchGameLearnMorePage =
    function (req, res) {
        if(!req.user){
            res.redirect("/")
        }
        else {
            res.render('ejs/game_learn_more.ejs', {
                username: req.user.username,
                title: "Learn More",
            })
        }
    };

function thumbUpUpdate(req, id, action) {
    if (action === "h_like") {
        db.collection("foodrecipes").update({recipe_id: id}, {$inc: {"health_like_num": 1}});
        db.collection("foodrecipes").update({recipe_id: id}, {$push: {"health_like_list": req.user.user_id}});
    }
    else if (action === "h_unlike") {
        db.collection("foodrecipes").update({recipe_id: id}, {$inc: {"health_like_num": -1}});
        db.collection("foodrecipes").update({recipe_id: id}, {$pull: {"health_like_list": req.user.user_id}});
    }

    else if (action === "d_like") {
        db.collection("foodrecipes").update({recipe_id: id}, {$inc: {"delicious_like_num": 1}});
        db.collection("foodrecipes").update({recipe_id: id}, {$push: {"delicious_like_list": req.user.user_id}});
    }
    else if (action === "d_unlike") {
        db.collection("foodrecipes").update({recipe_id: id}, {$inc: {"delicious_like_num": -1}});
        db.collection("foodrecipes").update({recipe_id: id}, {$pull: {"delicious_like_list": req.user.user_id}});
    }
}

function id_generate() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
}


