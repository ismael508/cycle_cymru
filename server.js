require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3781;

const postApi = require('./routes/postApi')
const getApi = require('./routes/getApi')
const deleteApi = require('./routes/deleteApi')

app.use(express.text({ type: '*/*' }));
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.DB_URI, {
  tls: true, // Enables TLS/SSL
  tlsAllowInvalidCertificates: true // Allow invalid certificates (not recommended for production)
})
.then(() => {
  app.use('', postApi, getApi, deleteApi);
  app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)});
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});