const functions = require('firebase-functions');
const admin = require("firebase-admin")
const serviceAccount = require("./service_account.json");
const cors = require('cors')({ origin: true })

const createEmailList = require('./createEmailList')

// zoho
const zohoCrmHook = require('./zohoCrmHook')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://renterii-landing-page.firebaseio.com"
})

exports.myWebHook = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {            
    zohoCrmHook(req, res)  
    createEmailList(req, res)
  })
})

// exports.zohoCrmHook = functions.https.onRequest(zohoCrmHook)
// exports.createEmailList = functions.https.onRequest(createEmailList)
