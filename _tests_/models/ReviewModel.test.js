const mongoose = require('mongoose');
const Review = require('../../models/review');
const User = require('../../models/user');

describe('Review Model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/test', {
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await Review.deleteMany({});
    await User.deleteMany({});
  });

  it('should create a new review', async () => {
    const user = await User.create({ email: 'testuser@example.com' });

    const reviewData = {
      body: 'Test review body',
      rating: 5,
      author: user._id,
    };

    const review = new Review(reviewData);
    await review.save();

    const fetchedReview = await Review.findById(review._id);
    expect(fetchedReview).toBeDefined();
    expect(fetchedReview.body).toBe('Test review body');
    expect(fetchedReview.rating).toBe(5);
    expect(fetchedReview.author.toString()).toBe(user._id.toString());
  });

  it('should delete a review', async () => {
    const user = await User.create({ email: 'testuser@example.com' });
  
    const reviewData = {
      body: 'Test review body',
      rating: 5,
      author: user._id,
    };
  
    const review = await Review.create(reviewData);
  
    await Review.findByIdAndDelete(review._id);
  
    const deletedReview = await Review.findById(review._id);
    expect(deletedReview).toBeNull();
  });
  
});
