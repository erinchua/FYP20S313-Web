import firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDwet3PlddlAMo4Mx_rHxowENsZSbeEwak",
    authDomain: "fyp20s3-13.firebaseapp.com",
    databaseURL: "https://fyp20s3-13.firebaseio.com",
    projectId: "fyp20s3-13",
    storageBucket: "fyp20s3-13.appspot.com",
    messagingSenderId: "671429853263",
    appId: "1:671429853263:web:71fb4fbeb23a4f74da6a3a"

    /*apiKey: "AIzaSyBuIdpJIFuUGwGSrh8OcmUPmy7k3f_6tEw",
    authDomain: "sandbox-4c75c.firebaseapp.com",
    databaseURL: "https://sandbox-4c75c.firebaseio.com",
    projectId: "sandbox-4c75c",
    storageBucket: "sandbox-4c75c.appspot.com",
    messagingSenderId: "364708425534",
    appId: "1:364708425534:web:6c5618f357552f4a86066f"*/
  };
  // Initialize Firebase
  const fire = firebase.initializeApp(firebaseConfig);

  export default fire;
