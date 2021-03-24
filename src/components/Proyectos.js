import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typing } from "typing-effect-reactjs";
import "../index.css";
import { Grid } from "@material-ui/core";
import CardProyectos from "./CardProyectos";

const useStyles = makeStyles((theme) => ({
  Titulo: {
    fontSize: "1.5rem",
    color: "#21CBF3",
  },
  Container: {
    color: "#fff",
  },
}));

const algunosProyectos = [
  {
    Titulo: "World Map Holiday",
    Descripcion:
      "Sitio para ver los feriados de cada pais en el año actual",
    link: "https://jotak1.github.io/worldmapholiday/",
    img: "./assets/proyectos/WMH.PNG",
  },
  {
    Titulo: "Cotizador Criptomonedas",
    Descripcion:
      "Sitio para cotizar 10 criptomonedas en algunas monedas internacionales",
    link: "https://jotak1.github.io/criptomonedas/",
    img: "./assets/proyectos/Criptomonedas.PNG",
  },
  {
    Titulo: "Buscador de Letras",
    Descripcion:
      "Sitio responsivo para buscar la letra de una cancion junto con la informacion del artista",
    link: "https://jotak1.github.io/letras/",
    img: "./assets/proyectos/Canciones.PNG",
  },
  {
    Titulo: "Recetas Bebidas",
    Descripcion:
      "Sitio responsivo para buscar la receta de una bebida de acuerdo a su categoria e ingrediente",
    link: "https://jotak1.github.io/bebidas/",
    img: "./assets/proyectos/Bebidas.PNG",
  },
  {
    Titulo: "Somein",
    Descripcion:
      "Sitio responsivo para empresa Metalmecanica desarrollado en Angular",
    link: "https://www.somein.cl",
    img: "./assets/proyectos/Somein.PNG",
  },
  {
    Titulo: "Pokedex en React(En Construcción)",
    Descripcion: "Pokedex desarrollada en React basado en la PokeApi",
    link: "https://jotak1.github.io/pokedex-react",
    img: "./assets/proyectos/PokedexReact.PNG",
  },
  {
    Titulo: "Pokedex en Angular",
    Descripcion: "Pokedex desarrollada en Angular basado en la PokeApi",
    link: "https://jotak1.github.io/Pokedex/home",
    img: "./assets/proyectos/PokedexAngular.PNG",
  },
];

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
        {algunosProyectos.map((proyecto, index) => (
          <Grid key={index} item xs={12} sm={8} md={6} lg={4}>
            <CardProyectos proyecto={proyecto} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Proyectos;
