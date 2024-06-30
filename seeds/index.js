require('dotenv').config({ path: '../.env' })
const mongoose = require('mongoose');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelper')
const Campground = require('../models/campground');
const axios = require('axios')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected')
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const fetchUnsplashImages = async () => {
    const response = await axios.get(process.env.UNSPLASH_COLLECTION, {
        headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_KEY}`
        },
        params: {
            per_page: 50
        }
    });
    return response.data.map(photo => ({
        url: photo.urls.small,
        filename: photo.id
    }));
};

const seedDB = async () => {
    await Campground.deleteMany({});
    const images = await fetchUnsplashImages();

    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const numImages = Math.floor(Math.random() * 3) + 1;

        const campImages = [];
        for (let j = 0; j < numImages; j++) {
            campImages.push(images[(i * numImages + j) % images.length]);
        }

        const camp = new Campground({
            author: '668128dd5f2e2b68d2ac5609',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: campImages,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae adipisci, eligendi autem quis ad excepturi tempora id eum veritatis, aspernatur nulla delectus, totam inventore? Rerum delectus libero aspernatur itaque quidem.',
            price: price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            }
        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close()
});
