import React, {Component} from 'react';

import {Button,Grid} from '@material-ui/core'
import Board from './board';

export default class Parks extends Component{
    render(){
        return(
            <Grid className='parksGrid' container direction='row' justify="center" alignItems="center" wrap='nowrap'>
                <div>
                <Board difficulty='easy'/>
                </div>                
                <Grid className="parksSideBar" width='10%' container direction='column'>
                    <Button>Timer </Button>
                    <Button>New Game</Button>
                    <Button>Rules </Button>
                </Grid>
            </Grid>
        )
    }
}