import React from "react";

import AuthUserContext from "./context";
import { withFirebase } from "../firebase";

const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null,
      };
    }

    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        (authUser) => {
          if (authUser) {
            console.log("hi", authUser.uid);

            this.props.firebase
              .user(authUser.uid)
              .get()
              .then((doc) => {
                if (doc.exists) {
                  console.log("Document data:", doc.data());

                  const userData = doc.data();
                  authUser.name = userData.name;
                  this.setState({ authUser });
                } else {
                  // doc.data() will be undefined in this case
                  console.log("No such document!");
                }
              })
              .catch(function (error) {
                console.log("Error getting document:", error);
              });
          } else {
            this.setState({ authUser: null });
          }
        }
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(WithAuthentication);
};

export default withAuthentication;
