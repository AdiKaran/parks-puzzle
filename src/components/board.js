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

export default class Board extends Component{
    // constructor(props){
    //     super(props);
    // }

    render(){
        console.log(this.renderBoard().toString());
        return(
        <Container>
            {this.renderBoard()}            
        </Container>
    )
    }

    newPark(){
        let park = {
                size:3,
                puzzle:[
                    [1,2,3],
                    [2,1,3],
                    [3,2,1]
                ]

            }
        return(park) ;
    }

    createBoard(){
        // TODO:Throw error if size is too large
        let park = this.newPark() ;
        let puzzle = park.puzzle ;
        let boardArr = []
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
        let boardArr = this.createBoard() ;
        let board = [] ;
        for(let rowList of boardArr){
            let row = []
            for(let cell of rowList){
                row.push(<td> {cell} </td>)                
            }
            board.push(<tr>{row}</tr>)
        }
        return board
    }
    
}
