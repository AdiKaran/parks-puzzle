import React, {Component} from 'react';
import produce from 'immer';

import {Box,Grid} from '@material-ui/core'
import Board from './board';

export default class Parks extends Component{
    constructor(props){
        super(props);
        this.state = produce({}, () => ({
          difficulty: 'medium',
          gameCount:0
        }));
    }
    render(){
        return(
            <Box mt='5rem'>
            <Grid className='parksGrid' container direction='row' justify="center" alignItems="center" wrap='nowrap'>
                <Board gameCount={this.state.gameCount} menuHandler={this.menuHandler} difficulty={this.state.difficulty}/>
            </Grid>
            </Box>
        )
    }
    menuHandler = (difficulty) =>{
        this.setState(
            produce(this.state, (draft) =>{
                draft.difficulty = difficulty ;
                draft.gameCount++;
            })
        )
    }
}