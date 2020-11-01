import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { withFirebase } from "../../../firebase";
import { AuthUserContext, withAuthorization } from "../../../session";

const RecipeAddPage = () => (
  <AuthUserContext.Consumer>
    {(authUser) => (
      <div>
        <h1>receipe add Page</h1>

        <AddForm uid={authUser.uid} username={authUser.name} />
      </div>
    )}
  </AuthUserContext.Consumer>
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
    let userInfo = {};

    userInfo[this.props.uid] = {
      name: this.props.username,
      uid: this.props.uid,
    };

    this.props.firebase
      .recipes()
      .doc(newID.id)
      .set({
        name: name,
        ingredients: ingredients,
        user: userInfo,
      })
      .catch((error) => {
        this.setState({ error });
      });

    let recipeObj = {};

    recipeObj[newID.id] = {
      name: name,
      ingredients: ingredients,
    };

    let userDoc = this.props.firebase.user(this.props.uid);

    userDoc
      .get()
      .then((doc) => {
        if (doc.exists) {
          const userData = doc.data();

          userData["recipes"][newID.id] = {
            name: name,
            ingredients: ingredients,
          };

          userDoc.update({
            recipes: userData["recipes"],
          });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });

    event.preventDefault();
  };

  changeRecipeName = (event) => {
    console.log(this.state);
    this.setState({ [event.target.name]: event.target.value });
  };

  quickAddParsing = (event) => {
    const arr = event.target.value.split("\n");
    console.log(arr);

    let ingredients = this.state.ingredients.slice();

    arr.forEach((e) => {
      const rawIngredient = e.trim();

      if (
        /^[0-9]$/.test(rawIngredient.substr(0, 1)) &&
        rawIngredient.length > 0
      ) {
        const regexResults = rawIngredient.match(/(.*?)\s(.*?)\s(.*)/);

        ingredients.push({
          name: regexResults[3],
          quantity: regexResults[2],
          unit: regexResults[1],
        });
      } else {
        ingredients.push({
          name: rawIngredient,
          quantity: "0",
          unit: "N/a",
        });
      }
    });

    this.setState({ ingredients: ingredients });
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

  ingredientClearAll() {
    this.setState({
      ingredients: [
        {
          name: "",
          quantity: "",
          unit: "",
        },
      ],
    });
  }

  ingredientRemove = (index) => {
    let ingredients = this.state.ingredients.slice();

    if (ingredients.length > 1) {
      ingredients.splice(index, 1);

      this.setState({ ingredients: ingredients });
    }
  };

  renderIngredient(obj, index) {
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

  formValidation() {
    let isValid = false;

    for (let ingredient of this.state.ingredients) {
      for (const property in ingredient) {
        if (ingredient[property] === "") {
          isValid = true;
        }
      }
    }

    if (this.state.name === "") isValid = true;

    return isValid;
  }

  render() {
    const { name, ingredients, error } = this.state;

    let isValid = this.formValidation();

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
        <button type="button" onClick={() => this.ingredientAdd()}>
          Add New Ingredient
        </button>
        {ingredients.map((obj, index) => {
          return this.renderIngredient(obj, index);
        })}

        <button type="button" onClick={() => this.ingredientClearAll()}>
          Remove All Ingredients
        </button>

        <div>
          <h2>Quick Add Ingredients</h2>
          <p>Paste a list of ingredients</p>
          <textarea
            rows="20"
            cols="60"
            onChange={(event) => this.quickAddParsing(event)}
          ></textarea>
        </div>

        <p>
          <button type="submit" disabled={isValid}>
            Add Recipe
          </button>
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
