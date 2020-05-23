import React, {Component} from 'react';
import {Container} from '@material-ui/core';
import produce from 'immer';
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

        this.state = produce({},() => ({
          parksPuzzle: this.initialState(this.json),
        }));
        this.isSolved() ;
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
                            <Cell cell={col} onClick={this.handleClick}/>
                          </MuiThemeProvider>
                        </ThemeProvider>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div><h3>Solved?</h3> <h4>{solved.toString()}</h4></div>
          </Container>
        );
    }

    handleClick = (e) =>{
        let i, j , val, newVal;
        i = e.row ;
        j = e.col ;
        val = e.value ;
        newVal = this.incrementValue(val);

        this.setState(
            produce(draft =>{
                draft.parksPuzzle.rows[i].cols[j].value = newVal;
                if(val ==='T'){
                    draft.parksPuzzle.trees[[i,j].toString()] = false ;
                    draft.parksPuzzle.treeCount--;
                }
                else if(newVal === 'T'){
                    draft.parksPuzzle.trees[[i, j].toString()] = true;
                    draft.parksPuzzle.treeCount++;
                }
            })
        )
    }

    incrementValue(val){
        // Todo: Throw error if unknown value
        let values = this.values ;
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
    solvePuzzle(){
        // solves the puzzle based on the original json
        // Does not take into account the current state of the board 

    }


    
}
