import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import App from '../App';


const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#141414',
    color: '#fff',
    alignItems: 'center'

  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: '#1d1d1d',
    padding: theme.spacing(3),
    color: '#fff'
  },
  large: {
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
}));

export default function PermanentDrawerLeft() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.toolbar} />
        <Divider />
          <Avatar alt="Jota" src="/assets/jota.png" className={classes.large} />
      
        <Divider />
        <List>
            <ListItem button >
              <ListItemText>Acerca</ListItemText> 
            </ListItem>
            <ListItem button >
              <ListItemText>Proyectos</ListItemText> 
            </ListItem>
        </List>
        <Divider />
      </Drawer>
      <main className={classes.content}>
            <App/>
      </main>
    </div>
  );
}