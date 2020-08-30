const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const axios = require('axios')


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

    // Line Setup
    if (!functions.config().line ||
        !functions.config().line.login ||
        !functions.config().line.login.channel_id ||
        !functions.config().line.login.client_secret) {
      throw new Error('please set LINE login CHANNEL_ID & CLIENT_SECRET before you deploy!');
    }

    const line_login_channel_id = functions.config().line.login.channel_id;
    const line_login_client_secret = functions.config().line.login.client_secret;

    let params = new URLSearchParams()
    const url = "https://api.line.me/oauth2/v2.1/token"
    params.append('grant_type', 'authorization_code')
    params.append('code', code)
    params.append('redirect_uri', redirect_uri)
    params.append('client_id', line_login_channel_id)
    params.append('client_secret', line_login_client_secret)
    await axios.post(url, params)
      .then(async res => {
        console.log("Responce : " + res)
        await admin.firestore().collection('res').add({res: res});
      }).catch(error => {
        console.error("Error...... : " + error)
        return res.status(500).json({error: error})
      })
    
    


    
    // Push the new message into Cloud Firestore using the Firebase Admin SDK.
    
    const writeResult = await admin.firestore().collection('test').add({
      code: code,
      redirect_uri: redirect_uri
    });
    // Send back a message that we've succesfully written the message
    res.status(200).send();
  })


});
