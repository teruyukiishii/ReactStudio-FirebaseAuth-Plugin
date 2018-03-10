// Import FirebaseAuth and firebase.
import React, {Component} from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';

// Configure Firebase.
const config = {
    apiKey: "{{APIKEY}}",
    authDomain: "{{PROJECTID}}.firebaseapp.com",
    databaseURL: "https://{{PROJECTID}}.firebaseio.com",
    projectId: "{{PROJECTID}}",
    storageBucket: "{{PROJECTID}}.appspot.com",
    messagingSenderId: "{MESSAGESENDERID}"
};
firebase.initializeApp(config);

class {{{CLASSNAME}}} extends React.Component {
  state = {
    signedIn: false // Local signed-in state.
  };
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a    callbacks.signInSuccess function.
    signInSuccessUrl: '/',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccess: () => false
    }
  };
  componentDidMount() {
    firebase.auth().onAuthStateChanged(
        (user) => this.setState({signedIn: !!user})
    );
  }
  render() {
    if (!this.state.signedIn) {
      return (
        <div>
          <h1>My App</h1>
          <p>Please sign-in:</p>
          <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
        </div>
      );
    }
    return (
      <div>
        <h1>My App</h1>
        <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
        <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
      </div>
    );
  }
}

export default {{{CLASSNAME}}}