const mongoose = require('mongoose');
const User = require('../../models/user');

describe('User Model', () => {
  beforeAll(async () => {
    const mongoUri = 'mongodb://localhost:27017/test';
    await mongoose.connect(mongoUri, {});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should create a new user', async () => {
    const userData = {
      email: 'testuser2@example.com',
      username: 'testuser2'
    };

    const user = new User(userData);
    await user.save();

    const fetchedUser = await User.findOne({ email: userData.email });
    if (!fetchedUser) {
    }
    expect(fetchedUser).not.toBeNull();
    expect(fetchedUser.email).toBe(userData.email);
    expect(fetchedUser.username).toBe(userData.username);
  });

  it('should not create a user without required fields', async () => {
    const user = new User();
    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.errors.email.message).toEqual('Path `email` is required.');
  });

  it('should not allow duplicate email addresses', async () => {
    const userData = {
      email: 'testuser2@example.com',
      username: 'testuser2'
    };

    const user1 = new User(userData);
    await user1.save();

    const user2 = new User(userData); // Attempt to create a user with the same email
    let error;
    try {
      await user2.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.name).toBe('MongoServerError');
    expect(error.code).toBe(11000);
  });

  it('should delete a user', async () => {
    const userData = {
      email: 'testuser3@example.com',
      username: 'testuser3'
    };

    const user = new User(userData);
    await user.save();
    await User.findByIdAndDelete(user._id);

    const deletedUser = await User.findById(user._id);
    expect(deletedUser).toBeNull();
  });
});
