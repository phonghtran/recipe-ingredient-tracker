import React, { Component } from "react";

import { withFirebase } from "../../../firebase";
class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.dbListener = "";

    this.state = {
      loading: false,
      users: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.dbListener = this.props.firebase
      .users()
      .onSnapshot((querySnapshot) => {
        let usersList = [];

        querySnapshot.forEach(function (doc) {
          let obj = doc.data();

          obj = {
            ...obj,
            uID: doc.id,
          };

          usersList.push(obj);
        });

        this.setState({
          users: usersList,
          loading: false,
        });
      });
  }

  componentWillUnmount() {
    this.dbListener();
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

const UserList = ({ users }) => (
  <div>
    {Object.keys(users).map((obj) => {
      const keys = Object.keys(users[obj]);
      const values = Object.values(users[obj]);

      console.log(values);

      const props = keys.map((prop, index) => (
        <p key={prop}>
          {prop}: {values[index].toString()}
        </p>
      ));

      return props;
    })}
  </div>
);

export default withFirebase(AdminPage);
