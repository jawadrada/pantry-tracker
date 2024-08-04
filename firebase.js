// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjoWSy4ClRXhCsfIgE5HqKUgbMWa4ymJw",
  authDomain: "pantry-tracker-78eb3.firebaseapp.com",
  projectId: "pantry-tracker-78eb3",
  storageBucket: "pantry-tracker-78eb3.appspot.com",
  messagingSenderId: "23623521147",
  appId: "1:23623521147:web:0ae12e04fc5f763d3b63de",
  measurementId: "G-HM76JPR6Z3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}
