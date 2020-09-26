import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { withFirebase } from "../../../firebase";
import { AuthUserContext, withAuthorization } from "../../../session";

const RecipeAddPage = () => (
  <AuthUserContext.Consumer>
    {(authUser) => (
      <div>
        <h1>receipes</h1>

        <ListForm uid={authUser.uid} username={authUser.name} />
      </div>
    )}
  </AuthUserContext.Consumer>
);

const INITIAL_STATE = {
  loading: false,
  recipes: [],
  error: null,
};

class RecipesListBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.listener = this.props.firebase
      .user(this.props.uid)
      .onSnapshot((querySnapshot) => {
        let recipesList = [];

        const obj = querySnapshot.data();

        if ("recipes" in obj) {
          for (const [key, value] of Object.entries(obj.recipes)) {
            recipesList.push({
              ...value,
              rID: `${key}`,
            });
          }
        }

        this.setState({
          recipes: recipesList,
          loading: false,
        });
      });
  }

  componentWillUnmount() {
    this.listener();
  }

  recipeRemove = (index) => {
    let recipes = this.state.recipes.slice();
    const targetRecipe = recipes[index];

    console.log(targetRecipe.rID);

    let newObject = {};
    let userDoc = this.props.firebase.user(this.props.uid);

    if (recipes.length > 1) {
      recipes = recipes.splice(index, 1);

      for (let recipe of recipes) {
        newObject[recipe.rID] = recipe;
      }

      console.log(userDoc, "recipes splie", newObject);
    }

    userDoc
      .update({
        recipes: newObject,
      })
      .then(function () {
        console.log("Recipe successfully deleted from user!");
      })
      .catch(function (error) {
        console.error("Error removing recipe from user: ", error);
      });

    this.props.firebase
      .recipes()
      .doc(targetRecipe.rID)
      .delete()
      .then(function () {
        console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });

    // delete from table

    // delete from user table
  };

  renderRecipe(obj, index) {
    return (
      <Recipe
        key={index}
        name={obj.name}
        rID={obj.rID}
        ingredients={obj.ingredients}
        onClick={() => this.recipeRemove(index)}
      />
    );
  }

  render() {
    const { loading, recipes, error } = this.state;

    return (
      <div>
        {loading && <div>Loading ...</div>}

        <h2>Recipes:</h2>
        {recipes.map((obj, index) => {
          return this.renderRecipe(obj, index);
        })}

        <p> {error && <p>{error.message}</p>}</p>
      </div>
    );
  }
}

class Recipe extends Component {
  renderIngredientsList(obj, index) {
    return (
      <IngredientsList
        key={index}
        name={obj.name}
        quantity={obj.quantity}
        unit={obj.unit}
      />
    );
  }

  render() {
    const ingredients = this.props.ingredients;

    return (
      <div className="m-recipeList__container">
        <h2>{this.props.name}</h2>
        <button type="button" onClick={this.props.onClick}>
          Delete Recipe
        </button>
        <p>{this.props.rID}</p>

        <h3>Ingredients</h3>
        {ingredients.map((obj, index) => {
          return this.renderIngredientsList(obj, index);
        })}
        <hr />
      </div>
    );
  }
}

function IngredientsList(props) {
  return (
    <div>
      {props.quantity}&nbsp;
      {props.unit}&nbsp;
      {props.name}
    </div>
  );
}

const ListForm = withRouter(withFirebase(RecipesListBase));
const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(RecipeAddPage);

export { ListForm };
