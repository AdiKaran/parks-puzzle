import React, {Component} from 'react';

import {Container} from '@material-ui/core'
import Board from './board';

export default class Parks extends Component{
    render(){
        return(
            <Container>
            <Board dimension={10}/>
            </Container>

        )
    }
}