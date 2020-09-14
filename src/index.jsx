import * as React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// import * as serviceWorker from "./serviceWorker";

import Firebase, { FirebaseContext } from "./firebase";
import App from "./components/pages/App";

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <App />
  </FirebaseContext.Provider>,
  document.getElementById("root")
);

// serviceWorker.unregister();
