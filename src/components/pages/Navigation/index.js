import React from "react";
import { Link } from "react-router-dom";

import { AuthUserContext } from "../../../session";
import SignOutButton from "../SignOut";
import * as ROUTES from "../../../constants/routes";

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {(authUser) => (authUser ? <NavigationAuth /> : <NavigationNonAuth />)}
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = () => (
  <ul className="sticky flex flex-row shadow-lg">
    <li className="py-4 px-3">
      <Link to={ROUTES.HOME}>Home</Link>
    </li>
    <li className="py-4 px-3">
      <Link to={ROUTES.ACCOUNT}>Account</Link>
    </li>
    <li className="py-4 px-3">
      <Link to={ROUTES.ADMIN}>Admin</Link>
    </li>{" "}
    <li className="py-4 px-3">
      <Link to={ROUTES.RECIPES}>Recipes</Link>
    </li>
    <li className="py-4 px-3">
      <Link to={ROUTES.RECIPEADD}>Recipe Add</Link>
    </li>
    <li className="py-4 px-3">
      <SignOutButton />
    </li>
  </ul>
);

const NavigationNonAuth = () => (
  <ul className="sticky flex flex-row shadow-lg">
    <li className="py-4 px-3">
      <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    </li>
  </ul>
);
export default Navigation;
