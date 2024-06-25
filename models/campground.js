const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () { //adjust the width of the images sent to Cloudinary by changeing the URL to w_200
    return this.url.replace('/upload', '/upload/w_200')
});

const opts = { toJSON: { virtuals: true } }; //mongoose docs - https://mongoosejs.com/docs/tutorials/virtuals.html. includes the virtuals in the campground array

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    geometry: {                  //GeoJson mongoose format
        type: {
            type: String,
            enum: ['Point'],     // Type/coordinates comes from mapbox(body.features[0].geometry)
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [ImageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User' //User collection in MongoDB
    },
    reviews: [
        {
            type: Schema.Types.ObjectId, //to store the objectID of the different reviews (One to Many)
            ref: 'Review' //Connects to the review model - 'Review' collection's name
        }
    ]
}, opts);

CampgroundSchema.virtual('properties').get(function () { //virtual to follow the Mapbox data format -> https://docs.mapbox.com/help/getting-started/creating-data/
    return {
      id: this._id,
      title: this.title
    }
  });
  

//Delete a review inside the reviews MongoDB collection when a campground is deleted from the campgrounds collection
CampgroundSchema.post('findOneAndDelete', async function (doc) { //to check if the express middleware it's a pre/post -> console.log('') -> terminal; When the data is deleted it's pass to the middleware -> console.log(doc)
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews //MongoDB operator
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema)

