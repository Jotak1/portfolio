import { Typing } from "typing-effect-reactjs";
import "../index.css";
import { Grid, Slide } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import React from "react";

const useStyles = makeStyles => ({
  Titulo: {
    fontSize: "1.5rem",
    color: "#21CBF3",
  },
  Container: {
    display: "flex",
    flexFlow: "column",
    color: "#fff",
  },
});

const Contacto = () => {
  const classes = useStyles();

  return (
    <div className={classes.Container}>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={12} sm={6}>
          <div className={classes.Titulo}>
            <Typing text={["Contacto"]} element="h1" cursorThickness={0} />
          </div>
          <Slide direction="right" in={true}>
            <p>Desde el contacto</p>
          </Slide>
        </Grid>
      </Grid>
    </div>
  );
};

export default Contacto;
