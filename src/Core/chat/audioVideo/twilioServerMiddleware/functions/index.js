require('dotenv').config();
const tokenGenerator = require('./src/tokenGenerator');

exports.getTwilioAccessToken = tokenGenerator;
