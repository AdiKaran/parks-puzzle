import React, {Component} from 'react';
import './App.css';
import CssBaseline from "@material-ui/core/CssBaseline";
import Layout from './components/layout';

import { createMuiTheme } from "@material-ui/core/";
import { MuiThemeProvider } from "@material-ui/core/styles";

// Routing
// import {Link} from 'react-router-dom';
import Main  from './components/main'
// Enable immer patches
import {enablePatches} from 'immer'
enablePatches()

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

export default class App extends Component {
    render(){
        return (
            <div className="app">
            <MuiThemeProvider theme={darkTheme}>
            <CssBaseline/>
                <Layout />
                <Main />                
            </MuiThemeProvider>
            </div>
        );
    }
    handleMenuClick(){
        
    }  
}
