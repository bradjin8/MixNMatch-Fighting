import { decode, encode } from 'base-64';
import './timerConfig';
global.addEventListener = (x) => x;
if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

// Instadating config
// const firebaseConfig = {
//   apiKey: 'AIzaSyAOWHBpPhKoNhcGFKHH_Q_0AtL2gV-imgQ',
//   authDomain: 'production-a9404.firebaseapp.com',
//   databaseURL: 'https://production-a9404.firebaseio.com',
//   projectId: 'production-a9404',
//   storageBucket: 'production-a9404.appspot.com',
//   messagingSenderId: '525472070731',
//   appId: '1:525472070731:web:ee873bd62c0deb7eba61ce',
// };

const firebaseConfig = {
  apiKey: "AIzaSyDdp5Ee86fZif0j3BJh0rxdKkZ82udYpg4",
  authDomain: "mixnmatch-31d2a.firebaseapp.com",
  projectId: "mixnmatch-31d2a",
  storageBucket: "mixnmatch-31d2a.appspot.com",
  messagingSenderId: "39056365912",
  appId: "1:39056365912:web:d57b94aa70b242c7f2ad2d",
  measurementId: "G-J09TXLYQ7Y"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export { firebase };
