import React, { useEffect } from 'react';
import clsx from 'clsx';
import { Link, BrowserRouter, Route, Switch  } from 'react-router-dom';
import { makeStyles,  useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Presentacion from './Presentacion';
import Acerca from './Acerca';
import Contacto from './Contacto';
import Proyectos from './Proyectos';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import GitHubIcon from '@material-ui/icons/GitHub';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { ListItemIcon } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';



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
    color: '#fff',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,

  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  large: {
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
  linkst: {
    color: '#fff',
    textDecoration: "none", 
  },
  iconcolor:{
    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
    color: '#fff',
    borderRadius: 10,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    color: "#fff",
    // padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  menupos:{
    position: 'absolute',
    top: 5,
    right: 5,
    color:"#fff",
  }
}));

export default function PermanentDrawerLeft() {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery('(min-width:600px)');
  
  const [open, setOpen] = React.useState(true);

  
  const handleDrawer = () => {
    setOpen(!open);
  };
  
  
  useEffect(() => {
    if(matches){
    setOpen(true);
    }
    else{
      setOpen(false);
    }
  }, [matches]);
  
  return (
    <div className={classes.root}>
      <div className={classes.menupos}>{!matches? <IconButton onClick={handleDrawer}><MenuIcon className={classes.linkst}/></IconButton> :null}</div>

      <BrowserRouter>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
        open={open}
      > 
        <div className={classes.toolbar} />
        
        <Divider />
          <Link to='/' >
      
            <Avatar alt="Jota" src="/assets/jota.png" className={classes.large} />
          </Link>
        <Divider />
        <List>
            <Link to='/acerca' className={classes.linkst}>
              <ListItem button >
                <ListItemText>Acerca</ListItemText> 
              </ListItem>
            </Link>
            <Link to='/proyectos' className={classes.linkst}>
            <ListItem button >
              <ListItemText>Proyectos</ListItemText> 
            </ListItem>
            </Link>
            <Link to='/contacto' className={classes.linkst}>
              <ListItem button >
                <ListItemText>Contactame</ListItemText> 
              </ListItem>
            </Link>
        </List>
        <Divider color="primary"/>
        <List>
            <a href="https://www.linkedin.com/in/jpas/" target="blank">
            <ListItem button>
              <ListItemIcon><LinkedInIcon className={classes.iconcolor} fontSize="large"/></ListItemIcon>
            </ListItem>
            </a>
            <a href="https://github.com/Jotak1" target="blank">
            <ListItem button>
              <ListItemIcon><GitHubIcon className={classes.iconcolor} fontSize="large"/></ListItemIcon>
            </ListItem>
            </a>
            <a href="mailto:jp.ausensi@gmail.com">
            <ListItem button>
              <ListItemIcon><MailOutlineIcon className={classes.iconcolor} fontSize="large"/></ListItemIcon>
            </ListItem>
            </a> 
        </List>
        
      </Drawer>
      <main className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}>
        <Switch>
            <Route path='/' exact>
                <Presentacion/>
                </Route>
            <Route path='/inicio'>
            <Presentacion/>2
            </Route>
            <Route path='/acerca'>
                <Acerca/>
            </Route>
            <Route path='/proyectos'>
                <Proyectos/>
            </Route>
            <Route path='/contacto'>
                <Contacto/>
            </Route>
        </Switch>
        </main>
    </BrowserRouter>
      
    </div>
  );
}