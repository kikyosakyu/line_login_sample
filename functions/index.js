const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});


const serviceAccount = functions.config().service_account;
if (!serviceAccount) {
  throw new Error('Please set SERVICE ACCOUNT before you deploy')
}
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

exports.lineLogin = functions.region('asia-northeast1').https.onRequest((req, res) => {
  cors(req, res, async() => {
    // Grab the text parameter.
    const code = req.body.code;
    const redirect_uri = req.body.redirect_uri;
    // Push the new message into Cloud Firestore using the Firebase Admin SDK.
    const writeResult = await admin.firestore().collection('test').add({
      code: code,
      redirect_uri: redirect_uri
    });
    // Send back a message that we've succesfully written the message
    res.status(200).send();
  })


});
