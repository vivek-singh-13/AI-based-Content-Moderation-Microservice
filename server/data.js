const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Post = require('./models/Post');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
}).then(async () => {
  await Post.insertMany([
    { title: 'Post 1', content: 'This is the first post' },
    { title: 'Post 2', content: 'This is the second post' },
    { title: 'Post 3', content: 'This is the third post' },
  ]);
  console.log('Posts added successfully');
  mongoose.disconnect();
}).catch(err => console.log(err));