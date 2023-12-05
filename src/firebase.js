// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJentQHQue9W_5pK3igafJw9WCqnIB8Pk",
  authDomain: "byld-336b0.firebaseapp.com",
  databaseURL: "https://byld-336b0-default-rtdb.firebaseio.com",
  projectId: "byld-336b0",
  storageBucket: "byld-336b0.appspot.com",
  messagingSenderId: "614289145791",
  appId: "1:614289145791:web:c69b52c055044b27be6b0a",
  measurementId: "G-205G0V0MSE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const storage = getStorage();



export default app;