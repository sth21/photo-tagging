import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAlkoEDXmAcJgg8CHH-3GQTctqZuOFl2vs",
    authDomain: "phototagging-b8217.firebaseapp.com",
    projectId: "phototagging-b8217",
    storageBucket: "phototagging-b8217.appspot.com",
    messagingSenderId: "848870176856",
    appId: "1:848870176856:web:5eff710ce89eda151cf22d"
  };

const APP = initializeApp(firebaseConfig);
const DB = getFirestore(APP);

export { APP, DB };