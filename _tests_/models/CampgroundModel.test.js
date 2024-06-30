const mongoose = require('mongoose');
const Campground = require('../../models/campground');
const Review = require('../../models/review'); 

describe('Campground Model', () => {
  beforeAll(async () => {
    const mongoUri = 'mongodb://localhost:27017/test'; 
    await mongoose.connect(mongoUri, {
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await Campground.deleteMany({});
    await Review.deleteMany({});
  });

  it('should create a new campground', async () => {
    const campgroundData = {
      title: 'Test Campground',
      price: 10,
      description: 'This is a test campground',
      location: 'Test Location',
      geometry: {
        type: 'Point',
        coordinates: [1.2345, -1.2345],
      },
      author: '6671edb4cb61931853570863', 
    };

    const campground = new Campground(campgroundData);
    await campground.save();

    const fetchedCampground = await Campground.findOne({ title: 'Test Campground' });
    expect(fetchedCampground).toBeDefined();
    expect(fetchedCampground.title).toBe('Test Campground');
  });

  it('should delete a campground and associated reviews', async () => {
    const campgroundData = {
      title: 'Test Campground',
      price: 10,
      description: 'This is a test campground',
      location: 'Test Location',
      geometry: {
        type: 'Point',
        coordinates: [1.2345, -1.2345],
      },
      author: '6671edb4cb61931853570863',
    };

    const campground = new Campground(campgroundData);
    await campground.save();

    const reviewData = {
      text: 'Test Review',
      rating: 5,
      author: '6671edb4cb61931853570863', 
      campground: campground._id,
    };

    const review = new Review(reviewData);
    await review.save();

    await Campground.findOneAndDelete({ title: 'Test Campground' });

    const deletedCampground = await Campground.findOne({ title: 'Test Campground' });
    const deletedReview = await Review.findOne({ text: 'Test Review' });

    expect(deletedCampground).toBeNull();
    expect(deletedReview).toBeNull();
  });

  it('should generate thumbnail URL and properties', () => {
    const campgroundData = {
      title: 'Test Campground',
      price: 10,
      description: 'This is a test campground',
      location: 'Test Location',
      geometry: {
        type: 'Point',
        coordinates: [1.2345, -1.2345],
      },
      images: [{ url: 'https://example.com/image.jpg', filename: 'image.jpg' }],
      author: '6671edb4cb61931853570863',
    };

    const campground = new Campground(campgroundData);

    const thumbnailUrl = campground.images[0].thumbnail;
    expect(thumbnailUrl).toBe('https://example.com/image.jpg');

    const properties = campground.properties;
    expect(properties.id).toEqual(campground._id);
    expect(properties.title).toEqual('Test Campground');
  });
});
