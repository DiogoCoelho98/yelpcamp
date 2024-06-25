const mongoose = require('mongoose');
const Schema = mongoose.Schema; //shorthand to wavoit over writting mongoose.Schema

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User' //User collection in MongoDB
    },
})

module.exports = mongoose.model('Review', reviewSchema);