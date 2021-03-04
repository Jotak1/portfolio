import { Grid, Slide } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import React from "react";
import { Typing } from "typing-effect-reactjs";
import "../index.css";
import TagCloud from 'react3dtagcloud'





const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    
  },
  Titulo: {
    fontSize: "1.5rem",
    // textAlign: "center",
    // margin: "auto",
    color: "#21CBF3",
  },
  content: {
    flexGrow: 1,
    backgroundColor: '#1d1d1d',
    padding: theme.spacing(3),
    color: '#fff',
  },
  tagstyle: {
    color: '#fff',
    display: 'flex',
    position: "absolute",
    marginTop: 150,
  },
  
}));

const Acerca = () => {
  const classes = useStyles();
  const tagName = ['SASS', 'javascript', 'HTML', 'CSS', 'Angular', 'React', 'GIT', 'JSON', 'API', 'Bootstrap']
  
  return (
    <div className={classes.root}>
      <Grid container 
          direction="column"
          justify="center"
          alignItems="center"
        >
        <Grid item xs={12} sm={6}>
          <div className={classes.Titulo}>
          <Typing text={["Sobre mi"]} element="h1" cursorThickness={0} /></div>
          <Slide direction="right" in={true}>
            <p>
              Desarrollador Front-End situado en Chile, apasionado por la
              tecnologia, la programacion y el desarrollo web,
            </p>
          </Slide>
          <Slide direction="right" in={true}>
            <p>
              Disponible para asumir nuevos desafíos, proactivo, me encanta
              darle soluciones creativas a los problemas. Fanatico del deporte, 
              futbol, actividades al aire libre y el ajedrez. Persona de familia
              y padre de una energica niña.
            </p>
          </Slide>
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className={classes.tagName}>
          <Slide direction="right" in={true}>
        <TagCloud speed={1} tagName={tagName} radius={150} ></TagCloud>
          </Slide>
        </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Acerca;
