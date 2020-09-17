import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDwet3PlddlAMo4Mx_rHxowENsZSbeEwak",
    authDomain: "fyp20s3-13.firebaseapp.com",
    databaseURL: "https://fyp20s3-13.firebaseio.com",
    projectId: "fyp20s3-13",
    storageBucket: "fyp20s3-13.appspot.com",
    messagingSenderId: "671429853263",
    appId: "1:671429853263:web:71fb4fbeb23a4f74da6a3a"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;
