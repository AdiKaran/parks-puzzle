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
State: {rows: [index: i, cols:[{row:0, col: 0, park:p, value:'T'}...] ]
        trees: {
            [0,0] : true,
            [0.1] : false, ...
            }
        tree_count: 0;
        }
Props:
Rows:'ABCDEF...'
Cols:'123456...'
Units: { A1: [ [A1,A2,A3...],[A1,B1,C1...], [Cells sharing a park with A1]   ]}
Peers:{A1:[Cells sharing a row, column or park with A1]}
*/

export default class Board extends Component{
    constructor(props){
        super(props) ;
        let park = this.newPark();
        let json,rows, cols, parks, peers ;
        ({json,rows,cols,parks,peers} = this.parsePuzzle(park));
        this.json = json ;  //TODO: pick a better name for the raw puzzle
        this.rows = rows ;
        this.cols = cols ;
        this.parks = parks ;
        this.peers = peers ;
        this.values = ["", "T", "X"];

        this.state = produce({},() => ({
          parksPuzzle: this.initialState(this.json),
        }));
        this.isSolved() ;
        console.log(this.peers);

    }

    render(){
        console.log(this.state.parksPuzzle.trees)
        const rows = this.state.parksPuzzle.rows;
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
                    draft.parksPuzzle.treesCount--;
                }
                else if(newVal === 'T'){
                    draft.parksPuzzle.trees[[i, j].toString()] = true;
                    draft.parksPuzzle.treesCount++;
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
                size:3,
                puzzle:[
                    [0,1,2],
                    [1,0,2],
                    [2,0,1],
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
            // console.log(sq) ;
            let sq_peers = new Set()
            for(let row of rows){
                if(unitContains(row,sq)){
                    for(let val of row){
                        sq_peers.add(val) ;
                    }
                }
            }
            for(let col of cols){
                if (unitContains(col, sq)) {
                  for(let val of col){
                        sq_peers.add(val) ;
                    }
                }
            }
            for(let park of parks){
                if (unitContains(park, sq)) {
                  for(let val of park){
                        sq_peers.add(val) ;
                    }
                }
            }
            peers[sq] = sq_peers ;            
        }
        return({json:json,rows:rows,cols:cols,parks:parks,peers:peers})
    }
    isSolved = () =>{
        let json = this.json ;
        let parksPuzzle = this.state.parksPuzzle
        let trees = this.state.parksPuzzle.trees ;

        if(parksPuzzle.treesCount !== json.count){
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


    
}
