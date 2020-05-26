import React from "react";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DoneIcon from "@material-ui/icons/Done";

export default function RulesPopUp() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Rules   
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"The Rules"}</DialogTitle>
        <DialogContent id="alert-dialog-description">
          <DialogContentText id="alert-dialog-description">
            A parks puzzle consists of an n x n grid with n contiguous regions
            known as parks, each marked with a different colour on the grid.
            Each square may be marked by a tree, represented by T, or an X,
            which is used to indicate that a square does not contain a tree,or
            may simply be left empty. A solution to a parks puzzle is a
            configuration such that,
          </DialogContentText>
          <ul>
            <li>Each row contains a tree</li>
            <li>Each column contains a tree</li>
            <li>Each park contains a tree</li>
            <li>
              No two trees are on squares that border one-another (even
              diagonally).
            </li>
          </ul>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={handleClose} autoFocus>
            <DoneIcon />
          </IconButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
