import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typing } from "typing-effect-reactjs";
import "../index.css";
import { Grid, Slide } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  Titulo: {
    fontSize: "1.5rem",
    color: "#21CBF3",
  },
  Container: {
    color: "#fff",
    // textAlign: 'justify'
  },
}));

const Proyectos = () => {
  const classes = useStyles();

  return (
    <div className={classes.Container}>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={12} sm={12}>
          <div className={classes.Titulo}>
            <Typing
              text={["Algunos Proyectos"]}
              element="h1"
              cursorThickness={0}
            />
          </div>
          
        </Grid>
        <Grid item xs={12} sm={12}>
        <Slide direction="right" in={true}>
            <p>Desde proyectos</p>
          </Slide></Grid>
      </Grid>
    </div>
  );
};

export default Proyectos;
