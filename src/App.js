import React from 'react';
import './App.css';

// Routing
// import {Link} from 'react-router-dom';
import Main  from './components/main'
// Enable immer patches
import {enablePatches} from 'immer'
enablePatches()

function App() {
  return (
    <div>
      <div>Hello Parks!</div>
      <Main />
    </div>
  );
}

export default App;
