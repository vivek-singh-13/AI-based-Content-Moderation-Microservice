const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const commentRoutes = require('./routes/commentRoutes');
const postRoutes = require('./routes/postRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
app.use(express.json());

app.use(cors());

mongoose.connect(process.env.MONGO_URI).then(
    ()=>console.log("DB connected successfully!")).catch((err)=>{console.log(err)});

app.use('/auth', authRoutes);
app.use('/comments', commentRoutes);
app.use('/posts', postRoutes);
app.use('/notifications', notificationRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
