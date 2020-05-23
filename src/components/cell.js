import React, {Component} from 'react';

import {Button} from '@material-ui/core' ;


export default class Cell extends Component {
    handleClick= () => {
        // console.log(this.props.cell);
        this.props.onClick({...this.props.cell})
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
                {this.props.cell.value}
              </Button>
          </div>
        );
    }
        
}