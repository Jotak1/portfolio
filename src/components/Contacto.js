import React from "react";
import { Typing } from "typing-effect-reactjs";
import "../index.css";
import { Grid, makeStyles } from "@material-ui/core";

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
  media: {
    height: 100,
  },
  linkstl: {
    textDecoration: "none",
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

        <Grid item xs={12} sm={8} md={4}>
          <a href="mailto:jp.ausensi@gmail.com" className={classes.linkstl}>
            <img
              className={classes.media}
              src="/assets/contacto/Gmail.png"
              alt="Gmail"
            />
            <p>jp.ausensi@gmail.com</p>
          </a>
        </Grid>
        <Grid item xs={12} sm={8} md={4} >
          <a href="https://www.linkedin.com/in/jpas/" className={classes.linkstl}>
            <img
              className={classes.media}
              src="/assets/contacto/linkedin.png"
              alt="Linkedin"
            />
            <p>linkedin.com/in/jpas/</p>
          </a>
        </Grid>
        <Grid item xs={12} sm={8} md={4} >
          <a href="https://github.com/Jotak1" className={classes.linkstl}>
            <img
              className={classes.media}
              src="/assets/contacto/github.png"
              alt="Github"
            />
            <p>github.com/Jotak1</p>
          </a>
        </Grid>
      </Grid>
    </div>
  );
};

export default Contacto;
