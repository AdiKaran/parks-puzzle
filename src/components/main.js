import React from 'react';
import {Switch,Route} from 'react-router-dom';

// Pages
import Parks from './parks' ;

const Main = () =>{
    return (
      <Switch>
        {/* <Route exact path="/" component={LandingPage}>; */}
        <Route exact path="/" component={Parks} />;
      </Switch>
    );
}

export default Main