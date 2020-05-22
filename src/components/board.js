import React, {Component} from 'react';
import {Container} from '@material-ui/core'
import Cell from './cell';
// import {ButtonGroup} from '@material-ui/core'

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
State: {rows: [cols:{row:0, col: 0, park:p, value:'T'}... ]
        trees: []
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
        // this.state={
        //     rows : [],
        //     trees : [],
        // }
        let park = this.newPark();
        let json,rows, cols, parks, peers ;
        ({json,rows,cols,parks,peers} = this.parsePuzzle(park));
        this.json = json ;
        this.rows = rows ;
        this.cols = cols ;
        this.parks = parks ;
        this.peers = peers ;

        this.state = this.initialState(this.json) ;
    }

    render(){
        return (
          <Container>
            <table key='board'>
              <tbody>{this.renderBoard()}</tbody>
            </table>
          </Container>
        );
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

    initialState(json){
        let size, puzzle, result ;
        ({ size, puzzle } = json);
        result = {rows: [], trees:[]}
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
            }
            result.rows.push(row);
        }
        return result;        
    }
    // Takes a json => {json:original puzzle rows: [] co]s: , parks:[], peers:{}, initialState:
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
        squares = this.cross(rowArr,colArr)
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
                if(this.unitContains(row,sq)){
                    for(let val of row){
                        sq_peers.add(val) ;
                    }
                }
            }
            for(let col of cols){
                if (this.unitContains(col, sq)) {
                  for(let val of col){
                        sq_peers.add(val) ;
                    }
                }
            }
            for(let park of parks){
                if (this.unitContains(park, sq)) {
                  for(let val of park){
                        sq_peers.add(val) ;
                    }
                }
            }
            peers[sq] = sq_peers ;            
        }
        return({json:json,rows:rows,cols:cols,parks:parks,peers:peers})
    }

    createBoard(){
        // TODO:Throw error if size is too large
        let puzzle, boardArr=[];
        ({puzzle } = this.json);
        for(let row of puzzle){
            let rowArr = []
            for(let color_id of row){
                rowArr.push(
                  <ThemeProvider theme={colors[color_id]}>
                    <MuiThemeProvider theme={colors[color_id]}>
                      <Cell/>
                    </MuiThemeProvider>
                  </ThemeProvider>
                );                
            }
            boardArr.push(rowArr)
        }
        return boardArr
    }

    renderBoard(size){
        let dataCount = 0;
        let rowCount = 0;
        let boardArr = this.createBoard() ;
        let board = [] ;
        for(let rowList of boardArr){
            let row = []
            for(let cell of rowList){
                row.push(<td key={dataCount}> {cell} </td>);  
                dataCount++ ;          
            }
            board.push(<tr key={"row" + rowCount.toString(10)}>{row}</tr>);
            rowCount++;
        }
        return board
    }

    // Helpers 
    cross(A,B){
        let result = [];
        for(let a of A){
            for(let b of B){
                result.push([a,b]);
            }
        }
        return(result);
    }
    arrayEquals(A,B){
        if (A === B) return true;
        for (var i = 0; i < A.length; i++) {
          if (A[i] !== B[i]) return false;
        }
        return true;
    }

    unitContains(A,b){
        for(let a of A){
            if(this.arrayEquals(a,b)){
                return true;
            }            
        }
        return false;
    }

    // Basic Gameplay Functions

    
}
