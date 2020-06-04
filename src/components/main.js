import React from 'react';
import {Switch,Route} from 'react-router-dom';

// Pages
import Parks from './parks' ;

const Main = () =>{
    return (
      <Switch>
        {/* <Route exact path="/" component={LandingPage}>; */}
        <Route exact path="/" component={Parks} />;
        <Route
          exact
          path="/profile"
          render={() => (window.location = "https://www.adikaran.me/")}
        />
        <Route
          exact
          path="/linkedin"
          render={() => (window.location = "https://www.linkedin.com/in/adikaran/")}
        />
        <Route
          exact
          path="/github"
          render={() => (window.location = "https://github.com/AdiKaran")}
        />
      </Switch>
    );
}

export default Main