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
    let lineAccessToken
    await axios.post(url, params)
      .then(async responce => {
        console.log("Responce : " + Object.keys(responce.data))
        lineAccessToken = responce.data.access_token
      }).catch(error => {
        console.error("Error...... : " + error)
        return res.status(500).json({error: error})
      })

    const createRequest = {}
    await axios({
      method: 'get',
      url: 'https://api.line.me/v2/profile',
      headers: {
        'Authorization': `Bearer ${lineAccessToken}`,
      },
    }).then(async responce => {
      console.log(Object.keys(responce.data))
      createRequest["uid"] = 'line:' + responce.data.userId
      createRequest["displayName"] = responce.data.displayName
      createRequest["pictureUrl"] = responce.data.pictureUrl

      await admin.auth().getUser(createRequest.uid).then(()=>{
        console.log(`user ${createRequest.uid} was found`)
      }).catch(async error => {
        if (error.code === 'auth/user-not-found'){
          await admin.auth().createUser(createRequest).then(() => {
            console.log('created user succesfully.')
          })
        }
      })
    }).catch(error => {
      console.error("Error...... : " + error)
        return res.status(500).json({error: error})
    })

    
    const claims = {
      provider: 'LINE'
    }
    console.log(claims)
    await admin.auth().setCustomUserClaims(createRequest.uid, claims)
    
    const firebaseCustomToken = await admin.auth().createCustomToken(createRequest.uid)
    
    res.status(200).send({
      firebase_token: firebaseCustomToken
    })
    
    // Push the new message into Cloud Firestore using the Firebase Admin SDK.
    
    // const writeResult = await admin.firestore().collection('test').add({
    //   code: code,
    //   redirect_uri: redirect_uri
    // });
    // Send back a message that we've succesfully written the message
    
  })


});
