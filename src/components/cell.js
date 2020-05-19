import React, {Component} from 'react';

import {Button} from '@material-ui/core' ;
import { MuiThemeProvider } from "@material-ui/core/styles";
import{themeRed,themeDeepPurple,themeIndigo} from '../buttonThemes' ;

export default class Cell extends Component {
    constructor(props){
        super(props) ;
        this.fills = ['','T','X',] ;
        this.state = {
            fill_id : 1,
            fill : '',
        }
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(){
        let new_id = (this.state.fill_id + 1) % 3 ; 
        this.setState(()=>({
            fill_id :new_id,
            fill: this.fills[this.state.fill_id],
        }))
    }

    render(){
        return (
          <div>
            <MuiThemeProvider theme={themeRed}>
                <Button
                style={{
                    maxWidth: "4em",
                    maxHeight: "4em",
                    minWidth: "4em",
                    minHeight: "4em",
                }}
                variant="contained"
                onClick={this.handleClick}
                color='primary'
                >
                {this.state.fill}
                </Button>
            </MuiThemeProvider>
          </div>
        );
    }
        
}