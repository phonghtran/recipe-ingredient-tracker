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
  ingredients: [
    {
      name: "carrot",
      quantity: "2",
      unit: "pounds",
    },
  ],
  error: null,
};

class AddFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { name, ingredients } = this.state;

    const newID = this.props.firebase.recipes().doc();

    console.log(newID.id);

    this.props.firebase
      .recipes()
      .doc(newID.id)
      .set({
        name: name,
        ingredients: ingredients,
        user: {},
      })
      .catch((error) => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  changeRecipeName = (event) => {
    console.log(this.state);
    this.setState({ [event.target.name]: event.target.value });
  };

  ingredientChange = (event, index) => {
    let ingredients = this.state.ingredients.slice();

    ingredients[index][event.target.name] = event.target.value;

    this.setState({ ingredients: ingredients });

    console.log(this.state);
  };

  ingredientAdd() {
    let ingredients = this.state.ingredients.slice();

    ingredients.push({
      name: "",
      quantity: "",
      unit: "",
    });

    this.setState({ ingredients: ingredients });
  }

  ingredientRemove = (index) => {
    let ingredients = this.state.ingredients.slice();

    if (ingredients.length > 1) {
      ingredients.splice(index, 1);

      this.setState({ ingredients: ingredients });
    }
  };

  renderIngredient(obj, index) {
    console.log(obj);
    return (
      <NewIngredient
        key={index}
        name={obj.name}
        quantity={obj.quantity}
        unit={obj.unit}
        index={index}
        onChange={(event) => this.ingredientChange(event, index)}
        onClick={() => this.ingredientRemove(index)}
      />
    );
  }

  render() {
    const { name, ingredients, error } = this.state;

    // const isInvalid = name === "";
    // name === "" || ingredient === "" || quantity === "" || unit === "";

    return (
      <form onSubmit={this.onSubmit}>
        <h2>Recipe Name: </h2>
        <input
          name="name"
          value={name}
          onChange={(event) => this.changeRecipeName(event)}
          type="text"
          placeholder="Recipe name"
        />

        <h2>Ingredients</h2>
        {ingredients.map((obj, index) => {
          return this.renderIngredient(obj, index);
        })}

        <button type="button" onClick={() => this.ingredientAdd()}>
          Add Ingredient
        </button>

        <p>
          <button type="submit">Add Recipe</button>
        </p>
        <p> {error && <p>{error.message}</p>}</p>
      </form>
    );
  }
}

function NewIngredient(props) {
  return (
    <div>
      <input
        name="name"
        value={props.name}
        onChange={props.onChange}
        type="text"
        placeholder="ingredient name"
      />
      <input
        name="quantity"
        value={props.quantity}
        onChange={props.onChange}
        type="text"
        placeholder="1"
      />
      <input
        name="unit"
        value={props.unit}
        onChange={props.onChange}
        type="text"
        placeholder="teaspoon"
      />
      <button type="button" onClick={props.onClick}>
        Remove Ingredient
      </button>
    </div>
  );
}

const AddForm = withRouter(withFirebase(AddFormBase));
const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(RecipeAddPage);

export { AddForm };
