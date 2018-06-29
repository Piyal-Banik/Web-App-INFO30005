let mongoose = require('mongoose');

//Define a schema
let Schema = mongoose.Schema;

//Define a model for food recipe
let FoodRecipeModelSchema = new Schema({
    recipe_id: String,
    title: String,
    user_id: String,
    username: String,
    ingredients: [{type: String}],
    steps: [{type: String}],
    image_path: String,
    create_date: {type: Date, default: Date.now,},
    health_like_num:{type: Number, default: 0,},
    delicious_like_num:{type: Number, default: 0,},
    health_like_list: [{type: String}],
    delicious_like_list:[{type: String}],
});

let FoodRecipe = mongoose.model('FoodRecipe', FoodRecipeModelSchema);

module.exports = FoodRecipe;

module.exports.createRecipeInstance =
    function (id, name, ingredients, steps, user_id, username, image_path) {
        return new FoodRecipe({
            recipe_id: id,
            title: name,
            user_id: user_id,
            username: username,
            ingredients: ingredients,
            steps: steps,
            image_path: image_path,
    })
};