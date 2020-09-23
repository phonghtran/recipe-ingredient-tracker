import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { withFirebase } from "../../../firebase";
import { withAuthorization } from "../../../session";
import * as ROUTES from "../../../constants/routes";

const RecipeAddPage = () => (
  <div>
    <h1>receipe add Page</h1>
    <AddForm />
  </div>
);

const INITIAL_STATE = {
  name: "",
  ingredient: "",
  quantity: "",
  unit: "",
  error: null,
};

class AddFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { name, ingredient, quantity, unit } = this.state;

    console.log(name, ingredient, quantity, unit);

    const newID = this.props.firebase.recipes().doc();

    console.log(newID.id);

    this.props.firebase
      .recipes()
      .doc(newID.id)
      .set({
        name: name,
        ingredients: [
          {
            name: ingredient,
            unit: unit,
            quantity: quantity,
          },
        ],
        user: {},
      })
      .catch((error) => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { name, ingredient, quantity, unit, error } = this.state;

    // const isInvalid = name === "";
    // name === "" || ingredient === "" || quantity === "" || unit === "";

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="name"
          value={name}
          onChange={this.onChange}
          type="text"
          placeholder="Recipe name"
        />
        <input
          name="ingredient"
          value={ingredient}
          onChange={this.onChange}
          type="text"
          placeholder="ingredient name"
        />
        <input
          name="quantity"
          value={quantity}
          onChange={this.onChange}
          type="text"
          placeholder="1"
        />
        <input
          name="unit"
          value={unit}
          onChange={this.onChange}
          type="text"
          placeholder="teaspoon"
        />
        <button type="submit">Add Recipe</button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const AddForm = withRouter(withFirebase(AddFormBase));
const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(RecipeAddPage);

export { AddForm };
