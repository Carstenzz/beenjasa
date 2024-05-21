import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB2h5l1Bymr692bJaP6PFcFsnwAS_s6TaI",
  authDomain: "beenjasa-d237c.firebaseapp.com",
  databaseURL: "https://beenjasa-d237c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "beenjasa-d237c",
  storageBucket: "beenjasa-d237c.appspot.com",
  messagingSenderId: "657561871766",
  appId: "1:657561871766:web:18ec95e758adfa59d769b7"
};

const app = initializeApp(firebaseConfig);

export default app