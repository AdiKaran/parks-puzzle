import React, {Component} from 'react';
import {Button, Container} from '@material-ui/core';
import produce, {applyPatches} from 'immer';
import Cell from './cell';
import{cross, unitContains} from '../helpers';

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

export default class Board extends Component{
    constructor(props){
        super(props) ;
        let park = this.newPark();
        let json,squares,rows, cols, parks, peers ;
        ({json,squares,rows,cols,parks,peers} = this.parsePuzzle(park));
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
        this.solutions = this.solvePuzzle();
        this.solution = this.solutions[0]

        this.state = produce({},() => ({
          parksPuzzle: this.initialState(this.json),
        }));

    }

    render(){
        const rows = this.state.parksPuzzle.rows;
        const solved = this.isSolved() ;
        return (
          <Container>
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
            <div>
              <h3>Solved?</h3> <h4>{solved.toString()}</h4>
            </div>
            <Button onClick={this.showSolution}>Show solution </Button>
            <Button onClick={this.refreshState}>Refresh State </Button>
            <Button onClick={this.handleUndo}>Undo</Button>
          </Container>
        );
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

    newPark(){
        let park = {
                size:4,
                puzzle:[
                    [0,0,0,0],
                    [1,1,1,1],
                    [2,2,2,2],
                    [3,3,3,3],
                ]
            }
        return(park) ;
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
    // json => {json:original puzzle rows: [] co]s: , parks:[], peers:{},
    parsePuzzle(json){
        let size,puzzle,rowArr = [],colArr = [],
        squares, rows=[],cols=[],parks=[],peers ={};

        ({size,puzzle} = json ) ;
        for(let i = 0; i<size;i++){
            rowArr.push(i);
            colArr.push(i);
            parks.push([]);
            rows.push([]);
            cols.push([]);
        }
        squares = cross(rowArr,colArr)
        // Creating separate arrays for each park
        for(let i=0;i<size;i++){
            for(let j=0;j<size;j++ ){
                parks[puzzle[i][j]].push([i,j]) ;
                cols[j].push([i,j]);
                rows[i].push([i,j]);
            }
        }
        // Todo: optimize peer generation
        for(let sq of squares){
            let [a,b] = sq ;
            let sq_peers = new Set()
            for(let row of rows){
                if(unitContains(row,sq)){
                    for(let val of row){
                        sq_peers.add(val.toString()) ;
                    }
                }
            }
            for(let col of cols){
                if (unitContains(col, sq)) {
                  for(let val of col){
                        sq_peers.add(val.toString()) ;
                    }
                }
            }
            for(let park of parks){
                if (unitContains(park, sq)) {
                  for(let val of park){
                        sq_peers.add(val.toString()) ;
                    }
                }
            }
            for(let i = (a-1);(i <= (a+1) && i<size);i++ ){
                if(i<0){continue;}
                for(let j = (b-1); (j<=(b+1) && j<size);j++ ){
                    if(j<0){continue;}
                    sq_peers.add([i,j].toString()) ;
                }
            }
            peers[sq] = sq_peers ;            
        }
        return({json:json,squares:squares,rows:rows,cols:cols,parks:parks,peers:peers})
    }
    isSolved = () =>{
        let json = this.json ;
        let parksPuzzle = this.state.parksPuzzle
        let trees = this.state.parksPuzzle.trees ;

        if(parksPuzzle.treeCount !== json.size){
            return false ;
        }
        for(let key in trees ){ 
            if(trees[key] === true){
                for(let square of this.peers[key]){
                    if(trees[square.toString()] === true && square !== key){
                        return false ;
                    }
                }             
            }
        }
        return true 
    }
    // Solving the current Board
    // Todo: optimize checking square validity 
    /*  variables: squares [0,0]...[i,j]...[n,n]
        values : "X,T"
        constraints:
        - number of Ts = n
        - Only one T in each unit (row,column,park)
        - Ts can't be next to each other 
        Starting with the first row, place a tree in the first valid column,
        -for each row, place a Tin the first valid position and move to the next row
        -If there are no valid positions, backtrack and try the next column of the previous row
    */
    currentPlacement(stack){
    //Takes the column values from the stack,
    //returns the corresponding tree placement
        return Array.from(stack.keys()).map((i) => [i, stack[i]]);
    }
    isValid(treePlacement, position){
    //Checks if a tree may be placed in a given position
        let posStr = position.toString();
        for(let t of treePlacement){
            for(let sq of this.peers[t.toString()]){
                if(sq === posStr){
                    return false ;
                }
            }            
        }
        return true ;
    }
    solvePuzzle(){
        let stack = [],solutions = [], col =0, row=0, size = this.json.size  ;
        
        while(true){
            while(col<size && !(this.isValid(this.currentPlacement(stack),[row,col]))){
                col++;
            }

            if(col<size){
                stack.push(col);
                if(row+1 >= size){
                    solutions.push(this.currentPlacement(stack));
                    stack.pop();
                    col = size;                    
                }
                else{
                    row++;
                    col =0;
                }
            }
            if (col>=size){
                if(row === 0){                    
                    return solutions
                }
                let curr = stack.pop();
                col = curr + 1 ;
                row -- ;
            }

        }
    }    
}
