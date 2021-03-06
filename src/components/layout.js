import React, {useState} from 'react';

import {Link} from 'react-router-dom'

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PersonIcon from "@material-ui/icons/Person";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";

export default function Layout() {

    const [state, setState] = useState({
    drawerOpen: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === "keydown" &&(event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };
    return (
      <div>
        <Drawer
          anchor="left"
          open={state["drawerOpen"]}
          onClose={toggleDrawer("drawerOpen", false)}
        >
          {/* Drawer Contents  */}
          <div
            role="presentation"
            onClick={toggleDrawer("drawerOpen", false)}
            onKeyDown={toggleDrawer("drawerOpen", false)}
          >
            <List>
              <ListItem
                button
                key="My Profile"
                component={Link}
                to={"/profile"}
                target="_blank"
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="My Profile" />
              </ListItem>
              <ListItem
                button
                key="Github"
                component={Link}
                to={"/github"}
                target="_blank"
              >
                <ListItemIcon>
                  <GitHubIcon />
                </ListItemIcon>
                <ListItemText primary="Github" />
              </ListItem>
              <ListItem
                button
                key="Linkedin"
                component={Link}
                to={"/linkedin"}
                target="_blank"
              >
                <ListItemIcon>
                  <LinkedInIcon />
                </ListItemIcon>
                <ListItemText primary="Linkedin" />
              </ListItem>
            </List>
            <Divider />
            {/* <List>
                {["Button1", "Button2", "Button3"].map((text, index) => (
                <ListItem button key={text}>
                    <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                </ListItem>
                ))}
            </List> */}
          </div>
        </Drawer>

        <AppBar color="#fff" className="appBar" position="static">
          <Toolbar variant="regular">
            <IconButton
              edge="start"
              onClick={toggleDrawer("drawerOpen", true)}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">Parks Puzzle</Typography>
          </Toolbar>
        </AppBar>
      </div>
    ); 
}
