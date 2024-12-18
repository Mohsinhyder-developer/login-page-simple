const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Ensure this file exists and is correctly configured

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sample-firbase-ai-app-733a1-default-rtdb.firebaseio.com/" // Add your database URL here

});

// Export Firebase services
const auth = admin.auth();
const db = admin.database(); 

module.exports = { auth, db };
















// Realtime Database reference
// module.exports = { db };