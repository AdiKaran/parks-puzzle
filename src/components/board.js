import React, {Component} from 'react';
import {Button,Box,Grid} from '@material-ui/core';
import produce, {applyPatches} from 'immer';
import Cell from './cell';
import {
  newPark,
  parsePuzzle,
  solvePuzzle,
} from "../helpers";
import NewGameMenu from "./newgamemenu";
import RulesPopUp from './rulespopup'

// Icons
import Undo from "@material-ui/icons/Undo";
import RefreshIcon from "@material-ui/icons/Refresh";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";

// Colors
import { ThemeProvider, MuiThemeProvider } from "@material-ui/core/styles";
import {
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
} from "../buttonThemes";

const colors = [
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
];

/*
State: parksPuzzle :
        {rows: [index: i, cols:[{row:0, col: 0, park:p, value:'T'}...] ]
        trees: {
            '[0,0]' : true,
            '[0.1]' : false, ...
            }
        treeCount: 0;
        }
Props:
Rows:'ABCDEF...'
Cols:'123456...'
Units: { A1: [ [A1,A2,A3...],[A1,B1,C1...],[Cells sharing a park with A1],[cells next to A1]   ]}
Peers:{A1:[Cells sharing a row, column,park with A1, and cells next to A1]}
*/
var Puzzles = require("../puzzles.json");

export default class Board extends Component{
    constructor(props){
        super(props) ;
        //TODO: set difficulty
        let park = newPark(Puzzles,this.props.difficulty);
        let json,squares,rows, cols, parks, peers ;
        ({json,squares,rows,cols,parks,peers} = parsePuzzle(park));
        this.json = json ;  //TODO: pick a better name for the raw puzzle
        this.squares = squares
        this.rows = rows ;
        this.cols = cols ;
        this.parks = parks ;
        this.peers = peers ;
        this.values = ["", "T", "X"];
        // Immer patches for undo
        // TODO : redo feature that works consistently with undo 
        this.inverseChanges = [] ;
        // TODO :  handle puzzles without any solutions 
        this.solutions = solvePuzzle(this.peers,this.json.size);
        this.solution = this.solutions[0]

        this.state = produce({},() => ({
          parksPuzzle: this.initialState(this.json),
        }));

    }

    render(){
        const rows = this.state.parksPuzzle.rows;
        return (
          <Grid
            className="boardGrid"
            container
            direction="row"
            justify="center"
          >
            <Grid>
              <Box className="boardBox">
                <table>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.index}>
                        {row.cols.map((col) => (
                          <td key={col.col}>
                            <ThemeProvider theme={colors[col.park]}>
                              <MuiThemeProvider theme={colors[col.park]}>
                                <Cell cell={col} onClick={this.handleClick} />
                              </MuiThemeProvider>
                            </ThemeProvider>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
              <Grid
                className="boardButtons"
                container
                alignItems="center"
                justify="space-evenly"
              >
                <Button
                  onClick={this.showSolution}
                  startIcon={<EmojiObjectsIcon />}
                >
                  Solution
                </Button>
                <Button onClick={this.refreshState} startIcon={<RefreshIcon />}>
                  Refresh
                </Button>
                <Button onClick={this.handleUndo} startIcon={<Undo />}>
                  Undo
                </Button>
              </Grid>
            </Grid>
            {/* <div className="boardSideBar"> */}
            <Box
              className="boardSideBar"
              border={1}
              borderColor="#303030"
              borderRadius={4}
            >
              {/* <div className="boardSideBar"> */}
              {/* <div className="boardSideBarButtonContainer">
                <Button className="boardSideBarButton">Timer</Button>
              </div> */}
              <div className="boardSideBarButtonContainer">
                <NewGameMenu
                  menuHandler={this.menuHandler}
                  className="boardSideBarButton"
                />
              </div>
              <div className="boardSideBarButtonContainer">
                <RulesPopUp />
              </div>
              {/* </div> */}
            </Box>
            {/* </div> */}
          </Grid>
        );
    }
    componentDidUpdate(prevProps){
        if(this.props.gameCount !== prevProps.gameCount){
            console.log("New Game initiated")
        }
    }
    

    handleClick = (e) =>{
        let i, j , val, newVal;
        i = e.row ;
        j = e.col ;
        val = e.value ;
        newVal = this.incrementValue(val,this.values);

        this.setState(
            produce(this.state,draft =>{
                draft.parksPuzzle.rows[i].cols[j].value = newVal;
                if(val ==='T'){
                    draft.parksPuzzle.trees[[i,j].toString()] = false ;
                    draft.parksPuzzle.treeCount--;
                }
                else if(newVal === 'T'){
                    draft.parksPuzzle.trees[[i, j].toString()] = true;
                    draft.parksPuzzle.treeCount++;
                }
            },
            (patches,inversePatches)=>{
                this.inverseChanges.push(inversePatches);
            })
        )
    }
    menuHandler = (difficulty) =>{
        this.props.menuHandler(difficulty);
    }
    refreshState = () =>{
        this.setState(applyPatches(this.state,this.inverseChanges.flat()));
    }
    showSolution = () =>{
        this.refreshState();
        this.setState(
          produce(this.state,(draft) => {
              for(let [i,j] of this.solution){
                  draft.parksPuzzle.rows[i].cols[j].value = "T";
                  draft.parksPuzzle.treeCount++;
              }           
          },
          (patches,inversePatches)=>{
                this.inverseChanges.push(inversePatches);
            })
        );
        this.solution = this.incrementValue(this.solution,this.solutions) ;
    }
    handleUndo = () =>{
        let undo = this.inverseChanges.pop();
        if(!undo){return;}
        this.setState(applyPatches(this.state,undo));  
    }

    incrementValue(val,vals){
        // Todo: Throw error if unknown value
        let values = vals ;
        let index = values.indexOf(val) ;
        index = (index + 1) % values.length;
        return values[index] ;
    }

    // parks json => initial state 
    initialState(json){
        let size, puzzle, result ;
        ({ size, puzzle } = json);
        result = {rows: [], trees:{}, treeCount:0}
        for(let i = 0; i<size; i++){
            let row = {cols: [], index: i}
            for(let j =0; j<size; j++){
                let col ={
                    row: i,
                    col:j,
                    park: puzzle[i][j],
                    value:'',
                };
                row.cols.push(col);
                result.trees[[i, j].toString()] = false;
            }
            result.rows.push(row);
        }
        return result;        
    }
    
    
        
}
