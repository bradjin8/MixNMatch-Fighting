require('dotenv').config();
const functions = require('firebase-functions');
const config = require('../config');

const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

function tokenGenerator(identity, room) {
  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  const token = new AccessToken(
    config.TWILIO_ACCOUNT_SID,
    config.TWILIO_API_KEY,
    config.TWILIO_API_SECRET,
  );

  // Assign identity to the token
  token.identity = identity;

  // Grant the access token Twilio Video capabilities
  const grant = new VideoGrant();
  grant.room = room;
  token.addGrant(grant);

  // Serialize the token to a JWT string
  return token.toJwt();
}

const app = (request, response) => {
  const identity = request.query.identity || 'identity';
  const room = request.query.room;
  response.json(tokenGenerator(identity, room));
};

module.exports = functions.https.onRequest(app);
