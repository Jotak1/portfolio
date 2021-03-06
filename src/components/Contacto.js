
import React from "react";

import { Typing } from "typing-effect-reactjs";
import "../index.css";
import { Grid, makeStyles, Slide } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  Titulo: {
    fontSize: "1.5rem",
    color: "#21CBF3",
  },
  Container: {
    display: "flex",
    flexFlow: "column",
    color: "#fff",
  },
}));

const Contacto = () => {
  const classes = useStyles();

  return (
    <div className={classes.Container}>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={12} sm={12}>
          <div className={classes.Titulo}>
            <Typing text={["Contacto"]} element="h1" cursorThickness={0} />
          </div>
        </Grid>
       
          <Grid item xs={3}>
          <Slide direction="right" in={true}><p>1</p></Slide> 
          </Grid>
          <Grid item xs={3}>
          <Slide direction="right" in={true}><p>1</p></Slide> 
          </Grid>
          <Grid item xs={3}>
          <Slide direction="right" in={true}><p>1</p></Slide> 
          </Grid>
          <Grid item xs={3}>
           <Slide direction="right" in={true}><p>1</p></Slide> 
          </Grid>
      </Grid>
    </div>
  );
};

export default Contacto;
