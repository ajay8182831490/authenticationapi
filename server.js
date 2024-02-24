require('dotenv').config();
const path = require('path');




const express = require('express');
const bodyParser = require('body-parser');

const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')
const log = require('node-file-logger');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const fileName = path.basename(__filename);
const nodemailer = require('nodemailer');
app = express();
app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));







app.use(express.static('./public'));



app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

app.use(require('./src/user/routes/userRoutes.js'))
























app.listen(3600, () => {
  console.log('app is running on port 3600');
})
