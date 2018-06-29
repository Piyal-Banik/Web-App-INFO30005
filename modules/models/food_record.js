let mongoose = require('mongoose');
let db = require('../db_connection');

//Define a schema
let Schema = mongoose.Schema;

//Define a model for food recipe
let foodOptionSchema = new Schema({
    user_id: String,
    id: String,
    date: String,
    breakfast : String,
    lunch : String,
    dinner : String,
    comment : String
});

let foodOption = mongoose.model('foodrecord', foodOptionSchema);

module.exports = foodOption;

module.exports.createFoodInstance =
    function (user_id,id,date, breakfast, lunch, dinner,comment) {
        return new foodOption({
            user_id: user_id,
            id: id,
            date:date,
            breakfast: breakfast,
            lunch: lunch,
            dinner: dinner,
            comment : comment
        })
    };