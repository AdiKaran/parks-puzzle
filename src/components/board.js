import React, {Component} from 'react';

import {Container} from '@material-ui/core'
import Cell from './cell';
// import {ButtonGroup} from '@material-ui/core'

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

export default class Board extends Component{
    constructor(props){
        super(props);
        // Hardcoded 10 colors
        this.colors =[ red[400],
                    deepPurple[400],
                    indigo[400],
                    cyan[400],
                    teal[400],
                    lime[400],
                    brown[400],
                    blueGrey[400],
                    lightGreen[400],
                    amber[400],             
        ]
    }

    render(){
        return(
        <Container>
            {this.renderBoard(this.props.dimension)}            
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
        // Throw error if size is too large
        let park = this.newPark() ;
        let puzzle = park.puzzle ;
        let boardArr = []
        for(let row of puzzle){
            let rowArr = []
            for(let color of row){
                rowArr.push(<Cell color={this.colors[color]}/>)                
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
