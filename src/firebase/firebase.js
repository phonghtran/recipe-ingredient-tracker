// Firebase Config

import app from "firebase/app";
import "firebase/auth";

export const config = {
  apiKey: "AIzaSyBAOATixW2NkUaWxrhEaWPZWOfJY24f9O0",
  authDomain: "recipe-ingredient-tracker.firebaseapp.com",
  databaseURL: "https://recipe-ingredient-tracker.firebaseio.com",
  projectId: "recipe-ingredient-tracker",
  storageBucket: "recipe-ingredient-tracker.appspot.com",
  messagingSenderId: "971308328916",
  appId: "1:971308328916:web:5b402d9a902f42503b1841",
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = (password) =>
    this.auth.currentUser.updatePassword(password);
}

export default Firebase;
