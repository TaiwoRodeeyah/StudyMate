import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCrgHA_WPgUbccWpEv3kn5RKztcj2yf6Kc",
  authDomain: "studymate-6a088.firebaseapp.com",
  projectId: "studymate-6a088",
  storageBucket: "studymate-6a088.firebasestorage.app",
  messagingSenderId: "107617080586",
  appId: "1:107617080586:web:42f1666bc045c8549bd6f3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export { auth };