import React, { useEffect, lazy , Suspense } from "react";
import clsx from "clsx";
import { Link, BrowserRouter, Route, Switch } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import GitHubIcon from "@material-ui/icons/GitHub";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MenuIcon from "@material-ui/icons/Menu";
import { ListItemIcon } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const Presentacion = lazy(() => import('./Presentacion'));
const Acerca = lazy(() => import('./Acerca'));
const Proyectos = lazy(() => import('./Proyectos'));
const Contacto = lazy(() => import('./Contacto'));

const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
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
    backgroundColor: "#141414",
    color: "#fff",
    alignItems: "center",
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: "#1d1d1d",
    padding: theme.spacing(3),
    color: "#fff",
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
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
    color: "#fff",
    textDecoration: "none",
  },
  iconcolor: {
    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
    color: "#fff",
    borderRadius: 10,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    color: "#fff",
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  menupos: {
    position: "absolute",
    top: 0,
    right: 0,
    margin: "5px",
    color: "#fff",
  },
  
}));

export default function PermanentDrawerLeft() {
  const classes = useStyles();
  const matches = useMediaQuery("(min-width:600px)");

  const [open, setOpen] = React.useState(false);

  const handleDrawer = () => {
    setOpen(!open);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (matches) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [matches]);

  return (
    <div className={classes.root}>
      <div className={classes.menupos}>
        {!matches ? (
          <IconButton onClick={handleDrawer}>
            <MenuIcon className={classes.linkst} />
          </IconButton>
        ) : null}
      </div>

      <BrowserRouter basename="/portfolio">
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
          <div className={classes.drawerHeader}>
          {!matches ? (
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon className={classes.iconcolor}/> 
          </IconButton>   ) : null}
        </div>
          <Divider />
          <Link to="/">
            <Avatar
              alt="Jota"
              src="./assets/jota.png"
              className={classes.large}
            />
          </Link>
          <Divider />
          <List>
            <Link to="/acerca" className={classes.linkst}>
              <ListItem button>
                <ListItemText>Acerca</ListItemText>
              </ListItem>
            </Link>
            <Link to="/proyectos" className={classes.linkst}>
              <ListItem button>
                <ListItemText>Proyectos</ListItemText>
              </ListItem>
            </Link>
            <Link to="/contacto" className={classes.linkst}>
              <ListItem button>
                <ListItemText>Contactame</ListItemText>
              </ListItem>
            </Link>
          </List>
          <Divider color="primary" />
          <List>
            <a href="https://www.linkedin.com/in/jpas/" target="blank">
              <ListItem button>
                <ListItemIcon>
                  <LinkedInIcon
                    className={classes.iconcolor}
                    fontSize="large"
                  />
                </ListItemIcon>
              </ListItem>
            </a>
            <a href="https://github.com/Jotak1" target="blank">
              <ListItem button>
                <ListItemIcon>
                  <GitHubIcon className={classes.iconcolor} fontSize="large" />
                </ListItemIcon>
              </ListItem>
            </a>
            <a href="mailto:jp.ausensi@gmail.com">
              <ListItem button>
                <ListItemIcon>
                  <MailOutlineIcon
                    className={classes.iconcolor}
                    fontSize="large"
                  />
                </ListItemIcon>
              </ListItem>
            </a>
          </List>
        </Drawer>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route path="/" exact>
              <Presentacion matches={matches} />
            </Route>
            <Route path="/inicio">
              <Presentacion matches={matches} />
            </Route>
            <Route path="/acerca">
              <Acerca />
            </Route>
            <Route path="/proyectos">
              <Proyectos />
            </Route>
            <Route path="/contacto">
              <Contacto />
            </Route>
          </Switch>
          </Suspense>
        </main>
      </BrowserRouter>
    </div>
  );
}
