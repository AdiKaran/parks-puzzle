import React, {Component} from 'react';

import {Button} from '@material-ui/core' ;


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
              <Button
                style={{
                  maxWidth: "4em",
                  maxHeight: "4em",
                  minWidth: "4em",
                  minHeight: "4em",
                }}
                variant="contained"
                onClick={this.handleClick}
                color="primary"
              >
                {this.state.fill}
              </Button>
          </div>
        );
    }
        
}