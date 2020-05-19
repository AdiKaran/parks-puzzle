import { createMuiTheme } from "@material-ui/core/";

// Colors
import red from "@material-ui/core/colors/red";
import deepPurple from "@material-ui/core/colors/deepPurple";
import indigo from "@material-ui/core/colors/indigo";
import cyan from "@material-ui/core/colors/cyan";
import teal from "@material-ui/core/colors/teal";
import lime from "@material-ui/core/colors/lime";
import brown from "@material-ui/core/colors/brown";
import blueGrey from "@material-ui/core/colors/blueGrey";
import lightGreen from "@material-ui/core/colors/lightGreen";
import amber from "@material-ui/core/colors/amber";
// 
import green from "@material-ui/core/colors/green";

const themeRed = createMuiTheme({
  palette: {
    primary: red,
    secondary: green,
  },
});

const themeDeepPurple = createMuiTheme({
  palette: {
    primary: deepPurple,
    secondary: green,
  },
});
const themeIndigo = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: green,
  },
});
const themeCyan = createMuiTheme({
  palette: {
    primary: cyan,
    secondary: green,
  },
});

const themeTeal = createMuiTheme({
  palette: {
    primary: teal,
    secondary: green,
  },
});

const themeLime = createMuiTheme({
  palette: {
    primary: lime,
    secondary: green,
  },
});

const themeBrown = createMuiTheme({
  palette: {
    primary: brown,
    secondary: green,
  },
});

const themeBlueGrey = createMuiTheme({
  palette: {
    primary: blueGrey,
    secondary: green,
  },
});

const themeLightGreen = createMuiTheme({
  palette: {
    primary: lightGreen,
    secondary: green,
  },
});

const themeAmber = createMuiTheme({
  palette: {
    primary: amber,
    secondary: green,
  },
});

export {
  themeRed,
  themeDeepPurple,
  themeIndigo,
  themeCyan,
  themeTeal,
  themeLime,
  themeBrown,
  themeBlueGrey,
  themeLightGreen,
  themeAmber,
};