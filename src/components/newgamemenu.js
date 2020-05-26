import React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

export default function NewGameMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const setDifficulty = (difficulty) => {
      props.menuHandler(difficulty)
      handleClose()
  }

  const handleClose = (event) => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        // className="boardSideBarButton"
        variant="outlined"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        New Game
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Resume</MenuItem>
        <MenuItem onClick={(e) => setDifficulty("easy")}>Easy</MenuItem>
        <MenuItem onClick={(e) => setDifficulty("medium")}>Medium</MenuItem>
      </Menu>
    </div>
  );
}
