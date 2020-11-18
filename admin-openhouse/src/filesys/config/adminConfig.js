const admin = require("firebase-admin");
const serviceAccount = require("./fypServiceKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fyp20s3-13.firebaseio.com"
});

const db  = admin.firestore();
module.exports = db;