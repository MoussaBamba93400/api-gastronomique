const express = require('express');
const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config();

const sauceRoute = require('./Routes/sauce');
const userRoute = require('./Routes/user');

const app = express();

mongoose.connect(`mongodb+srv://moussabulls:${process.env.MP}@cluster0.etdrnap.mongodb.net/?retryWrites=true&w=majority`,
{ useNewUrlParser: true,
   useUnifiedTopology: true })
 .then(() => console.log('Connexion à MongoDB réussie !'))
 .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content, Accept, Content-type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
})

app.use('/api', sauceRoute);
app.use('/api/auth', userRoute);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app