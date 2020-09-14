import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const firebase = require('firebase');
require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCg1s9UBKFHmsMTp4eFH5QnKq4XOPoTDlE",
  authDomain: "openhouse-fyp.firebaseapp.com",
  databaseURL: "https://openhouse-fyp.firebaseio.com",
  projectId: "openhouse-fyp",
  storageBucket: "openhouse-fyp.appspot.com",
  messagingSenderId: "604292284968",
  appId: "1:604292284968:web:2a0d1566c6080bc4592b1d",
  measurementId: "G-VJYJCHT4KC"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
