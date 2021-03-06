import { Grid, Slide } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { Typing } from "typing-effect-reactjs";
import "../index.css";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    textAlign: "justify",
    margin: 10,
  },
  Titulo: {
    fontSize: "1.5rem",
    color: "#21CBF3",
  },
  content: {
    flexGrow: 1,
    backgroundColor: "#1d1d1d",
    padding: theme.spacing(3),
    color: "#fff",
  },
  tagstyle: {
    color: "#fff",
    display: "flex",
    // // position: "absolute",
    margin: 20,
  },
}));

const Acerca = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={12} sm={12}>
          <div className={classes.Titulo}>
            <Typing text={["Sobre mi"]} element="h1" cursorThickness={0} />
          </div>
        </Grid>
        <Grid item xs={12} sm={6}>
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
          <div className={classes.tagstyle}>
            <Slide direction="right" in={true}>
              <p>prueba</p>
            </Slide>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Acerca;
