import React, { Component } from "react";

import { withFirebase } from "../../../firebase";
class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.listener = this.props.firebase.users().onSnapshot((querySnapshot) => {
      let usersList = [];

      querySnapshot.forEach(function (doc) {
        const obj = doc.data();

        let recipes = [];

        if ("recipes" in obj) {
          for (const [key, value] of Object.entries(obj.recipes)) {
            recipes.push({
              ...value,
              rID: `${key}`,
            });
          }
        }

        let history = [];

        if ("history" in obj) {
          for (const [key, value] of Object.entries(obj.history)) {
            history.push({
              ...value,
              hID: `${key}`,
            });
          }
        }

        const newObj = {
          recipes: recipes,
          history: history,
          name: obj.name,
          uID: doc.id,
        };

        console.log("newobj", newObj);

        usersList.push(newObj);
      });

      this.setState({
        users: usersList,
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    this.listener();
  }

  render() {
    const { users, loading } = this.state;

    return (
      <div>
        <h1>Admin</h1>

        {loading && <div>Loading ...</div>}

        <h2>Users:</h2>
        <UserList users={users} />
      </div>
    );
  }
}

const RecipeList = ({ recipes }) => (
  <div>
    Recipes:
    {Object.keys(recipes).map((obj) => {
      return (
        <ul>
          <li>{recipes[obj]["name"]}</li>
          <li>{recipes[obj]["rID"]}</li>
        </ul>
      );
    })}
  </div>
);

const HistoryList = ({ history }) => (
  <div>
    History:
    {Object.keys(history).map((obj) => {
      return (
        <ul>
          <li>{history[obj]["name"]}</li>
          <li>{history[obj]["hID"]}</li>
        </ul>
      );
    })}
  </div>
);

const UserList = ({ users }) => (
  <div>
    {Object.keys(users).map((obj) => {
      console.log("obj", obj);

      return (
        <div>
          <p key={users[obj]["name"]}>Name: {users[obj]["name"]}</p>{" "}
          <p key={users[obj]["uID"]}>uID: {users[obj]["uID"]}</p>
          <RecipeList recipes={users[obj]["recipes"]} />
          <HistoryList history={users[obj]["history"]} />
        </div>
      );
    })}
  </div>
);

export default withFirebase(AdminPage);
