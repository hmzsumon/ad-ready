const mongoose = require('mongoose');

let MONGO_URI = '';

if (process.env.NODE_ENV === 'production') {
  MONGO_URI = process.env.MONGO_URI;
} else {
  MONGO_URI = 'mongodb://localhost:27017/ad-ready';
}

const connectDatabase = () => {
  mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    });
};

module.exports = connectDatabase;
